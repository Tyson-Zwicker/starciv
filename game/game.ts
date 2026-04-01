import { Civilization } from './civilization';
import { Contract } from './contract';
import { Notification } from './notification';
import { Economy } from './economy';
import { Fleet } from './fleet';
import { Gate } from './gate';
import { Planet } from './planet';
import { System } from './system';
import { Trade } from './trade';
import { Traffic, GateTraffic } from './traffic';
import { War } from './war';

export default class Game {
  
  gateArrivals: GateTraffic[] = [];
  civilizations: Civilization[] = [];
  gameover = false;

  processTurn() {
    Traffic.clearArrivals();
    Traffic.moveGateTraffic();
    Traffic.moveProbes();
    Traffic.moveGateShips();
    for (const civ of this.civilizations.values()) {
      let infrastructureCost = 0; // Calculated at the end of the turn.
      for (const probe of Traffic.getArrivedProbes(civ)) {
        Notification.probeHasArrived(probe.owner, probe.destination); //This is being done for the benefit of the sender.
        Civilization.addKnownSystem(probe.owner, probe.destination); //not the civ whose turn is being processed!
      }
      for (const gateShip of Traffic.getArrivedGateShips(civ)) {
        Notification.gateShipArrivedInOccurpiedSystem(gateShip, gateShip.destination);
        const gate: Gate = {
          assistIncoming: false, assistOutgoing: false,
          blocked: false,
          cost: Gate.defaultCost,
          system: gateShip.destination,
          fixedDestination: gateShip.origin
        };
        gateShip.destination.gates.push(gate);
      }
//TODO: Pretty much anywhere a Notification leads to a change, needs to change:
//1. Its queues an "action" in place of the actual doing.
//2. An action must be written to look for the list, and do the things at the end of the turn...
//   because the human player will be on a browser- they're the only one not actually playing here..


//TODO: The only make this visible to the player(s) directly (as they play around on the map and
// re-arrange things) would be to run the game
//as a service OR put a tiny in the game server in here...

//OR EASY WAY: treat Game like the state engine it is and make it single player runs in the browser....
      for (const system of civ.systems.settled) {
        // Fill outgoing freighters in all fleets. (before sending because fleet could have more than one contracted freighter)
        for (const freighter of system.allFreighters) {
          const conract = freighter.contract;
          if (conract && conract.destination !== undefined) {
            if (Traffic.areGatesAvailable(system, conract.destination)) {
              const filled = Trade.fillOutgoingFreighter(freighter, system);
              if (!filled) Notification.freighterLoadingProblem(freighter);
            } else {
              Notification.contractBrokenNoGate(freighter.contract!);
            }
          }
        }

        // Send any fleets that request to leave.
        for (const fleet of system.fleets.values()) {
          if (fleet.orders && fleet.orders.destination !== system) {
            System.releaseFreightersForFleet(system, fleet);
            const sent = Traffic.addGateTraffic(fleet, system, fleet.orders.destination);
            if (sent) {
              System.removeFleet(system, fleet);
              continue;
            }
          }
          Notification.gateBlockedForFleet(system, fleet);
        }

        // Deal with arrivals..
        const arrivals = Traffic.getGateArrivals(system);

        // Deal with potential conflict
        const conflicts: Fleet[] = [];
        for (const fleet of arrivals) {
          if (fleet.orders?.hostile) {
            const resolvedPeacefully = Notification.underAttack(system, fleet);
            if (!resolvedPeacefully) conflicts.push(fleet);
          } else {
            Notification.OtherCivilizaionsFleetArrived(fleet, system);
          }
        }

        // Deal with actual conflicts..
        for (const fleet of conflicts) {
          const victory = War.battle(system, fleet);
          Notification.battleConcluded(system, fleet, victory);
        }

        // Now that the fighting is done.. add surviving arrivals to system fleets list..        
        for (const fleet of arrivals) {
          if (fleet.freighters.length > 0 || fleet.ships.length > 0) {
            System.addFleet(system, fleet);
            if (fleet.freighters.length > 0) {
              for (const freighter of fleet.freighters) { // Freighters are added to AllFreighters list              
                System.addToAllFreighters(system, freighter); //So there contracts can be dealt with start of next turn,
                Trade.unloadFreighter(system, freighter);
                if (freighter.contract && !Contract.nextPhase(freighter.contract)) {//This moves the contract phase and returnsfalse if its got nowhere to go..
                  freighter.contract = undefined;
                  if (freighter.fleet.owner !== civ) Notification.youCannotParkFreighterHere(freighter);
                }
                if (freighter.owner === civ) { // and (if own) freighters list
                  System.berthOwnFreighter(system, freighter);
                }
              }
            }
          }
        }
        // ** Arrivals all sorted! **

        // Now process individual planets...
        for (const planet of system.planets) {
          // Deal with the Resource extraction

          const production = Economy.generateResources(planet);
          Planet.addStores(planet, production);


          // Deal with food and population growth..
          const shortfall = Planet.feedPopulation(planet); // Will try to use system stores if shortfall occurs..
          if (shortfall > 0) {
            Planet.starvation(shortfall, planet);
          } else {
            Planet.populationGrowth(planet);
          }

          // Build things..
          Economy.infrastructureProduction(planet);
          Economy.orbitalProduction(planet);
        }
        // Collect the stuff into system's stores..
        System.collectivizeResources(system);
        infrastructureCost += System.calculateInfrastructureCost(system);
      }
      // Collect money into the big pot..
      Civilization.collectTaxes(civ);
      Civilization.payForInfrastructure(civ, infrastructureCost);
    }
  }
}
