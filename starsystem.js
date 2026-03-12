export default class StarSystem {
  name = 'unnamed';
  planets = [];
  interface = undefined;
  constructor(name, location, planets) {
    this.name = name;    
    this.location = location;
    this.planets = planets;
  }
  get population() {
    let pop = 0;
    for (let planet of this.planets) pop += planet.population;
    return pop;
  }
  get industry() {
    let ind = 0;
    for (let planet of this.planets) ind += planet.industry;
    return ind;
  }
  get populationGrowth() {
    let grw = 0;
    for (let planet of this.planets) grw += planet.populationGrowth;
    return grw;
  }
}
