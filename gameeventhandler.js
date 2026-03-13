import GameState from './gamestate.js';
import SimInterface from './siminterface.js';
import NameGenerator from './namegenerator.js';
import SystemMaker from './systemmaker.js';

export default class GameEventHandler {
  static initialize() {
    
    let starSystem = SystemMaker.getStarterSystem('Home');
    starSystem.location = {x:0, y:0};
    GameState.starSystems.set(starSystem.name, starSystem);

    let simObject = SimInterface.getSimObject(starSystem.name, starSystem.planets);
    starSystem.simObject = simObject;
    SimInterface.addToSim(simObject, starSystem);

    let numSystems = 500;
    for (let i = 0; i < numSystems; i++) {
      starSystem = SystemMaker.getRandomSystem(NameGenerator.names[i]);
      GameState.starSystems.set(starSystem.name, starSystem);
      simObject = SimInterface.getSimObject(starSystem.name, starSystem.planets);
      starSystem.simObject = simObject;
      SimInterface.addToSim(simObject, starSystem);
    }
  }
  static animate() {
    //for (let starSystem of GameState.starSystems.values()) {
    // starSystem.interface.animate();
    // }
  }
}