// Level 3: Haunted Woods
// Place in js/levels/ folder to override the default

export default {
  name: "Haunted Woods",
  w: 55,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":2,"ty":5},
  exit: {"tx":53,"ty":7},
  map: [
    [0,0,0,42,41,41,40,41,41,43,0,0,0,0,0,0,141,161,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,60,0,0,0,0,0,0,0,0,0,0,0,163,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,60,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,0,0,0,0,116,0,0,0,0,0,45,46,47,0,0,0,0,72,179,180,179,0,0,0,181,182,182,182,182,183,0,0,0],
    [0,0,0,0,0,0,60,72,179,180,179,0,0,0,0,0,0,0,82,0,75,118,119,119,119,120,75,0,0,0,45,46,72,66,72,46,47,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,60,181,182,183,0,0,0,0,0,0,0,116,82,0,0,0,0,0,0,0,0,0,0,0,85,86,86,125,86,86,87,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,179,180,60,0,0,0,0,0,0,179,180,179,76,78,82,0,0,179,180,179,0,0,0,0,0,179,180,179,0,166,167,0,0,0,29,31,0,0,0,181,182,183,0,0,0,179,180,179,0,0,0],
    [0,0,0,76,78,0,60,0,0,0,0,0,181,182,99,0,0,0,82,0,181,182,183,0,0,0,0,0,181,182,183,146,147,164,0,0,0,0,62,62,0,0,0,0,0,0,0,0,181,182,183,0,0,138,0],
    [0,116,0,0,0,0,100,0,0,0,0,0,154,0,99,0,0,0,82,0,154,0,0,116,0,0,0,157,0,0,0,0,0,165,0,0,0,135,83,83,116,155,0,0,0,0,0,0,154,0,0,0,0,178,0],
    [89,90,90,90,90,90,90,91,96,96,96,89,90,90,90,90,91,96,102,89,90,90,90,91,96,96,89,90,90,90,90,90,90,90,90,90,90,91,102,102,89,90,90,90,90,90,90,90,90,90,90,90,90,90,91],
    [169,170,170,170,170,170,170,171,81,81,81,169,170,170,170,170,171,81,81,169,170,170,170,171,81,81,169,170,170,170,170,171,81,81,169,170,170,171,81,81,169,170,170,170,171,81,81,169,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false],
    [false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 13,
      "ty": 2,
      "patrolL": 10,
      "patrolR": 16
    },
    {
      "type": "bat",
      "tx": 22,
      "ty": 1,
      "patrolL": 19,
      "patrolR": 25
    },
    {
      "type": "bat",
      "tx": 42,
      "ty": 1,
      "patrolL": 39,
      "patrolR": 45
    },
    {
      "type": "skeleton1",
      "tx": 44,
      "ty": 7,
      "patrolL": 41,
      "patrolR": 47
    },
    {
      "type": "skeleton2",
      "tx": 34,
      "ty": 7,
      "patrolL": 31,
      "patrolR": 37
    },
    {
      "type": "skeleton3",
      "tx": 22,
      "ty": 7,
      "patrolL": 19,
      "patrolR": 25
    },
    {
      "type": "prop",
      "tx": 11,
      "ty": 7,
      "patrolL": 8,
      "patrolR": 14
    }
  ],
};
