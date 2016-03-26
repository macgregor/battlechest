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

function refreshMasonryGrid(container="#meatshield"){
  $(container).masonry('reloadItems');
  $(container).masonry('layout');
}

function appendMeatshield(meatshield, refresh=false, container="#meatshield"){
  $(container).append(meatshield);

  if(refresh){
    refreshMasonryGrid(container);
  }
}

$(document).ready(function() {

  var generator_data = Generator.load_json('data/meatshield.json');
  var first_names = Generator.load_json('data/first_names.json');
  var last_names = Generator.load_json('data/last_names.json')
  var source = $("#template").html();
  var template = Handlebars.compile(source);
  var meatshields = getLocalData();
  var deleted = [];

  for(var i in meatshields){
    appendMeatshield(template(meatshields[i]))
  }

  runMasonry();

  $("#generate-character").click(function(){
    var new_meatshield = Generator.random_meatshield(generator_data, first_names["names"], last_names["names"]);
    console.log(new_meatshield);

    meatshields[new_meatshield['id']] = new_meatshield;
    updateLocalData(meatshields);
    appendMeatshield(template(new_meatshield), refresh=true);

    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  });

  $("#clear_data").click(function(){
    clearLocalData()
    $('#meatshield').html("");
    refreshMasonryGrid();
  });

  $("#undo_delete").click(function(){
    var undo = deleted.pop();

    if(undo){
      meatshields[undo.id] = undo;
      updateLocalData(meatshields);
      appendMeatshield(template(undo), refresh=true);
    }
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
    var id = $(this).closest('.character').attr('id');
    deleted.push(meatshields[id]);
    delete meatshields[id];
    updateLocalData(meatshields);
    $(this).closest('.character').remove();
    refreshMasonryGrid();
  });
});
