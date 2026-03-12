
export default class PlanetZone {
  population = 0;
  breedingRate = 0.05;
  starvationRate = 0.3;
  foodShortfall = 0;
  populationGrowth = 0;
  employment = 0;
  resources = { food: 0, gas: 0, ore: 0, power: 0 }; //extrated per worker.
  stores = { food: 0, gas: 0, ore: 0, power: 0 }; // Units stored
  storage = { food: 0, gas: 0, ore: 0, power: 0 };  //Units that can be stored..
  extractors = { farms: 0, refiners: 0, mines: 0, generators: 0 }; //# facilities built.

  constructor() {;}
  get industry (){
    let ind = this.extractors.farms + this.extractors.mines+this.extractors.generators+this.extractors.refiners;
    console.log ('zone-industry:'+ind);
    return  ind;

  }

  
}