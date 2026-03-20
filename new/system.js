export default class System {
  static nextSystemID = 0;
  ID = -1;
  location = { x: 0, y: 0 };
  stores = {};
  planets = new Map();
  fleets = new Map();
  freighters = new Map(); // own freighters only..and they might be part of a fleet that's only here for 1 turn..
  allFreighters = new Map(); //own and other civ's freighters that happen to be here this turn..
  unusedFreighters = []; //own freighters that have not been used this turn... (resets all own freighters every turn)
  gates = [];
  defence;
  owner = undefined;
  constructor() {
    this.init();
  }
  init() {
    for (let resource of Game.resources) stores[resource] = 0;
  }

  static removeFreighters(system, fleet) {
    for (let ship of fleet) {
      if (system.freighters.has(ship.id)) system.freighters.delete(ship.id);
      if (system.allFreighters.has(ship.id)) system.allFreighters.delete(ship.id);
    }
  }

  static removeFleet(system, fleet) {
    system.fleets.delete(fleet.id);
  }

  static addFleet(system, fleet) {
    system.fleets.set(fleet.id, fleet);
  }

  static addToAllFreighters(system, freighter) {
    system.allFreighters.set(freighter.id, freighter);
  }

  static berthOwnFreighter(system, freighter) {
    system.freighters.set(freighter.id, freighter);
  }
  static calcDistance(system, otherSystem) {
    return Math.hypot(system.x - otherSystem.x, system.y - otherSystem.y);
  }
  static collectivizeResources(system) {
    let resources = ['food', 'ore', 'gas','money','tech'];
    for (let planet of system.planets) {
      for (let resource of resources) {
        while (planet.stores[resource] > 0) {
          if (!system.freighters.length > 0) return;
          system.stores[resource] ++;
          planet.stores[resource] --;
          system.freighters.pop();
        }
      }
    }
  }
  
  static calculateInfrastructureCost(system) {    
    let cost = 0;
    let resources = ['food','ore','gas'];
    for (let planet of system.planets){
      //First get cost of resource extraction infrastructure..
      for (let resource of resources){
        cost+= planet.infrastructure[resource] -1; //The base line infrasstructure is free (thus the -1)
      }
      //Then pay for orbital upkeep
      cost += planet.orbitals;
    }
    for (let gate of system.gates){
      cost += gate.cost;
    }
    return cost;
  }
}