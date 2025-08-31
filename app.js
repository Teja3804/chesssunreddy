class ChessApp {
    constructor() {
        this.game = new ChessGame();
        this.boardFlipped = false;
        this.settings = {
            sound: true,
            highlight: true,
            notation: true,
            theme: 'classic'
        };
        this.selectedTimeControl = 10;
        this.selectedIncrement = 0;
        this.gameMode = 'oneDevice';
        this.previousGames = [];
        this.selectedSquare = null; // Track selected square
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadPreviousGames();
        this.setupEventListeners();
        this.showOpeningPage();
    }

    setupEventListeners() {
        // Opening page event listeners
        document.getElementById('testBtn').addEventListener('click', () => {
            this.testGameLogic();
        });
        
        document.getElementById('playBtn').addEventListener('click', () => {
            this.startGame();
        });

        // Time control buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTimeControl(parseInt(e.target.dataset.time));
            });
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTheme(e.target.dataset.theme);
            });
        });

        // Game mode radio buttons
        document.querySelectorAll('input[name="gameMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.saveSettings();
            });
        });

        // Increment slider
        document.getElementById('incrementSlider').addEventListener('input', (e) => {
            const increment = parseInt(e.target.value);
            document.getElementById('incrementValue').textContent = increment;
            this.selectedIncrement = increment;
        });

        // Settings toggles
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('highlightToggle').addEventListener('change', (e) => {
            this.settings.highlight = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('notationToggle').addEventListener('change', (e) => {
            this.settings.notation = e.target.checked;
            this.saveSettings();
        });

        // Game page event listeners
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.backToMenu();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('flipBoardBtn').addEventListener('click', () => {
            this.flipBoard();
        });

        document.getElementById('resignBtn').addEventListener('click', () => {
            this.resignGame();
        });

        // Game overlay buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.newGame();
            this.hideGameOverlay();
        });

        document.getElementById('backToMenuBtn2').addEventListener('click', () => {
            this.backToMenu();
            this.hideGameOverlay();
        });
    }

    selectTimeControl(minutes) {
        this.selectedTimeControl = minutes;
        
        // Update UI
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.time) === minutes) {
                btn.classList.add('active');
            }
        });
    }

    selectTheme(theme) {
        this.settings.theme = theme;
        
        // Update UI
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        this.saveSettings();
    }

    showOpeningPage() {
        document.getElementById('openingPage').style.display = 'flex';
        document.getElementById('gamePage').style.display = 'none';
        
        // Set default time control
        this.selectTimeControl(10);
        
        // Set default game mode
        document.querySelector('input[value="oneDevice"]').checked = true;
    }

    showGamePage() {
        document.getElementById('openingPage').style.display = 'none';
        document.getElementById('gamePage').style.display = 'block';
        
        // Initialize game
        this.game.setTimeControl(this.selectedTimeControl);
        this.game.setIncrement(this.selectedIncrement);
        
        // Update game info display
        const gameTimeControl = document.getElementById('gameTimeControl');
        const gameIncrement = document.getElementById('gameIncrement');
        
        if (gameTimeControl) {
            gameTimeControl.textContent = `${this.selectedTimeControl} min`;
        }
        if (gameIncrement) {
            gameIncrement.textContent = `+${this.selectedIncrement}s`;
        }
        
        // Show auto-flip info if in one device mode
        const autoFlipInfo = document.getElementById('autoFlipInfo');
        if (autoFlipInfo) {
            if (this.gameMode === 'oneDevice') {
                autoFlipInfo.style.display = 'block';
            } else {
                autoFlipInfo.style.display = 'none';
            }
        }
        
        // Reset selection state
        this.selectedSquare = null;
        
        // Render board and setup game
        this.renderBoard();
        this.updateUI();
    }

    startGame() {
        this.showGamePage();
    }

    testGameLogic() {
        // Test board initialization
        console.log('Board:', this.game.board);
        console.log('Current player:', this.game.currentPlayer);
        
        // Test valid moves for white pawn at e2
        const pawnMoves = this.game.getValidMoves(6, 4); // e2 position
        console.log('Valid moves for white pawn at e2:', pawnMoves);
        
        // Test valid moves for white knight at b1
        const knightMoves = this.game.getValidMoves(7, 1); // b1 position
        console.log('Valid moves for white knight at b1:', knightMoves);
        
        // Test if a move would be valid
        const isValidMove = this.game.isValidMove(6, 4, 5, 4); // e2 to e3
        console.log('Is e2 to e3 valid?', isValidMove);
        
        // Test making a move
        const moveResult = this.game.makeMove(6, 4, 5, 4); // e2 to e3
        console.log('Move result:', moveResult);
        console.log('Board after move:', this.game.board);
        console.log('Current player after move:', this.game.currentPlayer);
        
        // Test valid moves for black pawn at e7
        const blackPawnMoves = this.game.getValidMoves(1, 4); // e7 position
        console.log('Valid moves for black pawn at e7:', blackPawnMoves);
        
        // Reset the game
        this.game.resetGame();
        console.log('Game reset, current player:', this.game.currentPlayer);
    }

    backToMenu() {
        this.game.stopTimer();
        this.showOpeningPage();
    }

    renderBoard() {
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) {
            return;
        }
        
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;

                // Set square color
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');

                // Add piece if exists
                const piece = this.game.board[row][col];
                if (piece) {
                    const pieceElement = this.createPieceElement(piece);
                    square.appendChild(pieceElement);
                }

                // Add click event
                square.addEventListener('click', () => {
                    this.handleSquareClick(row, col);
                });

                chessboard.appendChild(square);
            }
        }
    }

    createPieceElement(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        
        // Set piece symbol based on type and color
        const pieceSymbols = {
            'white': {
                'king': '♔',
                'queen': '♕',
                'rook': '♖',
                'bishop': '♗',
                'knight': '♘',
                'pawn': '♙'
            },
            'black': {
                'king': '♚',
                'queen': '♛',
                'rook': '♜',
                'bishop': '♝',
                'knight': '♞',
                'pawn': '♟'
            }
        };

        pieceElement.textContent = pieceSymbols[piece.color][piece.type];
        pieceElement.style.color = piece.color === 'white' ? '#f0f0f0' : '#2d3748';
        pieceElement.style.fontSize = '40px';
        pieceElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';

        return pieceElement;
    }

    handleSquareClick(row, col) {
        if (this.game.gameOver) {
            return;
        }

        const piece = this.game.board[row][col];
        
        // If no square is selected yet
        if (!this.selectedSquare) {
            // Check if clicked square has a piece of current player
            if (piece && piece.color === this.game.currentPlayer) {
                this.selectSquare(row, col);
            } else {
                this.showMessage('Invalid selection! Choose your own piece.', 'error');
            }
        }
        // If a square is already selected
        else {
            // If clicking on the same square, deselect it
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                this.deselectSquare();
            }
            // If clicking on a different piece of the same color, select that instead
            else if (piece && piece.color === this.game.currentPlayer) {
                this.selectSquare(row, col);
            }
            // If clicking on a different square, try to make a move
            else {
                this.attemptMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
            }
        }
    }

    selectSquare(row, col) {
        // Clear previous selection
        this.deselectSquare();
        
        // Set new selection
        this.selectedSquare = { row, col };
        
        // Get valid moves for this piece
        const validMoves = this.game.getValidMoves(row, col);
        
        // Highlight selected square (green)
        const square = this.getSquareElement(row, col);
        if (square) {
            square.classList.add('selected');
        }
        
        // Highlight valid move targets (green for empty, red for captures)
        if (this.settings.highlight) {
            validMoves.forEach(move => {
                const targetSquare = this.getSquareElement(move.row, move.col);
                if (targetSquare) {
                    const targetPiece = this.game.board[move.row][move.col];
                    
                    if (targetPiece) {
                        targetSquare.classList.add('valid-capture');
                    } else {
                        targetSquare.classList.add('valid-move');
                    }
                }
            });
        }

        // Play sound
        if (this.settings.sound) {
            this.playSound('select');
        }
    }

    deselectSquare() {
        if (this.selectedSquare) {
            // Remove highlights from selected square
            const selectedSquare = this.getSquareElement(this.selectedSquare.row, this.selectedSquare.col);
            if (selectedSquare) {
                selectedSquare.classList.remove('selected');
            }
            
            // Remove highlights from valid move squares
            const validMoves = this.game.getValidMoves(this.selectedSquare.row, this.selectedSquare.col);
            validMoves.forEach(move => {
                const targetSquare = this.getSquareElement(move.row, move.col);
                if (targetSquare) {
                    targetSquare.classList.remove('valid-move', 'valid-capture');
                }
            });
            
            this.selectedSquare = null;
        }
    }

    attemptMove(fromRow, fromCol, toRow, toCol) {
        console.log(`Attempting move from (${fromRow},${fromCol}) to (${toRow},${toCol})`);
        
        // Check if move is valid
        if (this.game.isValidMove(fromRow, fromCol, toRow, toCol)) {
            console.log('Move is valid, executing...');
            this.executeMove(fromRow, fromCol, toRow, toCol);
        } else {
            console.log('Move is invalid');
            this.showMessage('Illegal move! Try again.', 'error');
            
            // Play error sound
            if (this.settings.sound) {
                this.playSound('error');
            }
        }
    }

    executeMove(fromRow, fromCol, toRow, toCol) {
        console.log('Executing move...');
        
        // Make the move
        const moveResult = this.game.makeMove(fromRow, fromCol, toRow, toCol);
        
        if (moveResult) {
            console.log('Move executed successfully');
            
            // Play sound
            if (this.settings.sound) {
                const capturedPiece = this.game.board[toRow][toCol] ? null : 'capture';
                this.playSound(capturedPiece || 'move');
            }

            // Add increment to timer
            if (this.game.increment > 0) {
                this.game.addIncrement();
            }

            // Clear selection
            this.deselectSquare();
            
            // Update UI
            this.renderBoard();
            this.updateUI();
            this.updateMoveHistory();
            this.updateCapturedPieces();

            // Auto-flip board for one device mode
            if (this.gameMode === 'oneDevice') {
                this.autoFlipBoard();
            }

            // Check for game over
            if (this.game.gameOver) {
                this.showGameOverlay();
                this.saveGameToHistory();
            }

            // Start timer if this is the first move
            if (this.game.moveHistory.length === 1) {
                this.game.startTimer();
            }
        } else {
            console.log('Move execution failed');
            this.showMessage('Move failed! Try again.', 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        
        // Add to game page
        const gamePage = document.getElementById('gamePage');
        if (gamePage) {
            gamePage.appendChild(messageDiv);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
    }

    autoFlipBoard() {
        console.log('=== Auto Flip Board Debug ===');
        // Flip board after each move so both players can see from their perspective
        this.boardFlipped = !this.boardFlipped;
        console.log('Board flipped to:', this.boardFlipped ? 'black perspective' : 'white perspective');
        this.updateBoardOrientation();
    }

    getSquareElement(row, col) {
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) {
            console.log('❌ Chessboard element not found');
            return null;
        }
        
        const index = row * 8 + col;
        console.log(`Looking for square at index ${index} (row ${row}, col ${col})`);
        console.log(`Chessboard has ${chessboard.children.length} children`);
        
        if (index >= 0 && index < chessboard.children.length) {
            const square = chessboard.children[index];
            console.log(`✅ Found square element:`, square);
            return square;
        } else {
            console.log(`❌ Index ${index} out of bounds`);
            return null;
        }
    }

    updateUI() {
        console.log('=== Update UI Debug ===');
        // Update game status
        const gameStatusElement = document.getElementById('gameStatus');
        if (gameStatusElement) {
            gameStatusElement.textContent = this.game.getGameStatus();
        } else {
            console.log('❌ Game status element not found');
        }
        
        // Update timers
        this.game.updateTimers();
        
        // Update board orientation
        this.updateBoardOrientation();
        
        // Update move history
        this.updateMoveHistory();
        
        // Update captured pieces
        this.updateCapturedPieces();
        
        console.log('✅ UI updated successfully');
    }

    updateBoardOrientation() {
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) {
            console.log('❌ Chessboard not found for orientation update');
            return;
        }
        
        if (this.boardFlipped) {
            chessboard.style.transform = 'rotate(180deg)';
            // Rotate pieces back
            const pieces = chessboard.querySelectorAll('.piece');
            pieces.forEach(piece => {
                piece.style.transform = 'rotate(180deg)';
            });
        } else {
            chessboard.style.transform = 'rotate(0deg)';
            const pieces = chessboard.querySelectorAll('.piece');
            pieces.forEach(piece => {
                piece.style.transform = 'rotate(0deg)';
            });
        }
    }

    updateMoveHistory() {
        const moveHistory = document.getElementById('moveHistory');
        if (!moveHistory) {
            console.log('❌ Move history element not found');
            return;
        }
        
        const movesContainer = moveHistory.querySelector('.moves');
        if (!movesContainer) {
            console.log('❌ Moves container not found');
            return;
        }
        
        movesContainer.innerHTML = '';

        this.game.moveHistory.forEach((move, index) => {
            if (index % 2 === 0) {
                // Add move number
                const moveNumber = document.createElement('div');
                moveNumber.className = 'move-number';
                moveNumber.textContent = `${Math.floor(index / 2) + 1}.`;
                movesContainer.appendChild(moveNumber);
            }

            // Add move
            const moveElement = document.createElement('div');
            moveElement.className = 'move';
            moveElement.textContent = this.game.getMoveNotation(move);
            movesContainer.appendChild(moveElement);
        });

        // Scroll to bottom
        moveHistory.scrollTop = moveHistory.scrollHeight;
    }

    updateCapturedPieces() {
        const capturedWhite = document.getElementById('capturedWhite');
        const capturedBlack = document.getElementById('capturedBlack');
        
        if (!capturedWhite || !capturedBlack) {
            console.log('❌ Captured pieces elements not found');
            return;
        }

        capturedWhite.innerHTML = '<h4>White</h4>';
        capturedBlack.innerHTML = '<h4>Black</h4>';

        this.game.capturedPieces.white.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.textContent = this.getPieceSymbol(piece.type);
            pieceElement.style.fontSize = '20px';
            pieceElement.style.marginRight = '5px';
            capturedWhite.appendChild(pieceElement);
        });

        this.game.capturedPieces.black.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.textContent = this.getPieceSymbol(piece.type);
            pieceElement.style.fontSize = '20px';
            pieceElement.style.marginRight = '5px';
            capturedBlack.appendChild(pieceElement);
        });
    }

    getPieceSymbol(pieceType) {
        const symbols = {
            'king': '♔',
            'queen': '♕',
            'rook': '♖',
            'bishop': '♗',
            'knight': '♘',
            'pawn': '♙'
        };
        return symbols[pieceType] || '';
    }

    newGame() {
        console.log('=== New Game Debug ===');
        this.game.resetGame();
        this.boardFlipped = false; // Reset board orientation
        this.selectedSquare = null; // Reset selection
        this.renderBoard();
        this.updateUI();
        console.log('✅ New game started');
    }

    flipBoard() {
        this.boardFlipped = !this.boardFlipped;
        this.updateBoardOrientation();
    }

    resignGame() {
        if (confirm('Are you sure you want to resign?')) {
            this.game.gameOver = true;
            this.game.currentPlayer = this.game.currentPlayer === 'white' ? 'black' : 'white';
            this.showGameOverlay();
            this.saveGameToHistory();
        }
    }

    showGameOverlay() {
        const overlay = document.getElementById('gameOverlay');
        if (!overlay) {
            console.log('❌ Game overlay not found');
            return;
        }
        
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        
        if (!title || !message) {
            console.log('❌ Overlay title or message not found');
            return;
        }

        if (this.game.checkmate) {
            title.textContent = 'Checkmate!';
            message.textContent = this.game.getGameStatus();
        } else if (this.game.stalemate) {
            title.textContent = 'Draw!';
            message.textContent = 'Stalemate';
        } else if (this.game.whiteTime <= 0) {
            title.textContent = 'Game Over!';
            message.textContent = 'Black wins on time';
        } else if (this.game.blackTime <= 0) {
            title.textContent = 'Game Over!';
            message.textContent = 'White wins on time';
        } else {
            title.textContent = 'Game Over!';
            message.textContent = 'Game ended';
        }

        overlay.style.display = 'flex';
    }

    hideGameOverlay() {
        const overlay = document.getElementById('gameOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    saveGameToHistory() {
        const gameRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            timeControl: this.selectedTimeControl,
            increment: this.selectedIncrement,
            result: this.game.checkmate ? 'Checkmate' : 
                   this.game.stalemate ? 'Stalemate' : 
                   this.game.whiteTime <= 0 || this.game.blackTime <= 0 ? 'Time' : 'Resignation',
            winner: this.game.currentPlayer === 'white' ? 'Black' : 'White',
            moves: this.game.moveHistory.length
        };

        this.previousGames.unshift(gameRecord);
        
        // Keep only last 10 games
        if (this.previousGames.length > 10) {
            this.previousGames = this.previousGames.slice(0, 10);
        }

        this.savePreviousGames();
        this.updatePreviousGamesDisplay();
    }

    loadPreviousGames() {
        const saved = localStorage.getItem('chessPreviousGames');
        if (saved) {
            this.previousGames = JSON.parse(saved);
        }
    }

    savePreviousGames() {
        localStorage.setItem('chessPreviousGames', JSON.stringify(this.previousGames));
    }

    updatePreviousGamesDisplay() {
        const container = document.getElementById('previousGames');
        if (!container) {
            console.log('❌ Previous games container not found');
            return;
        }
        
        if (this.previousGames.length === 0) {
            container.innerHTML = '<div class="no-games">No previous games yet</div>';
            return;
        }

        container.innerHTML = '';
        this.previousGames.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'previous-game-item';
            gameElement.innerHTML = `
                <div class="game-date">${game.date} ${game.time}</div>
                <div class="game-details">
                    <span class="game-time">${game.timeControl}min +${game.increment}s</span>
                    <span class="game-result">${game.result}</span>
                    <span class="game-winner">${game.winner} wins</span>
                </div>
            `;
            container.appendChild(gameElement);
        });
    }

    playSound(type) {
        try {
            // Simple sound implementation - you can replace with actual audio files
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            let frequency, duration;
            switch (type) {
                case 'select':
                    frequency = 800;
                    duration = 0.1;
                    break;
                case 'move':
                    frequency = 600;
                    duration = 0.15;
                    break;
                case 'capture':
                    frequency = 400;
                    duration = 0.2;
                    break;
                case 'error':
                    frequency = 200;
                    duration = 0.3;
                    break;
                default:
                    frequency = 600;
                    duration = 0.1;
            }

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log('Sound not supported');
        }
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('chessSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            
            // Update UI to reflect loaded settings
            const soundToggle = document.getElementById('soundToggle');
            const highlightToggle = document.getElementById('highlightToggle');
            const notationToggle = document.getElementById('notationToggle');
            
            if (soundToggle) soundToggle.checked = this.settings.sound;
            if (highlightToggle) highlightToggle.checked = this.settings.highlight;
            if (notationToggle) notationToggle.checked = this.settings.notation;
            
            // Update theme
            this.selectTheme(this.settings.theme);
        }
    }

    saveSettings() {
        localStorage.setItem('chessSettings', JSON.stringify(this.settings));
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessApp();
});

