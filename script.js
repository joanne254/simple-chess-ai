var TILE_CLASS = 'square-55d63';
var BLACK_TILE_CLASS = 'black-3c85d';
var HIGHLIGHTED_WHITE_TILE_COLOUR = '#a9a9a9';
var HIGHLIGHTED_BLACK_TILE_COLOUR = '#696969';

var board,
    gameWithHuman,
    gameWithAi,
    game;

/* board visualization and games state handling */

// var positionCount;

//
// var getBestMove = function (game) {
//     if (game.game_over()) {
//         alert('Game over');
//     }
//
//     // positionCount = 0;
//     // var depth = parseInt($('#search-depth').find(':selected').text());
//     //
//     // var d = new Date().getTime();
//     var bestMove = calculateBestMove(game);
//     // var bestMove = minimaxRoot(depth, game, true);
//
//     // var d2 = new Date().getTime();
//     // var moveTime = (d2 - d);
//     // var positionsPerS = ( positionCount * 1000 / moveTime);
//     //
//     // $('#position-count').text(positionCount);
//     // $('#time').text(moveTime/1000 + 's');
//     // $('#positions-per-s').text(positionsPerS);
//     return bestMove;
// };

var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    var bestMove = randomMove(game);
    return bestMove;
};

var aiMove = function () {
    console.log('An AI is supposed to move, now.')
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    // renderMoveHistory(game.history());

    if (game.game_over()) {
        alert('Game over');
    }

    else if (!gameWithHuman) {
        window.setTimeout(aiMove, 250);
    }
};

// var renderMoveHistory = function (moves) {
//     var historyElement = $('#move-history').empty();
//     historyElement.empty();
//     for (var i = 0; i < moves.length; i = i + 2) {
//         historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
//     }
//     historyElement.scrollTop(historyElement[0].scrollHeight);
//
// };

var onDragStart = function (source, piece, position, orientation) {
    // This would allow to check what colour is moving... not needed?
    // var pieceOptions = piece.search(/^b/);
    if (game.in_checkmate() === true || game.in_draw() === true) {
        return false;
    }
};

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    // renderMoveHistory(game.history());
    if (gameWithAi) {
        window.setTimeout(aiMove, 250);
    }
};

var onSnapEnd = function () {
    console.log('Updating board.')
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .' + TILE_CLASS).css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = (squareEl.hasClass(BLACK_TILE_CLASS) === true)?
        HIGHLIGHTED_BLACK_TILE_COLOUR : HIGHLIGHTED_WHITE_TILE_COLOUR;

    squareEl.css('background', background);
};

var getGameConfig = function() {
    var typePlayer1 = $('#player-1').val();
    var typePlayer2 = $('#player-2').val();
    gameWithHuman = typePlayer1 == 'human' || typePlayer2 == 'human';
    gameWithAi = typePlayer1 != 'human' || typePlayer2 != 'human';
    var config = { dropOffBoard: 'trash' };

    if (gameWithHuman) {
        Object.assign(config, {
            draggable: true,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onMouseoutSquare: onMouseoutSquare,
            onMouseoverSquare: onMouseoverSquare,
            onSnapEnd: onSnapEnd
        });
    }

    return config;
};

var startGame = function() {
    game = new Chess();

    var config = getGameConfig();
    board = ChessBoard('board', config);
    board.start();

    if (!gameWithHuman) {
        window.setTimeout(aiMove, 250);
    }
};

var endGame = function() {
    if (board) board.clear();
    if (game) game.clear();
}

$('#start-button').on('click', startGame);
$('#clear-button').on('click', endGame);
