// Level 10: Dark Throne

export default {
  name: "Dark Throne",
  w: 70,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":0,"ty":7},
  exit: {"tx":68,"ty":7},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,179,180,0,0,0,0,72,179,180,0,118,119,119,120,180,0,0,0,72,179,180,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,118,119,119,120,0,0,181,182,183,0,0,0,0,181,182,183,0,0,0,0,76,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,179,0,0,0,0,0,0,0,0,179,180,0,76,78,0,0,179,180,0,0,0,0,179,180,0,0,0,0,0,179,180,0,0,0,0,179,180,0,0,0,0,0,179,180,0,0,0,0,179,180,0,0,0,0,0,179,0,0,181,182,183,0,0,0,0,0],
    [0,0,129,130,31,0,0,0,0,0,0,0,181,182,183,0,0,0,0,76,78,0,0,0,0,181,182,183,0,0,0,0,181,182,183,0,0,0,181,182,183,0,0,0,0,76,78,0,0,0,0,181,182,183,0,0,0,0,0,182,0,0,0,0,0,0,0,179,180,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,154,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,78,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,154,0,0,0,0,135,0,0,0,0,0,0,0,155,0,0,0,0,0,0,0,0,0,0,0,0,156,0,0,0,0,0,135,80,100,0,0,99,0,157,0,0,0,0,135,0,0,0,0,0,0,0,135,155,0,0,178,0],
    [129,130,130,130,130,130,130,131,96,96,0,129,130,130,131,96,96,0,129,130,131,96,96,0,129,130,130,131,96,96,0,129,130,131,96,0,0,129,130,130,131,96,96,0,129,130,131,96,96,79,129,130,130,131,96,96,79,129,130,131,0,0,129,130,130,130,130,130,130,131],
    [169,170,170,170,170,170,170,171,0,0,0,169,170,170,171,0,0,0,169,170,171,0,0,0,169,170,170,171,0,0,0,169,170,171,0,0,0,169,170,170,171,0,0,0,169,170,171,0,0,0,169,170,170,171,0,0,0,169,170,171,0,0,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false],
    [false,false,true,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,true,true,true,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "slime",
      "tx": 12,
      "ty": 7,
      "patrolL": 11,
      "patrolR": 14
    },
    {
      "type": "slime",
      "tx": 25,
      "ty": 7,
      "patrolL": 24,
      "patrolR": 27
    },
    {
      "type": "slime",
      "tx": 38,
      "ty": 7,
      "patrolL": 37,
      "patrolR": 40
    },
    {
      "type": "slime",
      "tx": 51,
      "ty": 7,
      "patrolL": 50,
      "patrolR": 53
    },
    {
      "type": "slime",
      "tx": 58,
      "ty": 7,
      "patrolL": 57,
      "patrolR": 61
    },
    {
      "type": "slime",
      "tx": 63,
      "ty": 7,
      "patrolL": 62,
      "patrolR": 67
    },
    {
      "type": "bat",
      "tx": 8,
      "ty": 2,
      "patrolL": 5,
      "patrolR": 13
    },
    {
      "type": "bat",
      "tx": 22,
      "ty": 2,
      "patrolL": 18,
      "patrolR": 27
    },
    {
      "type": "bat",
      "tx": 36,
      "ty": 2,
      "patrolL": 32,
      "patrolR": 41
    },
    {
      "type": "bat",
      "tx": 48,
      "ty": 2,
      "patrolL": 44,
      "patrolR": 53
    },
    {
      "type": "bat",
      "tx": 60,
      "ty": 2,
      "patrolL": 56,
      "patrolR": 65
    },
    {
      "type": "skeleton1",
      "tx": 18,
      "ty": 6,
      "patrolL": 18,
      "patrolR": 20
    },
    {
      "type": "skeleton1",
      "tx": 44,
      "ty": 6,
      "patrolL": 44,
      "patrolR": 46
    },
    {
      "type": "skeleton1",
      "tx": 57,
      "ty": 7,
      "patrolL": 57,
      "patrolR": 62
    }
  ],
};
