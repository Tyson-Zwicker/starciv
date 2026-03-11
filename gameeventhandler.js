import GameState from './gamestate.js';
import StarSystem from './starsystem.js';
import NameGenerator from './namegenerator.js';
export default class GameEventHandler {
  static initialize(){
    //For now just make a single star system..
    let system = StarSystem.getStarter();
    GameState.starSystems.set (system.name, system);
    let numSystems = 500;
    console.log (NameGenerator.names.length);
    for (let i = 0; i < numSystems;i++){
      let system = StarSystem.getRandom(NameGenerator.names[i]);
    }
  }
  static animate() {
    //for (let starSystem of GameState.starSystems.values()) {
    // starSystem.interface.animate();
    // }
  }
}