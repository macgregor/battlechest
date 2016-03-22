function Generator(){}

/*
 * Load a json structure to be used as the generator's data source.
 */
Generator.load_json = function(filename='data/items.json'){
  var json_data;
  $.ajax({
  	url: filename,
  	async: false,
  	dataType: 'json',
  	success: function(data) {
  		json_data = data;
  	}
  });

  console.log(json_data);
  return json_data;
}

/*
 * Generate a random number between low and high, inclusive
 */
Generator.rand_range = function(low, high){
  return Math.floor((Math.random() * high) + low);
}

/*
 * Generate a random number based on a dice roll (e.g. 1d6, 2d8, 1d20+5)
 * The first number represents how many dice to roll, the number after the d
 * represents the number of sides on the dice and the optional + specifies
 * how much to add after the roll.
 *
 * For example:
 *    '1d6'    - rolls a single 6 sided die, returns a number between 1 and 6, inclusively
 *    '2d8'    - rolls two 8 sided dice, returns a number 2 through 16 inclusively
 *    '1d20+5' - rolls a single 20 sided die then adds 5 to the result,
 *               returns a number 6 through 25 inclusively
 */
Generator.dice_roll= function(dice_frmt){
  var regex = /^(\d+)d(\d+)\+*(\d*)$/;
  var matches = regex.exec(dice_frmt);
  console.log(matches);

  var num_dice = parseInt(matches[1]);
  var sides = parseInt(matches[2]);
  var bonus = 0;
  if(matches[3] !== ""){
    bonus = parseInt(matches[3]);
  }

  var roll = 0;

  for(var i = 0; i < matches[1]; i++){
    roll += this.rand_range(1, sides);
  }

  roll += bonus;
  return roll;
}

Generator.rand_weighted = function(array){

}

/*
 * Given a json structure containing an array "weapons", return
 * a new Weapon object built from a random weapon in the array
 */
Generator.random_weapon = function(json){
  console.log('Generating weapon.');

  var index = Generator.rand_range(1, json.weapons.length) - 1;
  var weapon = json.weapons[index];

  return new Weapon(weapon.name, weapon.damage, weapon.description, weapon);
};

/*
 * Given a json structure containing an array "items", return
 * a new Item object built from a random item in the array
 */
Generator.random_item = function(json){
  console.log('Generating item.');

  var index = Generator.rand_range(1, json.items.length) - 1;
  var item = json.items[index];

  return Item.fromJson(item);
};

/*
 * Given a json structure containing an array "armor", return
 * a new Armor object built from a random piece of armor in the array
 */
Generator.random_armor = function(json){
  console.log('Generate armor.');

  var index = Generator.rand_range(1, json.armor.length) - 1;
  var armor = json.armor[index];

  return new Armor(armor.name, armor.ac, armor.description, armor);
};

/*
 * Given a json structure containing an array "races", return
 * a random Race's name from the array
 */
Generator.random_race = function(json){
  console.log('Generate race.');

  var index = Generator.rand_range(1, json.races.length) - 1;
  var race = json.races[index];

  return race.name;
};

/*
 * Given a json structure containing an array "types", return
 * a random Type's name from the array
 */
Generator.random_type = function(json){
  console.log('Generate type.');

  var index = Generator.rand_range(1, json.types.length) - 1;
  var type = json.types[index];

  return new Type(type.name, type);
};

Generator.random_name = function(){
  console.log('Generate name.');

  var generator = NameGen.compile("sV'i");

  return generator.toString();
};

/*
 * Given a very specific json structure I wish I had a better way of validating,
 * generate a random NPC (meatshield) having a name, race, type, health (HP), weapons
 * armor and inventory.
 */
Generator.random_meatshield = function(json){
  console.log('Generating meatshield');

  var hp = Generator.dice_roll("1d6");
  var name = Generator.random_name(json);
  var type = Generator.random_type(json);
  var race = Generator.random_race(json);
  var weapons = [];
  var armor = [];
  var inventory = [];

  //use type as the root json structure if it has weapons specific to that type of meatshield
  if(type.raw_json.hasOwnProperty("weapons")){
    weapons.push(Generator.random_weapon(type.raw_json));
  } else{
    weapons.push(Generator.random_weapon(json));
  }

  //type specific armor restrictions
  if(type.raw_json.hasOwnProperty("armor")){
    armor.push(Generator.random_armor(type.raw_json));
  } else{
    armor.push(Generator.random_armor(json));
  }

  //generate weapon item dependencies (e.g. bows need arrows)
  for(var i in weapons){
    if(weapons[i].raw_json.hasOwnProperty("items")){
      for(var j in weapons[i].items){
        inventory.push(Item.fromJson(weapons[i].items[j]));
      }
    }
  }

  //generate type required items (e.g. torch bearers need torches)
  if(type.raw_json.hasOwnProperty("items")){
    for(var i in type.raw_json.items){
      inventory.push(Item.fromJson(type.raw_json.items[i]));
    }
  }

  return new Meatshield(name, type, race, hp, weapons, armor, inventory);
};

function Type(name, raw_json){
  this.name = name;
  this.raw_json = raw_json;
}

function Weapon(name, damage, description, raw_json){
  this.name = name;
  this.damage = damage;
  this.description = description;
  this.raw_json = raw_json;
}

function Item(name, quantity, description, raw_json){
  this.name = name;
  this.quantity = quantity;
  this.description = description;
  this.raw_json = raw_json;
}

Item.fromJson = function(item_json){
  var quantity = "1";

  if(item_json.hasOwnProperty("quantity")){
    quantity = Generator.dice_roll(item_json.quantity);
  }

  return new Item(item_json.name, quantity, item_json.description, item_json);
}

function Armor(name, ac, description, raw_json){
  this.name = name;
  this.ac = ac;
  this.description = description;
  this.raw_json = raw_json;
}

function Meatshield (name, type, race, hp, weapons, armor, inventory) {
  this.name = name;
  this.type = type;
  this.race = race;
  this.hp = hp;
  this.weapons = weapons;
  this.armor = armor;
  this.inventory = inventory;
}

function getLocalData(){
  var userData = [];

  if( supports_html5_storage() ){
    userData = JSON.parse(localStorage.getItem('meatshields'));
    if(userData == null){
      userData = []
    }
  }
  return userData;
}

function updateLocalData(data){
  console.log(data);
  if( supports_html5_storage() ){
    localStorage.setItem('meatshields', JSON.stringify(data))
  }
}

function clearLocalData(){
  if( supports_html5_storage() ){
    localStorage.clear()
  }
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
