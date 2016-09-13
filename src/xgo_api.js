var util = require('util');
var request = require("request");
var api_url = pokemon_conf.api_url;
var token = '';
var uid = 0;
function login(account, password, callback)
{
	var url = util.format("%s/login/%s/%s", api_url, account, password);
	console.log(url);
	request.get(url, function (error, response, body) {
		if (error) {
			throw "error login fail";
			return;
		}
		var data = JSON.parse(body);
		if (data.success != 1) {
			return callback(3, data);
		}
		uid = data.uid;
		token = data.token;
		return callback(null, data);
	});
}

function location_get(callback)
{
	var url = util.format("%s/loc/get/%d/%s", api_url, uid, token);
	request.get(url, function (error, response, body) {
		if (error) {
			throw "error loc get fail";
			return;
		}
		var data = JSON.parse(body);
		console.log(data);
		if (data.error == 1) {
			return callback(1, data);
		}
		if (data.success != 1) {
			throw "error loc get fail";
			return;
		}
		return callback(null, data);
	});
}


function location_move(latitude, longitude, altitude, callback)
{
	var url = util.format("%s/loc/move/%d/%s/%d/%d/%d", api_url, uid, token, latitude, longitude, altitude);
	request.get(url, function (error, response, body) {
		if (error) {
			throw "error move fail";
			return;
		}
		var data = JSON.parse(body);
		if (data.success != 1) {
			throw "error move fail";
			return;
		}
		return callback(null, data);
	});
}

exports.login = login;
exports.location_get = location_get;
exports.move = location_move;