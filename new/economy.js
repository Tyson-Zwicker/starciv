export default class Economy {
  calculateProduction(planet) { ; }
  static calculateProduction(civ, planet, resource) {
    // TODO: implement
    return 0;
  }

  feedPopulation(planet) {
    if (planet.population >= planet.stores.food) {
      planet.stores.food -= planet.population;
      return;
    }
    let required = planet.population - planet.stores.food;
    let available = planet.stores.food + Math.min(planet.system.availableFreightersCount, required);
    let transportsUsed = Math.min(required - planet.stores.food, planet.system.availableFreightersCount);
    planet.system.availableFreightersCount -= transportsUsed;
    return this.population - available;
  }
  static feedPopulation(planet) {
    // TODO: implement
    return 0;
  }

  static populationGrowth(planet) {
    // TODO: implement
  }

  static starvation(surplusFood, planet) {
    // TODO: implement
  }

  static groundProduction(planet) {
    // TODO: implement
  }

  static orbitalProduction(planet) {
    // TODO: implement
  }

  static payForInfrastructure(planet) {
    // TODO: implement
  }

  static moveResources(system, availableFreightersCount) {
    // TODO: implement
  }

  static collectSystemTaxes(system) {
    // TODO: implement
  }

  static collectCivTaxes(civ) {
    // TODO: implement
  }
}