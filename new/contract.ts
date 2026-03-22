import {System} from './system';
import {Resource} from './types';
export type ContractDirection = -1 | 0 | 1;

export type Contract = {
  origin: any;
  destination: any;
  resource: Resource;
  amount: number;
  direction: ContractDirection;
};

export namespace Contract {
  // Direction 0 or 1 = going to destination, -1 = returning, 0 = one way.
  export function makeContract(origin: System, destination: System, resource: Resource, amount: number, direction: ContractDirection): Contract {
    return { origin, destination, resource, amount, direction };
  }

  // Returns false if there is nowhere left to travel.
  export function nextPhase(contract: Contract): boolean {
    contract.direction *= -1;
    if (contract.direction === 0) return false;
    return true;
  }

  export function getCurrentDestination(contract: Contract) {
    if (contract.direction === -1) return contract.origin;
    return contract.destination;
  }
}