import Mien from '../engine/mien.js';
import StarInterface from './starinterface.js';
import Planet from './planet.js';
import Rnd from '../engine/rnd.js';
/*
  Star size is a scaled from 1-10. Same with planet size.
*/
export default class StarSystem {
  name = 'unnamed';
  planets = [];
  gameObject = undefined;
  guiPanel = undefined;
  interface = undefined;
  constructor(name, starSize, location, planets, mien = StarInterface.StarMien) {
    this.name = name;
    this.planets = planets;
    this.location = location;
    this.interface = new StarInterface(this, starSize, mien);
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
  static getStarter() {
    let planets = [Planet.getStarter('Terra', Mien.Blue), Planet.getStarterHelper('Other', Mien.Gray)];
    let s = new StarSystem('Home', 3, {x:0,y:0}, planets, StarInterface.StarMien);
    return s;
  }
  static getRandom(name) {
    let numplanets = Rnd.int(1, 4) + Rnd.int(0, 3);
    let size = Rnd.int (1,6);
    let planets = [];
    for (let i = 0; i < numplanets; i++) {      
      planets.push(Planet.getRandom (name, i+1));
    }
    let system = new StarSystem (name, size, {x:Rnd.int (-49000,49000),y:Rnd.int(-49000,49000)},planets, StarInterface.StarMien);
    return system;
  }
}
