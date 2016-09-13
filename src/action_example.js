'use strict';
var a2 = require('./action2_example.js');
var a = 0;
function getHeadFace() {
	a++;
	self.a++;
	console.log("id=%d, a=%d",this.id, a);
	return this.a++;
}
function action(d) {
	var self = this;
	this.a=d;
	this.id=d;
	this.a2 =a2;
	this.getHeadFace =getHeadFace;
};
exports.cc = function() {
	console.log("cc");
	cb();
}
function cb() {
		console.log("cb");
}
exports.cb = cb;

