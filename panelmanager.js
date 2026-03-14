import StarSystem from './starsystem.js';
import Planet from './planet.js';
import Zone from './planet.js';

import Camera from '../engine/camera.js';
import GUI from '../engine/gui.js';
import GUIPanel from '../engine/guipanel.js';
import GUIElement from '../engine/guielement.js';
import SimInterface from './siminterface.js';
import GameState from './gamestate.js';

export default class PanelManager{
  static getPlanetButtonFunction() {
    let fn = (r) => {
      //When a planet is pressed, create a vertical panel and hang it on this GUIelement...        
      let el = r.owner;
      if (el.attachedPanel === undefined) {
        let starSystemName = r.value.split('|')[0];
        let planetIndex = r.value.split('|')[1];
        let starSystem = GameState.getStarSystem(starSystemName);
        let planet = starSystem.planets[planetIndex];
        el.highlighted = true;
        let zonePanelConstraints = { width: el.drawnSize.width, height: 90 };
        let zonePanel = new GUIPanel(undefined, 'vertical', zonePanelConstraints, true);
        el.attachedPanel = zonePanel;
        zonePanel.anchor = el;
        //Now add the zone elements...        
        for (let zone of planet.zones) {
          GUIElement.addText(zonePanel, PanelManager.getInfoPanelForZone(zone), 'left');
        }
        //Now dim/make-inactive the other planet buttons...
        for (let otherEl of el.panel.elements) {
          if (otherEl !== el && otherEl.button.value.indexOf('|') > -1) { //the star button won't have a pipe it, planet buttons do.
            otherEl.active = false;
          }
        }

      } else {
        GUI.removePanel(el.attachedPanel);
        el.attachedPanel = undefined;
        el.highlighted = false;
        //Now reactivate other planet buttons..
        for (let otherEl of el.panel.elements) {
          otherEl.active = true;
        }        
      }
    }
    return fn;
  }
  static showInfoPanel(starSystem) {
    let infoPanelConstraint = { width: 150, height: 70 };
    let infoPanel = new GUIPanel(undefined, 'horizontal', infoPanelConstraint, true);
    infoPanel.anchor = starSystem.simObject;
    starSystem.infoPanel = infoPanel;
    // panel, textArray, alignment, value, toggle, fn
    GUIElement.addButton(infoPanel, PanelManager.getInfoPanelForStar(starSystem), 'left', starSystem.name, false, (r) => {
      let starSystemName = r.value;
      let starSystem = GameState.getStarSystem(starSystemName);
      PanelManager.hideInfoPanel(starSystem);
    });
    let p = 0;
    for (let planet of starSystem.planets) {
      
      let data = PanelManager.getInfoPanelForPlanet(planet);
      let value = starSystem.name + '|' + p;
      GUIElement.addButton(infoPanel, data, 'left', value, false, PanelManager.getPlanetButtonFunction());
      p++;
    }
  }

  static hideInfoPanel(starSystem) {
    GUI.removePanel(starSystem.infoPanel);
    Camera.freeAnchor();
    starSystem.infoPanel = undefined;
  }
  static getInfoPanelForStar(starSystem) {
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
  static getInfoPanelForPlanet(planet) {
    let r = [];
    r.push(`${planet.name}`);
    r.push(`Pop:${planet.population}`);
    r.push(`Ind:${planet.industry}`);
    let allResources = { food: 0, power: 0, ore: 0, gas: 0 };
    for (let zone of planet.zones) {
      allResources.food += zone.resources.food;
      allResources.power += zone.resources.power;
      allResources.ore += zone.resources.ore;
      allResources.gas += zone.resources.gas;
    }
    r.push(`F:${allResources.food}P:${allResources.power}O:${allResources.ore}G:${allResources.gas}`);
    return r;
  }
  static getInfoPanelForZone(zone) {
    let r = [];
    r.push(`Pop:${zone.population}`);
    r.push(`F:${zone.extractors.farms}x${zone.resources.food} (${zone.stores.food}/${zone.storage.food})`);
    r.push(`P:${zone.extractors.generators}x${zone.resources.power} (${zone.stores.power}/${zone.storage.power})`);
    r.push(`O:${zone.extractors.mines}x${zone.resources.ore} (${zone.stores.ore}/${zone.storage.ore})`);
    r.push(`G:${zone.extractors.refiners}x${zone.resources.gas} (${zone.stores.gas}/${zone.storage.gas})`);
    return r;
  }
}