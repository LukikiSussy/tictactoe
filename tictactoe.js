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

const height = 5;
const width = 5;

const maxDepth = 6;

var round = 1;


const penaltyAdd = Math.round(Math.sqrt(height) * Math.sqrt(width)) / 2;

var board = [];
for (let i = 0; i < height * width; i++) {
    board[i] = " ";
}


for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
        let cell = document.createElement("td");
        cell.id = `${y * height + x}`;
        cell.classList.add("cell");
        cell.onclick = function () {
            placePiece(`${y * height + x}`)
        }
        row.appendChild(cell);
    }
    document.getElementById("gameContainer").appendChild(row);
}

game();

function game() {
    if (globalWinner) return;
    if (player1AI && turn == "X" || player2AI && turn == "O") {
        setTimeout(() => {
            placePieceAI();
            game();
        }, 100);
    }
}

function placePiece(index) {
    if (globalWinner || player1AI && turn == "X" || player2AI && turn == "O") return;
    if (board[index] == " ") {
        drawSimbol(turn, index);
        turn = turnObj[turn];
        round++;
        game();
    }
    else {
        console.log(index)
    }
}

function placePieceAI() {
    let aiBoard = [];
    for (let i = 0; i < height * width; i++) {
        aiBoard[i] = " ";
    }

    let then = new Date();
    let bestMove = minimax(aiBoard, turn, 0, -Infinity, Infinity);
    let now = new Date();
    console.log(now - then + "ms");

    drawSimbol(turn, bestMove.index);
    turn = turnObj[turn];
}

function minimax(aiBoard, turn, depth, alpha, beta) {

    var win = chceckForWin(aiBoard)
    var depthOffset = Math.floor((1 - (emptySquares(board) / (width * height))))
    if (depth == 0)
        console.log(depthOffset)
    if (win == "O") {
        return { score: width * height - depth };
    }

    else if (win == "X") {
        return { score: -(width * height) + depth };
    }

    else if (win == "T" || depth >= maxDepth + depthOffset) {
        return { score: 0 };
    }

    var moves = [];
    var penalty = 0;
    for (let i = 0; i < width; i++) {
        if (aiBoard[i] == " ") {

            var move = {};
            move.index = [i];
            aiBoard[i] = turn;
            round++;

            if (turn == "O") {  //maximizing
                var result = minimax(aiBoard, "X", depth + 1, alpha, beta);

                move.score = result.score;

                if (alpha > beta) {
                    break;
                }

                alpha = Math.max(result, alpha);

            }
            else {  //minimizing
                var result = minimax(aiBoard, "O", depth + 1, alpha, beta);

                move.score = result.score;

                if (beta < alpha) {
                    break;
                }

                beta = Math.min(result, beta);
            }

            aiBoard[i] = " ";
            round--;

            moves.push(move);
        }
    }

    var bestMove;
    if (turn == "O") {
        var bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                moves[bestMove].score += penalty;

            }
        }
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                moves[bestMove].score += penalty;
            }
        }
    }

    return moves[bestMove];
}

function drawSimbol(simbol, index) {
    if (globalWinner) return;

    if (board[index] == " ") {
        board[index] = simbol;
        cell = document.getElementById(`${index}`);
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
    if (round < 9) return false;
    var winner = false;


    for (let i = 0; i < boardTemp.length; i++) {

        //vertical

        // 4*width protoze 5 je na win -> zmenit kdyz je vice in row to win
        if (i + 4 * width < width * height && isEqual(boardTemp[i], boardTemp[i + width], boardTemp[i + 2 * width], boardTemp[i + 3 * width], boardTemp[i + 4 * width])) {
            winner = boardTemp[i];
        }

        console.log(boardTemp[i], boardTemp[i + width], boardTemp[i + 2 * width], boardTemp[i + 3 * width], boardTemp[i + 4 * width])

        //horizontal

        // - 5 protoze 5 je na win
        if (i % width <= width - 5 && isEqual(boardTemp[i], boardTemp[i + 1], boardTemp[i + 1], boardTemp[i + 3], boardTemp[i + 4])) {
            winner = boardTemp[i];
        }

        //diagonal
        if (isEqual(boardTemp[i], boardTemp[i + width + 1], boardTemp[i + (2 * width) + 2], boardTemp[i + (3 * width) + 3], boardTemp[i + (4 * width) + 4])) {
            winner = boardTemp[i];
        }

        if (isEqual(boardTemp[i + 4], boardTemp[i + width + 3], boardTemp[i + (2 * width) + 2], boardTemp[i + (3 * width) + 1], boardTemp[i + (4 * width)])) {
            winner = boardTemp[i + 4];
        }

    }

    //tie
    if (!winner && emptySquares(boardTemp) <= 0) {
        winner = "T";
    }

    //console.log(emptySquares(boardTemp), winner, boardTemp + "")

    return winner;
}

function isEqual(a, b, c, d, e) {
    if (a == b && b == c && c == d && d == e && a != " ") return true
}

function emptySquares(tempBoard) {
    var i = 0;
    tempBoard.forEach(cell => {
        if (cell == " ") i++;
    });
    return i;
}