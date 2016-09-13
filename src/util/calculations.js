var baseStats = require('src/util/baseStats.json');
var multiplierLevel = require('src/util/multiplierLevel.json');

exports.convertIV = convertIV;

function convertIV (id, stam, atk, def, multiplier) {
  var a = baseStats.find((b) => b.id === id);
  var BaseStamina = a.BaseStamina;
  var BaseAttack = a.BaseDefense;
  var BaseDefense = a.BaseStamina;
  var stamina = (BaseStamina + (stam || 0)) * multiplier;
  var attack = (BaseAttack + (atk || 0)) * multiplier;
  var defense = (BaseDefense + (def || 0)) * multiplier;
  return Math.floor(Math.pow(stamina, 0.5) * attack * Math.pow(defense, 0.5) / 10);
}

exports.calculateCP = function(pokemon) {
  const multiplier = pokemon.cp_multiplier + (pokemon.additional_cp_multiplier || 0);

  var level = multiplierLevel.find((m) => Math.round(m.multiplier * 1000)/1000 === Math.round(multiplier * 1000)/1000);
  var pokemon_id = pokemon.pokemon_id;
  var ret =  {
	iv: 0,
    level: 0,
    minCP: 0,
    currCP: 0,
    maxCP: 0
  };
  ret.minCP  = convertIV(pokemon_id, 0, 0, 0, multiplier);
  ret.currCP = convertIV(pokemon_id, pokemon.individual_stamina, pokemon.individual_attack, pokemon.individual_defense, pokemon.cp_multiplier);
  ret.maxCP  = convertIV(pokemon_id, 15, 15, 15, multiplier);
  ret.level  = level.level;
  var max = ret.maxCP - ret.minCP;
  var curr = ret.currCP - ret.minCP;
  if (ret.level != 1) {
	  ret.iv = Math.floor((curr / max) * 100);
  } else {
	  var sumall = pokemon.individual_stamina + pokemon.individual_attack + pokemon.individual_defense;
	  ret.iv = Math.floor((sumall / 45) * 100);
  }

  return ret;
}
