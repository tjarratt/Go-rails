// =require board/node
// =require board/chain
// =require board/tokens
var Go = Go || {};
var chain_index = 0;
Go.Grid = Backbone.View.extend({
  id: "grid",
  tagName: "div",
  className: "no_select",

  nodes:  [],  // squares on the board
  chains: {},  // continuous chains of pieces on the board

  add_chain: function(node) {
    var chain = new Go.Chain(node);
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
      var node = new Go.Node();
      node.grid = this;
      node.index = i;
      this.nodes[i] = node;
    }

    var blackpieces = new Go.BlackPieces();
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
    if (this.nodes[index].token !== null || !this.nodes[index].alive()) {
      return this.make_random_move();
    }
    else {
      this.nodes[index].set_token(new Go.WhiteToken());
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
