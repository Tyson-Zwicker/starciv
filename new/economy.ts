import {Civilization} from './civilization';
import {Planet} from './planet';
import {Resource} from './types';

export namespace Economy {
  export function calculateProduction(_civ:Civilization, _planet:Planet, _resource:Resource) {
    // TODO: implement
    return 0;
  }

  export function feedPopulation(_planet:Planet) {
    // TODO: implement
    return 0;
  }

  export function groundProduction(_planet:Planet) {
    // TODO: implement
    //Remember to diminish this if the civ has no money..
  }

  export function orbitalProduction(_planet:Planet) {
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