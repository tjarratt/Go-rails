(function() {
  var not_empty_nodes = function(grid) {
    return _(grid.nodes).reject(function(n) {
      return n.empty();
    });
  };

  test('Chain Merging', function() {
    var grid = new Go.Grid();

    // just a simple corner case
    grid.nodes[1].set_token(new Go.BlackToken());
    equal( 1, not_empty_nodes(grid).length );
    equal( 1, Object.keys(grid.chains).length );

    grid.nodes[19].set_token(new Go.BlackToken());
    equal( 2, not_empty_nodes(grid).length );
    equal( 2, Object.keys(grid.chains).length );

    grid.nodes[0].set_token(new Go.BlackToken());
    equal( 3, not_empty_nodes(grid).length );
    equal( 1, Object.keys(grid.chains).length );

    _(grid.nodes).each(function(n) {
      n.token = null;
    });
    grid.chains = {};

    equal( 0, not_empty_nodes(grid).length);
    equal( 0, Object.keys(grid.chains).length );

    grid.nodes[1].set_token(new Go.BlackToken());
    equal( 1, not_empty_nodes(grid).length );
    equal( 1, Object.keys(grid.chains).length );

    grid.nodes[20].set_token(new Go.BlackToken());
    equal( 2, not_empty_nodes(grid).length );
    equal( 1, Object.keys(grid.chains).length );

    grid.nodes[58].set_token(new Go.BlackToken());
    equal( 3, not_empty_nodes(grid).length );
    equal( 2, Object.keys(grid.chains).length );

    grid.nodes[77].set_token(new Go.BlackToken());
    equal( 4, not_empty_nodes(grid).length );
    equal( 2, Object.keys(grid.chains).length );

    // connects the two disparate chains
    grid.nodes[39].set_token(new Go.BlackToken());
    equal( 5, not_empty_nodes(grid).length );
    equal( 1, Object.keys(grid.chains).length );
  });
})();
