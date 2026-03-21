import {Fleet} from './fleet';
import {Gate} from './gate';
import {Planet} from './planet';
import {Ship} from './ship';
import {Civilization} from './civilization';
import { Coordinates, RESOURCES, Resource } from './types';

export type System = {
  location: Coordinates;
  stores: Record<Resource, number>;
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
  export function hasUnfixedGate(system: System) {
    for (const gate of system.gates) {
      if (!gate.fixedDestination) return true;
    }
    return false;
  }

  export function removeFreighters(system: System, fleet: Fleet) {
    for (const ship of fleet.ships) {
      system.freighters =  system.freighters.filter (s => s!==ship);
      system.allFreighters = system.allFreighters.filter (s => s!==ship);      
    }
  }

  export function removeFleet(system: System, fleet: Fleet) {
    system.fleets = system.fleets.filter (f => f!==fleet);
  }

  export function addFleet(system: System, fleet: Fleet) {
    if (!system.fleets.includes (fleet)) system.fleets.push (fleet);
  }

  export function addToAllFreighters(system: System, freighter: Ship) {
    if (!system.allFreighters.includes (freighter)) system.allFreighters.push (freighter);    
  }

  export function berthOwnFreighter(system: System, freighter: Ship) {
    if (!system.freighters.includes (freighter)) system.freighters.push (freighter);    
  }

  export function calcDistance(system: System, otherSystem: System) {
    return Math.hypot(system.location.x - otherSystem.location.x, system.location.y - otherSystem.location.y);
  }

  export function collectivizeResources(system: System) {    
    for (const planet of system.planets.values()) {
      for (const resource of RESOURCES) {
        if (planet.stores[resource as Resource] > 0) {
          system.stores[resource] += planet.stores[resource as Resource];
          planet.stores[resource as Resource] = 0;
        }
      }
    }
  }

  export function calculateInfrastructureCost(system: System) {
    let cost = 0;
    const resources: Resource[] = ['food', 'ore', 'gas'];
    for (const planet of system.planets.values()) {
      for (const resource of resources) {
        cost += (planet.infrastructure[resource] ?? 0) - 1; // Base line infrastructure is free.
      }
      cost += planet.orbitals;
    }
    for (const gate of system.gates) {
      cost += gate.cost;
    }
    return cost;
  }
}