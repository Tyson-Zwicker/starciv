import { System } from './system';
import { RESOURCES, Resource } from './types';

export type Planet = {
  population: number;
  workerSlots: Record<Resource | 'factory' | 'orbital', number>;
  stores: Record<Resource, number>;
  infrastructure: Record<Resource, number>;
  orbitals: number;
  system: System;
}
export namespace Planet {
  export function make(system: System, name: string) {
    let stores: Record<Resource, number> = {} as Record<Resource, number>;
    let workerslots: Record<Resource, number> = {} as Record<Resource, number>;
    let infrastructure: Record<Resource, number> = {} as Record<Resource, number>;
    for (const resource of RESOURCES) {
      stores[resource] = 0;
      workerslots[resource] = 0;
      infrastructure[resource] = 0;
    }
    return {
      "name": name,
      "system": system,
      "stores": stores,
      "infrastructure": infrastructure,
      "orbitals": 0
    }
  }

  export function addStores(planet: Planet, resource: Resource, amount: number) {
    planet.stores[resource] = (planet.stores[resource] ?? 0) + amount;
  }

  export function feedPopulation(planet: Planet) {
    if (planet.population <= planet.stores.food) {
      planet.stores.food -= planet.population;
      return 0;
    }    
    const required = planet.population - planet.stores.food;
    const availableFreighters = planet.system.freighters.length;
    const available = planet.stores.food + Math.min(availableFreighters, required);
    const transportsUsed = Math.min(required - planet.stores.food, availableFreighters);
    planet.system.freighters.splice (0,transportsUsed);    
    return planet.population - available; // Returns shortfall.
  }

  export function populationGrowth(_planet: Planet) {
    // TODO: implement
  }

  export function starvation(_surplusFood: number, _planet: Planet) {
    // TODO: implement
  }
}