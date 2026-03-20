export default class Contract {
  //Direction 0 or 1 = GOING TO DESTINATION
  //-1 = GOING BACK TO ORIGIN
  //0 means it was a once way trip.
  phases = [];
  currentPhase = 0;
  static makeContract (origin, destination, resource, direction){
    return {origin, destination, resource, amount, direction}
  }  
  //Returns false if it has no where to go..
  static nextPhase(contract) {
    contract.direction *=-1;
    if (contract.direction ===0) return false;
    return true;
  }
  static getCurrentDestination(contract){
    if (direction ===-1) return contract.origin;
    return contract.destination;
  }
}