import { System } from './system';
import {Resource, ResourceType, Job, OrbitalItemType} from './economy';

export type Planet = {
  name: string;
  population: number;
  resources : Record <ResourceType,number>; //is a modifier
  infrastructure : Record <ResourceType,number>;   //is a modifier for RESOURCE extraction 
  jobAssignments:Record<Job,number>; 
  stores: Record<ResourceType,number>;  //is a collection
  orbitals: number;
  system: System;
  engineeringGoal: ResourceType | undefined;
  orbitalBuildGoal: OrbitalItemType | undefined;
}
export namespace Planet {


  export function addStores(planet: Planet, resources: Record<ResourceType,number>) {
    for (const resource of Resource.ResourceTypes) {
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