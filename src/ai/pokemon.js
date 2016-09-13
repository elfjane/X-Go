'use strict';
exports.checkTransferPokemon = ai_checkTransferPokemon;
exports.checkSpawnPokemon = ai_checkSpawnPokemon;
exports.catchPokemon = ai_autoCatchPokemon;

exports.checkIncubatorPokemon = ai_CheckIncubatorPokemon;

function fnCheckSingleTransferPokemon(pokemon)
{
	var isFindPokemon = false;
	var transferPokemon = null;
	for (var k in pokemon_acc.transferPokemonList) {
		transferPokemon = pokemon_acc.transferPokemonList[k];
		if (transferPokemon.pokemon_id == pokemon.pokemon_id) {
			isFindPokemon = true;
		}
	}
	if (!isFindPokemon)	{
		return {isFind: false, isTransfer: false};
	}
	if (transferPokemon == null)	{
		return {isFind: false, isTransfer: false};
	}
	if (pokemon.cp < transferPokemon.transferCP || pokemon.iv < pokemon_acc.transferIV) {
		// cp 太於多少保留
		if (pokemon.cp >= transferPokemon.keepCP) {
			return {isFind: true, isTransfer: false};
		}
		// iv 大於多少保留 
		if  (pokemon.iv >= transferPokemon.keepIV) {
			return {isFind: true, isTransfer: false};
		}
		return {isFind: true, isTransfer: true};
	}
	return {isFind: true, isTransfer: false};
}
// 檢查CP 小於多少與IV小於多少自動丟棄
function fnCheckTransferPokemon(pokemon)
{
	var isKeep = false;
	if (pokemon.cp < pokemon_acc.transferPokemonCP || pokemon.iv < pokemon_acc.transferPokemonIV) {
		// cp 太於多少保留
		if (pokemon.cp >= pokemon_acc.PokemonKeepCP) {
			return false;
		}
		// iv 大於多少保留 
		if (pokemon.iv >= pokemon_acc.PokemonKeepIV) {
			return false;
		}
		return true;
	}
	return false;
}
// 轉換 pokemon
function ai_checkTransferPokemon(callback)
{
	var isTransferPokemon = false;
	var pokemonId = null;
	var index = null;
	for (var k in _g.pokemons) {
		isTransferPokemon = false;
		var pokemon = _g.pokemons[k];
		if (pokemon.favorite != null) {
			continue;
		}
		// 檢查是否保留
		var isKeep = false;
		for (var k2 in pokemon_acc.pokemonKeepList) {
			if (pokemon_acc.pokemonKeepList[k2] == pokemon.pokemon_id ) {
				isKeep = true;
				break;
			}
		}
		if (isKeep)	{
			continue;
		}

		var single = fnCheckSingleTransferPokemon(pokemon);
		if (single.isFind)	{
			isTransferPokemon = single.isTransfer;
		} else {
			isTransferPokemon = fnCheckTransferPokemon(pokemon);
		}

		if (isTransferPokemon) {
			pokemonId = pokemon.id;
			index = k;
			break;
		}
	}
	if (!isTransferPokemon) {		
		return callback(null, null);
	}
	console.log("===== transfer pokemon =====");
	console.log(pokemonId);
	pokeio.TransferPokemon(pokemonId, function(err, info) {
		if (err) {
			console.log(err);			
			return callback(err, info);
		}
		if ((typeof(info) == "undefined") || (typeof(info.Status) == "undefined")) {			
			return callback(null, null);
		}
		switch(info.Status)
		{
			case 1:
			case 3:
			{
				console.log(_g.pokemons[index]);
				delete _g.pokemons[index];
			} break;
		}
		console.log(info);		
		return callback(null, info);
	});
}

// 檢查 pokemon 是否重生
function ai_checkSpawnPokemon(callback)
{
	var isCatch = false;
	var isUseBall = false;

	if (typeof(_g.spawn_pokemon) == "undefined") {
		return callback(null, null);
	}

	if (typeof(_g.items) == "undefined") {		
		return callback(null, null);
	}

	if (Object.keys(_g.spawn_pokemon).length < 0) {		
		return callback(null, null);
	}
	// 使用的抓寵道具
	var user_item_id = 1;

	// 設定可以使用的道具
	var user_item = pokemon_acc.use_item_ball;
	for (var i=0;i<pokemon_acc.use_item_ball.length;i++)
	{
		var id = pokemon_acc.use_item_ball[i];
		if ((typeof(_g.items[id]) != "undefined") && _g.items[id].count > 0) {
			user_item_id = id;
			isUseBall = true;
			break;
		}
	}
	if (!isUseBall) {	
		return callback(null, null);
	}

	for (var k in _g.spawn_pokemon) {
		return callback(null, {currentPokemon:_g.spawn_pokemon[k], user_item_id} );
		break;
	}
	return callback(null, null);
}

// ai atuo catch pokemon
function ai_autoCatchPokemon(currentPokemon, user_item_id, callback)
{
	var type_id = parseInt(currentPokemon.PokedexTypeId)- 1 ;
	var pokedexInfo = pokeio.pokemonlist[type_id];
	console.log('[+] There is a ' + pokedexInfo.name + ' near!! I can try to catch it!');

	pokeio.EncounterPokemon(currentPokemon, function(suc, dat) {

		console.log('Encountering pokemon ' + pokedexInfo.name + '...');
		console.log(currentPokemon);
		console.log('use %s(%d) total = %d catch pokemon', itemlist.items[user_item_id].name, user_item_id , _g.items[user_item_id].count);

		pokeio.CatchPokemon(currentPokemon, 1, 1.950, 1, user_item_id, function(err2, xdat) {
			if(err2) {
				console.log(err2);				
				return callback(err2, xdat);
			}
			console.log("====get pokemon====");
			console.log(pokemon_status.catch[xdat.Status]);
			console.log(xdat);
			switch(xdat.Status)
			{
				case 1:
				case 3:
				{
					delete _g.spawn_pokemon[currentPokemon.SpawnPointId];
				} break;
			}			
			return callback(null, xdat);
		});
	});
}

// 檢查是否可以用孵蛋器
function ai_CheckIncubatorPokemon(callback)
{
	var isEmptyIncubator = false;
	var isUseBall = false;
	if (typeof(_g.egg_incubators) == "undefined") {
		return callback(null, null);
	}

	if (typeof(_g.eggs) == "undefined") {
		return callback(null, null);
	}

	if (Object.keys(_g.egg_incubators).length < 0) {		
		return callback(null, null);
	}

	if (Object.keys(_g.eggs).length < 0) {		
		return callback(null, null);
	}

	// get total use egg in incubator
	var use_incubators = [] ;
	var no_use_incubators = [] ;
	for (var k in _g.egg_incubators) {	
		var pokemon_id = _g.egg_incubators[k].pokemon_id;
		if (pokemon_id != null) {
			use_incubators.push(game_core.getInt64(pokemon_id));
			continue;
		} else {
			no_use_incubators.push(k);
		}
	}

	var use_eggs = [];
	var no_use_eggs = [];
	for (var k in _g.eggs) {
		var isUse = false;
		var egg_id = _g.eggs[k].ids;
		for (var k2 in use_incubators) {	
			if (use_incubators[k2] == egg_id)
			{
				isUse = true;
				break;;
			}
		}
		if (!isUse)	{
			no_use_eggs.push(egg_id);
		} else {
			use_eggs.push(egg_id);
		}
	}

	if (no_use_eggs.length > 0 && no_use_incubators.length > 0) {
		return callback(null, {item_id: no_use_incubators[0], egg_id : no_use_eggs[0]});
	} else {
		return callback(null, null);
	}


}