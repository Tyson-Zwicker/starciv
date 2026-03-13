import Rnd from '../engine/rnd.js';
import StarSystem from './starsystem.js';
import PlanetZone from './planetzone.js';
import Planet from './planet.js';
import GameState from './gamestate.js';

export default class SystemMaker {
  static getStarterSystem(name) {
    let planets = [];
    planets.push(SystemMaker.getStarterPlanet(name));
    planets.push(SystemMaker.getStarterHelperPlanet(name));
    let system = new StarSystem(name, { x: Rnd.int(-499999, 499999), y: Rnd.int(-499999, 499999) }, planets);
    return system;
  }
  static getRandomSystem(name) {
    let numplanets = Rnd.int(1, 4) + Rnd.int(0, 3) + Rnd.int(0, 2);
    let planets = [];
    for (let i = 0; i < numplanets; i++) {
      planets.push(SystemMaker.getRandomPlanet(name, i + 1));
    }
    let system = new StarSystem(name, { x: Rnd.int(-499999, 499999), y: Rnd.int(-499999, 499999) }, planets);
    return system;
  }

  static getRandomPlanet(starName, number) {
    const name = `${starName}-${number}`;
    const type = Rnd.int(0, 4);
    const zones = [];
    const numzones = Rnd.int(2, 8);
    for (let zone = 0; zone < numzones; zone++) {
      let z = new PlanetZone();
      z.population = 0;
      switch (type) {
        case 0: {
          z.resources.food = Rnd.int(1, 8);
          z.resources.power = Rnd.int(1, 3);
          z.resources.ore = Rnd.int(1, 3);
          z.resources.gas = 0;
          break;
        }
        case 1: {
          z.resources.food = Rnd.int(0, 2);
          z.resources.power = Rnd.int(2, 4);
          z.resources.ore = Rnd.int(3, 6);
          z.resources.gas = Rnd.int(1, 2);
          break;
        }
        case 2: {
          z.resources.food = Rnd.int(0, 3);
          z.resources.power = Rnd.int(0, 3);
          z.resources.ore = Rnd.int(1, 3);
          z.resources.gas = Rnd.int(1, 3);
          break;
        }
        case 3: {
          z.resources.food = 0;
          z.resources.power = Rnd.int(3, 8);
          z.resources.ore = 0;
          z.resources.gas = Rnd.int(3, 9);
          break;
        }
        default: {
          throw Error('type = ' + type);
        }
      }
      zones.push(z);
    }
    return new Planet(name, type, zones);
  }

  static getStarterPlanet(starName) {
    let zones = [];
    for (let i = 0; i < 2; i++) {
      let z = new PlanetZone();
      z.population = Rnd.int(5, 7); //require 6 food.
      z.resources.food = Rnd.int(3, 7); //2 make enough food with 2 farms. (-3 power)
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
      z.resources.food = Rnd.int(3, 7);
      z.resources.power = Rnd.int(2, 4);
      z.resources.ore = 2;
      zones.push(z);
    }
    let p = new Planet('Terra', 0, zones);
    return p;
  }
  static getStarterHelperPlanet(starName) {
    let zones = [];
    for (let i = 0; i < 3; i++) {
      let z = new PlanetZone();
      z.population = 0;
      z.resources.food = Rnd.int(0, 1);
      z.resources.power = 2;
      z.resources.ore = 3;
      z.resources.gas = 3;
      zones.push(z);
    }
    let p = new Planet("Wanderer", 1, zones, zones.length);
    return p;
  }
}
