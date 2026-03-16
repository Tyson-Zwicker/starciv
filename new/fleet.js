export default class Fleet {
  static nextID = 0;
  ID = -1;
  ships = new Map();
  owner = undefined;
  get onlyFreighers() {
    for (let ship in this.ships.values) if (!ship.freighter) return false;
    return true;
  }
}