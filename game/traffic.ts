import { System } from './system';
import { Fleet } from './fleet';
import { Probe, GateShip } from './ship';
import { Civilization } from './civilization';

export type GateTraffic = {
  origin: System,
  destination: System,
  packet: Fleet
  remaining: number
}
export type ProbeTraffic = {
  origin: System,
  destination: System,
  packet: Probe,
  remaining: number;
}
export type GateShipTraffic = {
  origin: System,
  destination: System,
  packet: GateShip,
  remaining: number;
}
export namespace Traffic {
  export const gateArrivals: Fleet[] = [];
  export const gateTraffic: GateTraffic[] = [];

  export const probeArrivals: Probe[] = [];
  export const probeTraffic: ProbeTraffic[] = [];
  export const probeSpeedModifier = 0.01;

  export const gateShipArrivals: GateShip[] = [];
  export const gateShipTraffic: GateShipTraffic[] = [];
  export const gateShipSpeedModifier = 0.1;


  export function clearArrivals(): void {
    Traffic.gateArrivals.length = 0;
    Traffic.probeArrivals.length = 0;
    Traffic.gateShipArrivals.length = 0;
  }
  export function getSpeed(origin: System, destination: System): number { // gates - recalculate every turn because gate status can change.
    let speed = 1;
    if (System.gateAssistsOutgoing(origin)) speed++;
    if (System.gateAssistsIncoming(destination)) speed++;
    if (System.gateBlocked(destination)) speed = speed / 4;
    return speed;
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
  export function makeGateTraffic(fleet: Fleet, origin: System, destination: System, remaining: number): GateTraffic {
    return {
      "packet": fleet,
      "origin": origin,
      "destination": destination,
      "remaining": remaining
    }
  }
  export function addGateTraffic(fleet: Fleet, origin: System, destination: System): boolean {
    if (Traffic.areGatesAvailable(origin, destination)) {
      Traffic.gateTraffic.push(Traffic.makeGateTraffic(fleet, origin, destination, System.calcDistance(origin, destination)));
      return true;
    }
    return false;
  }
  export function moveGateTraffic(): void {
    const keep: GateTraffic[] = [];
    for (const traffic of Traffic.gateTraffic) {
      traffic.remaining -= Traffic.getSpeed(traffic.origin, traffic.destination);
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.gateArrivals.push(traffic.packet);
      }
    }
    Traffic.gateTraffic.length = 0;
    Traffic.gateTraffic.push(...keep);
  }


  export function getGateArrivals(system: System): Fleet[] {
    const localArrivals: Fleet[] = [];
    for (const fleet of Traffic.gateArrivals) {
      if (fleet.orders!.destination === system) localArrivals.push(fleet);
    }
    return localArrivals;
  }
  export function makeProbeTraffic(probe: Probe, origin: System, destination: System, remaining: number): ProbeTraffic {
    return {
      "packet": probe,
      "origin": origin,
      "destination": destination,
      "remaining": remaining
    }
  }
  export function addProbeTraffic(probe: Probe, origin: System, destination: System): void {
    Traffic.probeTraffic.push({
      packet: probe,
      origin,
      destination,
      remaining: System.calcDistance(origin, destination)
    });
  }
  export function moveProbes(): void {
    //Currently only used for probes..
    const keep: ProbeTraffic[] = [];
    for (const traffic of Traffic.probeTraffic) {
      traffic.remaining -= 1 * Traffic.probeSpeedModifier;
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.probeArrivals.push(traffic.packet);
      }
    }
    Traffic.probeTraffic.length = 0;
    Traffic.probeTraffic.push(...keep);
  }
  export function getArrivedProbes(civ: Civilization): Probe[] {
    const probes: Probe[] = [];
    for (const probe of Traffic.probeArrivals) {
      if (probe.owner === civ) probes.push(probe);
    }
    return probes;
  }
  export function moveGateShips(): void {
    //Currently only used for probes..
    const keep: GateShipTraffic[] = [];
    for (const traffic of Traffic.gateShipTraffic) {
      traffic.remaining -= 1 * Traffic.gateShipSpeedModifier;
      if (traffic.remaining > 0) {
        keep.push(traffic);
      } else {
        Traffic.gateShipArrivals.push(traffic.packet);
      }
    }
    Traffic.probeTraffic.length = 0;
    Traffic.probeTraffic.push(...keep);
  }
  export function addGateShipTraffic(gateShip: GateShip):void {
    Traffic.gateShipTraffic.push({
      packet: gateShip,
      origin: gateShip.origin,
      destination: gateShip.destination,
      remaining: System.calcDistance(gateShip.origin, gateShip.destination)
    });
  }
  export function getArrivedGateShips(civ: Civilization): GateShip[] {
    const gateShips: GateShip[] = [];
    for (const gateShip of Traffic.gateShipArrivals) {
      if (gateShip.owner === civ) gateShips.push(gateShip);
    }
    return gateShips;
  }
}