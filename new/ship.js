export default class Ship {
  static nextID = 0;
  ID = -1;
  isFrieghter = false;
  contract = undefined; //Only Freighters have these
  owner = undefined;
  fleet = undefined;
}