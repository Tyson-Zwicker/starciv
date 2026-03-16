export default class Trade {

  static fillOutgoingFreighter(freighter, system, terms) {
    if (system.stores[terms.resource] >= terms.amount) {
      for (let gate of system.gates) {
        if (gate.destination.fixedDestination === terms.destination || gate.fixedDestination === undefined) {
          //We have it, and we can get there, so load it and tell them to go there..
          system.stores[terms.resource] -= terms.amount;
          freighter[terms.resource] = terms.amount;
          freighter.currentFleet.outgoing = { destination: terms.destination }; // Give freighter's fleet a destination..
          return false;
        } else {          
          return 'nogate';
        }
      }
    } else {
        return 'resources'
    }
  }

  static acceptIncomingGoods(system, incomingFreighters) {
    // TODO: implement
  }
}