// Level 6: Sunlit Hills
// Place in js/levels/ folder to override the default

export default {
  name: "Sunlit Hills",
  w: 48,
  h: 10,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":0,"ty":7},
  exit: {"tx":46,"ty":7},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,179,180,0,0,0,0,0,0,0,0,0,179,180,0],
    [0,0,0,45,0,0,0,0,0,0,0,0,0,0,0,179,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,0,76,78,0,0],
    [0,45,0,46,0,0,179,180,179,0,0,0,0,0,181,182,183,0,0,0,0,76,78,0,0,0,0,0,0,0,179,180,179,0,0,0,0,0,0,45,0,179,180,179,0,0,0,0],
    [0,46,0,47,0,181,182,183,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,0,0,0,0,0,0,181,182,183,0,0,0,0,0,0,0,46,181,182,183,0,0,0,0,0],
    [0,47,0,65,0,0,0,157,0,0,0,99,0,0,0,0,0,0,0,135,49,50,50,50,51,0,135,0,0,0,156,0,0,0,0,0,0,0,0,47,0,0,156,0,0,0,178,0],
    [49,65,50,66,50,50,50,50,50,51,96,79,49,50,50,50,50,51,0,0,169,170,170,170,171,0,0,49,50,50,50,50,50,50,51,0,0,0,49,65,50,50,50,50,50,50,50,51],
    [169,66,170,67,170,170,170,170,170,171,0,0,169,170,170,170,170,171,0,0,169,170,170,170,171,0,0,169,170,170,170,170,170,170,171,0,0,0,169,66,170,170,170,170,170,170,170,171],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [true,false,true,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,true,false,true,true,true,true,true,true,true,true],
    [true,false,true,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,true,false,true,true,true,true,true,true,true,true],
  ],
  entities:   [
    {
      "type": "slime",
      "tx": 28,
      "ty": 7,
      "patrolL": 27,
      "patrolR": 34
    }
  ],
};
