import { Fleet } from './fleet';
import { Gate } from './gate';
import { Planet } from './planet';
import { Ship } from './ship';
import { Civilization } from './civilization';
import { Coordinates} from './types';
import { Resource, ResourceType, Infrastructure } from './economy';

export type System = {
  location: Coordinates;
  stores: Record <ResourceType,number>;
  planets: Planet[];
  fleets: Fleet[];
  freighters: Ship[]; // Own freighters only.
  allFreighters: Ship[]; // All freighters present this turn.
  unusedFreighters: Ship[]; //These are put there per turn, and popped off when used..
  gates: Gate[];
  defence: number;
  owner: Civilization;
}

export namespace System {
  export function gateAssistsOutgoing(system: System): boolean {
    for (let gate of system.gates) {
      if (gate.assistOutgoing) return true;
    }
    return false;
  }
  export function gateAssistsIncoming (system: System): boolean {
    for (let gate of system.gates) {
      if (gate.assistIncoming) return true;
    }
    return false;
  }
  export function gateBlocked (system: System):boolean{
    for (let gate of system.gates) {
      if (gate.blocked) return true;
    }
    return false;
  }
  export function hasUnfixedGate(system: System) {
    for (const gate of system.gates) {
      if (!gate.fixedDestination) return true;
    }
    return false;
  }

  export function removeFreighters(system: System, fleet: Fleet) {
    for (const ship of fleet.ships) {
      system.freighters = system.freighters.filter(s => s !== ship);
      system.allFreighters = system.allFreighters.filter(s => s !== ship);
    }
  }

  export function removeFleet(system: System, fleet: Fleet) {
    system.fleets = system.fleets.filter(f => f !== fleet);
  }

  export function addFleet(system: System, fleet: Fleet) {
    if (!system.fleets.includes(fleet)) system.fleets.push(fleet);
  }

  export function addToAllFreighters(system: System, freighter: Ship) {
    if (!system.allFreighters.includes(freighter)) system.allFreighters.push(freighter);
  }

  export function berthOwnFreighter(system: System, freighter: Ship) {
    if (!system.freighters.includes(freighter)) system.freighters.push(freighter);
  }

  export function calcDistance(system: System, otherSystem: System) {
    return Math.hypot(system.location.x - otherSystem.location.x, system.location.y - otherSystem.location.y);
  }

  export function collectivizeResources(system: System) {
    for (const planet of system.planets.values()) {
      for (const resource of Resource.ResourceTypes) {
        if (planet.stores[resource] > 0) {
          system.stores[resource] += planet.stores[resource];
          planet.stores[resource] = 0;
        }
      }
    }
  }

  export function calculateInfrastructureCost(system: System) {
    let cost = 0;
    const resources: ResourceType[] = ['food', 'ore', 'gas'];
    for (const planet of system.planets.values()) {
      for (const resource of resources) {
        cost += planet.infrastructureModifier[resource]; // Base line infrastructure is free.
      }
      cost += planet.orbitals* Infrastructure.orbitalCost;
    }
    for (const gate of system.gates) {
      cost += gate.cost;
    }
    return cost;
  }
}