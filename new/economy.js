
class Civ {
  constructor() {
    for (let t of Games.rTypes) this.TechFactor[t] = 1;
  }
}

class StarSystem {
  name = undefined;
  location = undefined;
  planets = [];

  constructor(name, location, planets) {
    this.name = name;
    this.location = location;
    this.planets = planets;
  }
  process 
}
class Games {
  static rTypes = ['food', 'ore', 'gas', 'tech', 'manu'];
}
const planet = {
  civ: 0,
  name: '',
  starSystem: undefined,
  population: 0,
  techFactor:{}, //getting that from "civ level"
  slots: {},    //= all size = #population: you could assign 100% to do one thing.
  filledSlots:{}, //getting that from user input
  stored: {},
  produced: {},
  planetFactor: {}
}
function proess (){

  let produced = getProduction ('food');
  //do inc to dec..
  //get workers
  //assign them
  //get rest of production
  //do "special project" -see ideas (5 basic things and asimpe mechanic) 
}
function getProduction (type){
  return filledSlots[type] * planetFactor[type] * infraFactor[type] * techFactor[type]
}
function initPlanet(planet) {
  for (let resourceType of StarSystem.resourceType) {
    planet.stored[resourceType] =0;    
  }
}
