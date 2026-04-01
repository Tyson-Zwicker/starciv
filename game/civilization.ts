import {System} from './system';
import {ResourceType, OrbitalItemType} from './economy';
export type Civilization = {
  systems: { known: System[]; settled: System[]};
  stores: { money: number; tech: number };
  resourceModifier : Record<ResourceType, number>;
  orbitalItemModifer: Record<OrbitalItemType,number>;
  money: number;
  friends: Civilization[];
  enemies: Civilization[];
  tech :number;
  populationStarvationBase:number;
  populationGrowthBase:number;
}

export namespace Civilization {
  export function addKnownSystem (civ:Civilization, system:System): void {
    if (!civ.systems.known.includes (system)) civ.systems.known.push (system);
  }
  export function collectTaxes(civ: Civilization) {
    for (const system of civ.systems.settled.values()) {
      civ.stores.money += system.stores.money;
      system.stores.money = 0;
    }
  }
  export function payForInfrastructure(civ: Civilization, infrastructureCost: number):void {
    //Pay for resource extraction infrastructure;
    //Infrastructure costs even if it isn't used this turn...
    const moneyRemaining = civ.stores.money - infrastructureCost;
    if (moneyRemaining < -1) civ.stores.money = -1;
  }
}


