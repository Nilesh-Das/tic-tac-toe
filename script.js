// board and pieces
var b = jsboard.board({ attach: "game", size: "3x3" });
var x = jsboard.piece({ text: "X", fontSize: "40px", textAlign: "center" });
var o = jsboard.piece({ text: "O", fontSize: "40px", textAlign: "center" });

let ai = "X";
let human = "O";
let currentPlayer = "X";
let gameEnded = false;

function board_clear() {
	b.cell("each").rid();
	document.getElementById('results').innerHTML='';
	gameEnded = false;
}

function check_line(p, q, r) {
	return p==q && q==r && p!=null;
}

function check_results() {
	var board = [];
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 3; j++) {
			board.push([i, j]);
		}
	}

	let winPositions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	let winner = null;

	for(let i = 0; i < winPositions.length; i++) {
		let p = b.cell(board[winPositions[i][0]]).get();
		let q = b.cell(board[winPositions[i][1]]).get();
		let r = b.cell(board[winPositions[i][2]]).get();
		if(check_line(p, q, r)) {
			winner = p; break;
		}
	}

	let openSpots = 0;
	for(let i = 0; i < 3; i++) {
		for(let j = 0; j < 3; j++) {
			if(b.cell([i,j]).get()==null) openSpots++;
		}
	}

	if(winner==null && openSpots==0) return 'tie';

  return winner;
}

function check_button() {
	if(!gameEnded)
		text = 'Game is running..';
	document.getElementById('results').innerHTML=text;
}

let scores = {
	X: 10,
	O: -10,
	tie: 0
}

function minimax(depth, isMaximizing) {
	let result = check_results();
	if(result !== null) return scores[result];

	let bestScore;
	if(isMaximizing) {
		bestScore = -Infinity;
		for(let i = 0; i < 3; i++) {
			for(let j = 0; j < 3; j++) {
				if(b.cell([i,j]).get()===null) {
					b.cell([i,j]).place(x.clone());
					let score = minimax(depth+1, false);
					b.cell([i,j]).rid();
					if(bestScore < score) bestScore = score;
				}
			}
		}
	} else {
		bestScore = Infinity;
		for(let i = 0; i < 3; i++) {
			for(let j = 0; j < 3; j++) {
				if(b.cell([i,j]).get()===null) {
					b.cell([i,j]).place(o.clone());
					let score = minimax(depth+1, true);
					b.cell([i,j]).rid();
					if(bestScore > score) bestScore = score;
				}
			}
		}
	}
	return bestScore;
}

function ai_move() {
	let bestScore = -Infinity;
	let move;
	for(let i = 0; i < 3; i++) {
		for(let j = 0; j < 3; j++) {
			if(b.cell([i,j]).get()===null) {
				b.cell([i,j]).place(x.clone());
				let score = minimax(0, false);
				b.cell([i,j]).rid();

				if(score > bestScore) {
					bestScore = score;
					move = [i,j];
				}
			}
		}
	}
	b.cell(move).place(x.clone());
	currentPlayer = human;
}

function human_move() {
	b.cell("each").on("click", function() {
		if (gameEnded) return;
	  if (b.cell(this).get()===null) {
    	b.cell(this).place(o.clone());
    	currentPlayer = ai;
    	// human will never win :(
    	let result;
    	result = check_results();
    	if(result !== null) {
    		gameEnded = true;
    		if(result == 'tie') {
    			text = 'Game is tied!';
    		} else {
    			text = result + ' wins!';
    		}
    		document.getElementById('results').innerHTML=text;
  			return;
    	}
    	ai_move();
    	result = check_results();
    	if(result !== null) {
    		gameEnded = true;
    		if(result == 'tie') {
    			text = 'Game is tied!';
    		} else {
    			text = result + ' wins!';
    		}
    		document.getElementById('results').innerHTML=text;
  			return;
    	}
		}
	});
}

human_move();
