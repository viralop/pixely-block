// Level 9: Tower Ascent

export default {
  name: "Tower Ascent",
  w: 90,
  h: 16,
  bgColor: "#1a2a1a",
  theme: "grass",
  spawn: {"tx":2,"ty":9},
  exit: {"tx":88,"ty":9},
  map: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3075,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3008,0,0,0,3008,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,0,0,0,3075,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3008,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,55,0,0,3075,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3041,0,0,0,0,0,0,179,0,0,0,3091,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,0,0,0,3020,3021,3021,3021,3021,3021,3038,3021,3021,3021,3022,143,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,3098,3097,0,0,3009,0,3041,0,0,0,3024,0,0,0,3042,3010,3010,3010,3010,3010,3010,3010,3042,0,0,0,0,0,0,0,0,0,179,0,0,0,0,0,0,0,0,1070,3053,0,37,0,0,163,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,0,179,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [0,3098,3097,3098,3097,0,0,3020,3038,3021,3021,3021,3021,3021,3021,3022,0,0,0,3024,0,0,0,3020,3021,3021,3021,3021,3038,3021,3021,3022,0,0,0,0,0,0,0,0,0,179,0,0,0,0,0,0,0,0,0,3053,0,37,0,0,3031,0,0,0,0,0,0,0,0,0,179,179,179,179,0,0,0,3087,3088,3090,0,0,3024,0,0,179,3024,0,0,0,0,0,0,0],
    [0,3082,3081,3096,3080,3010,0,3009,3027,3064,3024,0,0,0,3024,0,0,0,0,3024,0,0,0,0,0,0,0,1070,3043,0,0,0,0,0,0,0,0,0,0,179,179,135,0,0,0,0,72,0,0,0,0,3053,0,37,0,0,3031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,3024,0,0,0,0,0,0,0],
    [3020,3038,3021,3021,3021,3021,3021,3021,3021,3022,3024,0,0,0,3024,72,0,0,179,3024,0,0,0,0,0,179,0,179,3043,0,0,0,179,179,0,0,3020,3021,3021,3021,3038,3022,0,0,0,179,179,179,0,0,0,3053,0,56,0,0,3031,0,0,0,0,0,0,0,0,3103,3104,3104,3104,3104,3106,0,0,0,0,0,0,0,3024,179,0,0,3040,0,0,0,179,0,3012,0],
    [1070,3054,0,179,179,179,0,3058,0,0,3024,0,0,0,3024,179,0,0,179,3024,0,0,0,0,0,3042,0,0,3043,0,0,3037,0,0,0,0,0,0,3008,0,3052,0,0,0,0,0,1064,1069,1067,0,0,3053,0,56,0,0,3031,0,0,179,179,179,179,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3024,0,0,0,0,0,0,0,0,0,3028,3099],
    [0,3054,0,3010,0,0,0,3058,0,0,3024,179,0,3100,3101,3102,0,0,0,3024,0,0,0,0,0,3103,3088,3090,3043,0,3004,3038,3005,3005,3005,3005,3006,0,3024,0,3052,0,0,0,3041,0,1100,1101,1103,0,0,3053,0,56,140,0,3031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,179,0,0,0,3040,0,0,0,0,0,3099,3100,3101,3101,3101,3102],
    [3103,3104,3105,3106,0,0,0,3073,0,3100,3101,3102,0,0,0,3076,3109,3109,3109,3110,3109,3109,3109,3077,0,0,0,0,3043,0,0,3053,1070,0,0,0,3008,0,3024,0,3052,0,0,0,3020,3021,3021,3038,3021,3021,3021,3021,3021,3021,3021,3021,3021,3022,3099,3100,3101,3101,3101,3102,3099,0,0,0,0,0,0,0,0,0,3062,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3099],
    [0,3054,0,0,0,3087,3088,3090,0,0,0,0,0,0,0,3091,0,0,0,0,0,0,0,3075,0,0,0,0,3043,0,0,3053,0,0,0,0,3040,0,3024,0,3052,0,0,0,0,0,0,3053,0,0,0,3053,0,0,0,0,3031,3099,0,0,0,0,0,0,0,0,0,0,0,0,0,179,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3054,0,0,0,0,3052,0,0,0,0,0,0,0,0,3091,0,0,0,0,0,0,0,3075,0,0,0,0,3043,0,0,3053,0,0,0,0,0,0,3024,0,3052,0,0,0,0,0,0,3053,0,0,0,3053,0,0,0,0,3031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3062,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3068,0,0,0,0,3069,0,0,0,0,0,0,0,0,3078,0,0,0,0,0,0,0,3078,0,0,0,0,3068,0,0,3068,0,0,0,0,0,0,3040,0,3069,0,0,0,0,0,0,3069,0,0,0,3069,0,0,0,0,3031,0,0,0,0,0,0,0,0,0,3103,3106,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3094,3029,3029,3029,3029,3029,3029,3029,3095,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3095,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029,3029],
  ],
  solidMap: [
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,true,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,true,false,true,false,false,false,false,true,true,false,false,true,true,true,true,true,true,false,false,false,true,true,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,true,false,false,false],
    [false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,true,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,true,true,true,true,true],
    [true,true,true,true,false,false,false,false,false,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,true,false,false,false,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  ],
  entities:   [
    {
      "type": "bat",
      "tx": 26,
      "ty": 8,
      "patrolL": 23,
      "patrolR": 29
    },
    {
      "type": "bat",
      "tx": 12,
      "ty": 8,
      "patrolL": 9,
      "patrolR": 15
    },
    {
      "type": "skeleton3",
      "tx": 20,
      "ty": 10,
      "patrolL": 17,
      "patrolR": 23
    },
    {
      "type": "skeleton1",
      "tx": 6,
      "ty": 11,
      "patrolL": 3,
      "patrolR": 9
    },
    {
      "type": "skeleton1",
      "tx": 37,
      "ty": 7,
      "patrolL": 34,
      "patrolR": 40
    },
    {
      "type": "skeleton1",
      "tx": 35,
      "ty": 9,
      "patrolL": 32,
      "patrolR": 38
    },
    {
      "type": "skeleton3",
      "tx": 49,
      "ty": 10,
      "patrolL": 46,
      "patrolR": 52
    },
    {
      "type": "skeleton3",
      "tx": 49,
      "ty": 3,
      "patrolL": 46,
      "patrolR": 52
    },
    {
      "type": "skeleton3",
      "tx": 60,
      "ty": 10,
      "patrolL": 57,
      "patrolR": 63
    },
    {
      "type": "bat",
      "tx": 68,
      "ty": 4,
      "patrolL": 65,
      "patrolR": 71
    },
    {
      "type": "bat",
      "tx": 68,
      "ty": 12,
      "patrolL": 65,
      "patrolR": 71
    },
    {
      "type": "bat",
      "tx": 74,
      "ty": 8,
      "patrolL": 71,
      "patrolR": 77
    },
    {
      "type": "bat",
      "tx": 84,
      "ty": 5,
      "patrolL": 81,
      "patrolR": 87
    },
    {
      "type": "skeleton1",
      "tx": 68,
      "ty": 7,
      "patrolL": 65,
      "patrolR": 71
    }
  ],
};
