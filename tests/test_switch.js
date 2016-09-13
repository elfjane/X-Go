'use strict';
var a = require('./conf/type_stat.json');


var g_drop_items = [2];
	var g = g_drop_items;
	g.push(3);
	g_drop_items = [];
console.log(g_drop_items);
console.log(g);
console.log("==============");
console.log(a.begin);
function Foo(name) {
  this.name = name;
  this.data = [1, 2, 3]; // setting a non-primitive property
};
Foo.prototype.showData = function () { console.log(this.name, this.data); };
var foo1 = new Foo("foo1");
var foo2 = new Foo("foo2");
var foo3 = new Foo("foo3");
foo1.data.push(4);
foo2.data.push(5);
foo1.showData(); // "foo1", [1, 2, 3, 4]
foo2.showData(); // "foo2", [1, 2, 3]
foo3.showData(); // "foo2", [1, 2, 3]

var action = require('./src/action_example.js');

var d1 = new action(99);
console.log(d1.getHeadFace());
console.log(d1.getHeadFace());
console.log(d1.getHeadFace());
console.log(d1.getHeadFace());

a = new action(1);

console.log(a.getHeadFace());
console.log(a.getHeadFace());
console.log("==============");
var action2 = new action(9);
console.log(action2.getHeadFace());
console.log(action2.getHeadFace());
console.log("==============");
console.log(a.getHeadFace());
console.log(a.a2());
console.log(a.getHeadFace());
console.log("==============");
console.log(action2.getHeadFace());
console.log("==============");
console.log(a);
console.log("==============");
console.log(action2);
