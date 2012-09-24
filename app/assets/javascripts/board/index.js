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

window.fbAsyncInit = function() {
  FB.init({
    appId      : '331109186984431',
    channelUrl : '//go-game.heroku.com/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
};

(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  ref.parentNode.insertBefore(js, ref);
}(document));
