var redis = require("redis");
var redis_client = redis.createClient('6379', '127.0.0.1');
redis_client.on("error", function (err) {
    console.log("Error " + err);
});
redis_client.set("key", "value", redis.print);
function k ()
{
redis_client.get("key", function (err, reply) {
	redis_client.quit();
	setTimeout(function() {
		console.log(3333333);
			return reply;
	}, 3000);

});
}
for(var i=0;i<50;i++) {
	console.log( 2222);
}
var a = k ();
for(var i=0;i<50;i++) {
	console.log( 1);
}
console.log(a);
