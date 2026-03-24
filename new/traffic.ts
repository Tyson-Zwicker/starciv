import { System } from './system';
import { Civilization } from './civilization';
import { Fleet } from './fleet';

export type Traffic = {
  origin: System,
  destination: System,
  fleet: Fleet
  remaining: number;
}

export namespace Traffic {
  export const nonGateTraffic: Traffic[] = [];
  export const arrivals: Fleet[] = [];
  export const nonGateSpeedModifier = 0.01;
  export const gateShipModifier = 0.2;
  export const traffic: Traffic[] = [];
  export function make(fleet: Fleet, origin: System, destination: System, remaining: number): Traffic {
    return {
      "fleet": fleet,
      "origin": origin,
      "destination": destination,
      "remaining": remaining
    }
  }
  export function areGatesAvailable(origin: System, destination: System): boolean { // systems - calculate when entering "gate space"
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

  export function getSpeed(origin: System, destination: System): number { // gates - recalculate every turn because gate status can change.
    let speed = 1;
    if (System.gateAssistsOutgoing(origin)) speed++;
    if (System.gateAssistsIncoming(destination)) speed++;
    if (System.gateBlocked(destination)) speed = speed / 4;
    return speed;
  }

  export function addGateTraffic(fleet: Fleet, origin: System, destination: System): boolean {
    if (fleet.gateShip && fleet.owner.systems.known.includes(destination) && System.hasUnfixedGate(origin)) {
      Traffic.traffic.push({
        fleet,
        origin,
        destination,
        remaining: System.calcDistance(origin, destination)
      });
      return true;
    }
    if (Traffic.areGatesAvailable(origin, destination)) {
      Traffic.traffic.push(Traffic.make(fleet, origin, destination, System.calcDistance(origin, destination)));
      return true;
    }
    return false;
  }

  export function clearArrivals(): void {
    Traffic.arrivals.length = 0;
  }

  export function moveGateTraffic(): void {
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
        Traffic.arrivals.push(traffic.fleet);
      }
    }
    Traffic.traffic.length = 0;
    Traffic.traffic.push(...keep);
  }

  export function moveNonGateTraffic(): void {
    //Currently only used for probes..
    const keep: any[] = [];
    for (const traffic of Traffic.nonGateTraffic) {
      traffic.remaining -= 1 * Traffic.nonGateSpeedModifier;
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.arrivals.push(traffic.fleet);
      }
    }
    Traffic.nonGateTraffic.length = 0;
    Traffic.nonGateTraffic.push(...keep);
  }

  export function addNonGateTraffic(fleet: Fleet, origin: System, destination: System): boolean {
    Traffic.nonGateTraffic.push(Traffic.make(fleet, origin, destination, System.calcDistance(origin, destination)));
    return true;
  }

  export function getArrivalsForSystem(system: System) {
    const localArrivals:Fleet[] = [];
    for (const fleet of Traffic.arrivals) {
      if (fleet.orders!.destination === system) localArrivals.push(fleet);
    }
    return localArrivals;
  }

  export function getArrivedProbes(_civ: Civilization) {
    return [] as any[]; // TODO: implement probe tracking.
  }

  export function getArrivedGateShips(_civ: Civilization) {
    return [] as any[]; // TODO: implement gate ship tracking.
  }
}