export default class Planet {
  static nextPlanetID = 0;
  systemID = -1;
  ID = -1;
  population = 0;
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

  static feedPopulation(planet) {
    if (planet.population >= planet.stores.food) {
      planet.stores.food -= planet.population;
      return 0;
    }
    //TODO:  system.unusedFreighters is a list of REAL freighters, not a number.. change this accordingly..
    let required = planet.population - planet.stores.food;
    let available = planet.stores.food + Math.min(planet.system.availableFreightersCount, required);
    let transportsUsed = Math.min(required - planet.stores.food, planet.system.availableFreightersCount);
    planet.system.availableFreightersCount -= transportsUsed;
    return this.population - available; //Returns "shortfall
  }
  static populationGrowth(planet) {
    // TODO: implement
  }

  static starvation(surplusFood, planet) {
    // TODO: implement
  }
}