// https://cdn-icons-png.flaticon.com/512/75/75519.png
// https://cdn-icons-png.flaticon.com/512/105/105152.png

const player1AI = false; // x
const player2AI = false; // O

var turn = "X";
var globalWinner = false;

const turnObj = {
    X: "O",
    O: "X"
}

const height = 10;
const width = 10;

var board = [];
for (let x = 0; x < width; x++) {
    board[x] = [];
    for (let y = 0; y < height; y++) {
        board[x][y] = " ";
    }
}


for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
        let cell = document.createElement("td");
        cell.id = `${x}-${y}`;
        cell.classList.add("cell");
        cell.onclick = function() {
            placePiece(`${x}-${y}`)
        }
        row.appendChild(cell);
    }
    document.getElementById("gameContainer").appendChild(row);
}

game();

function game() {
    if (globalWinner) return;
    if(player1AI && turn == "X" || player2AI && turn == "O") {
        setTimeout(() => {
            placePieceAI();
            game();
        }, 100);
    }
}

function placePiece(index) {
    console.log(index)
    if (globalWinner || player1AI && turn == "X" || player2AI && turn == "O") return;
    var x = index[0];
    var y = index[2];
    if (board[x][y] == " ") {
        drawSimbol(turn, [x, y]);
        turn = turnObj[turn];
        game();
    }
    else {
        console.log(x, y)
    }
}

function placePieceAI() {
    let aiBoard = [];
    for (let x = 0; x < width; x++) {
        aiBoard[x] = [];
        for (let y = 0; y < height; y++) {
            aiBoard[x].push(board[x][y]);
        }
    }

    var maxTurnValue = -Infinity;

    let bestMove = minimax2(aiBoard, turn);

    console.log(bestMove)
    drawSimbol(turn, bestMove.index);
    turn = turnObj[turn];
}

function minimax1(aiBoard, turn) {

    var move = {};
    

    var win = chceckForWin(aiBoard)

    if (win == "O") {
        move.score = 10;
    }

    else if (win == "X") {
        move.score = -10;
    }

    else if (win == "T" || emptySquares(aiBoard) < 0) {
        move.score = 0;
    }

    //console.log(`${aiBoard}`)
    //console.log(win)
    for (let x2 = 0; x2 < width; x2++) {
        for (let y2 = 0; y2 < height; y2++) {
            if (aiBoard[x2][y2] == " ") {

                aiBoard[x2][y2] = turn;

                if (turn == "O") {
                    var tempScore = minimax1(aiBoard, "X").score;
                    if (tempScore < move.score || !move.score) {
                        move.score = tempScore;
                        move.index = [x2, y2];
                    }
                }
                else if (turn == "X") {
                    var tempScore = minimax1(aiBoard, "O").score;
                    if (tempScore > move.score || !move.score) {
                        move.score = tempScore;
                        move.index = [x2, y2];
                    }
                }

                aiBoard[x2][y2] = " ";
            }
        }
    }


    return move;
}

function minimax2(aiBoard, turn) {

    var win = chceckForWin(aiBoard)

    if (win == "O") {
        return { score: 10 };
    }

    else if (win == "X") {
        return { score: -10 };
    }

    else if (win == "T" || emptySquares(aiBoard) < 0) {
        return { score: 0 };
    }

    var moves = [];
    for (let x2 = 0; x2 < width; x2++) {
        for (let y2 = 0; y2 < height; y2++) {
            if (aiBoard[x2][y2] == " ") {

                var move = {};
                move.index = [x2, y2];
                aiBoard[x2][y2] = turn;

                if (turn == "O") {
                    var result = minimax2(aiBoard, "X");
                    move.score = result.score;
                } else {
                    var result = minimax2(aiBoard, "O");
                    move.score = result.score;
                }

                aiBoard[x2][y2] = " ";

                moves.push(move);
            }
        }
    }

    var bestMove;
    if (turn === "O") {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function drawSimbol(simbol, pos) {
    if (globalWinner) return;

    var x = pos[0];
    var y = pos[1];

    if (board[x][y] == " ") {
        board[x][y] = simbol;
        cell = document.getElementById(`${x}-${y}`);
        console.log(`${x}-${y}`)
        if (simbol == 'X') {
            cell.style.backgroundImage = "url(https://cdn-icons-png.flaticon.com/512/75/75519.png)";
        }
        else {
            cell.style.backgroundImage = "url(https://cdn-icons-png.flaticon.com/512/105/105152.png)";
        }
        globalWinner = chceckForWin(board);
        if (globalWinner) {
            document.getElementById("text").innerHTML = `The winner is: ${globalWinner}`;
        }
    }
}

function chceckForWin(boardTemp) {
    var winner = false;

    //vertical
    for (let x = 0; x < width-3; x++) {
        for (let y = 0; y < height-3; y++) {
            if (isEqual(boardTemp[x][y], boardTemp[x][y+1], boardTemp[x][y+2], boardTemp[x][y+3])) {
                winner = boardTemp[x][y];
            }
        }
    }

    //tie
    if (winner == false && emptySquares(boardTemp) <= 0) {
        winner = "T";
    }

    //console.log(emptySquares(boardTemp), winner, boardTemp + "")

    return winner
}

function isEqual(a, b, c, d) {
    if (a == b && b == c && c == d && a != " ") return true
}

function emptySquares(tempBoard) {
    var i = 0;
    tempBoard.forEach(line => {
        line.forEach(sq => {
            if (sq == " ") i++;
        });
    });
    return i;
}