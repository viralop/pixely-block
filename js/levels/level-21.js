// Level 21: My Level

export default {
  name: "My Level",
  w: 45,
  h: 15,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":1,"ty":10},
  exit: {"tx":42,"ty":8},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,109,111,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,109,111,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,109,111,0,0,0,0,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,45,46,47,0,0,0,0,0,0,0,0,0,0,135,0,0,0,0,0,56,75,118,119,119,119,119,119,120,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,85,125,87,0,0,0,0,0,0,0,0,0,109,111,0,0,0,0,0,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,0],
    [0,0,0,144,0,0,0,0,0,0,109,111,0,0,0,0,0,0,0,0,140,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,96,0,0,0,178,0,0],
    [0,0,0,144,0,129,130,130,131,0,0,0,0,0,0,0,0,0,0,0,109,111,0,0,0,0,0,0,0,0,0,0,0,0,129,130,130,130,130,130,130,130,130,130,131],
    [0,0,0,144,129,150,150,150,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,129,132,132,132,132,132,132,132,132,132,132,151],
    [0,0,0,129,150,150,150,150,151,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,81,81,81,81,81,81,129,130,130,132,132,132,132,132,132,132,132,132,132,132,151],
    [129,130,130,150,150,150,150,150,151,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,149,132,132,132,132,132,132,132,132,132,132,132,132,132,151],
    [149,150,150,150,150,150,150,150,151,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,169,170,170,170,170,170,170,170,170,170,170,170,170,170,171],
    [169,170,170,170,170,170,170,170,171,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false],
    [false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true],
    [false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    [true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 19,
      "ty": 1,
      "patrolL": 16,
      "patrolR": 22
    },
    {
      "type": "bat",
      "tx": 11,
      "ty": 2,
      "patrolL": 8,
      "patrolR": 14
    },
    {
      "type": "bat",
      "tx": 19,
      "ty": 6,
      "patrolL": 16,
      "patrolR": 22
    }
  ],
};
