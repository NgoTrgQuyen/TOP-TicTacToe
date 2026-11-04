const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];


function Player(name, score, marker) {
    this.name = name;
    this.score = score;
    this.marker = marker;

    this.makeMove = function(pos) {
        board[pos] = marker;
    }
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
    let currentPLayer = "humanTurn";
    let movesDone = 0;
    let board = Array(9).fill("");

    const human = new humanPlayer("Human", "O");
    const AI = new AIPlayer("AI", "X");

    const humanMove = () => {
        const move = prompt("Enter your move(0-8):");
        human.makeMove(move);
    }

    const AIMove = () => {
        const emptySlot = []
        board.forEach((cell, index) => {
            if(cell === ""){
                emptySlot.push(index);
            }
        });

        if(emptySlot.length === 0) return null;

        const randomIndex = Math.floor(Math.random * emptySlot.length);
        AI.makeMove(randomIndex);
    }

    const swtichTurn = () => {
        if(currentPLayer === "humanTurn"){ currentPLayer = "AITurn"; }
        else{ currentPLayer = "humanTurn"; }
    } 

    const checkWin = (board, player) => {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => board[index] === player.marker);
        })
    }

    const drawBoard = () => {
        for(let i = 0; i < 9; i++){
            if(board[i] === ""){
                console.log(i + " ");
            }
            if(board[i] === "X" || board[i] === "O"){
                console.log(board[i] + " ");
            }
            if(i+1 % 3 === 0){
                console.log("------------");
            }
        }
    }
})();

