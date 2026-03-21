import {System} from './system';

export type Civilization = {
  systems: { known: System[]; settled: System[]};
  stores: { money: number; tech: number };
  friends: Civilization[];
  enemies: Civilization[];
  infrastructureCost: number;
}

export namespace Civilization {
  export function collectTaxes(civ: Civilization) {
    for (const system of civ.systems.settled.values()) {
      civ.stores.money += system.stores.money;
      system.stores.money = 0;
    }
  }

  export function payForInfrastructure(civ: Civilization) {
    const moneyRemaining = civ.stores.money - civ.infrastructureCost;
    if (moneyRemaining < -1) civ.stores.money = -1;
  }
}


