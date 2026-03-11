import Main from '../engine/main.js';
import GameEventHandler from './gameeventhandler.js';

GameEventHandler.initialize();
Main.creatorsFunction = () => {
  GameEventHandler.animate();
  
}
Main.run(50);

