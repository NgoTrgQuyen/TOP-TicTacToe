
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function Player(name, marker) {
    this.name = name;
    this.marker = marker;
}

Player.prototype.makeMove = function(board, pos){
    if(board[pos] === ""){
        board[pos] = this.marker;
        return true;
    }
    return false;
}

function humanPlayer(name, marker) {
    this.marker = marker;
    this.name = name;
}

function AIPlayer(name, marker) {
    this.marker = marker;
    this.name = name;
}

Object.setPrototypeOf(humanPlayer.prototype, Player.prototype);
Object.setPrototypeOf(AIPlayer.prototype, Player.prototype);

const boardState = (() => { 
    let gameOver = false;

    let currentPLayer = "humanTurn";
    let movesDone = 0;
    const cellElements = Array.from(document.querySelectorAll('.cell'));
    let board = Array(9).fill("");

    const human = new humanPlayer("Human", "O");
    const AI = new AIPlayer("AI", "X");

    const humanMove = () => {
        let validMove = false;
        while (!validMove) {
            const input = prompt("Enter your move (0-8):");
            if (input === null) return false; // User cancelled
            const move = parseInt(input, 10);
            if (!isNaN(move) && move >= 0 && move <= 8 && board[move] === "") {
                human.makeMove(board, move);
                validMove = true;
            } else {
                console.log("Invalid slot or position already taken! Try again.");
            }
        }
        return true;
    };

    const handleCellClick = (cellElement, index) => {
        if(isNaN(index) || index < 0 || index > 8 || board[index] !== ""){
            console.log("Nope");
            return false;
        }

        human.makeMove(board, index);
        cellElements[index].textContent = human.marker;

        if (checkWin(board, human)) {
            console.log("You Win!");
            gameOver = true;
            return true;
        }

        if (checkDraw()) {
            console.log("Draw!");
            gameOver = true;
            return true;
        }

        AIMove();

        if (checkWin(board, AI)) {
            console.log("AI Wins!");
            gameOver = true;
            return true;
        }

        if (checkDraw()) {
            console.log("Draw!");
            gameOver = true;
            return true;
        }

        return true;
    };

    const AIMove = () => {
        const emptySlot = []
        board.forEach((cell, index) => {
            if(cell === ""){
                emptySlot.push(index);
            }
        });

        if(emptySlot.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * emptySlot.length);
        const chosenBoardIndex = emptySlot[randomIndex];

        AI.makeMove(board, chosenBoardIndex);
        if(cellElements[chosenBoardIndex]){
            cellElements[chosenBoardIndex].textContent = AI.marker;
        }
    }

    const switchTurn = () => {
        if(currentPLayer === "humanTurn"){ currentPLayer = "AITurn"; }
        else{ currentPLayer = "humanTurn"; }
    } 

    const checkWin = (board, player) => {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => board[index] === player.marker);
        })
    };

    const checkDraw = () => {
        return board.every(cell => cell !== "");
    };

    const drawBoard = () => {
        let row = "";
        for (let i = 0; i < 9; i++) {
            const displayChar = board[i] === "" ? i : board[i];
            row += ` ${displayChar} `;
            if ((i + 1) % 3 === 0) {
                console.log(row);
                if (i < 8) console.log("-----------");
                row = "";
            } else {
                row += "|";
            }
        }
        console.log("\n");
    };

    return {
        play: function() {
            board.fill("");
            cellElements.forEach(cell => {
                cell.textContent = "";
            });
            currentPLayer = "humanPlayer";
        },
        reset: function() {
            board.fill("");
            console.log("Board reset");
            drawBoard();
        },
        handleCellClick
    };
})();

const boardUI = document.querySelector("#board");

boardUI.addEventListener('click', (event) => {
    const clickedCell = event.target.closest('.cell');
    if(!clickedCell) return;

    const index = parseInt(clickedCell.getAttribute('data-index'), 10);

    boardState.handleCellClick(clickedCell, index);
});

const playBtn = document.querySelector("#play");

play.addEventListener('click', (event) => {
    boardState.play();
});