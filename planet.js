export default class Planet {
  zones = [];
  static typeNames = ['terran','rocky','tundra','gas'];
  constructor(name, type, zones) {
    this.name = name;    
    this.type = type;
    this.zones = zones;    
  }
  get population() {
    let pop = 0;
    for (let zone of this.zones) pop += zone.population;
    return pop;
  }
  get industry() {    
    let ind = 0;
    for (let zone of this.zones) ind += zone.industry;
    return ind;
  }
  get populationGrowth() {
    let grw = 0;
    for (let zone of this.zones) grw += zone.populationGrowth;
    return grw;
  }
  
}