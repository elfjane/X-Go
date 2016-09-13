var Polygon = require('polygon');
var Vec2 = require('vec2');

var p = new Polygon([
  Vec2(25.1111, 25.1111),
  Vec2(25.2222, 25.1111),
  Vec2(25.1111, 25.2222),
  Vec2(26.1111, 26.2222),
]);
console.log(p.containsPoint(Vec2(25.1113,25.1114)));
var center = p.center();
var aabb = p.aabb();
console.log("center = %d, %d, aabb", center.x , center.y);
console.log(aabb);
var aaac = [];
aaac["0b0a9380b62a4dbda90eb5cff3e12525.16"] = "123";
console.log(aaac);