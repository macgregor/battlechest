$(document).ready(function() {
    $("#generate-character").click(function(){
      var row_html='<tr>' +
        '<th class="col-xs-2">#</th>' +
        '<th class="col-xs-4">Name</th>' +
        '<th class="col-xs-4">Type</th>' +
        '<th class="col-xs-2">HP</th>' +
        '<th class="col-xs-8">Gear</th>' +
        '</tr>';
        $('#character-table tr:last').after(row_html);
    }); 
});

$(document).ready(function() {
  $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");

    $('div.container').addClass("hidden");
    $( $(this).attr('href') ).parent().removeClass("hidden");
  });
});
