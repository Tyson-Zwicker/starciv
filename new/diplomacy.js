export default class Diplomacy {

	static contractBrokenNoResources(terms) {
		// TODO: handle contracts that fail due to missing resources
	}

	static contractBrokenNoGate(contract) {
		// TODO: handle contracts that fail due to unavailable gates
	}

	static gateBlockedForFleet(system, fleet) {
		// TODO: notify that a fleet could not depart because gates are blocked
	}

	static underAttack(system, incomingFleet) {
		// TODO: resolve diplomatic options before combat; return true if conflict is avoided
		return false;
	}

	static battleConcluded(system, fleet, victory) {
		// TODO: post-battle diplomacy handling
	}

	static youCannotParkFreighterHere(freighter) {
		// TODO: handle unauthorized freighter parking
	}
}