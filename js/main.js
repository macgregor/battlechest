function roll(low, high){
  return Math.floor((Math.random() * high) + low); 
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
              alert(err);
            }
          }
    };
    xobj.send(null); 
}

function generate_weapon(json){
  var weapon = roll(1, json.items.weapons.length) - 1;
  return "<p><b>" + json.items.weapons[weapon].name + "</b> ("+json.items.weapons[weapon].damage+")<br/>" +
    json.items.weapons[weapon].description + "</p>";
}

function generate_armor(json){
  var armor = roll(1, json.items.armor.length) - 1;
  return "<p><b>" + json.items.armor[armor].name + "</b> (AC "+json.items.armor[armor].ac+")<br/>" +
    json.items.armor[armor].description + "</p>";
}

function generate_inventory(json){
  var inventory = roll(1, json.items.inventory.length) - 1;
  return "<p><b>" + json.items.inventory[inventory].name + "</b><br/>" +
    json.items.inventory[inventory].description + "</p>";
}

function generate_meatshield(){
  load_data('./json/items.json', function(json){
    var hp = roll(1, 6);
    var name = "Someone";
    var type = "Man-at-arms";

    var row_html='<tr>' +
      '<td class="col-xs-2">#</td>' +
      '<td class="col-xs-4">'+name+'</td>' +
      '<td class="col-xs-4">'+type+'</td>' +
      '<td class="col-xs-2">'+hp+'</td>' +
      '<td class="col-xs-4">'+generate_weapon(json)+'</td>' +
      '<td class="col-xs-4">'+generate_armor(json)+'</td>' +
      '<td class="col-xs-4">'+generate_inventory(json)+'</td>' +
      '</tr>';

    alert(row_html);
    $('#character-table tr:last').after(row_html);
  });
}

$(document).ready(function() {
    $("#generate-character").click(function(){
      generate_meatshield();
    }); 
});

$(document).ready(function() {
  $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");

    $('div.content').addClass("hidden");
    $( $(this).attr('href') ).parent().removeClass("hidden");
  });
});
