'use strict';
var a = 0;
function getHeadFace2() {
	a++;
	console.log("id=%d, a=%d",this.id, a);
	return this.a++;
}

module.exports = getHeadFace2;