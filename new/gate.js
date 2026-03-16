

export default class Gate {
  static nextID = 0;
  ID = 0;
  system = undefined;
  assistIncoming = false;
  assistOutgoing = false;
  blocked = false;
  fixDestination = undefined; //Set to a system if created by a Gateship.
}