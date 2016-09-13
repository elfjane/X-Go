var path = require('path');
global.g_player_profile = {a:"i'm unknow"}
process.env.NODE_PATH = path.join(__dirname, '');
console.log(process.env.NODE_PATH);
require('module')._initPaths();
var src_game = require('./src/action_example');
var ai_pokemon = require('./src/ai/pokemon');

ai_pokemon.checkSpawnPokemon(function(err2, xdat) {
	if(err2) {
		console.log(err2);
		console.log(111111111111111);
		return;
	}
	console.log(err2);
	console.log(xdat);
});
//var game = new src_game(1);
//console.log(game);
function a()
{
	var _a = 10;
	console.log(_a);
}
a();
console.log(src_game);
src_game.cc();
//game.drop_item2();
//game.char_move.check_isNear(1,2);
