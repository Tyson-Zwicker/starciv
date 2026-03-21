import System from './system';

export default class Traffic {
  static traffic: any[] = [];
  static nonGateTraffic: any[] = [];
  static arrivals: any[] = [];
  static nonGateSpeedModifier = 0.01;
  static gateShipModifier = 0.2;

  static areGatesAvailable(origin: any, destination: any) { // systems - calculate when entering "gate space"
    let available = false;
    for (const gate of origin.gates) {
      if (!gate.fixedDestination || gate.fixedDestination === destination) {
        if (!gate.blocked) {
          available = true;
          break;
        }
      }
    }
    if (!available) return false;

    for (const gate of destination.gates) {
      if (!gate.blocked) return true;
    }
    return false;
  }

  static getSpeed(origin: any, destination: any) { // gates - recalculate every turn because gate status can change.
    let speed = 1;
    if (origin.assistOutgoing) speed++;
    if (destination.assistIncoming) speed++;
    if (destination.blocked) speed -= 0.5;
    return speed;
  }

  static addGateTraffic(fleet: any, origin: any, destination: any) {
    if (fleet.gateShip && fleet.owner?.systems?.known?.has(destination.id) && System.hasUnfixedGate(origin)) {
      Traffic.traffic.push({
        fleet,
        origin,
        destination,
        remaining: System.calcDistance(origin, destination)
      });
      return true;
    }
    if (Traffic.areGatesAvailable(origin, destination)) {
      Traffic.traffic.push({
        fleet,
        origin,
        destination,
        remaining: System.calcDistance(origin, destination)
      });
      return true;
    }
    return false;
  }

  static clearArrivals() {
    Traffic.arrivals = [];
  }

  static moveGateTraffic() {
    const keep: any[] = [];
    for (const traffic of Traffic.traffic) {
      const speed = Traffic.getSpeed(traffic.origin, traffic.destination);
      if (traffic.fleet.gateShip) {
        traffic.remaining -= speed * Traffic.gateShipModifier;
      } else {
        traffic.remaining -= speed;
      }
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.arrivals.push(traffic);
      }
    }
    Traffic.traffic = keep;
  }

  static moveNonGateTraffic() {
    const keep: any[] = [];
    for (const traffic of Traffic.nonGateTraffic) {
      traffic.remaining -= 1 * Traffic.nonGateSpeedModifier;
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.arrivals.push(traffic);
      }
    }
    Traffic.nonGateTraffic = keep;
  }

  static addNonGateTraffic(fleet: any, origin: any, destination: any) {
    Traffic.nonGateTraffic.push({
      fleet,
      origin,
      destination,
      remaining: System.calcDistance(origin, destination)
    });
    return true;
  }

  static getArrivalsForSystem(system: any) {
    const localArrivals = [] as any[];
    for (const traffic of Traffic.arrivals) {
      if (traffic.destination === system) localArrivals.push(traffic.fleet);
    }
    return localArrivals;
  }

  static getArrivedProbes(_civ: any) {
    return [] as any[]; // TODO: implement probe tracking.
  }

  static getArrivedGateShips(_civ: any) {
    return [] as any[]; // TODO: implement gate ship tracking.
  }
}