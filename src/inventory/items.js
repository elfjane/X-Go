'use strict';
exports.drop = drop;
exports.getTotal = getTotal;
exports.useEggIncubator = useEggIncubator;
function drop (item_id, count, callback)
{
	if (typeof(_g.items[item_id]) == "undefined") {
		callback("undefined");
		return
	}
	if (_g.items[item_id].count < count) {
		callback("be max");
	}
	pokeio.DropItem(item_id, count, function(err, dropItemMessage) {
		if (err) {
			console.log(err);
			callback(err, dropItemMessage);
			return;
		};
		switch(dropItemMessage.result)
		{
			case 1:
			{
				_g.items[item_id].count = dropItemMessage.new_count;
				getTotal();
			} break;
		}
		callback(err, dropItemMessage);
	});
}

function getTotal() {
	var items_total = 0;
	for (var k in _g.items) {
		items_total += _g.items[k].count;
	}
	if ((typeof(_g.inventory.items_total) != "undefined")) {
		_g.inventory.items_total = items_total;
	}
	_g.items_total = items_total;
	return items_total;
}

// 使用孵蛋器
function useEggIncubator(item_id, egg_id, callback)
{
	if (typeof(_g.egg_incubators[item_id]) == "undefined") {
		callback("undefined egg_incubators item_id");
		return
	}
	if (typeof(_g.eggs[egg_id]) == "undefined") {
		callback("undefined eggs egg_id");
		return
	}
	var egg_incubator = _g.egg_incubators[item_id];
	var egg = _g.eggs[egg_id];
	pokeio.UseItemEggIncubator(egg_incubator.item_id, egg.id, function(err, info) {
		if (err) {
			console.log(err);
			callback(err, info);
			return;
		}
		switch (info.Status)
		{
			case 1:
			{
				var egg_incubator_id = info.egg_incubator.item_id;
				_g.egg_incubators[egg_incubator_id] = info.egg_incubator;
				console.log(info);
			} break;
		
		}
		callback(err, info);
		return;
	});
}