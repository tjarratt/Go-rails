(function() {
  test('node colors', function() {
    Go.Node.prototype.added_token = function() { }; // resub
    var node = new Go.Node();
    ok( node.empty() );

    node.set_token(new Go.BlackToken());
    ok( !node.empty() );
    ok( node.black() );

    node.token = null;
    node.set_token(new Go.WhiteToken());
    ok( node.white() );
  });

  test('node liberties', function() {
    var grid = new Go.Grid();

    // check corner
    var corner = grid.nodes[0];
    corner.set_token(new Go.WhiteToken());
    equal( 2, corner.liberties() );

    grid.nodes[1].set_token(new Go.BlackToken());
    equal( 1, corner.liberties() );

    grid.nodes[1].token = null;
    grid.nodes[1].set_token(new Go.WhiteToken());
    equal( 1, corner.liberties() );

    grid.nodes[19].set_token(new Go.BlackToken());
    equal( 0, corner.liberties() );

    // check edge
    var edge_index = 19 * 5;
    var edge = grid.nodes[edge_index];
    equal( 3, edge.liberties() );

    grid.nodes[edge_index + 1].set_token(new Go.WhiteToken());
    equal( 2, edge.liberties() );

    grid.nodes[edge_index - 19].set_token(new Go.BlackToken());
    equal( 1, edge.liberties() );

    grid.nodes[edge_index + 19].set_token(new Go.BlackToken());
    equal( 0, edge.liberties() );

    // check middle
    var center_index = 19 * 5 + 5;
    var center = grid.nodes[center_index];
    equal( 4, center.liberties() );

    grid.nodes[center_index - 1].set_token(new Go.WhiteToken());
    equal( 3, center.liberties() );

    grid.nodes[center_index + 1].set_token(new Go.WhiteToken());
    equal( 2, center.liberties() );

    grid.nodes[center_index - 19].set_token(new Go.BlackToken());
    equal( 1, center.liberties() );

    grid.nodes[center_index + 19].set_token(new Go.BlackToken());
    equal( 0, center.liberties() );
  });

  test('node neighbors', function() {
    ok( false );
  });
})();
