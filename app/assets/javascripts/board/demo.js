$(document).ready(function() {
  function same_color(node1, node2) {
    if (node1.empty() || node2.empty()) {
      return false;
    }
    if (node1.black() && node2.black()) {
      return true;
    }
    if (node1.white() && node2.white()) {
      return true;
    }

    return false;
  };

  var chain_index = 0;
  var Grid = Backbone.View.extend({
    id: "grid",
    tagName: "div",
    className: "no_select",

    nodes:  [],  // squares on the board
    chains: {},  // continuous chains of pieces on the board

    add_chain: function(node) {
      var chain = new Chain(node);
      chain.grid = this;
      chain.index = chain_index;
      node.chain = chain;
      this.chains[chain_index] = chain;
      chain_index += 1;
    },

    merge_chains: function(coming, going) {
      var the_chain = coming;
      _(going.nodes).each(function(node) {
        the_chain.add_node(node);
      });

      this.remove_chain(going);
    },

    remove_chain: function(chain) {
      delete this.chains[chain.index];
    },

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
    make_random_move: function() {
      var index = Math.floor(Math.random() * 361);
      if (this.nodes[index].token !== null) {
        // TODO: make sure this node is alive
        return this.make_random_move();
      }
      else {
        this.nodes[index].set_token(new WhiteToken());
      }
    },

    find_dead_chains: function() {
      _(this.chains).each(function(chain) {
        if (chain.liberties() == 0) {
          chain.remove(); // should delegate .remove to its nodes
        }
      });
    }
  });
  var Chain = Backbone.Model.extend({
    grid: null,
    nodes: null,

    initialize: function(node) {
      this.nodes = [node];
    },

    add_node: function(node) {
      this.nodes.push(node);
    },

    remove: function() {
      _(this.nodes).each(function(node) {
        node.token = null;
        node.chain = null;
        $(node.el).html("");
      });

      this.grid.remove_chain(this);
    },

    liberties: function() {
      var count = 0;
      _(this.nodes).each(function(node) {
        count += node.liberties();
      });

      return count;
    }
  });

  var Node = Backbone.View.extend({
    index: null,
    token: null,
    chain : null,
    tagName: "div",
    className: 'node',

    empty: function() { return this.token === null; },
    white: function() {
      return WhiteToken.prototype.isPrototypeOf(this.token);
    },
    black: function() {
      return BlackToken.prototype.isPrototypeOf(this.token);
    },

    liberties: function() {
      var empty_squares = 0;
      _(this.neighbors()).each(function(n) {
        if (n.token === null) {
          empty_squares += 1;
        }
      });

      return empty_squares;
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

      this.added_token();
    },

    events: {
      "drop" : "dragDropEvent",
      "mouseup" : "dragDropEvent"
    },

    added_token: function() {
      // look at our neighbors, find any same-color nodes
      // for each node we found, combine into a new chain
      // making sure to combine / discard old chains
      var neighbor_nodes = [];
      _(this.neighbors()).each(function(neighbor) {
        if (!neighbor.empty()) {
          if (same_color(this, neighbor)) {
            neighbor_nodes.push(neighbor);
          }
        }
      }.bind(this));

      this.grid.add_chain(this); // sets up this.chain
      if (neighbor_nodes.length > 0) {
        _(neighbor_nodes).each(function(neighbor) {
          if (neighbor.chain) {
            this.grid.merge_chains(this.chain, neighbor.chain);
          }
          else {
            this.chain.add_node(neighbor);
          }
        }.bind(this));
      }
      this.grid.find_dead_chains();
    },

    dragDropEvent: function(event) {
      if (this.token === null) {
        this.set_token(new BlackToken());
        this.grid.make_random_move();
      }

      // xxx switch to click to place
      // this.grid.blacks.isDragging = false;
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
