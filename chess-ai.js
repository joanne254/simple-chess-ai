
var randomMove = function (game) {
    //generate all the moves for a given position
    var newGameMoves = game.ugly_moves();
    console.log('There were', newGameMoves.length, 'ugly moves available.')
    var newMovesByPiece = {}
    newGameMoves.forEach(function (move) {
        var key = move.piece + ' in ' + move.from

        if (! newMovesByPiece[key])
            newMovesByPiece[key] = []

        newMovesByPiece[key] += '-> ' + move.to + '(' + move.flags + ')'

        // console.log(move)
    })
    console.log(newMovesByPiece)
    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
};
