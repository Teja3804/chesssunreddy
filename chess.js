class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.selectedSquare = null;
        this.validMoves = [];
        this.inCheck = false;
        this.checkmate = false;
        this.stalemate = false;
        this.timeControl = 10; // minutes
        this.increment = 0; // seconds
        this.whiteTime = 10 * 60; // seconds
        this.blackTime = 10 * 60; // seconds
        this.timer = null;
        this.gameStartTime = null;
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Initialize pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
            board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
        }

        // Initialize other pieces
        const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: pieces[i], color: 'black', hasMoved: false };
            board[7][i] = { type: pieces[i], color: 'white', hasMoved: false };
        }

        return board;
    }

    getSquareNotation(row, col) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        return files[col] + ranks[row];
    }

    getSquareFromNotation(notation) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        const col = files.indexOf(notation[0]);
        const row = ranks.indexOf(notation[1]);
        return { row, col };
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece || piece.color !== this.currentPlayer) return false;

        const validMoves = this.getValidMoves(fromRow, fromCol);
        return validMoves.some(move => move.row === toRow && move.col === toCol);
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];
        const directions = this.getPieceDirections();

        if (piece.type === 'pawn') {
            moves.push(...this.getPawnMoves(row, col));
        } else if (piece.type === 'knight') {
            moves.push(...this.getKnightMoves(row, col));
        } else if (piece.type === 'bishop') {
            moves.push(...this.getSlidingMoves(row, col, directions.bishop));
        } else if (piece.type === 'rook') {
            moves.push(...this.getSlidingMoves(row, col, directions.rook));
        } else if (piece.type === 'queen') {
            moves.push(...this.getSlidingMoves(row, col, directions.queen));
        } else if (piece.type === 'king') {
            moves.push(...this.getKingMoves(row, col));
        }

        // Filter out moves that would put/leave king in check
        return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col));
    }

    getPawnMoves(row, col) {
        const moves = [];
        const piece = this.board[row][col];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

        // Forward move
        if (this.isValidPosition(row + direction, col) && !this.board[row + direction][col]) {
            moves.push({ row: row + direction, col: col });
            
            // Double move from starting position
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col: col });
            }
        }

        // Diagonal captures
        const captureCols = [col - 1, col + 1];
        for (const captureCol of captureCols) {
            if (this.isValidPosition(row + direction, captureCol)) {
                const targetPiece = this.board[row + direction][captureCol];
                if (targetPiece && targetPiece.color !== piece.color) {
                    moves.push({ row: row + direction, col: captureCol });
                }
            }
        }

        return moves;
    }

    getKnightMoves(row, col, board = this.board) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        const piece = board[row][col];
        if (!piece) return moves;

        for (const [dRow, dCol] of knightMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const targetPiece = board[newRow][newCol];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getSlidingMoves(row, col, directions, board = this.board) {
        const moves = [];
        const piece = board[row][col];
        if (!piece) return moves;

        for (const [dRow, dCol] of directions) {
            let currentRow = row + dRow;
            let currentCol = col + dCol;

            while (this.isValidPosition(currentRow, currentCol)) {
                const targetPiece = board[currentRow][currentCol];
                
                if (!targetPiece) {
                    moves.push({ row: currentRow, col: currentCol });
                } else {
                    if (targetPiece.color !== piece.color) {
                        moves.push({ row: currentRow, col: currentCol });
                    }
                    break;
                }

                currentRow += dRow;
                currentCol += dCol;
            }
        }

        return moves;
    }

    getKingMoves(row, col, board = this.board, includeCastling = true) {
        const moves = [];
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const piece = board[row][col];
        if (!piece) return moves;

        // Regular king moves
        for (const [dRow, dCol] of kingMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const targetPiece = board[newRow][newCol];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        // Castling moves (only if includeCastling is true)
        if (includeCastling && !piece.hasMoved && !this.isKingInCheck(piece.color, board)) {
            // Kingside castling
            if (this.canCastleKingside(row, col, piece.color, board)) {
                const castlingCol = piece.color === 'white' ? 6 : 6; // g1 for white, g8 for black
                moves.push({ 
                    row: row, 
                    col: castlingCol, 
                    isCastling: true, 
                    castlingType: 'kingside',
                    rookFrom: { row: row, col: 7 },
                    rookTo: { row: row, col: 5 }
                });
            }

            // Queenside castling
            if (this.canCastleQueenside(row, col, piece.color, board)) {
                const castlingCol = piece.color === 'white' ? 2 : 2; // c1 for white, c8 for black
                moves.push({ 
                    row: row, 
                    col: castlingCol, 
                    isCastling: true, 
                    castlingType: 'queenside',
                    rookFrom: { row: row, col: 0 },
                    rookTo: { row: row, col: 3 }
                });
            }
        }

        return moves;
    }

    canCastleKingside(row, col, color, board = this.board) {
        // Check if king and kingside rook haven't moved
        const king = board[row][col];
        const kingsideRook = board[row][7]; // h-file rook
        
        if (!king || !kingsideRook || king.hasMoved || kingsideRook.hasMoved) {
            return false;
        }
        
        if (king.type !== 'king' || kingsideRook.type !== 'rook' || 
            king.color !== color || kingsideRook.color !== color) {
            return false;
        }

        // Check if squares between king and rook are empty
        for (let c = col + 1; c < 7; c++) {
            if (board[row][c] !== null) {
                return false;
            }
        }

        // Check if king is not in check and squares king moves through are not under attack
        const opponentColor = color === 'white' ? 'black' : 'white';
        if (this.isSquareUnderAttack(row, col, opponentColor, board) ||
            this.isSquareUnderAttack(row, col + 1, opponentColor, board) ||
            this.isSquareUnderAttack(row, col + 2, opponentColor, board)) {
            return false;
        }

        return true;
    }

    canCastleQueenside(row, col, color, board = this.board) {
        // Check if king and queenside rook haven't moved
        const king = board[row][col];
        const queensideRook = board[row][0]; // a-file rook
        
        if (!king || !queensideRook || king.hasMoved || queensideRook.hasMoved) {
            return false;
        }
        
        if (king.type !== 'king' || queensideRook.type !== 'rook' || 
            king.color !== color || queensideRook.color !== color) {
            return false;
        }

        // Check if squares between king and rook are empty
        for (let c = col - 1; c > 0; c--) {
            if (board[row][c] !== null) {
                return false;
            }
        }

        // Check if king is not in check and squares king moves through are not under attack
        const opponentColor = color === 'white' ? 'black' : 'white';
        if (this.isSquareUnderAttack(row, col, opponentColor, board) ||
            this.isSquareUnderAttack(row, col - 1, opponentColor, board) ||
            this.isSquareUnderAttack(row, col - 2, opponentColor, board)) {
            return false;
        }

        return true;
    }

    isKingInCheck(color, board = this.board) {
        const kingPosition = this.findKing(color, board);
        if (!kingPosition) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingPosition.row, kingPosition.col, opponentColor, board);
    }

    isInCheck(color, board = this.board) {
        const kingPosition = this.findKing(color, board);
        if (!kingPosition) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingPosition.row, kingPosition.col, opponentColor, board);
    }

    getPieceDirections(pieceType) {
        const directions = {
            bishop: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
            rook: [[-1, 0], [1, 0], [0, -1], [0, 1]],
            queen: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        };
        return directions;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    wouldBeInCheck(fromRow, fromCol, toRow, toCol) {
        // Temporarily make the move
        const tempBoard = this.board.map(row => [...row]);
        const capturedPiece = tempBoard[toRow][toCol];
        tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
        tempBoard[fromRow][fromCol] = null;

        // Check if king is in check after the move
        const kingPosition = this.findKing(this.currentPlayer, tempBoard);
        return this.isSquareUnderAttack(kingPosition.row, kingPosition.col, this.currentPlayer === 'white' ? 'black' : 'white', tempBoard);
    }

    findKing(color, board = this.board) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isSquareUnderAttack(row, col, attackingColor, board = this.board) {
        // Check all pieces of the attacking color
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && piece.color === attackingColor) {
                    const moves = this.getPieceMovesWithoutCheck(r, c, board);
                    if (moves.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getPieceMovesWithoutCheck(row, col, board) {
        const piece = board[row][col];
        if (!piece) return [];

        if (piece.type === 'pawn') {
            return this.getPawnMovesWithoutCheck(row, col, board);
        } else if (piece.type === 'knight') {
            return this.getKnightMoves(row, col, board);
        } else if (piece.type === 'bishop') {
            return this.getSlidingMoves(row, col, this.getPieceDirections().bishop, board);
        } else if (piece.type === 'rook') {
            return this.getSlidingMoves(row, col, this.getPieceDirections().rook, board);
        } else if (piece.type === 'queen') {
            return this.getSlidingMoves(row, col, this.getPieceDirections().queen, board);
        } else if (piece.type === 'king') {
            return this.getKingMoves(row, col, board, false); // Don't include castling for attack checking
        }

        return [];
    }

    getPawnMovesWithoutCheck(row, col, board) {
        const moves = [];
        const piece = board[row][col];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

        // Forward move
        if (this.isValidPosition(row + direction, col) && !board[row + direction][col]) {
            moves.push({ row: row + direction, col: col });
            
            // Double move from starting position
            if (row === startRow && !board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col: col });
            }
        }

        // Diagonal captures
        const captureCols = [col - 1, col + 1];
        for (const captureCol of captureCols) {
            if (this.isValidPosition(row + direction, captureCol)) {
                const targetPiece = board[row + direction][captureCol];
                if (targetPiece && targetPiece.color !== piece.color) {
                    moves.push({ row: row + direction, col: captureCol });
                }
            }
        }

        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            return false;
        }

        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];

        // Check if this is a castling move
        const validMoves = this.getValidMoves(fromRow, fromCol);
        const castlingMove = validMoves.find(move => 
            move.row === toRow && move.col === toCol && move.isCastling
        );

        if (castlingMove) {
            // Handle castling
            this.performCastling(fromRow, fromCol, toRow, toCol, castlingMove);
        } else {
            // Handle regular move
            // Handle capture
            if (capturedPiece) {
                this.capturedPieces[this.currentPlayer].push(capturedPiece);
            }

            // Make the move
            this.board[toRow][toCol] = { ...piece, hasMoved: true };
            this.board[fromRow][fromCol] = null;

            // Handle pawn promotion
            if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
                this.board[toRow][toCol] = { type: 'queen', color: piece.color, hasMoved: true };
            }
        }

        // Record move
        const move = {
            piece: piece.type,
            from: this.getSquareNotation(fromRow, fromCol),
            to: this.getSquareNotation(toRow, toCol),
            capture: capturedPiece ? capturedPiece.type : null,
            color: piece.color,
            isCastling: castlingMove ? castlingMove.castlingType : null
        };
        this.moveHistory.push(move);

        // Check for check/checkmate/stalemate
        this.checkGameState();

        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

        return true;
    }

    performCastling(fromRow, fromCol, toRow, toCol, castlingMove) {
        const king = this.board[fromRow][fromCol];
        
        // Move the king
        this.board[toRow][toCol] = { ...king, hasMoved: true };
        this.board[fromRow][fromCol] = null;
        
        // Move the rook
        const rook = this.board[castlingMove.rookFrom.row][castlingMove.rookFrom.col];
        this.board[castlingMove.rookTo.row][castlingMove.rookTo.col] = { ...rook, hasMoved: true };
        this.board[castlingMove.rookFrom.row][castlingMove.rookFrom.col] = null;
    }

    checkGameState() {
        const opponentColor = this.currentPlayer === 'white' ? 'black' : 'white';
        const kingPosition = this.findKing(opponentColor);

        if (this.isSquareUnderAttack(kingPosition.row, kingPosition.col, this.currentPlayer)) {
            this.inCheck = true;
            
            // Check for checkmate
            if (this.isCheckmate(opponentColor)) {
                this.checkmate = true;
                this.gameOver = true;
            }
        } else {
            this.inCheck = false;
            
            // Check for stalemate
            if (this.isStalemate(opponentColor)) {
                this.stalemate = true;
                this.gameOver = true;
            }
        }
    }

    isCheckmate(color) {
        // Check if any piece can make a move that gets the king out of check
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    isStalemate(color) {
        // Check if any piece can make a legal move
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    setTimeControl(minutes) {
        this.timeControl = minutes;
        this.whiteTime = minutes * 60;
        this.blackTime = minutes * 60;
        this.updateTimers();
    }

    setIncrement(seconds) {
        this.increment = seconds;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.gameStartTime = Date.now();
        this.timer = setInterval(() => {
            if (this.currentPlayer === 'white') {
                this.whiteTime--;
            } else {
                this.blackTime--;
            }

            if (this.whiteTime <= 0 || this.blackTime <= 0) {
                this.gameOver = true;
                clearInterval(this.timer);
            }

            this.updateTimers();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimers() {
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        document.getElementById('whiteTimer').textContent = formatTime(this.whiteTime);
        document.getElementById('blackTimer').textContent = formatTime(this.blackTime);
    }

    addIncrement() {
        if (this.currentPlayer === 'white') {
            this.whiteTime += this.increment;
        } else {
            this.blackTime += this.increment;
        }
        this.updateTimers();
    }

    resetGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.selectedSquare = null;
        this.validMoves = [];
        this.inCheck = false;
        this.checkmate = false;
        this.stalemate = false;
        this.stopTimer();
        this.setTimeControl(this.timeControl);
    }

    getGameStatus() {
        if (this.checkmate) {
            return `${this.currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`;
        } else if (this.stalemate) {
            return 'Draw by stalemate';
        } else if (this.inCheck) {
            return `${this.currentPlayer === 'white' ? 'Black' : 'White'} is in check!`;
        } else {
            return `${this.currentPlayer === 'white' ? 'White' : 'Black'} to move`;
        }
    }

    getMoveNotation(move) {
        // Handle castling notation
        if (move.isCastling) {
            return move.isCastling === 'kingside' ? 'O-O' : 'O-O-O';
        }
        
        let notation = '';
        
        if (move.piece !== 'pawn') {
            notation += move.piece.charAt(0).toUpperCase();
        }
        
        if (move.capture) {
            if (move.piece === 'pawn') {
                notation += move.from.charAt(0);
            }
            notation += 'x';
        }
        
        notation += move.to;
        
        return notation;
    }
}
