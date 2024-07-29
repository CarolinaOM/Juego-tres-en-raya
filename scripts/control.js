var TicTacToe = /** @class */ (function () {
    function TicTacToe() {
        this.currentPlayer = null; // Allow null to indicate not yet set
        this.playerSymbol = null; // Start as null to enforce choice
        this.computerSymbol = null; // Start as null to enforce choice
        this.board = Array.from({ length: 3 }, function () { return Array(3).fill(null); });
        this.gameOver = false;
        this.init();
    }
    TicTacToe.prototype.init = function () {
        var _this = this;
        var buttons = document.querySelectorAll('#tablero button');
        buttons.forEach(function (button) {
            button.disabled = true; // Disable board initially
            button.addEventListener('click', function (e) { return _this.handleButtonClick(e); });
        });
        var resetButton = document.getElementById('reiniciar');
        if (resetButton) {
            resetButton.addEventListener('click', function () { return _this.resetGame(); });
        }
        var chooseXButton = document.getElementById('choose-x');
        var chooseOButton = document.getElementById('choose-o');
        var chooseTurnPlayerButton = document.getElementById('choose-turn-player');
        var chooseTurnComputerButton = document.getElementById('choose-turn-computer');
        if (chooseXButton && chooseOButton) {
            chooseXButton.addEventListener('click', function () { return _this.setPlayerSymbol('X'); });
            chooseOButton.addEventListener('click', function () { return _this.setPlayerSymbol('O'); });
        }
        if (chooseTurnPlayerButton && chooseTurnComputerButton) {
            chooseTurnPlayerButton.addEventListener('click', function () { return _this.setPlayerTurn('player'); });
            chooseTurnComputerButton.addEventListener('click', function () { return _this.setPlayerTurn('computer'); });
        }
    };
    TicTacToe.prototype.setPlayerSymbol = function (symbol) {
        this.playerSymbol = symbol;
        this.computerSymbol = symbol === 'X' ? 'O' : 'X';
        console.log("Player symbol set to: ".concat(this.playerSymbol));
        console.log("Computer symbol set to: ".concat(this.computerSymbol));
        this.checkReadyToPlay();
    };
    TicTacToe.prototype.setPlayerTurn = function (turn) {
        var _this = this;
        if (this.playerSymbol === null || this.computerSymbol === null) {
            // Ensure the symbol has been selected first
            console.warn("Please choose your symbol before selecting who goes first.");
            return;
        }
        this.currentPlayer = turn === 'player' ? this.playerSymbol : this.computerSymbol;
        if (turn === 'computer') {
            setTimeout(function () {
                _this.systemMove();
            }, 1000); // 1 second delay
        }
        this.checkReadyToPlay();
    };
    TicTacToe.prototype.checkReadyToPlay = function () {
        // Only enable the board if both the symbol and the turn have been selected
        if (this.playerSymbol !== null && this.currentPlayer !== null) {
            this.enableBoardAndResetButton();
            this.disableChoiceButtons();
        }
    };
    TicTacToe.prototype.enableBoardAndResetButton = function () {
        var buttons = document.querySelectorAll('#tablero button');
        buttons.forEach(function (button) { return button.disabled = false; });
        var resetButton = document.getElementById('reiniciar');
        if (resetButton)
            resetButton.disabled = false;
    };
    TicTacToe.prototype.disableChoiceButtons = function () {
        var chooseXButton = document.getElementById('choose-x');
        var chooseOButton = document.getElementById('choose-o');
        var chooseTurnPlayerButton = document.getElementById('choose-turn-player');
        var chooseTurnComputerButton = document.getElementById('choose-turn-computer');
        if (chooseXButton)
            chooseXButton.disabled = true;
        if (chooseOButton)
            chooseOButton.disabled = true;
        if (chooseTurnPlayerButton)
            chooseTurnPlayerButton.disabled = true;
        if (chooseTurnComputerButton)
            chooseTurnComputerButton.disabled = true;
    };
    TicTacToe.prototype.resetGame = function () {
        this.board = Array.from({ length: 3 }, function () { return Array(3).fill(null); });
        this.gameOver = false;
        var buttons = document.querySelectorAll('#tablero button');
        buttons.forEach(function (button) {
            button.textContent = '';
            button.style.backgroundColor = '';
            button.disabled = true; // Disable board on reset
        });
        var premioElement = document.getElementById('premio');
        if (premioElement) {
            premioElement.textContent = '';
            premioElement.style.display = 'none';
        }
        this.enableChoiceButtons();
        var resetButton = document.getElementById('reiniciar');
        if (resetButton)
            resetButton.disabled = true;
        this.playerSymbol = null; // Reset player symbol
        this.computerSymbol = null; // Reset computer symbol
        this.currentPlayer = null; // Reset current player
    };
    TicTacToe.prototype.enableChoiceButtons = function () {
        var chooseXButton = document.getElementById('choose-x');
        var chooseOButton = document.getElementById('choose-o');
        var chooseTurnPlayerButton = document.getElementById('choose-turn-player');
        var chooseTurnComputerButton = document.getElementById('choose-turn-computer');
        if (chooseXButton)
            chooseXButton.disabled = false;
        if (chooseOButton)
            chooseOButton.disabled = false;
        if (chooseTurnPlayerButton)
            chooseTurnPlayerButton.disabled = false;
        if (chooseTurnComputerButton)
            chooseTurnComputerButton.disabled = false;
    };
    TicTacToe.prototype.handleButtonClick = function (event) {
        var _this = this;
        if (this.gameOver || this.currentPlayer === null)
            return;
        var target = event.target;
        var x = parseInt(target.dataset.x, 10);
        var y = parseInt(target.dataset.y, 10);
        if (this.playMove(x, y)) {
            target.textContent = this.currentPlayer;
            if (this.checkWinner(x, y)) {
                this.endGame("\u00A1El jugador ".concat(this.currentPlayer, " ha ganado!"));
            }
            else if (this.isDraw()) {
                this.endGame('¡El juego ha terminado en empate!');
            }
            else {
                this.switchPlayer();
                setTimeout(function () {
                    _this.systemMove();
                }, 1000); // 1 second delay
            }
        }
    };
    TicTacToe.prototype.isDraw = function () {
        return this.board.flat().every(function (cell) { return cell !== null; });
    };
    TicTacToe.prototype.playMove = function (x, y) {
        if (this.board[x][y] === null && this.currentPlayer !== null) {
            this.board[x][y] = this.currentPlayer;
            return true;
        }
        return false;
    };
    TicTacToe.prototype.switchPlayer = function () {
        if (this.playerSymbol !== null && this.computerSymbol !== null) {
            this.currentPlayer = this.currentPlayer === this.playerSymbol ? this.computerSymbol : this.playerSymbol;
        }
    };
    TicTacToe.prototype.systemMove = function () {
        if (this.gameOver || this.computerSymbol === null)
            return;
        // Attempt to win or block
        if (this.tryToWinOrBlock(this.computerSymbol) || this.tryToWinOrBlock(this.playerSymbol)) {
            return;
        }
        // If no winning or blocking move, make a random move
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    this.board[i][j] = this.computerSymbol;
                    this.updateButton(i, j, this.computerSymbol);
                    this.switchPlayer();
                    return;
                }
            }
        }
    };
    TicTacToe.prototype.tryToWinOrBlock = function (player) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    this.board[i][j] = player;
                    if (this.checkWinner(i, j)) {
                        if (player === this.computerSymbol) {
                            this.updateButton(i, j, this.computerSymbol);
                            this.endGame('¡El sistema ha ganado!');
                        }
                        else {
                            this.board[i][j] = this.computerSymbol;
                            this.updateButton(i, j, this.computerSymbol);
                        }
                        this.switchPlayer();
                        return true;
                    }
                    this.board[i][j] = null; // Undo temporary move
                }
            }
        }
        return false;
    };
    TicTacToe.prototype.updateButton = function (x, y, player) {
        var button = document.querySelector("button[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
        if (button)
            button.textContent = player;
    };
    TicTacToe.prototype.endGame = function (message) {
        this.gameOver = true;
        var premioElement = document.getElementById('premio');
        if (premioElement) {
            premioElement.textContent = message;
            premioElement.style.display = 'block';
        }
        // Disable buttons after the game ends
        var buttons = document.querySelectorAll('#tablero button');
        buttons.forEach(function (button) { return button.disabled = true; });
    };
    TicTacToe.prototype.checkWinner = function (x, y) {
        var player = this.board[x][y];
        if (!player)
            return false;
        // Check row
        if (this.board[x][0] === player && this.board[x][1] === player && this.board[x][2] === player) {
            return true;
        }
        // Check column
        if (this.board[0][y] === player && this.board[1][y] === player && this.board[2][y] === player) {
            return true;
        }
        // Check main diagonal
        if (x === y && this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return true;
        }
        // Check secondary diagonal
        if (x + y === 2 && this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return true;
        }
        return false;
    };
    return TicTacToe;
}());
document.addEventListener('DOMContentLoaded', function () { new TicTacToe(); });
