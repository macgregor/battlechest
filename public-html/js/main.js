$(document).ready(function() {
  $('table').stickyTableHeaders({scrollableArea: $('.scrollable-area')});

  var generator = new Generator();
  $("#generate-character").click(function(){
      $('#character-table tbody tr:last').after(generator.generate_meatshield().html());
  }); 

  $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");

    $('div.content').addClass("hidden");
    $( $(this).attr('href') ).parent().removeClass("hidden");
  });
});
