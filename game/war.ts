import {System} from './system';
import {Fleet} from './fleet';

export namespace War {
	export function battle(_system:System, _attackingFleet:Fleet):boolean {
		// TODO: resolve combat and return true if attacker wins
		return false;
	}
}
/* 
  Comabat/ SIEGING/ Attacks

  fleets have a location:
  -Hyperspace
  -System
  -Planet
  -Gate

  SEQUENCE
  -Fleets that arrive must fight "gate" fleet immediately (may or may not be owner)
   
  -If they survice they are in at "gate". Only 1 fleet at the gate.
  -Once per turn they may choose to attack a specific planet and fight its defences and any fleet with that location.
  -Owner may move all of their fleets locations once per turn (as well as split/join them).

  -When enemy attacks planet, their location is changed to planet, so they lose control of the gate
  -enemy may of course split their fleet as well.
  -enemy returns from planet on the next turn..
  */