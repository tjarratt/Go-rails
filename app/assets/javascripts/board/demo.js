// =require board/common
var Go = Go || {};

$(document).ready(function() {
  var grid = new Go.Grid();
  $("#content").html(grid.render().el);
});
