import tictactoe as ttt
import random
import copy



class AI:

    def best_move(self, board):
        moves = ttt.available_moves(board)
        if not moves:
            return None
        if ttt.is_empty(board):
            return random.choice(list(moves))
        all_moves = []
        player = ttt.player_turn(board)
        if player == ttt.X:
            for move in moves:
                new_board = copy.deepcopy(board)
                new_board[move[0]][move[1]] = player
                score = self.mini(new_board)
                all_moves.append((move, score))
            all_moves.sort(key=lambda x: x[1], reverse=True)
        elif player == ttt.O:
            for move in moves:
                new_board = copy.deepcopy(board)
                new_board[move[0]][move[1]] = player
                score = self.maxi(new_board)
                all_moves.append((move, score))
            all_moves.sort(key=lambda x: x[1])
        best_moves = [move for move, score in all_moves if score == all_moves[0][1]]
        print(f"Best moves: {all_moves}")
        return random.choice(best_moves) if best_moves else None

    def mini(self, board):
        winner = ttt.check_winner(board)
        moves = ttt.available_moves(board)
        if winner == ttt.X:
            return 1
        elif winner == ttt.O:
            return -1
        elif not moves:
            return 0
        scores = []
        for move in moves:
            new_board = copy.deepcopy(board)
            new_board = ttt.make_move(new_board, move)
            scores.append(self.maxi(new_board))
        return min(scores)
    
    def maxi(self, board):
        winner = ttt.check_winner(board)
        moves = ttt.available_moves(board)
        if winner == ttt.X:
            return 1
        elif winner == ttt.O:
            return -1
        elif not moves:
            return 0
        scores = []
        for move in moves:
            new_board = copy.deepcopy(board)
            new_board = ttt.make_move(new_board, move)
            scores.append(self.mini(new_board))
        return max(scores)