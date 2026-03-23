import { Planet } from './planet';
export type ResourceType = 'food' | 'ore' | 'gas' | 'tech' | 'money';
export namespace Resource {
  export const ResourceTypes: ResourceType[] = ['food', 'ore', 'gas', 'tech', 'money'];
}
export type ResourceModifier = Record<ResourceType, number>;
export type InfrastructureType = 'farms' | 'mines' | 'refineries' | 'labs' | 'banks';
export namespace Infrastructure {
  export const baseModifier = 0.1;
}
export type Job = 'farmer' | 'miner' | 'refiner' | 'researcher' | 'banker' | 'orbiter' | 'engineer'; //Orbital constructore builds ships, probes and orbitals themselves

export namespace Job {
  export const Jobs: Job[] = ['farmer', 'miner', 'refiner', 'researcher', 'banker', 'orbiter', 'engineer'];

  export const JobProduct: Record<Job, ResourceType | 'orbital-item' | 'infrastructure'> = {
    'farmer': 'food',
    'miner': 'ore',
    'refiner': 'gas',
    'researcher': 'tech',
    'banker': 'money',
    'orbiter': 'orbital-item',
    'engineer': 'infrastructure'
  };
}
export type materialRequirement = { gas: number, ore: number, money: number };

export type OrbitalItemType = 'shipyard' | 'ship' | 'probe' | 'defence' | 'gate';
export namespace OrbitalItemType {
  export const orbitalItemTypes: OrbitalItemType[] = ['shipyard', 'ship', 'probe', 'defence'];
  export const difficultyModifier: Record<OrbitalItemType, number> = {
    'shipyard': 0.05,
    'ship': 1,        //Building a ship will have an additional modifier based on the type of ship.
    'probe': 0.25,
    'defence': 0.1,
    'gate': 0.01
  }
}

export function generateResources(planet: Planet) {
  const collected: Record<ResourceType, number> = {} as Record<ResourceType, number>;
  for (const resource of Resource.ResourceTypes) {
    let collectedThisResource = 0;
    let civ = planet.system.owner;   
    for (const job of Job.Jobs) {
      if (Job.JobProduct[job] === resource) {
        const c = planet.system.owner.resourceModifier[resource];
        const p = planet.resources[resource];
        const w = planet.jobAssignments[job];
        const i = planet.infrastructure[resource];
        const t = planet.system.owner.tech[resource];
        collectedThisResource += w * i * t * p * t * c ;
      }

      collected[resource] = collectedThisResource;
    }
  }
  return collected;
}

export function infrastructureProduction(planet: Planet) {
  if (planet.engineeringGoal) {
    const w = planet.jobAssignments['engineer'];
    const goal = planet.engineeringGoal;
    //Check for materials on hand.. ore, gas & money..
    const i = Infrastructure.baseModifier;;
    const t = planet.system.owner.tech[goal];
    planet.infrastructure[goal] += w * i * t * 
  }
}


export function orbitalProduction(_planet: Planet) {
  // TODO: implement
  //Remember to diminish this if the civ has no money..

}


/* Money

Money is collectivized at the system level first, then collected by the civ at the end of the turn
The cost of infrastructure is calculated at the system level..

When the civilization collects money from all the systems, it may inherit less than zero money (debt)

Next turn the civizations money or lack there-of will affect all systems equally..
The affect have having no money is that the infrastructures productivity is multiplied by the debtModifier:  money/infracost


*/