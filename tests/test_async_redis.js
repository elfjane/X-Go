var async = require("async");
var redis = require("redis");
var client = redis.createClient('6379', '127.0.0.1');

function k (callback)
{
	console.log("start");
	var d;
async.waterfall([
	function(next) {
		return next(null);
//		return next(0,2);
		console.log(8383838)
	},
	function(next) {
		console.log(next);
		console.log(1111);
		return next(1);
		client.set("key", "value", function (err, reply) {
			setTimeout(function() {
				console.log(2223);
				console.log(2221);
				next();
			}, 3000);
		});
	},function(next) {
		console.log(2222);
		client.get("key", function (err, reply) {
			d = reply;
			client.quit();
			setTimeout(function() {
				console.log(3333333);
				next();
			}, 3000);
		});
	}
	],function(err) {
		console.log(1234);
		console.log(err);
		console.log(12345);
		console.log(d);
		return callback(3);
		console.log(123);

	}
	
);

}

k(function (err) {
  console.log('Caught exception: ' + err);
});

