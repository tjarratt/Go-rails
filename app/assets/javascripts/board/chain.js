var Go = Go || {};
Go.Chain = Backbone.Model.extend({
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
