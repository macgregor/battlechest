function rand_range(low, high){
  return Math.floor((Math.random() * high) + low); 
}

function dice_roll(dice_frmt){
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
    roll += rand_range(1, sides);
  }

  roll += bonus;
  return roll;
}

function load_data(file, callback){
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            try {
              json = JSON.parse(xobj.responseText);
              callback(json);
            }
            catch(err) {
              console.log(err);
            }
          }
    };
    xobj.send(null); 
}

function generate_weapon(json){
  var weapon = rand_range(1, json.items.weapons.length) - 1;
  return "<p><b>" + json.items.weapons[weapon].name + "</b> ("+json.items.weapons[weapon].damage+")<br/>" +
    json.items.weapons[weapon].description + "</p>";
}

function generate_armor(json){
  var armor = rand_range(1, json.items.armor.length) - 1;
  return "<p><b>" + json.items.armor[armor].name + "</b> (AC "+json.items.armor[armor].ac+")<br/>" +
    json.items.armor[armor].description + "</p>";
}

function generate_inventory(json){
  var inventory = rand_range(1, json.items.inventory.length) - 1;
  var quantity = "1";

  if(json.items.inventory[inventory].hasOwnProperty("quantity")){
    quantity = dice_roll(json.items.inventory[inventory].quantity);
  }

  return "<p><b>" + json.items.inventory[inventory].name + "</b>("+quantity+")<br/>" +
    json.items.inventory[inventory].description + "</p>";
}

function generate_meatshield(){
  load_data('./json/items.json', function(json){
    var hp = dice_roll("1d6");
    var name = "Someone";
    var type = "Man-at-arms";

    var row_html = '<tr class="table-hover">' +
      '<td class="col-sm-3">'+name+'</td>'+
      '<td class="col-sm-2">'+type+'</td>'+
      '<td class="col-sm-1">'+hp+'</td>'+
      '<td class="col-sm-2">'+generate_weapon(json)+'</td>'+
      '<td class="col-sm-2">'+generate_armor(json)+'</td>'+
      '<td class="col-sm-2">'+generate_inventory(json)+'</td>'+
      '</tr>';

    $('#character-table tbody tr:last').after(row_html);
  });
}

$(document).ready(function() {
  $('table').stickyTableHeaders({scrollableArea: $('.scrollable-area')});

  $("#generate-character").click(function(){
    generate_meatshield();
  }); 

  $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");

    $('div.content').addClass("hidden");
    $( $(this).attr('href') ).parent().removeClass("hidden");
  });
});
