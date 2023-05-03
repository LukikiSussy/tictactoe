// https://cdn-icons-png.flaticon.com/512/75/75519.png
        // https://cdn-icons-png.flaticon.com/512/105/105152.png

        const player1AI = false; // X
        const player2AI = false; // O

        var turn = "X";
        var winner = null;

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
            if (winner != null) return;
            var x = index[0];
            var y = index[2];

            if (board[x][y] == " ") {
                board[x][y] = turn;
                drawSimbol(turn, x, y);
                avalable --;
                chceckForWin();
                turn = turnObj[turn];
            }
        }

        function drawSimbol(simbol, x, y) {
            cell = document.getElementById(`${x}-${y}`);
            if (simbol == 'X') {
                cell.style.backgroundImage="url(https://cdn-icons-png.flaticon.com/512/75/75519.png)";
            }
            else {
                cell.style.backgroundImage="url(https://cdn-icons-png.flaticon.com/512/105/105152.png)";
            }
        }

        function chceckForWin() {
                        
            //vertical
            for (let i = 0; i < 3; i++) {
                if(isEqual(board[i][0], board[i][1], board[i][2])) {
                    winner = board[i][0];
                }
            }

            //horizontal
            for (let i = 0; i < 3; i++) {
                if(isEqual(board[0][i], board[1][i], board[2][i])) {
                    winner = board[0][i];
                }
            }

            //diagonal
            if (isEqual(board[0][0], board[1][1], board[2][2])) {
                    winner = board[0][0];
            }

            if (isEqual(board[2][0], board[1][1], board[0][2])) {
                    winner = board[0][0];
            }

            //tie
            if (winner == null && avalable == 0) {
                winner = "tie";
            }

            if (winner != null) {
                document.getElementById("text").innerHTML = `The winner is: ${winner}`;
            }
        }

        function isEqual(a, b, c) {
            if (a == b && b == c && a != " ") return true
        }