export default class ProcessPlanet {
  redistributeFood() {
    let foodProducers = structuredClone(this.zones);
    foodProducers.sort((a, b) => { b.stores.food - a.stores.food });
    let foodNeeders = structuredClone(this.zones);
    foodNeeders.sort((a, b) => { b.stores.foodShortfall - a.stores.foodShortfall });
    let surplus = 0;
    for (let zone of foodProducers) {
      surplus = zone.food.producers.stores.food;
    }
    for (let needer of foodNeeders) {
      if (needer.populationGrowth >= 0) break;
      let needed = needer.foodShortfall;
      while (needed > 0 && surplus > 0) {
        for (let haver of foodProducers) {
          if (haver.stores.food > 0) {
            haver.stores.food--;
            needer.stores.food++;
            needed--;
            surplus--;
          }
        }
      }
      if (surplus <= 0) break;
    }
  }
  process(firstRun) {
    if (firstRun !== true) {
      redistributeFood();
    }
    for (let zone of this.zones) {
      zone.process(firstRun);
    }
  }
}