// https://cdn-icons-png.flaticon.com/512/75/75519.png
// https://cdn-icons-png.flaticon.com/512/105/105152.png

const player2AI = true; // O

var turn = "X";
var globalWinner = false;

const turnObj = {
    X: "O",
    O: "X"
}

var board = [];

var avalable = 9;

for (let x = 0; x < 3; x++) {
    board[x] = [];
    for (let y = 0; y < 3; y++) {
        board[x][y] = " ";
    }
}

function placePiece(index) {
    if (globalWinner) return;
    var x = index[0];
    var y = index[2];
    if (board[x][y] == " ") {
        drawSimbol(turn, x, y);
        if (!player2AI) turn = turnObj[turn];

        if (player2AI && !globalWinner) {
            placePieceAI();
        }
    }
    else {
        console.log(board[x][y])
    }
}

function placePieceAI() {
    let aiBoard = [];
    for (let x = 0; x < 3; x++) {
        aiBoard[x] = [];
        for (let y = 0; y < 3; y++) {
            aiBoard[x].push(board[x][y]);
        }
    }


    var maxTurnValue = -Infinity;
    bestMove = [];

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (board[x][y] == " ") {
                let turnVal = minimax(aiBoard, "O", 0, x, y);
                console.log(turnVal, x, y)
                if (turnVal >= maxTurnValue) {
                    var maxTurnValue = turnVal;
                    bestMove = [x, y];
                }
            }
        }
    }
    drawSimbol("O", bestMove[0], bestMove[1]);
}

function minimax(aiBoard, turn, depth, x, y) {
    if (depth > 5) return 0;
    //if (depth == 2 || depth == 3) console.log(turn);

    if (turn == "O") {
        var maxTurnValue = -Infinity;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (aiBoard[x][y] == " ") {
                    aiBoard[x][y] = "O";
                    //if (depth == 1 || depth == 2) console.log(`${aiBoard}`);
                    if (!chceckForWin(aiBoard) == "T") {
                        aiBoard[x][y] = " ";
                        return 0 + depth
                    }
                    if (chceckForWin(aiBoard) == "O") {
                        aiBoard[x][y] = " ";
                        return 20 - depth
                    }
                    let turnVal = minimax(aiBoard, "X", depth + 1, x, y);
                    if (turnVal >= maxTurnValue) {
                        maxTurnValue = turnVal;
                    }
                    aiBoard[x][y] = " ";
                }
            }
        }
    }
    else {
        var maxTurnValue = Infinity;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (aiBoard[x][y] == " ") {
                    aiBoard[x][y] = "X";
                    //if (depth == 1 || depth == 2) console.log(`${aiBoard}`);
                    if (!chceckForWin(aiBoard) == "T") {
                        aiBoard[x][y] = " ";
                        return 0 - depth
                    }
                    if (chceckForWin(aiBoard) == "X") {
                        aiBoard[x][y] = " ";
                        return -20 + depth
                    }
                    let turnVal = minimax(aiBoard, "O", depth + 1, x, y);
                    if (turnVal <= maxTurnValue) {
                        maxTurnValue = turnVal;
                    }
                    aiBoard[x][y] = " ";
                }
            }
        }
    }

    return maxTurnValue;
}

function drawSimbol(simbol, x, y) {
    if (board[x][y] == " ") {
        board[x][y] = simbol;
        avalable--;
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
    var winner = null;

    //vertical
    for (let i = 0; i < 3; i++) {
        if (isEqual(boardTemp[i][0], boardTemp[i][1], boardTemp[i][2])) {
            winner = boardTemp[i][0];
        }
    }

    //horizontal
    for (let i = 0; i < 3; i++) {
        if (isEqual(boardTemp[0][i], boardTemp[1][i], boardTemp[2][i])) {
            winner = boardTemp[0][i];
        }
    }

    //diagonal
    if (isEqual(boardTemp[0][0], boardTemp[1][1], boardTemp[2][2])) {
        winner = boardTemp[0][0];
    }

    if (isEqual(boardTemp[2][0], boardTemp[1][1], boardTemp[0][2])) {
        winner = boardTemp[2][0];
    }

    //tie
    if (winner == null && avalable == 0) {
        winner = "T";
    }

    if (winner != null) {
        return winner
    }

    return false;
}

function isEqual(a, b, c) {
    if (a == b && b == c && a != " ") return true
}