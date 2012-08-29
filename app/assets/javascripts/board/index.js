$(document).ready(function() {
  var Grid = Backbone.View.extend({
    id: "grid",
    tagName: "div",
    initialize: function() {
      // standard size is 19x19
      for(var i = 0; i < 361; ++i) {
       this.nodes[i] = new Node();
      }
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
    }
  });
  var BlackToken = Backbone.View.extend({
    tagName: "div",
    className: 'black',
    render: function() {
      $(this.el).html(this.template);
      return this;
    }
  });
  var WhiteToken = Backbone.View.extend({
    tagName: "div",
    className: 'white',
    render: function() {
      $(this.el).html(this.template);
      return this;
    }
  });

  var grid = new Grid();
  $("#content").html(grid.render().el);

  grid.nodes[21].set_token(new WhiteToken());
});
