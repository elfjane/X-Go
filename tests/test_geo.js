'use strict';
var char_move = require('./src/char/move.js');
var geolib = require('geolib');
var a = geolib.getDistance(
    {latitude: 51.5103, longitude: 7.49347},
    {latitude: 51.5003, longitude: 7.49346}
);
console.log(a);

var b = geolib.getRhumbLineBearing(
    {latitude: 51.525, longitude: 7.4575},
    {latitude: 51.5175, longitude: 7.4678},
    5000
);

console.log(b);
var c = geolib.getBearing(
    {latitude: 52.518611, longitude: 13.408056}, 
    {latitude: 51.519475, longitude: 7.46694444}
);
console.log("getBearing");
console.log(c);

var d = geolib.getCompassDirection(
    {latitude: 52.518611, longitude: 13.408056}, 
    {latitude: 51.519475, longitude: 7.46694444}
);
console.log("getCompassDirection");
console.log(d);

var e = geolib.orderByDistance({latitude: 51.515, longitude: 7.453619}, [
    {latitude: 52.516272, longitude: 13.377722},
    {latitude: 51.518, longitude: 7.45425},
    {latitude: 51.503333, longitude: -0.119722}
]);

console.log(e);

var f = geolib.orderByDistance({latitude: 51.515, longitude: 7.453619}, {
    a: {latitude: 52.516272, longitude: 13.377722},
    b: {latitude: 51.518, longitude: 7.45425},
    c: {latitude: 51.503333, longitude: -0.119722}
});

console.log(f);


var spots = {
    "Brandenburg Gate, Berlin": {latitude: 52.516272, longitude: 13.377722},
    "Dortmund U-Tower": {latitude: 51.515, longitude: 7.453619},
    "London Eye": {latitude: 51.503333, longitude: -0.119722},
    "Kremlin, Moscow": {latitude: 55.751667, longitude: 37.617778},
    "Eiffel Tower, Paris": {latitude: 48.8583, longitude: 2.2945},
    "Riksdag building, Stockholm": {latitude: 59.3275, longitude: 18.0675},
    "Royal Palace, Oslo": {latitude: 59.916911, longitude: 10.727567}
}

// in this case set offset to 1 otherwise the nearest point will always be your reference point
var g = geolib.findNearest(spots['Dortmund U-Tower'], spots, 1)

console.log("findNearest");
console.log(g);

console.log("%d km",geolib.convertUnit("km", g.distance));

var initialPoint = {lat: 51.516272, lon: 0.45425}
var dist = 50;
var bearing = 22.5 * 12;
console.log("computeDestinationPoint");
console.log("================");
var h = geolib.computeDestinationPoint(initialPoint, dist, bearing);
console.log("%d, %d", h.latitude, h.longitude);
console.log(initialPoint);
console.log(h);

var test = require('./conf/test.json');
var Long = require('long');
var ProtoBuf = require('protobufjs');
console.log("================");
var t = test['3442aeb0dbf'].ExpirationTimeMs;
console.log(t);
var data = new Long(t.low ,t.high, t.unsigned);
var data = new Long.fromValue(t);
var d = new Date(data.toNumber());
console.log("=======date=========");
console.log(d);
console.log(data.toNumber());
var d1 = Date;
console.log(d1.now());
console.log(d1.now() - data.toNumber());
var a = {a:1,b:2};
console.log(a);
delete a.a;
console.log(a);
console.log("=======date2=========");
var d = new Date();
console.log(d);
console.log(data.toNumber());
var pokemon_conf = require('./conf/config.json');
//ProtoBuf.mkLong(test['3442aeb0dbf'].ExpirationTimeMs);
//
// computeDestinationPoint 行走距離
/*
var pokemon_conf = require('./conf/config.json');
var move_range = pokemon_conf.move_range;
for (var k in move_range){
	move_range[k].min = move_range[k].min + 360;
	move_range[k].max = move_range[k].max + 360;
}
console.log(move_range);
*/



function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min + 1) + min;
}

console.log(getRandomIntInclusive(1000, 2000));
var now = {latitude: 52.518611, longitude: 13.408056};
var target = {latitude: 52.518711, longitude: 13.407156};;
var g_data;
while(1) {
	var meter = geolib.getDistance(now, target);
	console.log(meter);
	if (meter < pokemon_conf.move_close) {
		break;
	}
	g_data = char_move.moveTarget(now, target);
	now = g_data.move_to;
	console.log(g_data);

}
/*
var move = char_move.moveTarget(
    {latitude: 52.518611, longitude: 13.408056}, 
    {latitude: 51.519475, longitude: 7.46694444}
	);
	console.log(move);
var move = char_move.moveTarget(
    {latitude: 52.518611, longitude: 13.408056}, 
    {latitude: 51.519475, longitude: 7.46694444}
	);
	console.log(move);
*/