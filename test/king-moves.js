var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');


function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-king-moves' : function (assert) {
        var b = new Board;
        b.move(4,0,4,3);
        moves = MoveGenerator(b, newState(), b.at(4,3), true);
        assert.equal(moves.length, 8);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.x == 3 && move.y == 2) ok++;
            if (move.x == 3 && move.y == 3) ok++;
            if (move.x == 3 && move.y == 4) ok++;
            if (move.x == 4 && move.y == 4) ok++;
            if (move.x == 5 && move.y == 4) ok++;
            if (move.x == 5 && move.y == 3) ok++;
            if (move.x == 5 && move.y == 2) ok++;
            if (move.x == 4 && move.y == 2) ok++;
        });

        assert.equal(ok, 8);
    },
    'no-king-moves' : function (assert) {
        var b = new Board;
        var nomoves = MoveGenerator(b, newState(), b.at(4,0), true);
        assert.equal(nomoves.length, 0);
    },
    'restricted-king-moves' : function (assert) {
        var b = new Board;
        b.move(4,0,4,4);
        moves = MoveGenerator(b, newState(), b.at(4,4), true);
        assert.equal(moves.length, 5);
    }
};
