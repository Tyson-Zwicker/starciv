import { Freighter } from './ship';
import { System } from './system';
import { Orders } from './orders';


export namespace Trade {

  export function fillOutgoingFreighter(freighter: Freighter, system: System): boolean {
    if (freighter.contract) {
      if (system.stores[freighter.contract.resource] >= freighter.contract.amount) {
        if (freighter.fleet && freighter.contract && freighter.contract.destination) {
          system.stores[freighter.contract.resource] -= freighter.contract.amount;
          freighter.amountCarried = freighter.contract.amount;
          freighter.fleet.orders = Orders.make('travel',system, freighter.contract.destination, false);
          return true;
        }
      }
    }
    return false;
  }

  export function acceptIncomingGoods(_system: System, _incomingFreighters: Freighter): void {
    // TODO: implement
  }
}