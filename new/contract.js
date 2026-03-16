export default class Contract {
  //step: {destination, resource, amount}
  phases = [];
  currentPhase = 0;
  
  static getTerms(contract) {
    // TODO: implement
    return contract?.terms ?? null;
  }
  static nextPhase(contract) {
    // TODO: implement
    return false;
  }
}