 import Mien from '../engine/mien.js';
 export default class PlanetInterface {
  static {
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
  }
  constructor (planet,size,mien){
    this.planet = planet;
    this.size = size;
    this.mien=mien;
  }
 }