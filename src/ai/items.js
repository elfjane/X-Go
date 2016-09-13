'use strict';
exports.auto_drop_item_all = ai_auto_drop_item_all;

// 自動清倉
function ai_auto_drop_item_all()
{
	var list = pokemon_acc.drop_items.list;
	var timeDrop = 0;
	_ai.dropItemList = [];
	for (var k in list) {
		var item_id = list[k].id;
		
		var keep = list[k].keep;
		console.log(item_id);

		// 檢查使用者可能設定錯誤
		if (typeof(_g.items[item_id]) == "undefined") {
			console.log('error _g.items');
			continue;
		}
		var count = _g.items[item_id].count;
		if (count > keep) {
			console.log("id %d ,count %d, keep %d, drop %d", item_id, count, keep, count - keep);
			_ai.dropItemList.push({
				item_id : item_id,
				count : count - keep,
			});
			_ai.isDropItem = true;
		}
	}
	if (_ai.isDropItem) {
		log.info("be start drop items %d", _ai.dropItemList.length);
	}
}