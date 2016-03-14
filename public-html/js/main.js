// Configures Masonry for a responsive card layout
function runMasonry() {
  var container = $('#meatshield');

  container.masonry({
    columnWidth: 60,
    itemSelector: '.character',
    containerStyle: null,
    isAnimated: true,
    gutter: 14,
    isFitWidth: true
  });
}

$(document).ready(function() {

  var generator = new Generator();
  var source = $("#template").html();
  var template = Handlebars.compile(source);
  runMasonry();
  
  $("#generate-character").click(function(){
    $('#meatshield').append(template(generator.generate_meatshield()));
    $('#meatshield').masonry('reloadItems');
    $('#meatshield').masonry('layout');
  }); 
});
