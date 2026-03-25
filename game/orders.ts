import { System } from './system';

export type Orders = {
  origin: System;
  destination: System;
  hostile: boolean;
  orderType: OrderType;
}
export type OrderType = 'attack' | 'defend' | 'travel';
export namespace Orders {
  export function make(orderType: OrderType, origin: System, destination: System, hostile = false) {
    return {
      "orderType": orderType,
      "origin": origin,
      "destination": destination, //destination is the place being attacked/defended or travelled to..
      "hostile": hostile //set to false if you don't want to attack right out of the gate..
    }
  }
}