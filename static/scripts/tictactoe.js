const EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#00000000"><path d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z"/></svg>';
const players = {
    'X': '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#222222"><path d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z"/></svg>',
    'O': '<svg xmlns="http://www.w3.org/2000/svg" height="80%" viewBox="0 -960 960 960" width="80%" fill="#222222"><path d="M480.14-55Q392-55 314.51-88.08q-77.48-33.09-135.41-91.02-57.93-57.93-91.02-135.27Q55-391.72 55-479.86 55-569 88.08-646.49q33.09-77.48 90.86-134.97 57.77-57.48 135.19-91.01Q391.56-906 479.78-906q89.22 0 166.83 33.45 77.6 33.46 135.01 90.81t90.89 134.87Q906-569.34 906-480q0 88.28-33.53 165.75t-91.01 135.28q-57.49 57.8-134.83 90.89Q569.28-55 480.14-55Zm-.14-94q138 0 234.5-96.37T811-480q0-138-96.5-234.5t-235-96.5q-137.5 0-234 96.5t-96.5 235q0 137.5 96.37 234T480-149Z"/></svg>'
};

let play_button = document.querySelector('.play');
play_button.onclick = () => {
    let game = new Game();
    play_button.innerHTML = 'Reset';
}


function forward_id(element, game=new Game()) {
    if (game.current_player === game.human_player) {
        move = element.id.split(',').map(Number);
        game.makeMove(move[0], move[1]);
        game.draw_board(game.board);
    }
    flash('AI is thinking.....');
    fetch('/playtictactoe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            board: game.board
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(response);
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        if (data.error) {
            play_button.innerHTML = 'Play';
            console.error(data.error);
        } else{
            game.board = data.board;
            game.draw_board(game.board);
            if (data.draw){
                flash("It's a draw!");
                play_button.innerHTML = 'Play';
            }else if (data.winner){
                let message = data.winner === game.human_player ? "You win!!!!!" : "AI wins!";
                flash(message);
                play_button.innerHTML = 'Play';
            }else{
                game.current_player = data.player;
                get_clicks(game);
                flash('Your turn!');
            }
        }
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function flash(message){
    const flashElement = document.querySelector('.guide');
    flashElement.innerHTML = message;
}

function stop_clicks(){
    document.querySelectorAll('.cell').forEach(element => {
        element.onclick = null;
    });
}

function get_clicks(game){
    document.querySelectorAll('.cell').forEach(element => {
        if( element.getAttribute('data-state') === 'EMPTY') {
            element.onclick = () =>{
                setTimeout(()=>{
                    stop_clicks();
                    forward_id(element, game);
                }, 3)
            }
        }
        
    });
}


class Game{
    constructor() {
        this.board = [
            [null, null, null], 
            [null, null, null], 
            [null, null, null]];
        this.current_player = 'X';
        this.choose_player();
        this.draw_board(this.board);
        if(this.ai === this.current_player){
            flash('AI is thinking.....')
            stop_clicks();
            forward_id(null, this);
        }
        else{
            flash('Your turn!');
            get_clicks(this);
        }
    }

    choose_player(){
        this.human_player = Math.round(Math.random()) === 1 ? 'X' : 'O';
        this.ai = this.human_player === 'X'? 'O' : 'X';
    }

    makeMove(row, col) {
        if (this.board[row][col] === null) {
            this.board[row][col] = this.current_player;
            this.switch_player();
            return true;
        }
        return false;
    }
    
    switch_player() {
        this.current_player = this.current_player === 'X' ? 'O' : 'X';
    }

    draw_board(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.getElementById(`${i},${j}`);
                cell.innerHTML = players[board[i][j]] || EMPTY;
                cell.setAttribute('data-state', board[i][j] || 'EMPTY');
            }
        }
    }
}