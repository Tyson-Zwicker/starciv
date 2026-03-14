import Button from '../engine/button.js';
import Camera from '../engine/camera.js';
import Sim from '../engine/sim.js';
import SimObject from '../engine/simobject.js';
import GUI from '../engine/gui.js';
import GUIPanel from '../engine/guipanel.js';
import GUIElement from '../engine/guielement.js';
import Mien from '../engine/mien.js';
import Part from '../engine/part.js'
import Polygon from '../engine/polygon.js';
import Effects from '../engine/effects.js';
import LineEffect from '../engine/lineeffect.js';
import Rnd from '../engine/rnd.js';

import GFXConsts from './gfxconsts.js';
import GameState from './gamestate.js';
import PanelManager from './panelmanager.js';

export default class SimInterface {


  static {
    this.StarMien = new Mien('star-yellow');
    this.StarMien.setColors('#ffb', '#ff0', '#fff', 'normal');
    this.StarMien.setColors('#fff', '#fff', '#000', 'hovered');
    this.StarMien.setColors('#f00', '#ff0', '#fff', 'pressed');

    this.TerranMien = new Mien('terran');
    this.TerranMien.setColors('#04a', '#500', '#fff', 'normal');
    this.TerranMien.setColors('#0af', '#79f', '#000', 'hovered');
    this.TerranMien.setColors('#006', '#fff', '#fff', 'pressed');
    this.RockyMien = new Mien('rocky');
    this.RockyMien.setColors('#666', '#999', '#fff', 'normal');
    this.RockyMien.setColors('#999', '#fff', '#000', 'hovered');
    this.RockyMien.setColors('#222', '#fff', '#fff', 'pressed');
    this.TundraMien = new Mien('tundra');
    this.TundraMien.setColors('#75f', '#fff', '#fff', 'normal');
    this.TundraMien.setColors('#fff', '#00f', '#000', 'hovered');
    this.TundraMien.setColors('#358', '#ff0', '#fff', 'pressed');
    this.GasMien = new Mien('gas');
    this.GasMien.setColors('#090', '#0c0', '#fff', 'normal');
    this.GasMien.setColors('#3f3', '#070', '#000', 'hovered');
    this.GasMien.setColors('#030', '#0f0', '#fff', 'pressed');
    this.planetMiens = [this.TerranMien, this.RockyMien, this.TundraMien, this.GasMien];
  }
  static addToSim(simObject, starSystem) {
    Sim.add(simObject, starSystem.location, 0);
  }
  static getSimObject(name, planets) {
    if (name === undefined || planets===undefined) throw new Error (`Bad params name:${name}, planets${planets}`);
    let starSystem = new SimObject(name, 'onscreen');
    let starPart = new Part(name, Polygon.regular(21, GFXConsts.starRadius, SimInterface.StarMien));
    starPart.addTo(starSystem, { x: 0, y: 0 }, 0);
    for (let i = 0; i < planets.length; i++) {
      let planet = planets[i];
      let anchorPart = new Part(name + 'Anchor' + i, Polygon.regular(3, 1, Mien.Transparent));
      let mien = SimInterface.planetMiens[planet.type];
      let planetPart = new Part(name + 'Planet' + i, Polygon.regular(11, planet.zones.length * GFXConsts.planetRadiusFactor, mien));
      anchorPart.addTo(starPart, { x: 0, y: 0 }, Rnd.int(0, 360));
      let distance = GFXConsts.planetDistanceFactor * 3 + (GFXConsts.planetDistanceFactor * i ** 1.5);
      planetPart.addTo(anchorPart, { x: distance, y: 0 });
      let spin = (GameState.maxPlanets - i) * GFXConsts.planetSpinFactor;
      anchorPart.spin = spin;
    }
    SimInterface.#makeButtonForStar(starPart);
    starSystem.finalize();
    return starSystem;
  }

  static #makeButtonForStar(part) {
    let button = new Button(part.name, false,
      (data) => {
        let starSystem = GameState.starSystems.get(data.value);
        if (starSystem.infoPanel === undefined) {
          PanelManager.showInfoPanel(starSystem);
          Camera.anchorTo (starSystem.simObject);
        } else {
          PanelManager.hideInfoPanel(starSystem);          
          Camera.freeAnchor();

        }
      }
    );
    part.button = button;
    button.simObjectPart = part;
  }
  
}
/*
  animate() {
    let minAngle = 0; let maxAngle = 360;
    let num = 20;
    let minStart = this.size * 49;
    let maxStart = minStart + Rnd.int(this.size * 2);
    let minLength = 4;
    let maxLength = 20;
    let minDur = 0.6;
    let maxDur = 1;
    let color = '#fff';
    this.#animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur);
    num = 10;
    minStart = this.size * 51;
    maxStart = minStart + Rnd.int(this.size * 2);
    minLength = 4;
    maxLength = 16;
    minDur = 0.3;
    maxDur = 0.6;
    color = '#ff0';
    this.#animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur);
    num = 5;
    minStart = this.size * 52;
    maxStart = minStart + Rnd.int(this.size * 2);
    minLength = 10;
    maxLength = 30;
    minDur = 0.2;
    maxDur = 0.3;
    color = '#f90';
    this.#animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur);
  }
  #animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur) {
    for (let i = 0; i < num; i++) {
      let ray = Rnd.ray(this.simObject.worldPosition, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, minDur, maxDur)
      let lineEffect = new LineEffect(ray.p0, ray.p1, color, 2, Rnd.float(minDur, maxDur));
      Effects.addBackground(lineEffect);
    }
  }
  */