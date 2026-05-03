// Level 7: Crumbling Bridge
// Place in js/levels/ folder to override the default

export default {
  name: "Crumbling Bridge",
  w: 55,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":0,"ty":7},
  exit: {"tx":53,"ty":7},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,181,182,183,0,0,0,0,118,119,119,119,120,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,76,78,0,0,0,179,180,0,76,78,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,179,180,0,76,78,0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0],
    [0,0,0,0,0,179,180,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,181,182,183,0,0,0,0,0,76,78,0,0,0,0,76,78,0,0,0,0,0,179,180],
    [0,0,0,0,76,78,0,0,0,0,99,0,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,155,0,0,135,0,0,0,76,78,0],
    [0,0,156,0,0,0,0,0,0,0,99,0,154,0,0,0,0,135,0,157,0,0,0,99,109,110,110,111,0,0,0,157,0,0,0,0,0,0,135,0,0,0,0,0,0,109,110,110,111,0,0,0,154,178,0],
    [109,110,110,110,110,110,110,111,96,96,79,109,110,110,111,96,96,0,109,110,111,96,96,79,169,170,170,171,0,0,0,109,110,110,110,111,96,96,0,109,110,111,96,96,0,169,170,170,171,96,96,109,110,110,111],
    [169,170,170,170,170,170,170,171,0,0,0,169,170,170,171,0,0,0,169,170,171,0,0,0,169,170,170,171,0,0,0,169,170,170,170,171,0,0,0,169,170,171,0,0,0,169,170,170,171,0,0,169,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false],
    [false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,true,true,true,true],
    [true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,true,true,true,true],
  ],
  entities:   [
    {
      "type": "slime",
      "tx": 19,
      "ty": 7,
      "patrolL": 18,
      "patrolR": 20
    },
    {
      "type": "slime",
      "tx": 32,
      "ty": 7,
      "patrolL": 31,
      "patrolR": 35
    },
    {
      "type": "bat",
      "tx": 9,
      "ty": 3,
      "patrolL": 6,
      "patrolR": 14
    },
    {
      "type": "bat",
      "tx": 37,
      "ty": 3,
      "patrolL": 33,
      "patrolR": 41
    },
    {
      "type": "skeleton1",
      "tx": 46,
      "ty": 6,
      "patrolL": 45,
      "patrolR": 48
    }
  ],
};
