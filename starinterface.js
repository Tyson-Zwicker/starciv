import Button from '../engine/button.js';
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
import ParticleEffect from '../engine/particleeffect.js';
import RadialEffect from '../engine/radialeffect.js';
import Vec from '../engine/vec.js';
import View from '../engine/view.js';
import Rnd from '../engine/rnd.js';
import GameState from './gamestate.js';

export default class StarInterface {
  static {
    this.StarMien = new Mien('star-yellow');
    this.StarMien.setColors('#ffb', '#ff0', '#fff', 'normal');
    this.StarMien.setColors('#fff', '#fff', '#000', 'hovered');
    this.StarMien.setColors('#f00', '#ff0', '#fff', 'pressed');
  }
  constructor(starSystem, starSize, mien) {
    this.starSystem = starSystem;
    this.size = starSize;
    this.mien = mien;
    let starDetails = { name: starSystem.name, radius: 10 * this.size, mien: this.mien };
    let planetDetails = [];    
    for (let i = 0; i < starSystem.planets.length; i++) {      
      let planet = starSystem.planets[i];             
      let radius = 2*planet.zones.length;
      let distance = this.size * 10 * (i + 2);
      let planetDetail = { name: planet.name, radius: radius, distance: distance, orbitalSpeed: Rnd.int(1, 5), mien: planet.interface.mien };
      planetDetails.push(planetDetail);
    }
    this.simObject = this.#getSimObject(starDetails, planetDetails);
    Sim.add (this.simObject,starSystem.location,0);
  }
  animate() {
    let minAngle = 0; let maxAngle = 360;
    let num = 20;
    let minStart = this.size*49;
    let maxStart = minStart +Rnd.int (this.size*2);
    let minLength = 4;
    let maxLength = 20;
    let minDur = 0.6;
    let maxDur = 1;
    let color = '#fff';
    this.#animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur);
    num = 10;
    minStart = this.size*51;
    maxStart = minStart+Rnd.int (this.size*2);
    minLength = 4;
    maxLength = 16;
    minDur = 0.3;
    maxDur = 0.6;
    color = '#ff0';
    this.#animateCorona(num, minAngle, maxAngle, minStart, maxStart, minLength, maxLength, color, minDur, maxDur);
    num = 5;
    minStart = this.size*52;
    maxStart = minStart+Rnd.int (this.size*2);
    minLength = 10;
    maxLength =  30;
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
  showInfoPanel() {
    let infoPanelConstraint = { width: 150, height: 100 };
    let infoPanel = new GUIPanel(undefined, 'horizontal', infoPanelConstraint);
    infoPanel.anchor = this.simObject;
    this.infoPanel = infoPanel;
    GUIElement.addText(infoPanel, this.getInfoPanelForStar(this.starSystem), 'left');
    for (let planet of this.starSystem.planets) {
      GUIElement.addText(infoPanel, this.getInfoPanelForPlanet(planet), 'left');

    }
  }
  hideInfoPanel() {
    GUI.removePanel(this.infoPanel);
    this.infoPanel = undefined;
  }
  getInfoPanelForStar(starSystem) {
    let r = [];
    r.push(`${starSystem.name}`);
    r.push(`Pop:${starSystem.population}`);
    r.push(`Ind:${starSystem.industry}`);
    if (starSystem.populationGrowth > 0) {
      r.push('Growing..');
    } else if (starSystem.populationGrowth < 0) {
      r.push('Starving..');
    } else {
      r.push('Stable');
    }
    return r;
  }
  getInfoPanelForPlanet(planet) {
    let r = [];
    r.push(`${planet.name}`);
    r.push(`Pop:${planet.population}`);
    r.push(`Ind:${planet.industry}`);
    if (planet.populationGrowth > 0) {
      r.push('Growing..');
    } else if (planet.populationGrowth < 0) {
      r.push('Starving..');
    } else {
      r.push('Stable');
    }
    return r;
  }
  
  #getSimObject(starDetails, planetDetails) {
    let starSystem = new SimObject(starDetails.name, true);    
    let star = new Part('part-'+this.starSystem.name, Polygon.regular(21, starDetails.radius, starDetails.mien));
    star.addTo(starSystem, { x: 0, y: 0 }, 0);
    for (let planetDetail of planetDetails) {    
      this.#getPlanetParts(star, planetDetail);
    }
    this.#makeButtonForStar (star);
    starSystem.finalize();
    return starSystem;
  }

  #getPlanetParts(star, planetDetail) {    
    let anchor = new Part(planetDetail.name + 'Anchor', Polygon.regular(3, 1, Mien.Transparent));
    let planet = new Part(planetDetail.name, Polygon.regular(11, planetDetail.radius, planetDetail.mien));
    anchor.addTo(star, { x: 0, y: 0 }, 0);
    planet.addTo(anchor, { x: planetDetail.distance, y: 0 });
    anchor.spin = planetDetail.orbitalSpeed;
  }
  #makeButtonForStar(part) {
    let button = new Button('button-' + part.name, true,
      (data) => {
        let systemName = data.value.split('-')[2];//skip button and star...
        let starSystem = GameState.starSystems.get(systemName);        
        if (data.toggled === true) {
          starSystem.interface.showInfoPanel();
        } else if (data.toggled === false) {
          starSystem.interface.hideInfoPanel();
        } else {
          throw new Error('toggle expected.');
        }
      }
    );
    part.button = button;
    button.simObjectPart = part;
  }
}
/*
When handling events, I receive data that tells the the owner is a SimObjectPart.
Great.. this simObject belongs to a star, I want to toggle its panel
How do I find the starSystem? Given the simObject.  
 
VALUE naming convention 'button-star-[NAMEOFSTAR]
The GAMESTATE must keep a map of Star Systems and game related stuff.

*/