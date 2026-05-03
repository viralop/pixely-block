// Level 8: Flooded Depths
// Place in js/levels/ folder to override the default

export default {
  name: "Flooded Depths",
  w: 60,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":19,"ty":8},
  exit: {"tx":58,"ty":7},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,181,182,183,0,0,0,0,0,76,78,118,119,119,119,120,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0],
    [0,0,0,45,179,180,0,0,0,0,0,0,0,0,179,180,0,0,76,78,0,0,179,180,0,0,0,0,0,0,179,180,0,0,0,0,0,0,179,180,0,0,0,0,0,0,179,180,76,78,0,0,0,0,0,0,76,78,0,0],
    [0,45,0,46,182,183,0,0,0,0,0,0,0,181,182,183,0,0,0,0,0,76,78,0,0,0,0,0,0,181,182,183,0,0,0,0,0,181,182,183,0,0,0,0,0,76,78,0,0,0,0,0,0,179,180,0,0,0,0,0],
    [0,46,0,47,0,0,0,0,0,0,0,99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,135,154,0,0,0,0,0,99,0,181,182,183,0,0,0,0,0],
    [0,47,0,65,0,0,0,157,0,0,0,99,0,0,156,0,135,0,0,0,60,80,80,100,0,0,99,0,154,0,0,0,0,0,0,135,0,155,0,0,0,0,0,0,60,80,80,100,0,0,99,135,0,155,0,0,0,0,178,0],
    [60,65,80,66,80,80,80,80,100,96,96,79,60,80,80,80,100,96,96,0,169,170,170,171,96,96,79,60,80,80,80,80,100,96,96,0,60,80,80,80,100,96,96,0,169,170,170,171,0,96,79,60,80,80,80,80,80,80,80,100],
    [169,66,170,67,170,170,170,170,171,62,62,62,169,170,170,170,171,62,62,62,169,170,170,171,62,62,62,169,170,170,170,170,171,62,62,62,169,170,170,170,171,62,62,62,169,170,170,171,0,62,62,169,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false],
    [false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,false,true,false,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true],
    [true,false,true,false,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "slime",
      "tx": 13,
      "ty": 7,
      "patrolL": 12,
      "patrolR": 16
    },
    {
      "type": "slime",
      "tx": 37,
      "ty": 7,
      "patrolL": 36,
      "patrolR": 40
    },
    {
      "type": "bat",
      "tx": 8,
      "ty": 2,
      "patrolL": 5,
      "patrolR": 12
    },
    {
      "type": "bat",
      "tx": 29,
      "ty": 4,
      "patrolL": 25,
      "patrolR": 33
    },
    {
      "type": "bat",
      "tx": 48,
      "ty": 3,
      "patrolL": 44,
      "patrolR": 52
    },
    {
      "type": "skeleton1",
      "tx": 45,
      "ty": 6,
      "patrolL": 44,
      "patrolR": 47
    },
    {
      "type": "skeleton1",
      "tx": 52,
      "ty": 7,
      "patrolL": 51,
      "patrolR": 56
    }
  ],
};
