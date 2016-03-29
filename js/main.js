/*
 * Configures Masonry for a responsive card layout
 */
function initMasonry() {
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

/*
 * Refreshes the masonry grid, used after modifying the underlying html dom
 * (adding or deleting a meatshield)
 */
function refreshMasonryGrid(container="#meatshield"){
  $(container).masonry('reloadItems');
  $(container).masonry('layout');
}

/*
 * Append a meatshield to the html dom and (optionally) refresh the masonry grid
 */
function appendMeatshield(meatshield, refresh=false, container="#meatshield"){
  $(container).append(meatshield);

  if(refresh){
    refreshMasonryGrid(container);
  }
}

/*
 * Create a delete event, basically a simple json structure
 * that stores an array of meatshields that were deleted in an action.
 * Deleting a single meatshield via the card will yield a delete event with
 * an array length of 1, using the clear data button will yield an event
 * with all meatshields at the time of the delete.
 */
function delete_event(meatshields){
  return { "action" : "delete", "data" : meatshields};
}

/*
 * main method
 */
$(document).ready(function() {

  //load generator json data
  var generator_data = Generator.load_json('data/meatshield.json');
  var first_names = Generator.load_json('data/first_names.json');
  var last_names = Generator.load_json('data/last_names.json');

  //create handlebars tmeplate for generating meatshield dom elements
  var source = $("#template").html();
  var template = Handlebars.compile(source);

  //sometimes after using the app and refreshing the undo button is enabled for some reason
  $('#undo_delete').attr("disabled", true);


  //load meatshield data from localdata, meatshields is a json structure that acts as a hashmap
  //of meatshield id to meatshield json, map needed to manage deleting/undoing
  var meatshields = getLocalData();
  var deleted = [];

  //create dom elements for meatshields loaded from saved data
  for(var i in meatshields){
    appendMeatshield(template(meatshields[i]))
  }

  initMasonry();

  //generate-character on click handler
  $("#generate-character").click(function(){
    var new_meatshield = Generator.random_meatshield(generator_data, first_names["names"], last_names["names"]);

    meatshields[new_meatshield['id']] = new_meatshield;
    updateLocalData(meatshields);
    appendMeatshield(template(new_meatshield), refresh=true);

    //scroll to the newly generated card,
    //TODO: doesnt work so great on mobile or when you generate alot of meatshields quickly
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  });

  //clear_data on click handler
  $("#clear_data").click(function(){
    //meatshield json map -> array so we can add the arry to a delete event
    var to_delete = [];
    $.each(meatshields, function(id, meatshield) {
      to_delete.push(meatshield);
      delete meatshields[id];
    });

    //they can press clear even when there is no data so need to check length of array
    if(to_delete.length > 0){
      deleted.push(delete_event(to_delete));
      $('#undo_delete').attr("disabled", false);
    }

    //clear the local data and refresh masonry grid
    clearLocalData()
    $('#meatshield').html("");
    refreshMasonryGrid();
  });

  //undo_delete on click handler
  $("#undo_delete").click(function(){
    var undo = deleted.pop();

    if(undo){
      //add each meatshield in the delete event data array back to the dom
      for(var i in undo.data){
        meatshields[undo.data[i].id] = undo.data[i];
        appendMeatshield(template(undo.data[i]));
      }

      updateLocalData(meatshields);
      refreshMasonryGrid();
    }

    if(deleted.length == 0){
      $('#undo_delete').attr("disabled", true);
    }
  });

  //this hides the bootstrap collabsible nav when mouse leaves the navbar
  $(".navbar").mouseleave(() => {
    $(".navbar-collapse").collapse('hide');
  });

  //add a delegate click handler to the page to add on click listeners to the dynamically
  //generated meatshield elements. Handles deleting the card that was clicked on
  $(document).on("click", '#delete-meatshield', function(){
    //get the id off the dom element to find it in the json map
    var id = $(this).closest('.character').attr('id');

    deleted.push(delete_event([meatshields[i]]));
    $('#undo_delete').attr("disabled", false);
    delete meatshields[id];

    updateLocalData(meatshields);
    $(this).closest('.character').remove();
    refreshMasonryGrid();
  });
});
