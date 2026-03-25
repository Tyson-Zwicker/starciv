import { Fleet } from './fleet';
import { Contract } from './contract';
import { Civilization } from './civilization';
import { System } from './system';

export type Freighter = {
  contract: Contract | undefined, // Only freighters use this; remains loosely typed for now.
  amountCarried: number,
  fleet: Fleet,
  owner: Civilization
}
export namespace Freighter {
  export function make(system: System, fleet: Fleet): Freighter {
    return {
      "contract": undefined,
      "owner": system.owner,
      "fleet": fleet,
      "amountCarried": 0
    }
  }
}
export type Probe = {
  owner: Civilization;
  destination: System;
}
export namespace Probe {
  export function make(owner: Civilization, destination: System): Probe {
    return {
      "destination": destination,
      "owner": owner,
    };
  }
}
export type GateShip = {
  owner: Civilization;
  origin: System;
  destination: System;
}
export namespace GateShip {
  export function make(owner: Civilization, origin: System, destination: System): GateShip {
    return {
      "origin": origin,
      "destination": destination,
      "owner": owner,
    };
  }
}

export type ShipClass = {
  name: string,
  size: number;
  tech: number;
}
export type Ship = {
  owner: Civilization;
  fleet: Fleet;
  shipClass: ShipClass;
}

export namespace Ship {
  export function make(shipClass: ShipClass, owner: Civilization, fleet: Fleet): Ship {
    return {
      "fleet": fleet,
      "shipClass": shipClass,
      "owner": owner,
    };
  }
}
