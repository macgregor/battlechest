// Configures Masonry for a responsive card layout
function runMasonry() {
  var $container = $('#meatshield');

  $container.masonry({
    columnWidth: 60,
    itemSelector: '.item',
    containerStyle: null,
    isAnimated: true,
    gutter: 14,
    isFitWidth: true
  });
}

function runHandlebars(characters){
  var source = $("#template").html();
  var template = Handlebars.compile(source);

  $('#meatshield').append(template(characters));

  runMasonry();
}

$(document).ready(function() {

  var generator = new Generator();
  var characters = {characters:[]}
  $("#generate-character").click(function(){
      characters['characters'].push(generator.generate_meatshield());
      console.log(characters);
      runHandlebars(characters);
  }); 
});
