
export default class Civilization {
  static nextID = 0;
  systems = {
    known: new Map(),
    settled: new Map()
  };
  stores = { money: 0, tech: 0 };
  friends = new Map();
  enemies = new Map();
  static collectTaxes(civ) {
    // TODO: implement
  }
}


