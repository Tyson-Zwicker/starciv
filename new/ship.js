export default class Ship {
  static nextID = 0;
  ID = -1;
  frieghter = false;
  contract = undefined; //Only Freighters have these
  owner = undefined;
  currentFleet = undefined;
}