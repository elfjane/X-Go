'use strict';
var async = require("async");
var geolib = require('geolib');

exports.main = heartBeat;
var reload_iv = 0;
function heartBeat(callback)
{
	async.waterfall(
		[
			function(next) {
				return next(null);
			},
			function(next) {
				pokeio.Heartbeat(function(err,hb) {
					if(err) {
						log.error(err);
						log.error("error = pokeio.Heartbeat");
						return next(2);
					}

					_g.hb = hb;
					_g.near_pokemon = {};
					for (var i = hb.cells.length - 1; i >= 0; i--) {
						if(hb.cells[i].NearbyPokemon[0]) {
							for (var j = 0; j < hb.cells[i].NearbyPokemon.length; j++) {
								var pokemon = pokeio.pokemonlist[parseInt(hb.cells[i].NearbyPokemon[j].PokedexNumber)-1];
								_g.near_pokemon[pokemon.num] = pokemon;
								//console.log('[+] There is a ' + pokemon.name + '('+pokemon.num+') near.');
							}
						}
					}
					// Show MapPokemons (catchable) & catch
					for (var i = hb.cells.length - 1; i >= 0; i--)
					{
						hb.cells[i].S2CellId.unsigned = false;
						hb.cells[i].s2id = game_core.getInt64toStr(hb.cells[i].S2CellId);
						hb.cells[i].timeMs = game_core.getInt64(hb.cells[i].AsOfTimeMs);
						for (var k = 0 ;k < hb.cells[i].Fort.length ; k++)
						{
							var currentFort = hb.cells[i].Fort[k];
							var fort_id = currentFort.FortId;
							currentFort.ActiveFortModifier = {};
							_g.forts[fort_id] = currentFort;	
						}
						if (hb.cells[i].Fort.length > 0)	{
							hb.cells[i].Fort = null;
						}
						for (var j = hb.cells[i].MapPokemon.length - 1; j >= 0; j--)
						{   // use async lib with each or eachSeries should be better :)
							var currentPokemon = hb.cells[i].MapPokemon[j];
							var type_id = currentPokemon.PokedexTypeId - 1;
							var spawnPointId = currentPokemon.SpawnPointId;
							currentPokemon.info = pokemonlist.pokemon[type_id];
							//console.log(currentPokemon);
							//currentPokemon.ExpirationTimeLong = getInt64(currentPokemon.ExpirationTimeMs);
							//console.log(currentPokemon);
							_g.spawn_pokemon[spawnPointId] = currentPokemon;
							_g.spawn_history_pokemon[spawnPointId] = currentPokemon;
						}
						if (hb.cells[i].MapPokemon.length > 0)	{
							hb.cells[i].MapPokemon = null;
						}

					}
					return next(null);
				});
			}, function(next) {
				// 設定多久重载入物品資料
				reload_iv++;
				if (reload_iv < 30) {
					return next(1, null);
				}
				reload_iv = 0;
				game_core.inventory.get(function(err, inventory) {
					if(err) {
						console.log(err);
						return next(2, err);
					}
					
					return next(1, null);
				});
			}
		], function(err, result) {
			if (err != 1) {
				log.error("heartbeat error");
				console.log(err);				
				return callback(err, result);
			}
			console.log("finsih heartbeat");
			return callback(err, result);
		}
	);
}