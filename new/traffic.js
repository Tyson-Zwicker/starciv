export default class Traffic {
  static moveGateTraffic() {
    // TODO: implement
  }

  static moveNonGateTraffic() {
    // TODO: implement
  }

  static addGateTraffic(system, fleet) {
    //Send any fleets that request to leave.
    let sent = 'nogate';
    for (let gate of system.gates) {
      if (gate.destination === fleet.outgoing.destination) {
        //TODO: actually add it to the traffic...          
        sent = 'ok'
      }
    }
    return sent;
  }

  static getArrivalsForSystem(system) {
    // TODO: implement
    return [];
  }
}