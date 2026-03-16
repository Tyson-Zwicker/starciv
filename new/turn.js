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
      arrivals.length = 0;
      arrivals.push(Traffic.moveNonGateTraffic());
      arrivals.push(Traffic.moveGateTraffic());
      for (let civ of this.civilizations) {
        for (let system of civ.systems.settled) {
          //Send away (with resources) freighters with fullfilled return contracts (that you agreed to)
          for (let freighter of system.frieghters) {            
            if (freighter.contractSide != 0) {
              freighter.contractSide *= -1;
              let contract = freighter.contract[frieghterContractSide];
              if (system.stores[contract.resource] >= contract.amount){
                system.stores[contract.resource] -=contract.amount;
                freighter[contract.resource] = contract.amount;
                let tempfleet = Fleet.make ([freighter]);
                Gate.addNonGateTraffic (tempfleet);
              }else{
                Diplomacy.contractBroken(contract); //this resolves in the freighter being sent home next turn, unless you keep it!!
              }
            }
          }
          //Send any fleets that request to leave last turn...
          for (let fleet of system.fleets){
            if (fleet.outgoing!==undefined){
              for (let gate of system.gates){
                if (gate.destination === fleet.outgoing.destination){
                  Traffic.addGateTraffic (fleet);
                }
              }
            }
          }
          //Deal with Conflict and Contact...
          let potentialHostiles = Traffic.incomingThreats(system, arrivals);
          for (threat of potentialHostiles) {
            if (!civ.friends.has(threat.fleet.civ)) {
              conflict = false;
              if (civ.enemies.has(threat.fleet.civ)) {
                War.fight(system, threat.fleet);
              } else {
                conflict = Diplomacy.contact(civ, threat.fleet.civ);
              }
            }
            if (conflict){
               War.fight(system, threat.fleet)
               Diplomacy.postConflict (civ, threat.fleet.civ);
            };
            
          }

          //Bring in goods from other systems..
          Economy.acceptIncomingGoods(Traffic.incomingCommerial(system, arrivals));
          for (let fleet of Traffic.incomingCommercial) {
            if (fleet.civ === civ) {
              for (let ship in fleet.ships) {
                if (ship.freighter) system.frieghter.push(freighter);  //All 'own' freighters spend the turn here..              
              }
            }
          }
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