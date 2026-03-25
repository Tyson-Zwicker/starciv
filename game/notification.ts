import { Contract } from './contract';
import { Civilization } from './civilization';
import { System } from './system';
import { Fleet } from './fleet';
import { Freighter, GateShip, Ship } from './ship';
import { Planet } from './planet';

export namespace Notification {

	export function freighterLoadingProblem(_freighter: Freighter) {
		throw new Error('Function not implemented.');
		// handle contracts that fail due to missing resources
	}
	export function contractBrokenNoGate(_contract: Contract) {
		throw new Error('Function not implemented.');
		// handle contracts that fail due to unavailable gates
	}
	export function probeHasArrived(_owner: Civilization, _destination: System) {
		throw new Error('Function not implemented.');
		// handle probe arrival events
	}
	export function gateBlockedForFleet(_system: System, _fleet: Fleet) {
		throw new Error('Function not implemented.');
		// notify that a fleet could not depart because gates are blocked
	}
	export function underAttack(_system: System, _incomingFleet: Fleet): boolean {
		throw new Error('Function not implemented.');// resolve diplomatic options before combat; return true if conflict is avoided		
	}
	export function battleConcluded(_system: System, _fleet: Fleet, _victory: boolean) {
		//post-battle diplomacy handling
		//IMPORTANT: Call to notificatin decides new orders of invading fleet.
		//Fleet that lost doesn't need to worry about order becuase it dead...
		throw new Error('Function not implemented.');
	}
	export function youCannotParkFreighterHere(_freighter: Freighter) {
		throw new Error('Function not implemented.');
	}
	export function orbitalItemCompleted(_planet: Planet) {
		throw new Error('Function not implemented.');
	}
	export function insufficientMaterialToBuildOrbitalItem(_planet: Planet) {
		throw new Error('Function not implemented.');
	}
	export function gateCreated(_planet: Planet): void {
		throw new Error('Function not implemented.');
	}

	export function probeCreated(_planet: Planet): System {
		throw new Error('Function not implemented.');
	}

	export function gateShipArrivedInOccurpiedSystem(_gateship: GateShip, _system: System): boolean {
		throw new Error('Function not implemented.');
	}
	export function OtherCivilizaionsFleetArrived(_fleet: Fleet, _system: System) {
		throw new Error('Function not implemented.');
	}
	export function defencePlatformCompleted(_planet: Planet) {
		throw new Error('Function not implemented.');
	}
	export function freighterCreated(_freighter: Freighter, _planet: Planet) {
		throw new Error('Function not implemented.');
	}
	export function shipCreated(_ship: Ship, _planet: Planet) {
		throw new Error('Function not implemented.');
	}
}