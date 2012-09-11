$(document).ready(function() {
  var Grid = Backbone.View.extend({
    id: "grid",
    tagName: "div",
    className: "no_select",
    initialize: function() {
      // standard size is 19x19
      for(var i = 0; i < 361; ++i) {
        var node = new Node();
        node.grid = this;
        this.nodes[i] = node;
      }

      // init sidebar
      var pieces = new DraggablePieces();
      pieces.grid = this;
      this.pieces = pieces;
      $("#sidebar").html(pieces.render().el);
    },
    render: function() {
      var root = $(this.el);
      root.html(this.template);

      this.nodes.forEach(function(node, i) {
        root.append(node.render().el);
      });
      return this;
    },
    nodes: []
  });
  var Node = Backbone.View.extend({
    token: null,
    tagName: "div",
    className: 'node',

    render: function() {
      $(this.el).html(this.template);
      return this;
    },

    set_token: function(t) {
      if (this.token !== null) {
        throw 'wabbajack';
      }

      this.token = t;
      this.token.render();
      $(this.el).append(this.token.el);
    },

    events: {
      "drop" : "dragDropEvent",
      "mouseup" : "dragDropEvent"
    },
    dragDropEvent: function(event) {
      if (this.grid.pieces.isDragging) {
        this.set_token(new BlackToken());
      }
    }
  });
  var BlackToken = Backbone.View.extend({
    tagName: "div",
    className: 'black circle',
    render: function() {
      $(this.el).html(this.template);
      return this;
    }
  });
  var WhiteToken = Backbone.View.extend({
    tagName: "div",
    className: 'white circle',
    render: function() {
      $(this.el).html(this.template);
      return this;
    }
  });

  var DraggablePieces = Backbone.View.extend({
    tagName: "div",
    id: "drag_box",
    isDragging: false,
    events: {
      "mousedown" : "dragStartEvent",
      "drop" : "dragStopEvent",
      "mouseup" : "dragStopEvent",
      "dragend" : "dragStopEvent"
    },
    dragStartEvent: function(event) {
      this.isDragging = true;

      // cursor should be an icon
    },
    dragStopEvent: function(event) {
      //return cursor, reset dragging
      this.isDragging = false;
    }
  });

  var grid = new Grid();
  $("#content").html(grid.render().el);
});
