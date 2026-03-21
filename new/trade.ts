export default class Trade {

  static fillOutgoingFreighter(freighter: any, system: any, terms: any) {
    if (system.stores[terms.resource] >= terms.amount) {
      system.stores[terms.resource] -= terms.amount;
      freighter[terms.resource] = terms.amount;
      if (freighter.fleet) {
        freighter.fleet.outgoing = { destination: terms.destination };
      }
      return true;
    }
    return false;
  }

  static acceptIncomingGoods(system: any, incomingFreighters: any[]) {
    // TODO: implement
  }
}