import { System } from './system';
import { RESOURCETYPES, ResourceTypes, ResourceModifier, ResourceCollection } from './resources';

export type Planet = {
  population: number;
  workerSlots: Record<ResourceTypes | 'factory' | 'orbital', number>;
  resources : ResourceModifier;
  infrastructure: ResourceModifier;
  stores: ResourceCollection;  
  orbitals: number;
  system: System;
}
export namespace Planet {
  export function make(system: System, name: string, resources: ResourceModifier) {

    let stores: Record<ResourceTypes, number> = {} as Record<ResourceTypes, number>;
    let workerslots: Record<ResourceTypes, number> = {} as Record<ResourceTypes, number>;
    let infrastructure: Record<ResourceTypes, number> = {} as Record<ResourceTypes, number>;
    for (const resource of RESOURCETYPES) {
      stores[resource] = 0;
      workerslots[resource] = 0;
      infrastructure[resource] = 0;
    }
    return {
      "name": name,
      "system": system,
      "resources": resources,
      "stores": stores,
      "infrastructure": infrastructure,
      "orbitals": 0
    }
  }

  export function addStores(planet: Planet, resources: ResourceCollection) {
    for (const resource of RESOURCETYPES) {
      planet.stores[resource] = planet.stores[resource] + resources[resource];
    }
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
    planet.system.freighters.splice(0, transportsUsed);
    return planet.population - available; // Returns shortfall.
  }

  export function populationGrowth(_planet: Planet) {
    // TODO: implement
  }

  export function starvation(_surplusFood: number, _planet: Planet) {
    // TODO: implement
  }
}