export default class Trade {

  static fillOutgoingFreighter(freighter, system, terms) {
    if (system.stores[terms.resource] >= terms.amount) {
      system.stores[terms.resource] -= terms.amount;
      freighter[terms.resource] = terms.amount;
      freighter.currentFleet.outgoing = { destination: terms.destination }; // Give freighter's fleet a destination..
      return true;
    }
    return false;
  }

  static acceptIncomingGoods(system, incomingFreighters) {
    // TODO: implement
  }
}