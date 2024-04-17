// https://cdn-icons-png.flaticon.com/512/75/75519.png
// https://cdn-icons-png.flaticon.com/512/105/105152.png

const player1AI = false; // x
const player2AI = true; // O

var turn = "X";
var globalWinner = false;

const turnObj = {
    X: "O",
    O: "X"
}

const height = 7;
const width = 7;

const maxDepth = 4;


const penaltyAdd = Math.round(Math.sqrt(height) * Math.sqrt(width)) / 2;

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
        cell.onclick = function () {
            placePiece(`${x}-${y}`)
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

    let bestMove = minimax(aiBoard, turn, 0);

    drawSimbol(turn, bestMove.index);
    turn = turnObj[turn];
}

function minimax(aiBoard, turn, depth) {

    var win = chceckForWin(aiBoard)
    var depthOffset = Math.floor((1-(emptySquares(board)/(width*height))))
    if (depth == 0) 
        console.log(depthOffset)
    if (win == "O") {
        return { score: width * height-depth };
    }

    else if (win == "X") {
        return { score: -(width * height)+depth };
    }

    else if (win == "T" || depth >= maxDepth + depthOffset) {
        return { score: 0 };
    }

    var moves = [];
    var penalty = 0;
    for (let x2 = 0; x2 < width; x2++) {
        for (let y2 = 0; y2 < height; y2++) {
            if (aiBoard[x2][y2] == " ") {

                var move = {};
                move.index = [x2, y2];
                aiBoard[x2][y2] = turn;

                if (turn == "O") {
                    var result = minimax(aiBoard, "X", depth + 1);
                    move.score = result.score;
                    /*if (move.score > 0) {
                        penalty += penaltyAdd;
                    }*/
                } else {
                    var result = minimax(aiBoard, "O", depth + 1);
                    move.score = result.score;
                    /*if (move.score < 0) {
                        penalty += penaltyAdd;
                    }*/
                }

                aiBoard[x2][y2] = " ";

                moves.push(move);
            }
        }
    }

    if (depth == 0) {
        for (let i = 0; i < moves.length; i++) {
            if (board[moves[i].index[0]][moves[i].index[1]] == " ")
                document.getElementById(`${moves[i].index[0]}-${moves[i].index[1]}`).innerHTML = moves[i].score;
        }
    }
    
    var bestMove;
    if (turn == "O") {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                moves[bestMove].score += penalty;

            }
        }
    } else {
        var bestScore = 10000;
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

function drawSimbol(simbol, pos) {
    if (globalWinner) return;

    var x = pos[0];
    var y = pos[1];

    if (board[x][y] == " ") {
        board[x][y] = simbol;
        cell = document.getElementById(`${x}-${y}`);
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
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height - 4; y++) {
            if (isEqual(boardTemp[x][y], boardTemp[x][y + 1], boardTemp[x][y + 2], boardTemp[x][y + 3], boardTemp[x][y + 4])) {
                winner = boardTemp[x][y];
            }

            if (isEqual(boardTemp[y][x], boardTemp[y + 1][x], boardTemp[y + 2][x], boardTemp[y + 3][x], boardTemp[y + 4][x])) {
                winner = boardTemp[y][x];
            }
        }
    }

    //diagonal
    for (let x = 0; x < width - 4; x++) {
        for (let y = 0; y < height - 4; y++) {
            if (isEqual(boardTemp[x][y], boardTemp[x + 1][y + 1], boardTemp[x + 2][y + 2], boardTemp[x + 3][y + 3], boardTemp[x + 4][y + 4])) {
                winner = boardTemp[x][y];
            }

            if (isEqual(boardTemp[x][y + 4], boardTemp[x + 1][y + 3], boardTemp[x + 2][y + 2], boardTemp[x + 3][y+1], boardTemp[x + 4][y])) {
                winner = boardTemp[x][y + 4];
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

function isEqual(a, b, c, d, e) {
    if (a == b && b == c && c == d && d == e && a != " ") return true
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