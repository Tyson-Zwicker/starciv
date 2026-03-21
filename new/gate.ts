import {System} from './system';

export type Gate = {
  system: System;
  assistIncoming: boolean;
  assistOutgoing: boolean;
  blocked: boolean;
  fixedDestination: System|undefined; // Set to a system if created by a gate ship.
  cost: number;
}
export namespace Gate {
  export function make (system:System, fixedDestination:System|undefined = undefined, cost:number = Gate.defaultCost):Gate {    
    return {
      "system":system,
      "assistOutgoing":false,
      "assistIncoming":false,
      "blocked": false,
      "fixedDestination":fixedDestination,
      "cost":cost
    };
  }
  export const defaultCost = 10;
}

//Gateships create gates which can recieve from
//anywhere, but they can only send to the place the
//gateship originated from.

//Normal gates can point to any other gate, and 
//recieve from any other gate.

//Both types can be blocked.
//Both types can assist in/out

//Blocking only affects the ability to ENTER
//gate space, once there
//If the destination Blocks it doesn't affect ships (well- it slows them, but they're still coming).
//in GateSpace.
//Assist can affect speed of shps in GateSpace, but 
//only _positively_ so, if either gate switches direction
//to favor the "other way" the in-transit ship's
//speed remains base-line.  

//Gateships must be sent through a gate.  They travel much slower than normal ships because they need to "microjump",
//which is a process of stopping once in a while, leaving a beacon, jumping back home, and then microjumping again,
//each time getting closer to the destination. This mechanism isn't visible, but it is reflected by the fact that
//gate ships go much slower than normal ships, and they can only be sent to the gate they originated from.

