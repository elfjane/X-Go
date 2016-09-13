'use strict';
var Long = require('long');

var move = require('src/char/move.js');
function game_core() {
	var self = this;
	
	var _g = {
		  hb : {}
		, player_profile : {}
		, player_stats : {}
		, forts : {}
		, items_total : 350
		, items : {}
		, inventory : {}
		, pokemons : {}
		, pokemon_family : {}
		, pokedex_entry : {}
		, eggs : {}
		, near_pokemon : {}
		, spawn_pokemon : {}
		, drop_items : []
	}
	self.near = move.check_isNear;

	self.ai = {};
	self.ai.pokemon = require('src/ai/pokemon.js');
	self.ai.items = require('src/ai/items.js');
	self.ai.fort = require('src/ai/fort.js');
	self.ai.core = require('src/ai/core.js');
	self.player = {};
	self.player.move = require('src/char/move.js')
	self.items = require('src/inventory/items.js');
	self.pokemons = require('src/inventory/pokemons.js');
	self.inventory = require('src/inventory/inventory.js');
	self.getInt64 = getInt64;
	self.getInt64toStr = getInt64toStr;
	self.getInt64Date = getInt64Date;
}

// 將 json 的 int64 buff 轉為 int64
function getInt64(data)
{
	if (typeof(data) == "undefined") {
		return;
	}
	if (data == null) {
		return 0;
	}
	var l = Long.fromValue(data);
	return l.toNumber();	
}
// 將 json 的 int64 buff 轉為 int64
function getInt64toStr(data)
{
	if (typeof(data) == "undefined") {
		return;
	}
	if (data == null) {
		return 0;
	}
	var l = Long.fromValue(data);
	return l.toString();	
}
// 將 json 的 int64 buff 轉為 date 格式
function getInt64Date(data)
{
	if (typeof(data) == "undefined") {
		return;
	}
	if (data == null) {
		return 0;
	}
	var l = Long.fromValue(data);
	return new Date(l.toNumber());
}

exports = module.exports = game_core;
