import { System } from './system';
import {Resource, ResourceType, Job, OrbitalItemType} from './economy';
import {ShipClass } from './ship';
export type Planet = {
  name: string;
  population: number;
  populationGrowthModifier : number;
  resourceModifier : Record <ResourceType,number>; //is a modifier
  infrastructureModifier : Record <ResourceType,number>;   //is a modifier for RESOURCE extraction 
  jobAssignments:Record<Job,number>; 
  stores: Record<ResourceType,number>;  //is a collection
  orbitals: number;
  defencePlatforms: number;
  system: System;
  engineeringGoal: ResourceType | undefined;
  orbitalBuildGoal: OrbitalItemType;
  orbitalBuildGoalShipClass :ShipClass;
  buildProgress: Record <OrbitalItemType, number>;
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

  export function populationGrowth(planet: Planet) {
    planet.population +=planet.system.owner.populationGrowthBase * planet.populationGrowthModifier * (1 +planet.system.owner.tech/2);
  }

  export function starvation(shortfall:number, planet: Planet) {
    let shortMod = (planet.population-shortfall)/planet.population;
    planet.population -= shortMod * planet.system.owner.populationStarvationBase *  planet.populationGrowthModifier ;
  }
}