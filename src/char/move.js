var geolib = require('geolib');
var pokemon_conf = require('conf/config.json');
exports.check_isNear = function(src, desc)
{
console.log(123);
console.log(g_player_profile);

}

// 設定面對方向只有八個方向 並轉為小寫對應圖檔
exports.getHeadFace = function(src, desc) {
	if ((typeof(src) == "undefined") || (typeof(desc) == "undefined")) {
		return "s";
	}
	var headFace = geolib.getCompassDirection(src, desc);
	switch(headFace.exact)
	{
		case "NE":
		case "NNE":
		case "ENE":
		{
			return "ne";
		} break;
		case "SE":
		case "ESE":
		case "SSE":
		{
			return "se";
		} break;
		case "SW":
		case "SSW":
		case "WSW":
		{
			return "sw";
		} break;
		case "NW":
		case "WNW":
		case "NNW":
		{
			return "nw";
		} break;
		case "E":
		{
			return "e";
		} break;
		case "S":
		{
			return "s";
		} break;
		case "N":
		{
			return "n";
		} break;
		case "W":
		{
			return "w";
		} break;
		default:
		{
			return "e";
		} break;
	}
}
function randomRange(min, max)
{
	var r_max = max - min;
	var r_data = (Math.random() * r_max) + min;
	return r_data
}
exports.moveTarget = function(src, target) {
	// 史萊姆的公式尚未置換
	// 
	// ((min - angle) + 360) % 360
	if ((typeof(src) == "undefined") || (typeof(target) == "undefined")) {
		return ;
	}
	var r_move_min_meter = randomRange(pokemon_conf.move_meter.min, pokemon_conf.move_meter.max);
	// 取得面對方向
	var headFace  = geolib.getCompassDirection(src, target);
	// 計算面對方向行走
	var move_data = pokemon_conf.move_range[headFace.exact];
	var move_base = pokemon_conf.move_base
	var move_min  = move_data.min + move_base;
	var move_max  = move_data.max + move_base;

	// 取得實際面對方向
	var r_bearing = randomRange(move_min, move_max) - move_base;

	// 取得行走路線
	var move_to = geolib.computeDestinationPoint(src, r_move_min_meter, r_bearing);
/*
	var lat_n = Math.random()*100;
	var lng_n = Math.random()*100;
	if (lat_n > 50) {
		location1_move.coords.latitude += lat;
	} else {
		location1_move.coords.latitude -= lat;
	}
	if (lng_n > 99) {
		location1_move.coords.longitude += lng;
	} else {
		location1_move.coords.longitude -= lng;
	}
	location1_move.coords.latitude  = parseFloat(location1_move.coords.latitude.toFixed(7));
	location1_move.coords.longitude = parseFloat(location1_move.coords.longitude.toFixed(7));
	b.SetLocation(location1_move, function(err, coordinates) {
		if(err) {
				console.log(err);
				return;
		}
		location1_move.coords = coordinates;

	});
	*/

	return {src: src, target:target, meter: r_move_min_meter, headFace: headFace, move_data: move_data, bering: r_bearing, move_to: move_to};
}

exports.moveRandom = function(coords, target) {
	if ((typeof(src) == "undefined") || (typeof(target) == "undefined")) {
		return ;
	}
	var latitude  = coords.latitude;
	var longitude = coords.longitude;
	var lat = Math.random()*0.00005;
	var lng = Math.random()*0.00005;

	var lat_n = Math.random()*100;
	var lng_n = Math.random()*100;
	if (lat_n > 50) {
		latitude += lat;
	} else {
		latitude -= lat;
	}
	if (lng_n > 50) {
		longitude += lng;
	} else {
		longitude -= lng;
	}
	latitude  = parseFloat(latitude.toFixed(7));
	longitude = parseFloat(longitude.toFixed(7));
	pokeio.SetLocation(location1_move, function(err, coordinates) {
		if(err) {
				console.log(err);
				return;
		}
		location1_move.coords = coordinates;

	});
	var move_to = {latitude: latitude, longitude:longitude, altitude: 0};
	//console.log(move_to);

	return {move_to: move_to};
}

// 自動行走
exports.walk = function (callback) {
	var g_data = game_core.player.move.moveTarget(_ai.walk.selfLocation, _ai.walk.target);
	if ((typeof(g_data) == "undefined"))	{
		return;
	}

	var now = g_data.move_to;
	_g.location_move.coords.latitude  = parseFloat(now.latitude.toFixed(7));
	_g.location_move.coords.longitude = parseFloat(now.longitude.toFixed(7));
	pokeio.SetLocation(_g.location_move, function(err, coordinates) {
		if(err) {
			console.log(err);
			return callback(err, coordinates);;
		}
		xgo_api.move(_g.location_move.coords.latitude, _g.location_move.coords.longitude, _g.location_move.coords.altitude, function (err, data) {
			if(err) {
				throw "err";
			}
			_g.location_move.coords = coordinates;
			_ai.walk.headFace = game_core.player.move.getHeadFace(now, _ai.walk.target);
			_ai.walk.meter = geolib.getDistance(_ai.walk.selfLocation, _ai.walk.target);
			callback(err, coordinates);
		})
				/*
		redis_client.set("location_move", JSON.stringify(coordinates), function (err, reply) {
			if(err) {
				console.log(err);
				return callback(err, coordinates);;
			}
			_g.location_move.coords = coordinates;
			_ai.walk.headFace = game_core.player.move.getHeadFace(now, _ai.walk.target);
			_ai.walk.meter = geolib.getDistance(_ai.walk.selfLocation, _ai.walk.target);
			callback(err, coordinates);
		});
		*/
	});
}