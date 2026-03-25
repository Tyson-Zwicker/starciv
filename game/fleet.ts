import { Ship,Freighter } from './ship';
import { Orders } from './orders';
import { Civilization } from './civilization';

export type Fleet = {
  ships: Ship[]
  freighters: Freighter[];
  owner: Civilization;
  orders: Orders | undefined;
  gateShip: boolean;
}


