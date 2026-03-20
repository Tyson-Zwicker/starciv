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
        for (let freighter of system.freighters) {
          if (freighter.contract) {
            let terms = Contract.getTerms(freighter.contract);
            let failed = Trade.fillOutgoingFreighter(freighter, system, terms);
            if (failed === 'nogate') Diplomacy.contractBrokenNoGate(freighter.contract); //
            if (failed === 'resources') Diplomacy.contractBrokenNoResources(terms);
            if (failed === 'blocked') Diplomacy.contractBrokenGateBlocked (terms);
          }
        }

        //Send any fleets that request to leave.
        for (let fleet of system.fleets) {
          if (fleet.outgoing !== undefined) { //Outgoing is an "Order" so in addition to "Where" it might contain "what"..            
            let sent = Traffic.addGateTraffic(system, fleet);
            if ('ok'=== sent){
              System.removeFleet(system, fleet);
            }else if ('nogate'===sent){              
              Diplomacy.noGateForFleet (system,fleet);
            }else if ('blocked' === sent){
              Diplomacy.gateBlockedForFleet (system,fleet);
            }
          }
        }

        //Deal with arrivals..
        let arrivals = Traffic.getArrivalsForSystem(system);
        //Deal with Conflict,Contact or Commerce
        for (let arrival of arrivals) {
          if (!civ.friends.has(arrival.fleet.owner)) {
            unresolvedConflict = false;
            if (civ.enemies.has(arrival.fleet.owner)) {
              War.fight(system, arrival.fleet);
              if (arrival.fleet.ships.length > 0) {
                Diplomacy.invaded(system, arrival.fleet.owner)
                System.addFleet(system, arrival.fleet);
              } else {
                Diplomacy.successfulDefence(system, arrival.fleet.owner)
              }
            } else {
              unresolvedConflict = Diplomacy.contact(civ, arrival.fleet.owner);
            }
          }
          if (unresolvedConflict) {
            War.fight(system, arrival.fleet);
            if (arrival.fleet.ships.length > 0) {
              Diplomacy.invaded(system, arrival.fleet.owner)
            } else {
              Diplomacy.successfulDefence(system, arrival.fleet.owner)
            }
          };
          //Now that the fighting is done.. add surviving arrivals to system fleets list..
          System.addFleet(arrival.fleet);

          //Make a list of freighters to accept cargo from..            
          let incomingFreighters = [];
          for (let ship in arrival.fleet) {
            if (ship.freigher) {
              incomingFreighters.push(ship);
            }
          }
        }   //Arrivals sorted...

        //Bring in goods from other systems..         
        Trade.acceptIncomingGoods(system, incomingFreighters);
        system.availableFreighterCount = System.berthOwnFreighters(system, incomingFreighters);

        //Move freighter contracts to the next phase (or remove the
        //contract if there is no next phase-it was a one way trip).
        for (let freighter of incomingFreighters) {
          if (!Contract.nextPhase(freighter.contract)) {
            freighter.contract === undefined;
            if (freighter.fleet.owner !== civ) Diplomacy.yourFreigherIsOnMyLawn (freighter);
          }
        }
        
        //Now process individual planets...
        for (let planet of system.planets) {

          //Deal with the Resource extraction          
          for (let resource of Game.resources) {
            Planet.addStores (planet, resource, Economy.calculateProduction(civ, planet, resource));
          }

          //Deal with food and population growth..
          Economy.feedPopulation(planet); //Will try to use system stores if shortfall occurs..
          if (surplusFood > 0) {
            system.stores.food += surplusFood;
            Economy.populationGrowth(planet);
          } else {
            Economy.starvation(surplusFood, planet);
          }

          //Build things..
          Economy.groundProduction(planet);
          Economy.orbitalProduction(planet);
          Economy.payForInfrastructure(planet);
        }
        //Collect the stuff into system's stores..
        Economy.moveResources(system, availableFreightersCount);
        Economy.collectSystemTaxes(system);
      }
      //Collect money into the big pot..
      Economy.collectCivTaxes(civ);
    }
  }
}






