'use strict';
var calculations = require('src/util/calculations');
exports.get = get;

function get(callback)
{
	pokeio.GetInventory(function(err, inventory) {
		if(err) {			
			return callback(err, inventory);
		}
		var data = merge_data(inventory);
		return callback(err, data);
	});
}

function merge_data(inventory)
{
	var inventory_items = inventory.inventory_delta.inventory_items;
	var noCheckData = [];
	_g.pokemons = {};
	_g.eggs = {};
	_g.items = {};
	_g.pokemon_family = {};
	_g.pokedex_entry = {};
	_g.egg_incubators = {};
	for (var i = 0 ;i < inventory_items.length ; i++)
	{
		var t_item = inventory_items[i].inventory_item_data.item;
		if (t_item != null)
		{
			var item_id = t_item.item_id;
			_g.items[item_id] = t_item;
			inventory_items[i].inventory_item_data.item = null;
			continue;
		}
		var t_pokemon = inventory_items[i].inventory_item_data.pokemon;

		if (t_pokemon != null)
		{

			var ids = game_core.getInt64toStr(t_pokemon.id);
			t_pokemon.ids = ids;
			//t_pokemon.captured_cell_id = getInt64(t_pokemon.captured_cell_id);
			//t_pokemon.creation_time_ms = getInt64(t_pokemon.creation_time_ms);
			var creation_time_ms = game_core.getInt64(t_pokemon.creation_time_ms);
			t_pokemon.data = {
				captured_cell_id : game_core.getInt64(t_pokemon.captured_cell_id),
				creation_time_ms : game_core.getInt64(t_pokemon.creation_time_ms)
			};
			//console.log(t_pokemon.time);

			if (t_pokemon.is_egg) {
				_g.eggs[ids] = t_pokemon;
			} else {
				var iv_data = calculations.calculateCP(t_pokemon);
				t_pokemon.iv = iv_data.iv;
				t_pokemon.level = iv_data.level;
				_g.pokemons[ids] = t_pokemon;
			}
			inventory_items[i].inventory_item_data.pokemon = null;
			continue;
		}
		var t_pokemon_family = inventory_items[i].inventory_item_data.pokemon_family;
		if (t_pokemon_family != null)
		{
			var family_id = t_pokemon_family.family_id;
			_g.pokemon_family[family_id] = t_pokemon_family;
			continue;
		}
		var t_pokedex_entry = inventory_items[i].inventory_item_data.pokedex_entry;
		if (t_pokedex_entry != null)
		{
			var pokedex_entry_number = t_pokedex_entry.pokedex_entry_number;
			_g.pokedex_entry[pokedex_entry_number] = t_pokedex_entry;
			continue;
		}
		var t_player_stats = inventory_items[i].inventory_item_data.player_stats;
		//inventory_items[i].inventory_item_data.pokemon = {}
		if (t_player_stats != null)
		{
			var player_stats = t_player_stats;
			player_stats.experience = game_core.getInt64(player_stats.experience);
			player_stats.prev_level_xp = game_core.getInt64(player_stats.prev_level_xp);
			player_stats.next_level_xp = game_core.getInt64(player_stats.next_level_xp);

			player_stats.pokemon_caught_by_type = null;
			_g.player_stats = player_stats;
			continue;
		}

		var t_egg_incubators = inventory_items[i].inventory_item_data.egg_incubators;

		if (t_egg_incubators != null)
		{
			for(var j=0;j<t_egg_incubators.egg_incubator.length;j++)
			{
				var egg_incubators_item_id = t_egg_incubators.egg_incubator[j].item_id;
				_g.egg_incubators[egg_incubators_item_id] = t_egg_incubators.egg_incubator[j];
			}
			continue;
		}
		noCheckData.push(inventory_items[i].inventory_item_data);
	}
	var items_total = game_core.items.getTotal();
	var iv = {"new_timestamp_ms" : game_core.getInt64(inventory.inventory_delta.new_timestamp_ms),
			"player_stats": _g.player_stats,
			"items_total": items_total,
			"items": _g.items,
			"pokemon": _g.pokemons,
			"eggs" : _g.eggs,
			"g_pokemon_family" : _g.pokemon_family,
			"g_pokedex_entry" : _g.pokedex_entry,
			"g_egg_incubators" : _g.egg_incubators,
			"inventory_items": noCheckData
		};
//				"inventory": inventory
	_g.items_total = items_total;
	_g.inventory = iv;
	return iv;
}