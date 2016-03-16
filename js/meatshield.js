function Generator(){
  var tmp;
  $.ajax({
  	url: 'data/items.json',
  	async: false,
  	dataType: 'json',
  	success: function(data) {
  		tmp = data;
  	}
  });

  this.json_data = tmp;
  console.log(this.json_data);
}

Generator.prototype.rand_range = function(low, high){
  return Math.floor((Math.random() * high) + low); 
}

Generator.prototype.dice_roll= function(dice_frmt){
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

Generator.prototype.generate_weapon = function(){
  console.log('Generating weapon.');

  var index = this.rand_range(1, this.json_data.items.weapons.length) - 1;
  var weapon = this.json_data.items.weapons[index];

  return new Weapon(weapon.name, weapon.damage, weapon.description);
};

Generator.prototype.generate_item = function(){
  console.log('Generating item.');

  var index = this.rand_range(1, this.json_data.items.inventory.length) - 1;
  var item = this.json_data.items.inventory[index];
  var quantity = "1";

  if(item.hasOwnProperty("quantity")){
    quantity = this.dice_roll(item.quantity);
  }

  return new Item(item.name, quantity, item.description);
};

Generator.prototype.generate_armor = function(){
  console.log('Generate armor.');

  var index = this.rand_range(1, this.json_data.items.armor.length) - 1;
  var armor = this.json_data.items.armor[index];

  return new Armor(armor.name, armor.ac, armor.description);
};

Generator.prototype.generate_race = function(){
  console.log('Generate race.');

  var index = this.rand_range(1, this.json_data.races.length) - 1;
  var race = this.json_data.races[index];

  return race.name;
};

Generator.prototype.generate_type = function(){
  console.log('Generate type.');

  var index = this.rand_range(1, this.json_data.types.length) - 1;
  var type = this.json_data.types[index];

  return type.name;
};

Generator.prototype.generate_name = function(){
  console.log('Generate name.');

  var generator = NameGen.compile("sV'i");

  return generator.toString();
};

Generator.prototype.generate_meatshield = function(){
  console.log('Generating meatshield');

  var hp = this.dice_roll("1d6");
  var name = this.generate_name();
  var type = this.generate_type();
  var race = this.generate_race();
  var weapon = [this.generate_weapon()];
  var armor = [this.generate_armor()];
  var inventory = [this.generate_item()];
  return new Meatshield(name, type, race, hp, weapon, armor, inventory);
};

function Weapon(name, damage, description){
  this.name = name;
  this.damage = damage;
  this.description = description;
}

function Item(name, quantity, description){
  this.name = name;
  this.quantity = quantity;
  this.description = description;
}

function Armor(name, ac, description){
  this.name = name;
  this.ac = ac;
  this.description = description;
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
