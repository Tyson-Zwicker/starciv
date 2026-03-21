import {System} from './system';

export type Orders = {
  origin: System;
  destination: System;
  hostile: boolean;
}
export namespace Orders {
  export function make (origin: System, destination: System, hostile = false) {
    return{
    "origin" : origin,
    "destination": destination,
    "hostile": hostile
    }
  }
}