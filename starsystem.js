import Mien from '../engine/mien.js';
import StarInterface from './starinterface.js';
import Planet from './planet.js';

/*
  Star size is a scaled from 1-10. Same with planet size.
*/
export default class StarSystem {
  name = 'unnamed';
  planets = [];
  gameObject = undefined;
  guiPanel = undefined;
  interface = undefined;
  constructor(name, starSize, planets, mien = StarInterface.StarMien) {
    this.name = name;    
    this.planets = planets;
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
    let s = new StarSystem('Home',3, planets, StarInterface.StarMien);
    return s;
  }
  static getRandom() {

  }
}
