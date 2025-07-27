from flask import Flask, render_template, request, jsonify
import tictactoe as ttt
from tttai import AI
# from WebDev.ai.digits import predict_digit

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


@app.route("/nim")
def nim():
    return render_template("nim.html")


@app.route("/minesweeper")
def minesweeper():
    return render_template("minesweeper.html")


# @app.route("/digits")
# def digits():
#     return render_template("number_ai.html")


# @app.route("/predict", methods=["POST"])
# def get_prediction():
#     data = request.get_json()
#     if not data or "pixels" not in data:
#         return jsonify({"error": "No image provided"}), 400

#     image_data = data["pixels"]
#     try:
#         prediction = predict_digit(image_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     return jsonify({"prediction": prediction}), 200