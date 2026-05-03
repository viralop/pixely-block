// Level 5: Final Quest
// Place in js/levels/ folder to override the default

export default {
  name: "Final Quest",
  w: 66,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":1,"ty":6},
  exit: {"tx":64,"ty":6},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,161,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [122,0,0,0,0,121,162,0,0,0,0,0,0,0,0,0,0,0,121,142,0,161,162,161,161,161,161,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [141,161,161,161,161,142,0,0,0,0,0,0,0,0,0,0,0,0,141,161,161,142,0,0,0,0,0,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,140,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,72,179,180,179,0,0,0,0,0,0,0,0,0,0,0,72,179,180,179,0,0,0,82,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,181,182,183,0,0,0,0,82,0,0,0,0,0,0,76,78,0,0,0,0,0,0,179,180,179,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,179,180,0,0,0,0,0,179,180,179,76,78,0,0,0,179,180,0,0,0,0,140,179,180,82,76,78,0,0,179,180,0,0,0,0,179,180,179,181,182,183,0,0,0,0,0,179,180,179,76,78,0,0,0,0,0,0,179,180,179,76,78,0],
    [0,0,76,78,0,0,0,0,0,181,182,183,0,0,0,0,0,76,78,0,0,0,0,0,181,182,183,82,0,0,0,76,78,0,0,0,0,181,182,183,0,0,0,0,0,0,0,99,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0],
    [0,0,0,0,0,0,0,0,0,0,156,0,0,0,0,0,0,155,0,0,0,0,0,0,154,0,0,102,0,0,0,157,0,0,0,0,0,0,156,0,0,0,156,0,0,0,0,99,0,155,0,0,0,0,0,0,154,0,0,0,0,0,0,0,158,0],
    [49,50,50,50,50,51,61,61,61,109,110,110,110,111,96,96,89,90,90,91,96,96,109,110,110,110,111,81,81,49,50,50,51,81,81,89,90,90,91,96,96,109,110,110,110,111,81,81,49,50,50,51,81,81,49,50,50,50,50,50,50,50,50,50,50,51],
    [169,170,170,170,170,171,101,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,true,false],
    [false,false,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 11,
      "ty": 0,
      "patrolL": 8,
      "patrolR": 14
    },
    {
      "type": "bat",
      "tx": 17,
      "ty": 2,
      "patrolL": 14,
      "patrolR": 20
    },
    {
      "type": "skeleton1",
      "tx": 22,
      "ty": 7,
      "patrolL": 19,
      "patrolR": 25
    },
    {
      "type": "skeleton1",
      "tx": 30,
      "ty": 7,
      "patrolL": 27,
      "patrolR": 33
    },
    {
      "type": "bat",
      "tx": 32,
      "ty": 2,
      "patrolL": 29,
      "patrolR": 35
    },
    {
      "type": "bat",
      "tx": 49,
      "ty": 2,
      "patrolL": 46,
      "patrolR": 52
    },
    {
      "type": "prop",
      "tx": 37,
      "ty": 5,
      "patrolL": 34,
      "patrolR": 40
    },
    {
      "type": "skeleton1",
      "tx": 5,
      "ty": 7,
      "patrolL": 2,
      "patrolR": 8
    }
  ],
};
