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

  var generator_data = Generator.load_json('data/meatshield.json');
  var first_names = Generator.load_json('data/first_names.json');
  var last_names = Generator.load_json('data/last_names.json')
  var source = $("#template").html();
  var template = Handlebars.compile(source);
  var meatshields = getLocalData();

  for(var i in meatshields){
    $('#meatshield').append(template(meatshields[i]));
  }

  runMasonry();

  $("#generate-character").click(function(){
    var new_meatshield = Generator.random_meatshield(generator_data, first_names["names"], last_names["names"]);
    console.log(new_meatshield);

    meatshields.push(new_meatshield);
    updateLocalData(meatshields);


    $('#meatshield').append(template(new_meatshield));
    $('#meatshield').masonry('reloadItems');
    $('#meatshield').masonry('layout');

    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  });

  $("#clear_data").click(function(){
    clearLocalData()
    $('#meatshield').html("");
    $('#meatshield').masonry('reloadItems');
    $('#meatshield').masonry('layout');
  });

  $(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".navbar-collapse");
    var _opened = $navbar.hasClass("in");
    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
        $navbar.collapse('hide');
    }
  });

  $(document).on("click", '#delete-meatshield', function(){
    $(this).closest('.character').remove();
    $('#meatshield').masonry('reloadItems');
    $('#meatshield').masonry('layout');
  });
});
