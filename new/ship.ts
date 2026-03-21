import {Fleet} from './fleet';
import {Contract} from './contract';
import {Civilization} from './civilization';

export type Ship = {
  isFreighter: boolean;
  contract: Contract|undefined; // Only freighters use this; remains loosely typed for now.
  owner: Civilization;
  fleet: Fleet;
  shipClass: string; //TODO: make this a type at somepoint..
  //TODO: Make freighter a type that inherits from ship...
}
export namespace Ship {
 export function make (shipClass: string, owner: Civilization, fleet: Fleet, isFreighter:boolean = false ): Ship {
    return {
      "shipClass":shipClass,
      "fleet": fleet,
      "owner":owner,
      "isFreighter": isFreighter,
      "contract": undefined
    };
  }
}