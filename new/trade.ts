import {Contract} from './contract';
import {Ship} from './ship';
import {System} from './system';
import {Orders} from './orders';


export namespace Trade {

  export function fillOutgoingFreighter(freighter: Ship, system: System, contract: Contract):boolean{
    if (system.stores[contract.resource] >= contract.amount) {
      system.stores[contract.resource] -= contract.amount;
      freighter.amountCarried = contract.amount;
      if (freighter.fleet) {
        freighter.fleet.orders = Orders.make (system, contract.destination, false);
      }
      return true;
    }
    return false;
  }

  export function acceptIncomingGoods(_system: System, _incomingFreighters: Ship[]):void {
    // TODO: implement
  }
}