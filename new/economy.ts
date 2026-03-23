import { Planet } from './planet';
import { ResourceTypes, RESOURCETYPES } from './resources';

export namespace Economy {
  export function generateResources(planet: Planet) {
    const collected: Record<ResourceTypes, number> = {} as Record<ResourceTypes, number>;
    for (const resource of RESOURCETYPES) {
      const p = planet.resources[resource];
      const w = planet.workerSlots[resource];
      const i = planet.infrastructure[resource];
      const t = planet.system.owner.tech[resource];
      collected[resource] = p * w * i * t;
    }
    return collected;
  }

  export function groundProduction(_planet: Planet) {
    // TODO: implement
    //Remember to diminish this if the civ has no money..
  }

  export function orbitalProduction(_planet: Planet) {
    // TODO: implement
    //Remember to diminish this if the civ has no money..
  }
}
/* Money

Money is collectivized at the system level first, then collected by the civ at the end of the turn
The cost of infrastructure is calculated at the system level..

When the civilization collects money from all the systems, it may inherit less than zero money (debt)

Next turn the civizations money or lack there-of will affect all systems equally..
The affect have having no money is that the infrastructures productivity is multiplied by the debtModifier:  money/infracost


*/