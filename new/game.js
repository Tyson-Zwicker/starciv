import Civilization from './civilization.js';
import Contract from './contract.js';
import Diplomacy from './diplomacy';
import Economy from './economy.js';
import Fleet from './fleet.js';
import Gate from './gate.js';
import Planet from './planet.js';
import Ship from './ship.js';
import System from './system.js';
import Trade from '/.trade.js';
import Traffic from './traffic.js;';
import War from './war.js';

class Game {
  resources = ['food', 'ore', 'gas', 'tech', 'money'];
  gates = new Map();
  gatePackets = [];
  nonGatePackets = [];
  arrivals = [];
  civilizations = new Map();
  systems = new Map();
  gameover = false;
  processTurn() {
    Traffic.moveGateTraffic();
    Traffic.moveNonGateTraffic();

    for (let civ of this.civilizations) {
      for (let system of civ.systems.settled) {
        //Fill outgoing freighters in all fleets. (before sending because fleet could have more>1 contracted freighter.          
        for (let freighter of system.allFreighters.values) {
          if (freighter.contract && freighter.contract.destination !== system) {
            if (Traffic.areGatesAvailable(system, freighter.contract.destination)) {
              if (!Trade.fillOutgoingFreighter(freighter, system, terms)) {
                Diplomacy.contractBrokenNoResources(terms);
              }
            } else {
              Diplomacy.contractBrokenNoGate(freighter.contract);
            }
          }
        }

        //Send any fleets that request to leave.
        for (let fleet of system.fleets) {
          if (fleet.orders && fleet.orders.destination !== system) {
            System.removeFreighters(system, fleet); 
            let sent = Traffic.addGateTraffic(fleet, system, fleet.orders.destination);
            if (sent) {
              System.removeFleet(system, fleet); 
              continue;
            }
          }
          Diplomacy.gateBlockedForFleet(system, fleet); 
        }


        //Deal with arrivals..
        let arrivals = Traffic.getArrivalsForSystem(system);

        //Deal with potential Conflict
        let conflicts = [];
        for (let fleet of arrivals) {
          let resolvedPeacefully = false;
          if (fleet.orders.hostile) {
            resolvedPeacefully = Diplomacy.underAttack(system, fleet); 
            if (!resolvedPeacefully) conflicts.push(fleet);
            continue;
          }
        }
        ///Deal with actual conflicts..
        for (let fleet of conflicts) {
          let victory = War.battle(system, fleet);
          Diplomacy.battleConcluded(system, fleet, victory);       
        }

        //Now that the fighting is done.. add surviving arrivals to system fleets list..
        let incomingFreighters = [];
        for (let fleet of arrivals) {
          if (fleet.ships.length > 0) { //Fleets that don't survive combat have no ships remaining and can be ignored..
            System.addFleet(system, fleet); 
            for (let ship of fleet.ships) { //Freighters are added to AllFreighters list 
              if (ship.isFreighter) {
                incomingFreighters.push(ship);
                System.addToAllFreighters(system, ship); 
                if (ship.owner === civ) { //and (if own) freighters list
                  System.berthOwnFreighter(system, ship);
                }
              }
            }
          }
        }



        //Bring in goods from arrived freighters..
        Trade.acceptIncomingGoods(system, incomingFreighters);
        System.berthOwnFreighter(system, incomingFreighters);


        //Move freighter contracts to the next phase (or remove the
        //contract if there is no next phase-it was a one way trip).
        for (let freighter of incomingFreighters) {
          if (!Contract.nextPhase(freighter.contract)) {
            freighter.contract === undefined;
            if (freighter.fleet.owner !== civ) Diplomacy.youCannotParkFreighterHere(freighter); 
          }
        }
        // ** Arrivals all sorted! **


        //Now process individual planets...
        for (let planet of system.planets) {
          //Deal with the Resource extraction          
          for (let resource of Game.resources) {
            let production = Economy.calculateProduction(civ, planet, resource);
            Planet.addStores(planet, resource, production);
          }
                    
          //Deal with food and population growth..
          let shortfall = Planet.feedPopulation(planet); //Will try to use system stores if shortfall occurs..
          if (shortfall <=0) {
            Planet.starvation(surplusFood, planet); 
          }else{
            Planet.populationGrowth(planet);
          }          
          //Build things..
          Planet.groundProduction(planet); 
          Planet.orbitalProduction(planet);         
        }
        //Collect the stuff into system's stores..
        System.collectivizeResources(system); 
        System.collectTaxes(system); 
        System.payForInfrastructure(system) 
      }
      //Collect money into the big pot..
      Civilization.collectTaxes(civ); 
    }
  }
}






