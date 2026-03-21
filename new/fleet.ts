import {Ship} from './ship';
import {Orders} from './orders';
import {Civilization} from './civilization';

export type Fleet  = {  
  ships: Ship[];
  owner: Civilization;
  orders?: Orders;
  gateShip: boolean;
}

export namespace Fleet {
  export function onlyFreighters(fleet:Fleet): boolean {
    return fleet.ships.every((ship) => ship.isFreighter);
  }
}
