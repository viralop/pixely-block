// Level 2: Rocky Caves
// Place in js/levels/ folder to override the default

export default {
  name: "Rocky Caves",
  w: 50,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":2,"ty":5},
  exit: {"tx":48,"ty":7},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,169,150,150,150,150,150,150,150,150,150,150,150,150,150,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,169,150,150,150,150,150,150,150,150,150,150,150,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,169,170,150,150,150,150,150,150,150,150,171,0,0,72,179,180,0,42,40,43,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,179,179,180,0,0,0,75,118,119,119,119,119,119,120,75,0,0,0,181,182,183,0,0,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,180,0],
    [0,0,0,0,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,179,180,179,0,0,0,0,0,60,0,76,78,0,0,0,0,0,0,72,0,0,0,76,78,0,0],
    [0,0,0,0,179,179,180,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,49,51,0,0,135,140,60,0,0,0,0,0,0,179,180,179,181,182,183,0,0,0,0,0],
    [0,0,0,0,181,182,183,0,0,0,0,0,0,0,105,106,107,0,0,0,0,0,0,0,0,0,149,151,0,0,76,78,60,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,138,0],
    [0,0,156,0,0,0,0,0,0,0,0,0,0,155,0,0,0,0,0,0,0,0,0,0,0,135,149,151,0,155,0,0,100,0,0,0,0,135,0,0,0,0,0,0,0,0,0,0,178,0],
    [109,110,110,110,110,110,110,110,111,0,0,0,109,110,110,110,111,0,0,0,0,0,109,110,110,111,149,151,109,110,110,110,110,111,96,96,109,110,110,110,111,0,0,109,110,110,110,110,110,111],
    [169,170,170,170,170,170,170,170,171,0,0,0,169,170,170,170,170,81,81,81,81,81,170,170,170,171,149,151,169,170,170,170,170,171,170,170,169,170,170,170,171,0,0,169,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,true,false,false,false,false,false,false,false,false,false,false,true,true,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false],
    [false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 38,
      "ty": 2,
      "patrolL": 35,
      "patrolR": 41
    },
    {
      "type": "bat",
      "tx": 42,
      "ty": 2,
      "patrolL": 39,
      "patrolR": 45
    },
    {
      "type": "bat",
      "tx": 36,
      "ty": 1,
      "patrolL": 33,
      "patrolR": 39
    },
    {
      "type": "prop",
      "tx": 44,
      "ty": 7,
      "patrolL": 41,
      "patrolR": 47
    },
    {
      "type": "slime",
      "tx": 39,
      "ty": 7,
      "patrolL": 36,
      "patrolR": 42
    }
  ],
};
