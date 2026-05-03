// Level 9: Tower Ascent
// Place in js/levels/ folder to override the default

export default {
  name: "Tower Ascent",
  w: 50,
  h: 14,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":0,"ty":11},
  exit: {"tx":20,"ty":0},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,178,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,72,180,0,0,0,0,0,0,0,49,50,50,50,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,49,50,50,51,0,0,0,0,0,0,169,170,170,170,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,169,170,170,171,0,0,0,0,0,0,169,170,170,72,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,169,170,170,171,0,0,0,0,0,0,169,170,170,170,171,50,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,169,170,170,72,180,0,0,0,118,119,119,120,170,170,171,170,171,0,0,0,0,0,0,0,179,180,0,0,118,119,119,120,0,0,0,0,0,45,0,0,0,0],
    [0,0,0,0,0,0,0,0,169,170,76,78,50,50,51,76,78,0,169,170,170,170,171,170,171,0,0,0,0,179,180,76,78,50,50,51,0,179,180,0,0,0,0,45,0,46,0,0,0,0],
    [0,0,0,0,0,0,179,180,169,170,170,171,170,170,171,99,0,0,169,76,78,170,99,170,179,180,0,0,76,78,0,0,169,170,170,171,76,78,0,0,179,180,0,46,0,47,0,0,0,0],
    [0,0,0,0,0,76,78,0,169,170,170,171,99,170,171,79,110,110,169,170,170,170,79,76,78,0,0,0,0,0,109,110,169,170,99,171,0,0,0,76,78,0,0,47,0,65,0,0,0,0],
    [0,0,0,0,0,0,0,0,169,170,170,171,99,155,171,170,170,170,169,170,170,135,171,157,171,0,0,0,0,135,169,157,169,170,99,171,0,0,0,157,0,0,0,65,0,66,0,0,0,0],
    [0,0,179,99,109,110,110,110,169,170,170,171,79,170,171,170,170,170,169,170,170,170,171,170,171,99,111,0,0,0,169,170,169,170,79,171,0,0,109,110,110,110,110,66,0,67,0,0,0,0],
    [0,155,182,99,169,170,170,135,169,170,170,171,170,170,171,170,170,170,169,170,170,170,171,170,171,99,171,0,0,0,169,170,169,170,170,171,0,0,169,170,170,170,135,67,0,85,156,0,0,0],
    [109,110,110,79,169,170,170,170,169,170,170,171,170,170,171,170,170,170,169,170,170,170,171,170,171,79,171,110,110,110,169,170,169,170,170,171,110,110,169,170,170,170,170,85,110,86,110,110,110,111],
    [169,170,170,170,169,170,170,170,169,170,170,171,170,170,171,170,170,170,169,170,170,170,171,170,171,170,171,170,170,170,169,170,169,170,170,171,170,170,169,170,170,170,170,86,170,87,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,true,false,false,false,false,true,true,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,true,true,false,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true,false,true,false,true,false,false,false,false,false,true,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,false,false,false,true,true,true,true,false,true,false,false,true,true,true,true,true,false,false,false,false,false,false,false],
    [false,false,true,false,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,false,false,false,false,false,false,false,false],
    [true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,false,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,false,true,true,true,true],
  ],
  entities:   [
    {
      "type": "slime",
      "tx": 14,
      "ty": 9,
      "patrolL": 14,
      "patrolR": 18
    },
    {
      "type": "slime",
      "tx": 30,
      "ty": 9,
      "patrolL": 30,
      "patrolR": 34
    },
    {
      "type": "bat",
      "tx": 16,
      "ty": 5,
      "patrolL": 14,
      "patrolR": 20
    },
    {
      "type": "bat",
      "tx": 28,
      "ty": 5,
      "patrolL": 25,
      "patrolR": 32
    },
    {
      "type": "bat",
      "tx": 36,
      "ty": 5,
      "patrolL": 33,
      "patrolR": 40
    },
    {
      "type": "skeleton1",
      "tx": 22,
      "ty": 9,
      "patrolL": 22,
      "patrolR": 26
    },
    {
      "type": "skeleton1",
      "tx": 38,
      "ty": 9,
      "patrolL": 38,
      "patrolR": 43
    },
    {
      "type": "slime",
      "tx": 11,
      "ty": 7,
      "patrolL": 10,
      "patrolR": 14
    },
    {
      "type": "slime",
      "tx": 33,
      "ty": 7,
      "patrolL": 32,
      "patrolR": 35
    }
  ],
};
