var pokemon_acc = require('./conf/account.json');
var pokemon_location = require('./conf/location.json');
var pokemon_conf = require('./conf/config.json');
var pokemon_lang = require('./conf/lang/'+pokemon_acc.lang+".json");
//    coords: {latitude:25.052019,longitude :121.568036,altitude :0 }
var location_name = pokemon_acc.location;
console.log(pokemon_location);
console.log(location_name);
var location1_move = pokemon_location[location_name];
console.log(location1_move);