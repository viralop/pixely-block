// Level 1: Green Meadows
// Place in js/levels/ folder to override the default

export default {
  name: "Green Meadows",
  w: 45,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":1,"ty":5},
  exit: {"tx":43,"ty":7},
  map: [
    [170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,170,132,132,132,132,132,132,132],
    [0,0,45,46,47,0,0,181,182,183,0,0,0,0,0,0,0,169,150,150,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,169,132,132,132,132,132,132],
    [0,105,66,66,66,107,0,0,0,0,0,0,0,0,0,0,0,0,169,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,169,132,132,132,132,132],
    [0,0,85,125,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,180,0,0,169,132,132,132,132],
    [0,0,0,124,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,139,0,0,0,0,0,0,0,0,0,0,0,0,181,182,183,0,0,0,169,132,132,132],
    [0,0,0,166,167,179,179,180,0,0,79,181,182,183,0,0,0,0,179,180,179,76,78,0,0,0,0,0,179,180,179,0,0,0,0,0,0,0,0,0,0,0,169,170,150],
    [0,146,147,164,0,181,182,183,0,0,99,0,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,0,138,149],
    [0,0,0,165,0,0,0,0,154,0,99,0,0,0,0,0,154,0,0,0,0,0,0,0,0,0,156,0,0,0,135,0,0,0,0,0,0,0,0,0,0,0,0,178,149],
    [49,50,50,50,50,50,50,50,50,50,50,51,0,0,0,49,50,50,50,50,50,50,51,0,0,49,50,50,50,50,51,0,0,49,50,50,50,50,50,50,50,50,50,50,51],
    [169,170,170,170,170,170,170,170,170,170,170,171,81,81,81,169,170,170,170,170,170,170,171,81,81,169,170,170,170,170,171,81,81,169,170,170,170,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false],
    [false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 14,
      "ty": 2,
      "patrolL": 11,
      "patrolR": 17
    },
    {
      "type": "bat",
      "tx": 26,
      "ty": 2,
      "patrolL": 23,
      "patrolR": 29
    }
  ],
};
