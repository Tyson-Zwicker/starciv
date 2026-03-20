
export default class Civilization {
  static nextID = 0;
  systems = {
    known: new Map(),
    settled: new Map()
  };
  stores = { money: 0, tech: 0 };
  friends = new Map();
  enemies = new Map();
  infrastructureCost = 0; //Calculated freshly ever turn..
  static collectTaxes(civ) {
    for (system of civ.systems.settled){
      civ.stores.money += system.stores.money;
      system.stores.money = 0;
    }
  }
  static payForInfrastructure (civ){
    let moneyRemaining = civ.stores.money - civ.infrastructureCost;
    if (moneyRemaining<-1) civ.stores.money = -1;
  }
}


