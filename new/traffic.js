export default class Traffic {
  static traffic = new Map (); //of fleets (key is fleet.id)
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
      if (!gate.fixedDestination ||( gate.fixedDestination === fleet.outgoing.destination)) {
        if (gate.blocked) {
          sent='blocked';
        }else{
          traffic.set (fleet.id,fleet);
          sent = 'ok'
          break;
        }
      }      
    }
    return sent;
  }

  static getArrivalsForSystem(system) {
    // TODO: implement
    return [];
  }
}