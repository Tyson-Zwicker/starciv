import { Planet } from './planet';
import { Notification } from './notification';
import { Gate } from './gate';
import { Freighter, Probe, GateShip } from './ship';
import { Traffic } from './traffic';
import { Fleet } from './fleet';
export type ResourceType = 'food' | 'ore' | 'gas' | 'tech' | 'money';
export namespace Resource {
  export const ResourceTypes: ResourceType[] = ['food', 'ore', 'gas', 'tech', 'money'];
}

//export type InfrastructureType = 'farms' | 'mines' | 'refineries' | 'labs' | 'banks';
export namespace Infrastructure {
  export const buildInfrastructureModifier = 0.1; //Used Gamewide, is the same for everybody, applies to all types of infrastructure..
  export const orbitalCost = 1; // used Gamewide, is same for everyone
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

export type OrbitalItemType = 'none' | 'ship' | 'freighter' | 'probe' | 'defence' | 'gate' | 'gateship' | 'orbital';
export type MaterialRequirementType = Extract<ResourceType, 'ore' | 'gas' | 'money'>;
export type MaterialCost = Record<MaterialRequirementType, number>;
export namespace OrbitalItems {
  export const orbitalItemTypes: OrbitalItemType[] = ['orbital', 'ship', 'probe', 'defence'];
  export const difficultyModifier: Record<OrbitalItemType, number> = {
    'none': 0,
    'orbital': 0.05,
    'ship': 1,        //Building a ship will have an additional modifier based on the type of ship.
    'probe': 0.25,
    'defence': 0.1,
    'gate': 0.01,
    'freighter': 1,
    'gateship': 2
  }

  export const materialsRequiredForOrbitalItem: Record<OrbitalItemType, MaterialCost> = {
    'none': { ore: 0, gas: 0, money: 0 },
    'orbital': { ore: 1, gas: 1, money: 1 },
    'ship': { ore: 1, gas: 1, money: 1 },        //Building a ship will have an additional modifier based on the type of ship.
    'probe': { ore: 1, gas: 1, money: 1 },
    'defence': { ore: 1, gas: 1, money: 1 },
    'gate': { ore: 1, gas: 1, money: 1 },
    'freighter': { ore: 1, gas: 1, money: 1 },
    'gateship': { ore: 1, gas: 1, money: 1 }
  }

  export namespace Economy {
    export function generateResources(planet: Planet) {
      const collected: Record<ResourceType, number> = {} as Record<ResourceType, number>;
      for (const resource of Resource.ResourceTypes) {
        let collectedThisResource = 0;
        for (const job of Job.Jobs) {
          if (Job.JobProduct[job] === resource) {
            const c = planet.system.owner.resourceModifier[resource];
            const p = planet.resourceModifier[resource];
            const w = planet.jobAssignments[job];
            const i = planet.infrastructureModifier[resource]; //how good is the infrastucture on the planet
            const t = planet.system.owner.tech;
            let m = 1;
            if (planet.system.owner.money < 0) m = 0.75;
            collectedThisResource += w * i * t * p * c * m;
          }
          collected[resource] = collectedThisResource;
        }
      }
      return collected;
    }

    function resourcesAvailableForOrbitalItem(planet: Planet) {
      let materialsNeeded = OrbitalItems.materialsRequiredForOrbitalItem[planet.orbitalBuildGoal];
      return (planet.system.stores['ore'] >= materialsNeeded['ore'] &&
        planet.system.stores['gas'] >= materialsNeeded['gas'] &&
        planet.system.stores['money'] >= materialsNeeded['money']
      );
    }
    export function infrastructureProduction(planet: Planet) {
      if (planet.engineeringGoal) {
        const goal = planet.engineeringGoal;
        const w = planet.jobAssignments['engineer'];
        const c = planet.system.owner.resourceModifier[goal];
        const i = Infrastructure.buildInfrastructureModifier; //How hard is it to make infrastrucutre?
        const t = planet.system.owner.tech;
        let m = 1;
        if (planet.system.owner.money < 0) m = 0.1;
        planet.infrastructureModifier[goal] += w * i * t * c * m;
      }
    }

    export function orbitalProduction(planet: Planet) {
      const goal = planet.orbitalBuildGoal;
      if (goal) {
        if (resourcesAvailableForOrbitalItem(planet)) {
          const w = planet.jobAssignments['orbiter'];
          const d = OrbitalItems.difficultyModifier[goal];
          const t = planet.system.owner.tech;
          let m = 1;
          if (planet.system.owner.money < 0) m = 0.1;
          const item = planet.orbitalBuildGoal;
          let shipModifier = 1; //not affect.
          if (item === 'ship') {
            shipModifier += planet.orbitalBuildGoalShipClass.size;
          }

          const before = planet.buildProgress[planet.orbitalBuildGoal];
          planet.buildProgress[planet.orbitalBuildGoal] += w * d * t * m;
          const after = planet.buildProgress[planet.orbitalBuildGoal];
          if (after > before) {

            switch (planet.orbitalBuildGoal) {
              case 'orbital':
                Notification.orbitalItemCompleted(planet);
                planet.orbitals++;
                break;
              case 'defence':
                Notification.defencePlatformCompleted(planet);
                planet.defencePlatforms++;
                break;
              case 'gate':
                Notification.gateCreated(planet);
                planet.system.gates.push(Gate.make(planet.system, undefined));
                break;
              case 'probe':
                const destination = Notification.probeCreated(planet);
                const probe: Probe = {
                  owner: planet.system.owner,
                  destination: destination
                }
                Traffic.addProbeTraffic(probe, planet.system, destination);
                break;
              case 'gateship':
                const gsDestination = Notification.gateShipCreated(planet);
                const gateShip: GateShip = GateShip.make(planet.system.owner, planet.system, gsDestination);
                Traffic.addGateShipTraffic (gateShip);
                break;
              case 'freighter':
                const fleet: Fleet = Fleet.make(planet.system);
                const freighter = Freighter.make(planet.system, fleet);
                Notification.freighterCreated(freighter, planet);
                planet.system.fleets.push(fleet);
                break;

              case 'ship':
                //    Notification.shipCreated (planet);
                break;
            }
            planet.buildProgress[planet.orbitalBuildGoal] += 0; //Reset build counter...
          }
        } else {
          Notification.insufficientMaterialToBuildOrbitalItem(planet);
        }
      }
    }
  }
}

/* Money

Money is collectivized at the system level first, then collected by the civ at the end of the turn
The cost of infrastructure is calculated at the system level..

When the civilization collects money from all the systems, it may inherit less than zero money (debt)

Next turn the civizations money or lack there-of will affect all systems equally..
The affect have having no money is that the infrastructures productivity is multiplied by the debtModifier:  money/infracost


*/