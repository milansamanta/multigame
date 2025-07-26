from flask import Flask, render_template, request, jsonify
import tictactoe as ttt
from tttai import AI
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tictactoe")
def tictactoe():
    return render_template("tictactoe.html")


@app.route("/playtictactoe", methods=["POST"])
def play_tictactoe():
    data = request.get_json()
    _AI = AI()
    try:
        move = _AI.best_move(data.get("board"))
        new_board = ttt.make_move(data.get("board"), move)
        new_player = ttt.player_turn(new_board)
        draw = ttt.check_draw(new_board)
        winner = ttt.check_winner(new_board)
        print(winner)
    except ValueError:
        return jsonify({"error": "Invalid move format"}), 400
    return jsonify({
        "board": new_board,
        "draw": draw,
        "player": new_player,
        "winner": winner,
    }), 200