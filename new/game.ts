import {Civilization} from './civilization';
import {Contract} from './contract';
import {Notification} from './notification';
import {Economy} from './economy';
import {Fleet} from './fleet';
import {Gate} from './gate';
import {Planet} from './planet';
import {Ship} from './ship';
import {System} from './system';
import {Trade} from './trade';
import {Traffic} from './traffic';
import {War} from './war';

export default class Game {
  gates = new Map<number, Gate>();
  arrivals: Traffic[] = [];
  civilizations:Civilization[] = [];
  systems = new Map<number, System>();
  gameover = false;

  processTurn() {
    Traffic.clearArrivals();
    Traffic.moveGateTraffic();
    Traffic.moveNonGateTraffic();
    //TODO: Cancel standing orders of fleets once they have arrived UNLESS they are freighters with a contract that specifies a return trip..
    for (const civ of this.civilizations.values()) {
      civ.infrastructureCost = 0; // Calculated at the end of the turn.

      for (const probe of Traffic.getArrivedProbes(civ)) {
        Notification.probeHasArrived?.(probe.owner, probe.destination); // TODO: probeHasArrived..
        Civilization.addKnownSystem(civ, probe.destination);
      }

      for (const gateShip of Traffic.getArrivedGateShips(civ)) {
        if (gateShip.orders?.destination?.owner) {
          // TODO: What should be done if the system has been colonized by the time your gate gets there?
        } else {
          // TODO: Put a gate in the system. The gate gets a fixed destination (the gateship's origin)...
        }
      }

      for (const system of civ.systems.settled) {
        // Fill outgoing freighters in all fleets. (before sending because fleet could have more than one contracted freighter)
        for (const freighter of system.allFreighters) {
          const terms = freighter.contract;
          if (terms && terms.destination !== system) {
            if (Traffic.areGatesAvailable(system, terms.destination)) {
              const filled = Trade.fillOutgoingFreighter(freighter, system, terms);
              if (!filled) Notification.contractBrokenNoResources(terms);
            } else {
              Notification.contractBrokenNoGate(freighter.contract!);
            }
          }
        }

        // Send any fleets that request to leave.
        for (const fleet of system.fleets.values()) {
          if (fleet.orders && fleet.orders.destination !== system) {
            System.removeFreighters(system, fleet);
            const sent = Traffic.addGateTraffic(fleet, system, fleet.orders.destination);
            if (sent) {
              System.removeFleet(system, fleet);
              continue;
            }
          }
          Notification.gateBlockedForFleet(system, fleet);
        }

        // Deal with arrivals..
        const arrivals = Traffic.getArrivalsForSystem(system);

        // Deal with potential conflict
        const conflicts: Fleet[] = [];
        for (const fleet of arrivals) {
          if (fleet.orders?.hostile) {
            const resolvedPeacefully = Notification.underAttack(system, fleet);
            if (!resolvedPeacefully) conflicts.push(fleet);
          }
        }

        // Deal with actual conflicts..
        for (const fleet of conflicts) {
          const victory = War.battle(system, fleet);
          Notification.battleConcluded(system, fleet, victory);
        }

        // Now that the fighting is done.. add surviving arrivals to system fleets list..
        const incomingFreighters: Ship[] = [];
        for (const fleet of arrivals) {
          if (fleet.ships.length > 0) { // Fleets that don't survive combat have no ships remaining and can be ignored..
            System.addFleet(system, fleet);
            for (const ship of fleet.ships) { // Freighters are added to AllFreighters list
              if (ship.isFreighter) {
                incomingFreighters.push(ship);
                System.addToAllFreighters(system, ship);
                if (ship.owner === civ) { // and (if own) freighters list
                  System.berthOwnFreighter(system, ship);
                }
              }
            }
          }
        }

        // Bring in goods from arrived freighters..
        Trade.acceptIncomingGoods(system, incomingFreighters);
        incomingFreighters.forEach((freighter) => System.berthOwnFreighter(system, freighter));

        // Move freighter contracts to the next phase (or remove the contract if there is no next phase-it was a one way trip).
        for (const freighter of incomingFreighters) {
          if (freighter.contract && !Contract.nextPhase(freighter.contract)) {
            freighter.contract = undefined;
            if (freighter.fleet?.owner !== civ) Notification.youCannotParkFreighterHere(freighter);
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
          Economy.groundProduction(planet);
          Economy.orbitalProduction(planet);
        }
        // Collect the stuff into system's stores..
        System.collectivizeResources(system);
        civ.infrastructureCost += System.calculateInfrastructureCost(system);
      }
      // Collect money into the big pot..
      Civilization.collectTaxes(civ);
      Civilization.payForInfrastructure(civ);
    }
  }
}
