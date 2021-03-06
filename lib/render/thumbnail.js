Thumbnail.prototype = new EventEmitter;
function Thumbnail(board) {
    var self = this;
    
    self.board = board;
    
    self.element = $('<div>')
        .addClass('thumbnail')
        .mouseover(function () {
            bg.attr({ fill : 'rgb(200,50,50)' })
            self._label.attr({ opacity : 1 });
            boardOverlay.attr({ opacity : 0.5 });
        })
        .mouseout(function () {
            bg.attr({ fill : 'rgb(220,200,200)' })
            self._label.attr({ opacity : 0 });
            boardOverlay.attr({ opacity : 0 });
        })
        .click(function () {
            self.emit(self.label);
        });
    ;
    
    var height = 400;
    var spacing = 100;
    var topSmudge = 30;
    
    var im = Raphael(self.element[0], 300, height);
    var bg = im.rect(0, topSmudge, 300, height - spacing, 20)
        .attr({
            fill : 'rgb(220,200,200)',
            stroke : 'none'
        });
    
    function tile (x, y) {
        var w = (300 - 20) / 8;
        var h = (height - spacing - 20) / 8;
        return {
            width : w,
            height : h,
            x : 10 + x * w,
            y : topSmudge + 10 + (7 - y) * h
        };
    }
    
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            var t = tile(x, y);
            im.rect(t.x, t.y, t.width, t.height)
                .attr({
                    fill : (x + y) % 2 ? 'white' : 'rgb(150,100,100)',
                    stroke : 'none'
                });
        }
    }
    var boardOverlay = im.rect(0, topSmudge, 300, height - spacing, 20)
        .attr({
            fill : 'rgb(200, 50, 50)',
            opacity : 0
        });
    
    board.pieces.forEach(function (p) {
        var t = tile(p.x, p.y);
        // Generated thumbs doing something like so:
        // for i in `ls`; do convert -resize 35 $i/back.svg thumbs/$i.png; done
        // Nice n' quick for the standard images :)
        var file = 'images/' + p.color + '/thumbs/' + p.code + '.png';
        var image = im.image(file, t.x, t.y, 35, 35);
        p.image = image;
    });
    
    var labelText = '';
    self.__defineSetter__('label', function (txt) {
        if (self._label) self._label.remove();
        self._label = im.text(150, 190, txt)
            .attr({
                opacity : 0,
                'font-size' : 72,
                'fill' : 'rgb(255,230,100)',
                stroke : 'rgb(100,70,10)',
                'stroke-width' : 2
            });
        self._label.text = txt;
    });
    
    self.__defineGetter__('label', function () {
        return self._label.text;
    });
    
    self.label = 'create';
    
    self.move = function (sx, sy, dx, dy) {
        var dstPiece = board.pieceAt(dx, dy);
        if (dstPiece) setTimeout(function () {
            // possibly blood goes here
            dstPiece.image.remove();
        });
        
        board.move(sx, sy, dx, dy);
        var t = tile(dx, dy);
        board.pieceAt(dx, dy).image.toFront().animate({
            x : t.x, y : t.y
        }, 500);
    };
    
    self.players = {};
    
    self.available = function () {
        if (!self.players.white.name) return 'white';
        if (!self.players.black.name) return 'black';
        return null;
    };
    
    self.addPlayer = function (player) {
        if (self.players[player.color]) {
            self.players[player.color].element.remove();
        }
        self.players[player.color] = player;
        
        var y = player.color == 'white'
            ? height - spacing / 2 + 3
            : topSmudge - 5;
        
        var fill = player.color == 'white'
            ? 'rgb(200,200,200)' : 'rgb(70,70,70)';
        var stroke = player.color == 'white'
            ? 'rgb(70,70,70)' : 'black';
        if (player.name == null) {
            fill = 'rgb(150,255,150)';
            stroke = 'rgb(50,150,50)';
        }
        else {
            self.label = 'join';
        }
        
        player.element = im.text(150, y, player.name ? player.name : 'empty')
            .attr({
                fill : fill,
                stroke : stroke,
                'stroke-width' : 1,
                'font-weight' : 'bold',
                'font-size' : 28
            });
        
        if (self.players.white && self.players.white.name
        && self.players.black && self.players.black.name)
            self.label = 'watch';
    };
    
    self.removePlayer = function (player) {
        self.addPlayer({ name : null, color : player.color });
        self.label = 'join';
    };
    
    self.addPlayer({ name : null, color : 'white' });
    self.addPlayer({ name : null, color : 'black' });
}
