export default class GameState{
  static resourseNames = ['power','food','ore','gas'];
  static extractorNames = ['generator','farm','mine','refiner'];
  static storageNames = ['battery','silo','warehouse','tanks'];
  static maxPlanets = 8;
  static starSystems = new Map();

  static getStarSystem (name){
    return this.starSystems.get(name);
  }
}