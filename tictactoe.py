EMPTY = None
X = 'X'
O = 'O'

def make_move(board, move:tuple):
    winner = check_winner(board)

    if winner is not None:
        return board
    if move is None:
        return board
    new_board = board.copy()
    row, col = move
    player = player_turn(board)
    if player is None:
        raise ValueError("Invalid player turn")
    new_board[row][col] = player
    return new_board

def is_empty(board):
    return all(cell == EMPTY for row in board for cell in row)

def check_winner(board):
    for i in range(3):
        if all(board[i][0] == board[i][j] != EMPTY for j in range(3)):
            return board[i][0]
        if all(board[0][i] == board[j][i] != EMPTY for j in range(3)):
            return board[0][i]
    if all(board[i][i] == board[0][0] != EMPTY for i in range(3)):
        return board[0][0]
    if all(board[i][2-i] == board[0][2] != EMPTY for i in range(3)):
        return board[0][2]
    return None

def check_draw(board):
    return all(board[i][j] != EMPTY for i in range(3) for j in range(3)) and check_winner(board) is None


def available_moves(board):
    return set((i, j) for i in range(3) for j in range(3) if board[i][j] == EMPTY)


def player_turn(board):
    count_X = sum(board[i][j] == X for i in range(3) for j in range(3))
    count_O = sum(board[i][j] == O for i in range(3) for j in range(3))
    if count_X == count_O:
        return X
    if count_X == count_O + 1:
        return O
    return None
