'use strict';
// 加到我的最愛
function setFavorite(pokemon_key, isFavorite, callback)
{
	if (typeof(_g.pokemons[pokemon_key]) == "undefined") {
		callback("undefined egg_incubators item_id", null);
		return
	}

	var pokemon = _g.pokemons[pokemon_key];
	switch(isFavorite)
	{
		case 0:
		{
			isFavorite = false;
		} break;
		case 1:
		{
			isFavorite = true;
		} break;
		default:
		{
			callback("undefined set favorite", null);
		} break;
	}
	pokeio.SetFavoritePokemon(pokemon.id, isFavorite, function(err, info) {
		if (err) {
			callback(err, info);
			return;
		};

		switch(info.Result)
		{
			case 1:
			{
				_g.pokemons[pokemon_key].favorite = isFavorite;
			} break;
		}
		callback(err, info);
	});
}

exports.setFavorite = setFavorite;