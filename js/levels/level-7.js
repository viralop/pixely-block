// Level 7: Crumbling Bridge

export default {
  name: "Crumbling Bridge",
  w: 110,
  h: 15,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":1,"ty":12},
  exit: {"tx":108,"ty":11},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,150,150,150,150,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,163,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,163,163,163,163,163,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,37,37,37,37,37,37,37,37,37,37,37],
    [0,0,0,180,180,180,0,0,0,0,0,0,0,0,0,0,0,0,0,149,150,150,150,150,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,102,102,102,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,37,37,37,37,37,37,37,37,37,37,37],
    [0,0,0,105,106,107,0,0,0,0,0,0,0,0,0,0,0,0,0,149,150,150,150,150,150,150,150,150,150,150,150,150,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,179,0,0,82,82,82,82,82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,37,37,37,37,37,37,37,37,37,37,37],
    [0,0,0,0,0,0,0,45,46,46,46,46,46,46,46,47,180,0,0,149,150,150,150,150,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,179,0,181,183,0,0,82,82,82,82,82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [105,107,0,0,0,0,0,85,86,86,86,125,86,86,86,87,180,0,0,149,150,150,150,150,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,57,82,0,0,0,0,0,0,72,0,0,0,0,0,0,0,181,183,0,0,0,0,0,82,82,82,82,82,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,179,179,0],
    [0,0,0,0,0,0,0,0,0,0,0,144,0,0,0,0,180,0,0,149,150,150,150,150,150,150,150,150,150,150,150,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,83,0,0,0,0,180,0,140,0,180,0,0,0,56,56,0,0,0,0,0,0,0,82,82,82,82,82,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,72,72,0],
    [0,0,0,0,0,0,0,0,179,179,0,144,0,0,0,0,0,0,0,169,170,170,170,170,170,170,170,170,170,170,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,117,83,181,182,182,182,182,182,182,182,182,182,182,183,56,56,0,0,0,0,0,0,0,82,82,82,82,82,180,79,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,179,179,0],
    [69,70,70,70,70,70,71,0,37,79,37,144,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,0,117,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,50,51,57,89,82,82,82,82,82,91,99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,179,179,0],
    [37,0,0,0,0,0,0,0,0,99,0,144,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,118,119,119,119,120,37,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,117,83,0,0,0,0,0,0,0,0,0,0,179,179,0,0,0,0,149,170,171,57,149,102,102,102,102,102,151,99,0,0,0,0,180,180,42,40,43,0,0,0,76,77,77,77,77,77,77,77,77,77,77,78],
    [37,0,0,0,0,0,0,0,0,99,0,144,0,179,180,0,76,78,0,0,0,0,0,0,0,42,43,180,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,117,83,0,0,179,49,50,50,50,50,50,50,50,50,50,50,50,50,171,0,0,57,149,81,81,81,81,81,151,99,69,70,70,70,70,70,71,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [69,70,70,70,70,70,71,0,0,99,0,144,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,161,162,0,0,0,0,0,76,78,0,0,0,0,76,78,0,0,0,0,0,179,180,0,117,83,0,0,179,169,170,170,170,170,170,170,170,170,170,170,170,171,0,0,0,57,169,170,170,170,170,170,171,99,0,0,0,180,180,180,0,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0],
    [0,0,0,0,0,0,0,0,0,99,0,144,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,155,0,0,135,0,0,0,76,78,0,0,117,83,0,0,0,0,0,0,0,179,179,179,0,0,0,0,0,0,0,0,0,179,179,0,0,0,0,0,0,99,0,0,0,180,180,180,0,80,0,0,180,0,0,180,0,0,0,0,180,0,0,180,158,0],
    [0,0,0,0,0,0,0,0,37,99,37,165,0,0,0,0,0,0,0,0,0,0,0,0,109,110,110,111,0,0,0,157,0,0,0,0,0,0,0,0,72,0,0,0,121,109,110,110,111,122,0,72,0,0,0,0,117,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,0,0,0,0,0,0,0,100,0,37,37,0,0,37,37,0,0,37,37,0,0,37,37,37],
    [109,110,110,110,110,110,110,111,96,96,96,109,110,110,111,96,96,96,109,110,111,96,96,0,0,0,0,0,0,0,0,109,110,110,110,111,0,0,0,109,110,111,0,0,102,81,81,81,81,102,96,109,110,110,111,0,137,102,76,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,77,78,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,101,169,170,170,171,101,81,169,170,170,171,81,57,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false],
    [false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,true,false,true,false,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false],
    [false,false,false,false,false,false,false,false,true,true,false,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false],
    [true,true,true,true,true,true,true,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false],
    [true,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,false,false,false,true,true,true,false,true,false,false,true,false,false,true,false,false,false,false,true,false,false,true,false,false],
    [false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,true,true,false,false,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,true],
    [true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,true,true,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 37,
      "ty": 3,
      "patrolL": 33,
      "patrolR": 41
    },
    {
      "type": "skeleton3",
      "tx": 105,
      "ty": 7,
      "patrolL": 102,
      "patrolR": 108
    },
    {
      "type": "skeleton3",
      "tx": 104,
      "ty": 7,
      "patrolL": 101,
      "patrolR": 107
    },
    {
      "type": "bat",
      "tx": 104,
      "ty": 3,
      "patrolL": 101,
      "patrolR": 107
    },
    {
      "type": "slime",
      "tx": 63,
      "ty": 12,
      "patrolL": 60,
      "patrolR": 66
    },
    {
      "type": "skeleton1",
      "tx": 71,
      "ty": 12,
      "patrolL": 68,
      "patrolR": 74
    },
    {
      "type": "bat",
      "tx": 88,
      "ty": 3,
      "patrolL": 85,
      "patrolR": 91
    },
    {
      "type": "bat",
      "tx": 93,
      "ty": 3,
      "patrolL": 90,
      "patrolR": 96
    },
    {
      "type": "skeleton2",
      "tx": 88,
      "ty": 12,
      "patrolL": 85,
      "patrolR": 91
    },
    {
      "type": "skeleton2",
      "tx": 33,
      "ty": 12,
      "patrolL": 30,
      "patrolR": 36
    },
    {
      "type": "skeleton2",
      "tx": 26,
      "ty": 11,
      "patrolL": 23,
      "patrolR": 29
    },
    {
      "type": "skeleton2",
      "tx": 19,
      "ty": 12,
      "patrolL": 16,
      "patrolR": 22
    },
    {
      "type": "bat",
      "tx": 23,
      "ty": 8,
      "patrolL": 20,
      "patrolR": 26
    },
    {
      "type": "bat",
      "tx": 36,
      "ty": 6,
      "patrolL": 33,
      "patrolR": 39
    },
    {
      "type": "bat",
      "tx": 49,
      "ty": 6,
      "patrolL": 46,
      "patrolR": 52
    },
    {
      "type": "skeleton1",
      "tx": 53,
      "ty": 12,
      "patrolL": 50,
      "patrolR": 56
    },
    {
      "type": "skeleton1",
      "tx": 3,
      "ty": 9,
      "patrolL": 0,
      "patrolR": 6
    }
  ],
};
