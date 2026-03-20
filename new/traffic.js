import System from './system.js';
export default class Traffic {
  static traffic = [];
  static nonGateTraffic = [];
  static arrived = [];
  static nonGateSpeed =0.1;
  
  static areGatesAvailable(origin, destination) { //systems - calculate when entering "gate space"
    let available = false;
    //Check origin gate to see if it points to destination..
    for (let gate of origin.gates) {
      if (!gate.fixedDestination || (gate.fixedDestination === fleet.outgoing.destination)) {
        if (!gate.blocked) {
          available = true;
          break;
        }
      }
    }
    if (!available) return false;
    //Check destination to see if its accepting..    
    for (let gate of destination.gates) {
      if (!gate.blocked) return true;
    }
    return false;
  }
  static getSpeed(origin, destination) {//gates -recalculate every turn because gate status can change.
    let speed = 1;
    if (origin.assistOutgoing) speed++;
    if (destination.assistIncoming) speed++;
    if (destination.blocked) speed -= 0.5;
  }

  static addGateTraffic(fleet, origin, destination) {
    if (Traffic.areGatesAvailable(origin, destination)) {
      traffic.push({
        fleet: fleet,
        origin: origin,
        destiantion: destination,
        remaining: System.calcGateDistance(origin, destination)
      });
      return true;
    }
    return false;
  }
  static clearArrivals (){
    Traffic.arrived = [];
  }
  static moveGateTraffic() {
    let keep = [];    
    for (let traffic of Traffic.traffic) {
      traffic.remaining -= Traffic.getSpeed(traffic.origin, traffic.destination);
      if (fleet.remaining > 0) {
        keep.push(traffic);
        continue;
      } else {
        arrived.push(traffic);
      }
    }
    Traffic.traffic = keep;
  }

  static moveNonGateTraffic() {
    let keep = [];
    
    for (let traffic of Traffic.traffic) {
      traffic.remaining -= Traffic.nonGateSpeed;
      if (traffic.remaining > 0) {
        keep.push(traffic);
        continue;
      } else {
        arrived.push(traffic);
      }
    }
    Traffic.nonGateTraffic = keep;
  }


  static getArrivalsForSystem(system) {
    let localArrivals = [];
    for (let traffic of Traffic.arrivals) {
      if (traffic.destination === system) localArrivals.push(traffic.fleet);
    }
    return localArrivals;
  }
}