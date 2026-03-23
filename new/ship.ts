import {Fleet} from './fleet';
import {Contract} from './contract';
import {Civilization} from './civilization';

export type Ship = {
  isGateship: boolean;
  isFreighter: boolean;         //
  contract: Contract|undefined; // Only freighters use this; remains loosely typed for now.
  owner: Civilization;
  fleet: Fleet;
  amountCarried: number;
  shipClass: string; //TODO: make this a type at some point..
  //TODO: Make freighter a type that inherits from ship...
}
export namespace Ship {
 export function make (shipClass: string, owner: Civilization, fleet: Fleet, isFreighter:boolean = false , isGateship = false): Ship {
    return {
      "shipClass":shipClass,
      "fleet": fleet,
      "owner":owner,
      "isFreighter": isFreighter,
      "isGateship": isGateShip,
      "contract": undefined,
      "amountCarried":0
    };
  }
}