export default class Planet {
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

  static addStores(planet, resource, amount) {
    // TODO: implement
  }
}