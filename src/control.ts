type Player = 'X' | 'O';
type Board = (Player | null)[][];

class TicTacToe {
    private board: Board;
    private currentPlayer: Player | null = null; // Allow null to indicate not yet set
    private playerSymbol: Player | null = null; // Start as null to enforce choice
    private computerSymbol: Player | null = null; // Start as null to enforce choice
    private gameOver: boolean;

    constructor() {
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.gameOver = false;
        this.init();
    }

    private init(): void {
        const buttons = document.querySelectorAll<HTMLButtonElement>('#tablero button');
        buttons.forEach(button => {
            button.disabled = true; // Disable board initially
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });

        const resetButton = document.getElementById('reiniciar') as HTMLButtonElement;
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetGame());
        }

        const chooseXButton = document.getElementById('choose-x') as HTMLButtonElement;
        const chooseOButton = document.getElementById('choose-o') as HTMLButtonElement;
        const chooseTurnPlayerButton = document.getElementById('choose-turn-player') as HTMLButtonElement;
        const chooseTurnComputerButton = document.getElementById('choose-turn-computer') as HTMLButtonElement;

        if (chooseXButton && chooseOButton) {
            chooseXButton.addEventListener('click', () => this.setPlayerSymbol('X'));
            chooseOButton.addEventListener('click', () => this.setPlayerSymbol('O'));
        }

        if (chooseTurnPlayerButton && chooseTurnComputerButton) {
            chooseTurnPlayerButton.addEventListener('click', () => this.setPlayerTurn('player'));
            chooseTurnComputerButton.addEventListener('click', () => this.setPlayerTurn('computer'));
        }
    }

    private setPlayerSymbol(symbol: Player): void {
        this.playerSymbol = symbol;
        this.computerSymbol = symbol === 'X' ? 'O' : 'X';

        console.log(`Player symbol set to: ${this.playerSymbol}`);
        console.log(`Computer symbol set to: ${this.computerSymbol}`);

        this.checkReadyToPlay();
    }

    private setPlayerTurn(turn: 'player' | 'computer'): void {
        if (this.playerSymbol === null || this.computerSymbol === null) {
            // Ensure the symbol has been selected first
            console.warn("Please choose your symbol before selecting who goes first.");
            return;
        }

        this.currentPlayer = turn === 'player' ? this.playerSymbol : this.computerSymbol;

        if (turn === 'computer') {
            setTimeout(() => {
                this.systemMove();
            }, 1000); // 1 second delay
        }

        this.checkReadyToPlay();
    }

    private checkReadyToPlay(): void {
        // Only enable the board if both the symbol and the turn have been selected
        if (this.playerSymbol !== null && this.currentPlayer !== null) {
            this.enableBoardAndResetButton();
            this.disableChoiceButtons();
        }
    }

    private enableBoardAndResetButton(): void {
        const buttons = document.querySelectorAll<HTMLButtonElement>('#tablero button');
        buttons.forEach(button => button.disabled = false);

        const resetButton = document.getElementById('reiniciar') as HTMLButtonElement;
        if (resetButton) resetButton.disabled = false;
    }

    private disableChoiceButtons(): void {
        const chooseXButton = document.getElementById('choose-x') as HTMLButtonElement;
        const chooseOButton = document.getElementById('choose-o') as HTMLButtonElement;
        const chooseTurnPlayerButton = document.getElementById('choose-turn-player') as HTMLButtonElement;
        const chooseTurnComputerButton = document.getElementById('choose-turn-computer') as HTMLButtonElement;

        if (chooseXButton) chooseXButton.disabled = true;
        if (chooseOButton) chooseOButton.disabled = true;
        if (chooseTurnPlayerButton) chooseTurnPlayerButton.disabled = true;
        if (chooseTurnComputerButton) chooseTurnComputerButton.disabled = true;
    }

    private resetGame(): void {
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.gameOver = false;
        
        const buttons = document.querySelectorAll<HTMLButtonElement>('#tablero button');
        buttons.forEach(button => {
            button.textContent = '';
            button.style.backgroundColor = '';
            button.disabled = true; // Disable board on reset
        });

        const premioElement = document.getElementById('premio') as HTMLElement;
        if (premioElement) {
            premioElement.textContent = '';
            premioElement.style.display = 'none';
        }

        this.enableChoiceButtons();

        const resetButton = document.getElementById('reiniciar') as HTMLButtonElement;
        if (resetButton) resetButton.disabled = true;

        this.playerSymbol = null; // Reset player symbol
        this.computerSymbol = null; // Reset computer symbol
        this.currentPlayer = null; // Reset current player
    }

    private enableChoiceButtons(): void {
        const chooseXButton = document.getElementById('choose-x') as HTMLButtonElement;
        const chooseOButton = document.getElementById('choose-o') as HTMLButtonElement;
        const chooseTurnPlayerButton = document.getElementById('choose-turn-player') as HTMLButtonElement;
        const chooseTurnComputerButton = document.getElementById('choose-turn-computer') as HTMLButtonElement;

        if (chooseXButton) chooseXButton.disabled = false;
        if (chooseOButton) chooseOButton.disabled = false;
        if (chooseTurnPlayerButton) chooseTurnPlayerButton.disabled = false;
        if (chooseTurnComputerButton) chooseTurnComputerButton.disabled = false;
    }

    private handleButtonClick(event: MouseEvent): void {
        if (this.gameOver || this.currentPlayer === null) return;

        const target = event.target as HTMLButtonElement;
        const x = parseInt(target.dataset.x!, 10);
        const y = parseInt(target.dataset.y!, 10);

        if (this.playMove(x, y)) {
            target.textContent = this.currentPlayer;
            if (this.checkWinner(x, y)) {
                this.endGame(`¡El jugador ${this.currentPlayer} ha ganado!`);
            } else if (this.isDraw()) {
                this.endGame('¡El juego ha terminado en empate!');
            } else {
                this.switchPlayer();
                setTimeout(() => {
                    this.systemMove(); 
                }, 1000); // 1 second delay
            }
        }
    }

    private isDraw(): boolean {
        return this.board.flat().every(cell => cell !== null);
    }

    private playMove(x: number, y: number): boolean {
        if (this.board[x][y] === null && this.currentPlayer !== null) {
            this.board[x][y] = this.currentPlayer;
            return true;
        }
        return false;
    }

    private switchPlayer(): void {
        if (this.playerSymbol !== null && this.computerSymbol !== null) {
            this.currentPlayer = this.currentPlayer === this.playerSymbol ? this.computerSymbol : this.playerSymbol;
        }
    }

    private systemMove(): void {
        if (this.gameOver || this.computerSymbol === null) return;
        
        // Attempt to win or block
        if (this.tryToWinOrBlock(this.computerSymbol) || this.tryToWinOrBlock(this.playerSymbol!)) {
            return;
        }

        // If no winning or blocking move, make a random move
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    this.board[i][j] = this.computerSymbol;
                    this.updateButton(i, j, this.computerSymbol);
                    this.switchPlayer();
                    return;
                }
            }
        }
    }

    private tryToWinOrBlock(player: Player): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    this.board[i][j] = player;
                    if (this.checkWinner(i, j)) {
                        if (player === this.computerSymbol) {
                            this.updateButton(i, j, this.computerSymbol);
                            this.endGame('¡El sistema ha ganado!');
                        } else {
                            this.board[i][j] = this.computerSymbol!;
                            this.updateButton(i, j, this.computerSymbol!);
                        }
                        this.switchPlayer();
                        return true;
                    }
                    this.board[i][j] = null; // Undo temporary move
                }
            }
        }
        return false;
    }

    private updateButton(x: number, y: number, player: Player): void {
        const button = document.querySelector<HTMLButtonElement>(`button[data-x="${x}"][data-y="${y}"]`);
        if (button) button.textContent = player;
    }

    private endGame(message: string): void {
        this.gameOver = true; 
        const premioElement = document.getElementById('premio') as HTMLElement;
        if (premioElement) {
            premioElement.textContent = message;
            premioElement.style.display = 'block';
        }

        // Disable buttons after the game ends
        const buttons = document.querySelectorAll<HTMLButtonElement>('#tablero button');
        buttons.forEach(button => button.disabled = true);
    }

    private checkWinner(x: number, y: number): boolean {
        const player = this.board[x][y];
        if (!player) return false;

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
    }
}

document.addEventListener('DOMContentLoaded', () => { new TicTacToe(); });