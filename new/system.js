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
    // TODO: remove a fleet's freighters from system tracking
    // Remove them from freighers and (if applicable) ownFreighters..
  }

  static removeFleet(system, fleet) {
    // TODO: implement
  }

  static addFleet(system, fleet) {
    // TODO: implement
  }

  static addToAllFreighters(system, freighter) {
    // TODO: track freighter presence in the system
  }

  static berthOwnFreighter(system, freighter) {
    // TODO: implement
  }
  static calcGateDistance(system, otherSystem) {
    return Math.hypot(system.x - otherSystem.x, system.y - otherSystem.y);
  }
  static collectivizeResources (system){
    //This depends upon there being available freighters to move the resources..
    //TODO: implement
  }
  static collectTaxes(system) {
    // TODO: implement
  }
  static payForInfrastructure(system) {
    // TODO: implement
  }
}