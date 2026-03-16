class Game {
  resources = ['food', 'ore', 'gas', 'tech', 'money'];
  gates = new Map();
  gatePackets = [];
  nonGatePackets = [];
  arrivals = [];
  civilizations = new Map();
  systems = new Map();

  processTurn() {
    gameover = false;
    let arrivals = new Map();
    while (!this.gameover) {
      for (let civ of this.civilizations) {
        for (let system of civ.systems.settled) {

          //Fill outgoing freighters in all fleets. (before sending because fleet could have more>1 contract. They SHOULD all be same dest/origin...
          for (let freighter of system.freighters) {
            if (freighter.contractSide != 0) {
              freighter.contractSide *= -1;
              let contract = freighter.contract[frieghterContractSide];
              if (system.stores[contract.resource] >= contract.amount) {
                for (let gate of system.gates) {
                  if (gate.destination === contract.destination) {
                    //We have it, and we can get there, so load it and tell them to go there..
                    system.stores[contract.resource] -= contract.amount;
                    freighter[contract.resource] = contract.amount;
                    freighter.currentFleet.outgoing = { destination: contract.destination }; // Give freighter's fleet a destination..
                  } else {
                    Diplomacy.contractBrokenNoGate(contract); //
                  }
                }
              } else {
                Diplomacy.contractBrokenNoResources(contract);
              }
            }
          }

          //Send any fleets that request to leave.
          for (let fleet of system.fleets) {
            if (fleet.outgoing !== undefined) { //Outoing is an "Order" so in addition to "Where" it might contain "what"..
              for (let gate of system.gates) {
                if (gate.destination === fleet.outgoing.destination) {
                  Traffic.addGateTraffic(system, fleet.outgoing.destination, fleet);
                  System.removeFleet(system, fleet);
                }
              }
            }
          }

          //Deal with arrivals..
          let arrivals = Traffic.getArrivalsForSystem(system);
          //Deal with Conflict,Contact or Commerce
          for (let arrival of arrivals) {
            if (!civ.friends.has(arrival.fleet.civ)) {
              unresolvedConflict = false;
              if (civ.enemies.has(arrival.fleet.civ)) {
                War.fight(system, arrival.fleet);
                if (arrival.fleet.ships.length > 0) {
                  Diplomacy.invaded(system, arrival.fleet.civ)
                  System.addFleet(system, arrival.fleet);
                } else {
                  Diplomacy.successfulDefence(system, arrival.fleet.civ)
                }
              } else {
                unresolvedConflict = Diplomacy.contact(civ, arrival.fleet.civ);
              }
            }
            if (unresolvedConflict) {
              War.fight(system, arrival.fleet);
              if (arrival.fleet.ships.length > 0) {
                Diplomacy.invaded(system, arrival.fleet.civ)
              } else {
                Diplomacy.successfulDefence(system, arrival.fleet.civ)
              }
            };
            //Now that the fighting is done.. add surviving arrivals to system fleets list..
            System.addFleet(arrival.fleet);

            //Make a list of freighters to accept cargo from..            
            for (let ship in arrival.fleet) {
              if (ship.freigher) {
                incomingFreighters.push(ship);
              }
            }
          }   //Arrivals sorted...

          //Bring in goods from other systems..         
          Economy.acceptIncomingGoods(system, incomingFreighters);
          System.berthOwnFreighters(system, incomingFreighters);
          system.availableFreighters = system.freighters.length;
          for (let planet of system.planets) {

            //Deal with the Resource extraction          
            for (let resource of Game.resources) {
              planet.stores[resource] += Economy.calculateProduction(civ, planet, resource);
            }

            //Deal with food and population growth..
            Economy.feedPopulation(planet, availableFreighters); //Will try to use system stores if shortfall occurs..
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
          Economy.moveResources(system, availableFreighters);
          Economy.collectSystemTaxes(system);
        }
        //Collect money into the big pot..
        Economy.collectCivTaxes(civ);
      }
    }
  }
}
class Civilization {
  static nextID = 0;
  systems = {
    known: new Map(),
    settled: new Map()
  };
  friends = new Map();
  enemies = new Map();
}
class Economy {
  calculateProduction(planet) { ; }
  feedPopulation(planet) {
    if (planet.population >= planet.stores.food) {
      planet.stores.food -= planet.population;
      return;
    }
    let required = planet.population - planet.stores.food;
    let available = planet.stores.food + Math.min(planet.system.availableFreighters.length, required);
    let transportsUsed = Math.min(required - planet.stores.food, planet.system.availableFreighters.length);
    planet.system.availableFreighters -= transportsUsed;
    return this.population - available;
  }
}
class Traffic {
  static moveGateTraffic() {

    ;
  }
  static moveNonGateTraffic() { ; }
}
class War {

}
class Ship {
  static nextID = 0;
  ID = -1;
  frieghter = false;
  currentFleet = undefined;
}
class Fleet {
  static nextID = 0;
  ID = -1;
  ships = new Map();
  get onlyFreighers() {
    for (let ship in this.ships.values) if (!ship.freighter) return false;
    return true;
  }
}
class System {
  static nextSystemID = 0;
  ID = -1;
  stores = {};
  planets = new Map();
  fleets = new Map(); //of fleets
  freighterFleet = new Map(); //of otherwise unassigned freighter ships
  gates = [];
  defence;
  availableFreighters = -1; //Set per turn..
  constructor() {
    this.init();
  }
  init() {
    for (let resource of Game.resources) stores[resource] = 0;
  }
}
class Planet {
  static nextPlanetID = 0;
  systemID = -1;
  ID = -1;
  population = 0;
  foodShortFall = 0;
  workerSlots = {};
  stores = {};
  infrastructure = {};
  constructor() {
    this.init();

  }
  init() {
    for (let resource of Game.resources) {
      stores[resource] = 0;
      workerSlots[resource] = 0;
      infrastructure[resource] = 0;
    }
    workerSlots['factory'] = 0;
    workerSlots['orbital'] = 0;
  }
}
class Gate {
  static nextID = 0;
  ID = 0;
  system = undefined;

}