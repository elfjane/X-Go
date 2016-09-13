var path = require('path');
process.env.NODE_PATH = path.join(__dirname, '');
require('module')._initPaths();
var calculations = require('./src/util/calculations');
var mon ={
    pokemon_id : 86,
    individual_attack : 3,
    individual_defense : 3,
    individual_stamina : 8,
    cp_multiplier : 0.6121572852134705,
    additional_cp_multiplier : null,
  }

var data = calculations.calculateCP(mon);
console.log(data);