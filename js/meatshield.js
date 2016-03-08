function Generator(){
  this.json_data;

  $.getJSON( 'json/items.json', function( data ) {
    this.json_data = data;
  });

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
  var index = this.rand_range(1, this.json_data.items.weapons.length) - 1;
  var weapon = this.json_data.items.weapons[index];

  return new Weapon(weapon.name, weapon.damage, weapon.description);
};

Generator.prototype.generate_item = function(){
  var index = this.rand_range(1, this.json_data.items.inventory.length) - 1;
  var item = this.json_data.items.inventory[index];
  var quantity = "1";

  if(item.hasOwnProperty("quantity")){
    quantity = this.dice_roll(item.quantity);
  }

  return new Item(item.name, quantity, item.description);
};

Generator.prototype.generate_armor = function(){
  var index = this.rand_range(1, this.json_data.items.armor.length) - 1;
  var armor = this.json_data.items.armor[index];

  return new Armor(armor.name, armor.ac, armor.description);
};

Generator.prototype.generate_meatshield = function(){
  var hp = this.dice_roll("1d6");
  var name = "Someone";
  var type = "Man-at-arms";
  var weapon = this.generate_weapon();
  var armor = this.generate_armor();
  var inventory = this.generate_item();

  return new Meatshield(name, type, hp, weapon, armor, inventory);
};

function Weapon(name, damage, description){
  this.name = name;
  this.damage = damage;
  this.description = description;
}

Weapon.prototype.html = function(){
  return "<p><b>" + this.name + "</b> (" + this.damage + ")<br/>" + this.description + "</p>";
}

function Item(name, quantity, description){
  this.name = name;
  this.damage = damage;
  this.description = description;
}

Item.prototype.html = function(){
  return "<p><b>" + this.name + "</b>(" + this.quantity + ")<br/>" + this.description + "</p>";
};

function Armor(name, ac, description){
  this.name = name;
  this.ac = ac;
  this.description = description;
}

Armor.prototype.html = function(){
  return "<p><b>" + this.name + "</b> (AC " + this.ac + ")<br/>" + this.description + "</p>";
};

function Meatshield (name, type, race, hp, weapons, armor, inventory) {
  this.name = name;
  this.type = type;
  this.race = race;
  this.hp = hp;
  this.weapons = weapons;
  this.armor = armor;
  this.inventory = inventory;
}

Meatshield.prototype.html = function(){
  return '<tr class="table-hover">' +
    '<td class="col-sm-3">'+this.name+'</td>'+
    '<td class="col-sm-2">'+this.type+'</td>'+
    '<td class="col-sm-1">'+this.hp+'</td>'+
    '<td class="col-sm-2">'+this.weapons.html()+'</td>'+
    '<td class="col-sm-2">'+this.armor.html()+'</td>'+
    '<td class="col-sm-2">'+this.inventory.html()+'</td>'+
    '</tr>';
};
