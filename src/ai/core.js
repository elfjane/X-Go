'use strict';
var async = require("async");
var geolib = require('geolib');

exports.bot = bot;
exports.walk = walk;
function bot(callback)
{
	async.waterfall(
		[
			function(next) {				
				if (!_ai.isAI) {
					return next(1);
				}
				if (!_ai.isBot) {
					return next(1);
				}
				return next(null);
			}, function(next) {
				// 檢查物品是否超過承載設定
				if (_g.items_total > pokemon_acc.drop_items.burden) {
					game_core.ai.items.auto_drop_item_all();
					return next(1, _g.items_total);
				}
				return next(null);
			}, function(next) {
				// 檢查是否自動使用孵蛋
				if (!pokemon_acc.autoUseIncubator) {
					return next(null);
				}
				game_core.ai.pokemon.checkIncubatorPokemon(function(err, useIncubator) {
					if (err) {
						log.error(err);
						log.error("error checkIncubatorPokemon");
						return next(2);
					}
					if (useIncubator == null) {
						return next(null);
					}
					console.log(useIncubator);
					game_core.items.useEggIncubator(useIncubator.item_id, useIncubator.egg_id, function(err, info) {
						if (err) {
							log.error(err);
							log.error("error core bot game_core.items.useEggIncubator");
							return next(2);
						};
						return next(1);
					});	
				});
			}, function(next) {
				// 檢查是否有 CP 低的寵丟掉
				game_core.ai.pokemon.checkTransferPokemon(function(err, info) {
					if (err) {
						log.error(err);
						log.error("error checkTransferPokemon");
						return next(2);
					}
					return next(null);
				});
			}, function(next) {
				// 檢查是否有寵物可以抓
				game_core.ai.pokemon.checkSpawnPokemon(function(err, data) {
					if (err) {
						return next(2);
					}
					if (data == null) {
						return next(null);
					}
					game_core.ai.pokemon.catchPokemon(data.currentPokemon, data.user_item_id, function(err2, data2) {
						if (err2) {
							return next(2);
						}
						return next(null);
					});
				});
			}, function(next) {
				// 自動行走
				_ai.walk.selfLocation = pokeio.GetLocationCoords();
				if (!_ai.walk.target) {
					_ai.walk.target = _ai.walk.selfLocation;
					_ai.walk.target.key = null;
				}
				var meter = geolib.getDistance(_ai.walk.selfLocation, _ai.walk.target);
				console.log("close meter = %d", meter);
				if ((typeof(_g.forts) == "undefined"))	{
					return next(1, null);
				}
				if (meter < global.pokemon_conf.move_close) {
					_ai.isBot = true; // 走到後自動設定為 BOT
					_ai.walk.isBot = true;
					_ai.walk.isWalk = false;

					if (_ai.walk.target.key != null && (typeof(_ai.walk.turns[_ai.walk.target.key]) == "undefined")) {
						_ai.walk.turns[_ai.walk.target.key] = _ai.walk.target;
						game_core.ai.fort.find();
					}
					console.log(_ai.walk.target);

					if ((typeof(_ai.walk.target.isTurn) != "undefined") && (_ai.walk.target.isTurn == false)) {
						console.log("be starting turn");
						_ai.walk.target.isTurn = true;

						game_core.ai.fort.search(function(err, data) {
							if(err) {
								log.error(err);
								log.error("error game_core.ai.fort.search");
								return next(err);
							}
							game_core.ai.fort.find();
							return next(1, null);
						});
					} else {
						game_core.ai.fort.find();
						return next(1, null);
					}
				} else {
					game_core.player.move.walk(function(err, coordinates) {
						if(err) {
							log.error(err);
							log.error("error game_core.player.move.walk");
							return next(err);
						}
						return next(1, null);
					});
				}
			}
		],function(err, result) {
			if (err != 1) {
				log.error("bot error");
				console.log(err);
				callback(err, null);
				return;
			}
			console.log("finsih bot");
			return callback(err, result);
		}
	);
}

function walk(callback)
{
	async.waterfall(
		[
			function(next) {				
				_ai.walk.selfLocation = pokeio.GetLocationCoords();
				// 檢查是否手動走到目地的
				console.log(_ai.walk.selfLocation);
				var meter = geolib.getDistance(_ai.walk.selfLocation, _ai.walk.target);
				console.log("close meter = %d", meter);
				if (meter < global.pokemon_conf.move_close) {
					_ai.isWalk = false;
					return next(1);
				}
				// 自動移動
				game_core.player.move.walk(function(err, data) {
					if (err) {
						log.error(err);
						log.error("game_core.ai.player.move.walk");
						type_status = pokemon_status.type.disconnected;
						return next(2);
					}

					return next(1);
				});
			}
		],function(err, result) {
			if (err != 1) {
				log.error("walk");
				console.log(err);
				callback(err, null);
				return;
			}
			console.log("finsih walk");
			return callback(1, result);
		}
	);
}