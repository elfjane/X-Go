var redis = require("redis");
var redis_client;

var redis_key = "g_";

exports.createClient = function(host, port, key) {
	console.log(host);
	console.log(port);
	redis_client = redis.createClient(port, host);
	redis_key = key;
	redis_client.on("error", function (err) {
		console.log("Error " + err);
	});
}

exports.set = function(key, value, callback) {
	var hashKey = pokemon_acc.redis_key + key;
	redis_client.set(hashKey, value, function (err, reply) {
		if (err) {
			throw new Error('redis set error');
		}
		callback(err, reply);
	});
}

exports.get = function(key, callback) {
	var hashKey = pokemon_acc.redis_key + key;
	redis_client.get(hashKey, function (err, reply) {
		if (err) {
			throw new Error('redis get error');
		}
		callback(err, reply);
	});
}

exports.del = function(key, callback) {
	var hashKey = pokemon_acc.redis_key + key;
	redis_client.del(hashKey, function (err, reply) {
		if (err) {
			throw new Error('redis get error');
		}
		callback(err, reply);
	});
}