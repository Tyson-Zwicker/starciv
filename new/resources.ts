export type ResourceTypes = 'food' | 'ore' | 'gas' | 'tech' | 'money';

export const RESOURCETYPES: ResourceTypes[] = ['food', 'ore', 'gas', 'tech', 'money'];

//Civ tech, Civ Natural talent, Planet resources, Planet Infrastructure, Planet WorkerSlots...  
export type ResourceModifier = Record <ResourceTypes ,number>;

//The amount of that resource stored per Planet/System/Civ/Freighter...
export type ResourceCollection = Record<ResourceTypes, number>;