// Level 4: Dark Caves
// Place in js/levels/ folder to override the default

export default {
  name: "Dark Caves",
  w: 60,
  h: 15,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":1,"ty":10},
  exit: {"tx":58,"ty":11},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,46,46,46,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,66,66,66,66,66,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,169,150,150,150,150,150,150,150,150,150,150,150,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,45,46,46,66,66,66,66,66,66,66,46,46,46,47,0,0,0,0,0,0,0,0,0,0,55,0,0,0,169,150,150,150,150,150,150,150,150,150,150,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,65,66,66,66,66,66,66,66,66,66,66,66,66,67,0,0,0,0,0,0,0,0,0,75,75,75,75,0,0,169,150,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,65,66,66,66,66,66,125,66,66,66,66,66,66,67,0,0,0,0,0,0,0,75,0,0,0,0,0,0,0,0,169,150,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,85,86,86,86,86,87,124,85,86,86,86,86,86,87,0,0,0,0,0,75,0,0,0,0,0,0,0,0,0,0,0,169,150,150,150,150,150,150,151,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,126,147,147,147,147,147,145,167,0,0,0,0,0,0,0,0,0,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0,169,170,170,170,170,170,171,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,124,0,0,0,0,0,0,0,0,75,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,144,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,56,0,0,0,0,72,179,180,179,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,76,78,0,0,0,0,0,0,0,0,144,0,0,0,0,0,76,78,0,0,0,0,0,140,179,180,179,0,0,0,0,0,0,0,0,0,0,56,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0],
    [0,0,0,0,179,180,179,0,0,0,0,0,179,180,179,76,78,144,0,0,179,180,179,0,0,0,0,179,180,179,181,182,183,0,0,0,0,0,0,179,180,179,76,78,90,90,90,90,91,0,0,0,0,0,179,180,179,76,78,0],
    [0,0,0,181,182,183,0,0,0,0,0,181,182,183,0,0,0,145,0,181,182,183,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0,181,182,183,0,0,150,150,150,150,150,151,0,0,0,0,181,182,183,0,0,138,0],
    [0,0,156,0,0,0,0,0,0,0,0,157,0,0,0,0,0,165,0,157,0,0,75,0,0,0,156,0,0,0,0,0,0,0,0,0,0,0,156,0,0,0,0,150,150,150,150,150,151,0,0,0,0,155,0,0,0,0,158,0],
    [109,110,110,110,110,110,111,61,61,61,109,110,110,110,111,61,61,109,110,110,111,61,61,109,110,110,110,111,61,61,109,110,110,111,61,61,109,110,110,110,111,61,61,150,150,150,150,150,151,109,110,110,110,110,110,110,110,110,110,111],
    [169,170,170,170,170,170,171,101,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,171,101,101,169,170,170,171,101,101,169,170,170,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,false],
    [false,false,false,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,true,true,true,true,true,true,false,false,false,false,true,true,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "skeleton1",
      "tx": 6,
      "ty": 12,
      "patrolL": 3,
      "patrolR": 9
    },
    {
      "type": "bat",
      "tx": 10,
      "ty": 6,
      "patrolL": 7,
      "patrolR": 13
    },
    {
      "type": "bat",
      "tx": 21,
      "ty": 6,
      "patrolL": 18,
      "patrolR": 24
    },
    {
      "type": "bat",
      "tx": 32,
      "ty": 7,
      "patrolL": 29,
      "patrolR": 35
    },
    {
      "type": "skeleton3",
      "tx": 24,
      "ty": 12,
      "patrolL": 21,
      "patrolR": 27
    },
    {
      "type": "skeleton2",
      "tx": 37,
      "ty": 12,
      "patrolL": 34,
      "patrolR": 40
    },
    {
      "type": "skeleton1",
      "tx": 34,
      "ty": 2,
      "patrolL": 31,
      "patrolR": 37
    },
    {
      "type": "skeleton3",
      "tx": 42,
      "ty": 9,
      "patrolL": 39,
      "patrolR": 45
    },
    {
      "type": "prop",
      "tx": 52,
      "ty": 12,
      "patrolL": 49,
      "patrolR": 55
    }
  ],
};
