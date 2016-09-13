'use strict';
var geolib = require('geolib');

exports.find = find_fort;
exports.search = search_fort;

// 找尋pokestop點
function find_fort()
{
	var nowTime;
	var t_forts = [];	
	for (var k in _g.forts){
		t_forts[k] = {"latitude" : _g.forts[k].Latitude, "longitude" : _g.forts[k].Longitude}
	}
	var listfort = geolib.findNearest(_ai.walk.selfLocation, t_forts, 0, 50);
	var isSetFind = false;
	var isFind    = false;
	var key;
	for (var i = 0; i < listfort.length; i++) {
		isSetFind = false;
		key = listfort[i].key;
		//console.log(listfort[i].key);
		//console.log(_g.forts[key]);
		if (_g.forts[key].FortType != 1) {
			continue;
		}
		for (var k in _ai.walk.turns) {
			if (_ai.walk.turns[k].key == listfort[i].key) {
				nowTime = checkTime.now();
				console.log("=======delete time");
				console.log(nowTime - _ai.walk.turns[k].turnTime);
				if (nowTime - _ai.walk.turns[k].turnTime < 0) {
					console.log("break is turn");
					isSetFind = true;
					break;
				} else {
					break;
				}
				isSetFind = true;
				break;
			}
		}
		if (!isSetFind)	{
			_ai.walk.fort   = listfort[i];
			_ai.walk.target = listfort[i];
			_ai.walk.target.turnTime = 0;
			_ai.walk.target.isTurn   = false;
			isFind = true;
			break;
		}
	}
	if (!isFind) {
		console.log("can't find target");
		return;
	} else {
		console.log(_ai.walk.target);
	}
}

function search_fort(callback)
{
	// 檢查物品檢是否滿　如果是就不轉景點了
/*
		_ai.walk.turns[_ai.walk.target.key].turnTime = checkTime.now() + pokemon_conf.searchFortTime;
		_ai.walk.target.isTurn = true;
		callback(null, null);
		return;
		*/
	console.log(_g.items_total);
	if (_g.items_total > 330) {
		callback(null, null);
		return;
	}
	pokeio.GetFort(_ai.walk.target.key, _ai.walk.target.latitude, _ai.walk.target.longitude, function(err, searchFort) {
		if(err) {
			callback(err, searchFort);
			return;
		}
		var cooldown_complete_timestamp_ms = searchFort.cooldown_complete_timestamp_ms;
		var getNow = checkTime.now();
		switch (searchFort.result)
		{
			case 3:
			{
				cooldown_complete_timestamp_ms = checkTime.now();
			}
			case 1:
			default:
			{
				_ai.walk.turns[_ai.walk.target.key].turnTime = checkTime.now() + pokemon_conf.searchFortTime;
				_ai.walk.target.isTurn = true;
				for (var k in searchFort.items_awarded) {
					_g.drop_items.push(searchFort.items_awarded[k]);
				}
				console.log(searchFort);
			} break;
		
		}
		_ai.walk.turns[_ai.walk.target.key].turnTime = checkTime.now() + pokemon_conf.searchFortTime;
		_ai.walk.target.isTurn = true;
		/*
		console.log("=========be turn=========");
		console.log(searchFort);
		console.log();

		var d = new Date(cooldown_complete_timestamp_ms);
		var now = new Date(getNow);
		console.log(now);
		console.log(d);
		console.log(getNow);
		console.log(cooldown_complete_timestamp_ms);
		*/

		callback(err, searchFort);
	});
}