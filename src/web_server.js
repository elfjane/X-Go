'use strict';
var express = require('express');
var fs = require('fs');
//var bodyParser = require('body-parser')

var app = express();
var server;

function listen(callback)
{
	app.get('/', function(req, res) {
		fs.readFile("./html/index.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}
			res.send(filedata.toString());
		});
	});
	app.get('/debug', function(req, res) {
		fs.readFile("./html/debug.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}
			res.send(filedata.toString());
		});
	});
	app.get('/history', function(req, res) {
		fs.readFile("./html/history.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}
			res.send(filedata.toString());
		});
	});
	app.get('/items', function(req, res) {
		fs.readFile("./html/items.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}

			var items = filedata.toString();
			items = items.replace('___items_total___', JSON.stringify(_g.inventory.items_total));
			items = items.replace('___items___', JSON.stringify(_g.inventory.items));
			res.send(items);
		});
	});
	app.get('/pokemon', function(req, res) {
		fs.readFile("./html/pokemon.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}
			var pokemonfile = filedata.toString();
			pokemonfile = pokemonfile.replace('___pokemon___', JSON.stringify(_g.inventory.pokemon));
			pokemonfile = pokemonfile.replace('___eggs___', JSON.stringify(_g.inventory.eggs));
			res.send(pokemonfile);
		});
	});
	app.get('/pokedex', function(req, res) {
		fs.readFile("./html/pokedex.html", function(err, filedata)	{
			if(err) {
				res.send('error');
				return;
			}
			var pokedexfile = filedata.toString();
			pokedexfile = pokedexfile.replace('___pokedex___', JSON.stringify(_g.inventory.g_pokedex_entry));
			res.send(pokedexfile);
		});
	});
	// ===================================
	app.get('/profile', function(req, res) {
		_g.player_profile.username = "i'm hide name";
		res.send(_g.player_profile);
	});
	app.get('/loc', function(req, res) {
		res.send(pokeio.GetLocationCoords());
	});
	app.get('/hb', function(req, res) {
		res.send(_g.hb);
	});
	app.get('/iv', function(req, res) {
		res.send(_g.inventory);
	});
	app.get('/iv2', function(req, res) {
		pokeio.GetInventory(function(err, inventory) {
			if(err) {			
				return callback(err, inventory);
			}
			return res.send(inventory);
		});
	
	});
	app.get('/get/player/profile', function(req, res) {
		_g.player_profile.username = "i'm hide name";
		res.send(_g.player_profile);
	});
	app.get('/getforts', function(req, res) {
		res.send(_g.forts);
	});
	app.get('/get_near_pokemon', function(req, res) {
		res.send(JSON.stringify(_g.near_pokemon));
	});
	app.get('/get_spawn_pokemon', function(req, res) {
		res.send(JSON.stringify(_g.spawn_pokemon));
	});
	app.get('/get/pokemon/spawn_history', function(req, res) {
		res.send(JSON.stringify(_g.spawn_history_pokemon));
	});
	app.get('/getfortdetails', function(req, res) {
		var fortid = req.query.fortid;
		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		pokeio.GetFortDetails(fortid, lat, lng, function(err, fortdetails) {
			if (err) {
				res.send('error');
				return;
			};
			res.send(fortdetails);
		});
	});
	app.get('/get/hatched/eggs', function(req, res) {
		pokeio.GetHatchedEggs(function(err, info) {
			if (err) {
				res.send("error");
				return;
			};
			return res.send(info);
		});
	});

	app.get('/set/pokemon/favorite/:pokemon_key/:isFavorite', function(req, res) {
		var pokemon_key = req.params.pokemon_key;
		game_core.pokemons.setFavorite(pokemon_key, Number(req.params.isFavorite), function(err, info) {
			if (err) {
				res.send("error");
				return;
			};
			return res.send(info);
		});
	});

	app.get('/dropitem/:item_id/:count', function(req, res) {
		var item_id = Number(req.params.item_id);
		var count = Number(req.params.count);
		game_core.items.drop(item_id, count, function(err, info) {
			if (err) {
				res.send(err);
				return;
			};
			res.send(info);
		});	
	});

	app.get('/use/egg_incubator/:item_id/:egg_id', function(req, res) {
		var item_id = req.params.item_id;
		var egg_id = req.params.egg_id;
		game_core.items.useEggIncubator(item_id, egg_id, function(err, info) {
			if (err) {
				res.send(err);
				return;
			};
			res.send(info);
		});	
	});



	app.get('/get/near_fort', function(req, res) {
		/*
		var selfLocation = b.GetLocationCoords();
		var t_forts = [];	
		for (var k in _g.forts){
			t_forts[k] = {"latitude" : _g.forts[k].Latitude, "longitude" : _g.forts[k].Longitude}
		}
		var g = {"fort" : {},
				"headFace" : ""
			};
		g.fort = geolib.findNearest(selfLocation, t_forts, 1, 1);
		g.headFace = game_core.player.move.getHeadFace(selfLocation, g.fort);

		res.send(g);
		*/
		res.send(_ai.walk);
		
	});

	app.get('/get/items/drop', function(req, res) {
		var g = _g.drop_items;
		_g.drop_items = [];
		res.send(g);	
	});

	app.get('/set/target/:latitude/:longitude', function(req, res) {	
		if (!pokemon_acc.support_control) {
			res.send({"err":1,"msg":"can't find"});	
			return;
		}
		_ai.walk.target = {
			"latitude" : Number(req.params.latitude),
			"longitude" : Number(req.params.longitude),
			"altitude" : 0
		}
		_ai.walk.target.key = null;
		_ai.walk.isWalk = true;
		_ai.isWalk = true;
		res.send(_ai.walk);	
	});
	app.get('/set/target/stopmove', function(req, res) {
		_ai.walk.target = _ai.walk.selfLocation;
		_ai.walk.target.key = null;
		_ai.walk.isWalk = true;
		_ai.isBot = true;
		res.send(_ai.walk);	
	});
	// in this case set offset to 1 otherwise the nearest point will always be your reference point

	// to support JSON-encoded bodies
	//app.use(bodyParser.json());       
	// to support URL-encoded bodies
	//app.use(bodyParser.urlencoded({extended: true})); 
	var server = app.listen(pokemon_conf.port, function() {
		// get host
		var host = server.address().address;
		var port = server.address().port;
		log.info('listeing host = %s, port =%s', host, port);
		callback(null);
	});
}

exports.listen = listen;