var Go = Go || {};

Go.Node = Backbone.View.extend({
  index: null,
  token: null,
  chain : null,
  tagName: "div",
  className: 'node',

  empty: function() { return this.token === null; },
  white: function() {
    return Go.WhiteToken.prototype.isPrototypeOf(this.token);
  },
  black: function() {
    return Go.BlackToken.prototype.isPrototypeOf(this.token);
  },

  alive: function() {
    return this.liberties() > 0;
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
      this.set_token(new Go.BlackToken());
      this.grid.make_random_move();
    }
  }
});
