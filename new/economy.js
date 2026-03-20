export default class Economy {


  static calculateProduction(civ, planet, resource) {
    // TODO: implement
    return 0;
  }

  static feedPopulation(planet) {
    // TODO: implement
    return 0;
  }

  static groundProduction(planet) {
    // TODO: implement
    //Remember to diminish this if the civ has no money..
  }

  static orbitalProduction(planet) {
    // TODO: implement
    //Remember to diminish this if the civ has no money..
  }
}
/* Money

Money is collectivized at the system level first, then collected by the civ at the end of the turn
The cost of infrastructure is calculated at the system level..

When the civilization collects money from all the systems, it may inherit less than zero money (debt)

Next turn the civizations money or lack there-of will affect all systems equally..
The affect have having no money is that the infrastructures productivity is multiplied by the debtModifier:  money/infracost


*/