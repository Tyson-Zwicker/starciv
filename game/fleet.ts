import { Ship, Freighter } from './ship';
import { Orders } from './orders';
import { Civilization } from './civilization';
import { System } from './system';
export type Fleet = {
  ships: Ship[]
  freighters: Freighter[];
  owner: Civilization;
  orders: Orders | undefined;
  location: System;
}
export namespace Fleet {
  export function make(system: System): Fleet {
    return {
      owner: system.owner,
      ships: [],
      freighters: [],
      orders: undefined,
      location: system
    }
  }
}
