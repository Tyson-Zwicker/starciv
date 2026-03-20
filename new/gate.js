

export default class Gate {
  static nextID = 0;
  ID = 0;
  system = undefined;
  assistIncoming = false;
  assistOutgoing = false;
  blocked = false;
  fixDestination = undefined; //Set to a system if created by a Gateship.
}

//Gateships create gates which can recieve from
//anywhere, but they can only send to the place the
//gateship originated from.

//Normal gates can point to any other gate, and 
//recieve from any other gate.

//Both types can be blocked.
//Both types can assist in/out

//Blocking only affects the ability to ENTER
//gate space, once there
//If the destination Blocks it doesn't affect ships (well- it slows them, but they're still coming).
//in GateSpace.
//Assist can affect speed of shps in GateSpace, but 
//only _positively_ so, if either gate switches direction
//to favor the "other way" the in-transit ship's
//speed remains base-line.  