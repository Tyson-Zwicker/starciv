import { Contract } from './contract';
import {Civilization} from './civilization';
import {System} from './system';
import {Fleet} from './fleet';
import {Ship} from './ship';

export namespace Diplomacy {

	export function contractBrokenNoResources(_contract: Contract) {
		// TODO: handle contracts that fail due to missing resources
	}

	export function contractBrokenNoGate(_contract: Contract) {
		// TODO: handle contracts that fail due to unavailable gates
	}

	export function probeHasArrived(_owner: Civilization, _destination: System) {
		// TODO: handle probe arrival events
	}

	export function gateBlockedForFleet(_system:System, _fleet:Fleet) {
		// TODO: notify that a fleet could not depart because gates are blocked
	}

	export function underAttack(_system:System, _incomingFleet:Fleet) {
		// TODO: resolve diplomatic options before combat; return true if conflict is avoided
		return false;
	}

	export function battleConcluded(_system:System, _fleet:Fleet, _victory:boolean) {
		// TODO: post-battle diplomacy handling
	}

	export function youCannotParkFreighterHere(_freighter:Ship) {
		// TODO: handle unauthorized freighter parking
	}
}