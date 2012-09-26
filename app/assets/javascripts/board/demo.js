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
        node.index = i;
        this.nodes[i] = node;
      }

      var blackpieces = new BlackPieces();
      blackpieces.grid = this;
      this.blacks = blackpieces;
      $("#sidebar").html(blackpieces.render().el);
    },
    render: function() {
      var root = $(this.el);
      root.html(this.template);

      this.nodes.forEach(function(node, i) {
        root.append(node.render().el);
      });
      return this;
    },
    nodes: [],
    make_random_move: function() {
      var index = Math.floor(Math.random() * 361);
      if (this.nodes[index].token !== null) {
        // TODO: make sure this node is alive
        return make_random_move();
      }
      else {
        this.nodes[index].set_token(new WhiteToken());
      }
    },

    look_for_dead_pieces: function(index) {
      _(this.nodes).each(function(node) {
        // look at up to four neighbors, see if lives >= 1
        var lives = 0;
        _(node.neighbors()).each(function(neighbor) {
          if (neighbor.empty()) {
            lives += 1;
          }
          else if (neighbor.white() && node.white()) {
            lives += 1;
          }
          else if (neighbor.black() && node.black()) {
            lives += 1;
          }
        });

        if (lives == 0) {
          node.token = null;
          $(node.el).html("");
        }
      });
    }
  });
  var Node = Backbone.View.extend({
    index: null,
    token: null,
    tagName: "div",
    className: 'node',

    empty: function() { return this.token === null; },
    white: function() {
      return WhiteToken.prototype.isPrototypeOf(this.token);
    },
    black: function() {
      return BlackToken.prototype.isPrototypeOf(this.token);
    },

    neighbors: function() {
      var left = this.index - 1;
      var right = this.index + 1;
      var top = this.index - 19;
      var bottom = this.index + 19;

      var n = [];
      if (this.index % 19 - 1 > 0) {
        n.push(this.grid.nodes[this.index - 1]);
      }
      if (this.index % 19 + 1 < 19) {
        n.push(this.grid.nodes[this.index + 1]);
      }
      if (this.index >= 19) {
        n.push(this.grid.nodes[this.index - 19]);
      }
      if (this.index <= 341) {
        n.push(this.grid.nodes[this.index + 19]);
      }

      return n;
    },

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
      if (this.token === null) {
        this.set_token(new BlackToken());
        this.grid.look_for_dead_pieces(this.index);

        this.grid.make_random_move();
        this.grid.look_for_dead_pieces(this.index);
      }

      this.grid.blacks.isDragging = false;
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
  var BlackPieces = DraggablePieces.extend({
    className: "black"
  });
  var WhitePieces = DraggablePieces.extend({
    className: "white"
  });

  var grid = new Grid();
  $("#content").html(grid.render().el);
});
