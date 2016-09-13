'use strict';
// ========================================= 
// 設定自動 include 的方法
// ========================================= 
var path = require('path');
process.env.NODE_PATH = path.join(__dirname, '');
require('module')._initPaths();

// ========================================= 
// 優先載入設定
// ========================================= 
global.pokemonlist = require('./data/pokemons.json');	// pokemon list
global.itemlist = require('./data/items.json');			// 物品道具 list
global.pokemon_status = require('./data/type_stat.json');
global._g = require('./data/gamedata.json');

var async = require("async");
var log4js = require('log4js');


var game = require('./src/game');
var game_heartbeat = require('./src/heartbeat');
var game_web_server = require('./src/web_server');
// =========================================
// global area
// =========================================
global.pokeio = null;
//global.redis_client = require('src/redis/redis'); // redis code client
global.pokemon_acc = require('./conf/account.json');
global.pokemon_location = require('./conf/location.json');
global.pokemon_conf = require('./conf/config.json');
global.pokemon_lang = require('./conf/lang/'+pokemon_acc.lang+".json");

global._ai = {};
global.xgo_api = require('./src/xgo_api'); // xgo api
global.game_core = new game();
global.log = log4js.getLogger();
global.type_status = pokemon_status.type.begin;
global.checkTime = Date;

// ========================================= 
// init & default
// =========================================
var PokemonGO = require('src/poke.io.js');


_ai = {
	"isAI" : true,
	"isBot" : true,
	"isDropItem" : false,
	"dropItemList" : [],
	"walk" : {
		  "target" : null
		, "headFace" : {}
		, "fort" : {}
		, "turns" : {}
		, "selfLocation" : {}
	}
};

// time
var timer_heartbeat;
var timer_move;

// =========================================

function init()
{
	type_status = pokemon_status.type.begin;
	log.info("begin");
	async.waterfall(
		[
			function(next) {
				//redis_client.createClient(pokemon_conf.redis.host, pokemon_conf.redis.port, pokemon_conf.redis.key);
				return next(null);
			},
			function(next) {
				xgo_api.login(pokemon_acc.xgo_account.username, pokemon_acc.xgo_account.password, function (err, data) {
					if (err) {
						return next(2);
					}
					_g.uid = data.uid;
					_g.token = data.token;
					return next(null)
				});
			},
			function(next) {
				xgo_api.location_get(function (err, data) {
					if (err) {
						if (err == 1) {
							return next(null, true);
						}
						return next(2);
					}
					var get_loc = {
						"type" : "coords",
						"coords" : {
							"latitude" : data.latitude,
							"longitude" : data.longitude,
							"altitude" : data.altitude
						}
					}
					_g.location_move = get_loc;
					_ai.walk.selfLocation = _g.location_move.coords;
					return next(null, null)
				});
			},
			function(isNew, next) {
				if (!isNew)	{
					return next(null);
				}
				var location_name = pokemon_acc.location;
				_g.location_move = pokemon_location[location_name];
				_ai.walk.selfLocation = _g.location_move.coords;
				
				xgo_api.move(_g.location_move.coords.latitude, _g.location_move.coords.longitude, _g.location_move.coords.altitude, function (err, data) {
					if (err) {
						return next(2);
					}
					return next(null)
				});
			},
			function(next) {
				return next(null);
			},
			function(next) {
				return next(null);
			},
			function(next) {
				// init web server
				game_web_server.listen(function(err) {
					if (err) {
						console.log(err);
						return next(2);
					}
					return next(null);

				});
			}, function(next) {
				// start login
				type_status = pokemon_status.type.init;
				login(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					return next(null);
				});
			}
		], function(err) {
			if (err) {
				log.error("init error");
				console.log(err);				
				return;
			}
			// start bot
			log.info("starting......");
			setInterval(heartbeat, pokemon_conf.heartBeat);
		}
	);
}

function login(callback)
{
	type_status = pokemon_status.type.init;
	pokeio = new PokemonGO.Pokeio();
	pokeio.init(pokemon_acc.account.username, pokemon_acc.account.password, _g.location_move, pokemon_acc.account.provider, function(err) {
		if (err) {
			log.error("login init error");
			log.error(err);

			type_status = pokemon_status.type.disconnected;
			callback(err)
			return;
		}
		console.log('[i] Current location: ' + pokeio.playerInfo.locationName);
		console.log('[i] lat/long/alt: : ' + pokeio.playerInfo.latitude + ' ' + pokeio.playerInfo.longitude + ' ' + pokeio.playerInfo.altitude);
		type_status = pokemon_status.type.connected;
		// 設定連線成功後不立即讀取新資料
		setTimeout(function() {
			pokeio.GetProfile(function(err, profile) {
				if (err) {
					console.log(err);
					type_status = pokemon_status.type.disconnected;
					callback(err);
					return;
				}
				_g.player_profile = profile;
				log.info(profile);

				log.info(pokemon_lang.username, profile.username);
				log.info(pokemon_lang.poke_storage, profile.poke_storage);
				log.info(pokemon_lang.item_storage, profile.item_storage);


				var poke = 0;
				if (profile.currency[0].amount) {
					poke = profile.currency[0].amount;
				}

				console.log(pokemon_lang.poke_coin, poke);
				console.log(pokemon_lang.stardust, profile.currency[1].amount);
				// 設定連線成功後不立即讀取新資料
				setTimeout(function() {
					game_core.inventory.get(function(err, inventory) {
						if(err) {
							console.log(err);
							console.log("game_core.inventory.get");
							type_status = pokemon_status.type.disconnected;
							callback(err);
							return;
						}
						log.info("get inventory");
						type_status = pokemon_status.type.playing;
						callback(null, null);
						return;
					});
				}, 1000 );
			});
			return;
		}, 1000 );
		
	});
}
var run = false;
function heartbeat()
{
	if (run) {
		return;;
	}
	console.log("heartbeat starting");
	log.info(type_status);
	/*
	if (type_status == pokemon_status.type.disconnected) {
		check_type(pokemon_status.type.disconnected);
		return;
	}
	*/
	switch (type_status)
	{
		case pokemon_status.type.init:
		case pokemon_status.type.connecting:
		case pokemon_status.type.connect:
		case pokemon_status.type.connected:
		{
		} break;
		case pokemon_status.type.playing:
		{
			run = true;
			// 啟動定時心跳
			async.waterfall(
				[
					function(next) {
						// 自動丟物品
						// 有丟物品動作則不進行其他動作
						if (!_ai.isBot) {
							return next(null);
						}
						if (!_ai.isDropItem) {
							return next(null);
						}
						if (_ai.dropItemList.length < 1) {
							_ai.isDropItem = false;
							run = false;
							return next(1);
						}
						var dropitem = _ai.dropItemList.pop();
						console.log(dropitem);
						game_core.items.drop(dropitem.item_id, dropitem.count, function(err, data) {
							if (err) {
								log.error(err);
								log.error("game_core.items.drop");
								type_status = pokemon_status.type.disconnected;
								run = false;
								return next("game_core.items.drop");
							}
							return next(1);
						});
					},	function(next) {
						game_heartbeat.main(function(err, data) {
							if (err != 1) {
								log.error(err);
								log.error("game_heartbeat.main");
								type_status = pokemon_status.type.disconnected;
								return next("game_heartbeat.main");
							}
							return next(null);
						});
					},	function(next) {
						// 檢查是否為自動行走
						if (!_ai.isWalk) {
							return next(null);
						}
						// 啟動自動走路
						game_core.ai.core.walk(function(err, data) {
							if (err != 1) {
								log.error(err);
								log.error("game_core.ai.core.walk");
								type_status = pokemon_status.type.disconnected;
								run = false;
								return next("game_core.ai.core.walk");
							}
							return next(1);
						});
					},	function(next) {
						// 檢查是否為BOT
						if (!_ai.isAI && !_ai.isBot) {
							return next(1);
						}
						// 如果是 BOT 則啟動BOT
						game_core.ai.core.bot(function(err, data) {
							if (err != 1) {
								log.error(err);
								log.error("game_heartbeat.ai.core.bot");
								type_status = pokemon_status.type.disconnected;
								run = false;
								return next("game_heartbeat.ai.core.bot");
							}
							return next(1);

						});
					}
				], function(err) {
					if (err != 1) {
						log.error("playering error");
						console.log(err);
						type_status = pokemon_status.type.disconnected;
						run = false;
						return;
					}
					console.log("playering finish");
					run = false;
					return;
				}
			);
		} break;
		case pokemon_status.type.disconnected:
		{
			run = true;
			console.log("disconnect reconnecting");
			login(function(err) {
				if (err) {
					log.error(err);
					log.error("disconnected");
					type_status = pokemon_status.type.disconnected;
					run = false;
					return;
				}
				run = false;
				return;
			});
		} break;
	}
}

// 初始化
init();