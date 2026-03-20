export default class System {
  static nextSystemID = 0;
  ID = -1;
  location = {x:0,y:0};
  stores = {};
  planets = new Map();
  fleets = new Map();
  freighters = []; //freighter _ships_ (may be local or in a fleet that's here for just a turn..)
  gates = [];
  defence;
  owner =undefined;
  constructor() {
    this.init();
  }
  init() {
    for (let resource of Game.resources) stores[resource] = 0;
  }

  static removeFleet(system, fleet) {
    // TODO: implement
  }

  static addFleet(system, fleet) {
    // TODO: implement
  }

  static berthOwnFreighters(system, incomingFreighters) {
    // TODO: implement
    return 0;
  }
  static gateDistanceBetween (system, otherSystem){
    return Math.hypot (system.x-otherSystem.x, system.y-otherSystem.y);
  }
}