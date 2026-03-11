import PlanetZone from './planetzone.js';
import Rnd from '../engine/rnd.js';
import PlanetInterface from './planetinterface.js';
import StarInterface from './starinterface.js';
export default class Planet {
  zones = [];
  type = '';
  name = 'unnamed';
  mien = undefined;

  constructor(name, type, zones, size, mien) {
    this.name = name;
    this.type = type;
    this.zones = zones;
    this.interface = new PlanetInterface (this, size,mien);    
    console.log (this);
    this.process(true);
  }
  get population() {
    let pop = 0;
    for (let zone of this.zones) pop += zone.population;
    return pop;
  }
  get industry() {
    
    let ind = 0;
    for (let zone of this.zones) ind += zone.industry;
    console.log ('planet-industry ('+this.zones.length+'): '+ind);
    return ind;
  }
  get populationGrowth() {
    let grw = 0;
    for (let zone of this.zones) grw += zone.populationGrowth;
    return grw;
  }
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
  static getRandom(starName, number) {   
    const name = `${starName}-${number}`;
    const planetTypeNum = Rnd.int(0, 4);
    let typeName;
    let mien;
    const zones = [];
    const numzones = Rnd.int(2, 8);
    for (let zone = 0; zone < numzones; zone++) {
      let z = new PlanetZone();
      z.population = 0;
      switch (planetTypeNum) {
        case 0: {
          typeName = 'terran';
          mien = PlanetInterface.TerranMien;
          console.log (mien);
          z.resources.food = Rnd.int(1, 8);
          z.resources.power = Rnd.int(1, 3);
          z.resources.ore = Rnd.int(1, 3);
          z.resources.gas = 0;
          break;
        }          
        case 1: {
          typeName = 'barren';
          mien = PlanetInterface.RockyMien;
          z.resources.food = Rnd.int(0, 2);
          z.resources.power = Rnd.int(2, 4);
          z.resources.ore = Rnd.int(3, 6);
          z.resources.gas = Rnd.int(1, 2);
          break;
        } 
        case 2: {
          typeName = 'tundra'
          mien = PlanetInterface.TundraMien;
          z.resources.food = Rnd.int(0, 3);
          z.resources.power = Rnd.int(0, 3);
          z.resources.ore = Rnd.int(1, 3);
          z.resources.gas = Rnd.int(1, 3);
          break;
        } 
        case 3: {
          typeName = 'gas';
          mien = PlanetInterface.GasMien;          
          z.resources.food = 0;
          z.resources.power = Rnd.int(3, 8);
          z.resources.ore = 0;
          z.resources.gas = Rnd.int(3, 9);
          break;
        } 
        default: {
          throw Error ('type = '+planetTypeNum);
        }
      }
      zones.push (z);
    }   
    return new Planet (name, typeName, zones, zones.length, mien);
  }
  static getStarter(starName) {
    let zones = [];
    for (let i = 0; i < 2; i++) {
      let z = new PlanetZone();
      z.population = Rnd.int(5,7); //require 6 food.
      z.resources.food = Rnd.int(3,7); //2 make enough food with 2 farms. (-3 power)
      z.resources.power = 2; //2 of them make enough for 4 farms..
      z.resources.ore = 1; //1 left and 1 power
      z.resources.gas = 0;
      z.extractors.farms = 2;
      z.extractors.generators = 2;
      z.extractors.mines = 1;
      zones.push(z);
    }
    for (let i = 2; i < 4; i++) {
      let z = new PlanetZone();
      z.population = 0;
      z.resources.food = Rnd.int(3,7);
      z.resources.power = Rnd.int(2,4);
      z.resources.ore = 2;
      zones.push(z);
    }
    let p = new Planet('Terra', "Terran", zones, zones.length, PlanetInterface.TerranMien);
    return p;
  }
  static getStarterHelper(starName) {
    let zones = [];
    for (let i = 0; i < 3; i++) {
      let z = new PlanetZone();
      z.population = 0;
      z.resources.food = 0;
      z.resources.power = 2;
      z.resources.ore = 3;
      z.resources.gas = 3;
      zones.push(z);
    }
    let p = new Planet("Wanderer", "Rocky", zones, zones.length, PlanetInterface.RockyMien);
    return p;
  }
}