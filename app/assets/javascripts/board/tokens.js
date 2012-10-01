var Go = Go || {};

Go.BlackToken = Backbone.View.extend({
  tagName: "div",
  className: 'black circle',
  render: function() {
    $(this.el).html(this.template);
    return this;
  }
});
Go.WhiteToken = Backbone.View.extend({
  tagName: "div",
  className: 'white circle',
  render: function() {
    $(this.el).html(this.template);
    return this;
  }
});

Go.DraggablePieces = Backbone.View.extend({
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
Go.BlackPieces = Go.DraggablePieces.extend({
  className: "black"
});
Go.WhitePieces = Go.DraggablePieces.extend({
  className: "white"
});
