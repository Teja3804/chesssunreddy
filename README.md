# Chess Master - Advanced Chess Website

A modern, feature-rich chess website built with HTML, CSS, and JavaScript. This chess application includes advanced features like time controls, move validation, and a beautiful responsive design with a dedicated opening page for game setup.

## Features

### 🎮 Core Game Features
- **Complete Chess Rules**: Full implementation of standard chess rules
- **Move Validation**: All moves are validated according to chess rules
- **Check/Checkmate Detection**: Automatic detection of game-ending conditions
- **Stalemate Detection**: Draw detection when no legal moves are available
- **Pawn Promotion**: Automatic promotion to queen when reaching the back rank
- **Piece Movement**: Fully functional piece selection and movement

### 🏠 Opening Page
- **Time Control Selection**: Choose from 1, 3, 5, 10, 15, and 30-minute games
- **Increment Settings**: Configurable time increment (0-30 seconds) after each move
- **Board Themes**: Multiple board themes (Classic, Modern, Wooden)
- **Game Settings**: Toggle sound effects, move highlighting, and notation
- **Previous Games**: View history of your last 10 games with results
- **Beautiful Interface**: Modern, intuitive design for easy game setup

### ⏱️ Time Controls
- **Multiple Time Options**: 1, 3, 5, 10, 15, and 30-minute games
- **Increment System**: Configurable time increment (0-30 seconds) added after each move
- **Visual Timers**: Real-time countdown timers for both players
- **Time-based Victory**: Automatic win when a player runs out of time

### 🎨 User Interface
- **Modern Design**: Beautiful gradient background with glassmorphism effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Board Flipping**: Ability to flip the board to play from either perspective
- **Move Highlights**: Visual indicators for selected pieces and valid moves
- **Captured Pieces Display**: Track all captured pieces for both players

### 📊 Game Information
- **Move History**: Complete record of all moves with algebraic notation
- **Game Status**: Real-time updates showing current game state
- **Captured Pieces**: Visual display of all captured pieces
- **Player Turn Indicator**: Clear indication of whose turn it is

### ⚙️ Customization Options
- **Sound Effects**: Toggleable audio feedback for moves and selections
- **Move Highlighting**: Option to show/hide valid move indicators
- **Algebraic Notation**: Toggle for move notation display
- **Settings Persistence**: Your preferences are saved locally
- **Theme Selection**: Choose from multiple board themes

### 🔧 Technical Features
- **Pure JavaScript**: No external dependencies required
- **Local Storage**: Settings, preferences, and game history are saved locally
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Performance Optimized**: Efficient move calculation and rendering

## How to Play

### Getting Started
1. **Open the Website**: Simply open `index.html` in any modern web browser
2. **Opening Page**: You'll see a beautiful opening page with game setup options
3. **Choose Time Control**: Select your preferred game duration from the time control buttons
4. **Set Increment**: Use the slider to add time increment after each move (optional)
5. **Select Theme**: Choose your preferred board theme
6. **Configure Settings**: Toggle sound effects, move highlighting, and notation
7. **Click Play**: Press the "Start Game" button to begin playing

### Game Controls
- **Back to Menu**: Return to the opening page to change settings
- **New Game**: Start a fresh game with the same settings
- **Flip Board**: Rotate the board 180 degrees to play from the opposite perspective
- **Resign**: Give up the current game

### Making Moves
1. **Select a Piece**: Click on any piece of your color
2. **View Valid Moves**: Valid moves will be highlighted (if highlighting is enabled)
3. **Make Your Move**: Click on a highlighted square to move your piece
4. **Game Continues**: The turn automatically passes to your opponent

### Game End Conditions
- **Checkmate**: When a king is in check with no legal moves to escape
- **Stalemate**: When a player has no legal moves but is not in check
- **Time Out**: When a player's timer reaches zero
- **Resignation**: Player can resign at any time

## File Structure

```
Chess/
├── index.html          # Main HTML file with opening page and game interface
├── styles.css          # CSS styling and responsive design
├── chess.js           # Chess game logic and rules
├── app.js             # User interface and game management
└── README.md          # This documentation file
```

## Browser Compatibility

- **Chrome**: 60+ ✅
- **Firefox**: 55+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅
- **Mobile Browsers**: iOS Safari, Chrome Mobile ✅

## Installation & Usage

### Option 1: Direct Usage
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)
1. Download all files to a folder
2. Start a local HTTP server in the folder:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Option 3: Online Hosting
Upload all files to any web hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Customization

### Adding New Time Controls
Edit the time control buttons in `index.html`:
```html
<button class="time-btn" data-time="60">60 min</button>
```

### Adding New Themes
Edit the theme buttons in `index.html`:
```html
<button class="theme-btn" data-theme="custom">Custom</button>
```

### Modifying Piece Appearance
Update the piece symbols in `app.js` within the `createPieceElement` function.

### Changing Colors
Modify the CSS variables in `styles.css` to match your preferred color scheme.

## Technical Details

### Chess Engine
- **Move Generation**: Efficient algorithms for all piece types
- **Validation**: Complete rule checking including check prevention
- **State Management**: Comprehensive game state tracking

### Performance Features
- **Efficient Rendering**: Minimal DOM manipulation
- **Move Calculation**: Optimized algorithms for valid move generation
- **Memory Management**: Clean object lifecycle management

### Security Features
- **Client-Side Only**: No server communication required
- **Local Storage**: Secure local data persistence
- **Input Validation**: All user inputs are validated

## Recent Fixes

### ✅ Fixed Issues
- **Piece Movement**: Completely rewrote the piece selection and movement system for guaranteed functionality
- **Simplified Logic**: Implemented a clear two-step process: select piece (green), then select destination
- **Visual Feedback**: Clear color coding - green for selection, red for captures, with immediate feedback
- **Error Handling**: Added popup messages for illegal moves and invalid selections
- **Event Handling**: Streamlined click event handling for chess squares
- **User Experience**: Added proper opening page with game setup options
- **Navigation**: Implemented smooth transition between opening page and game

### 🔧 Technical Improvements
- **Code Restructuring**: Completely rewrote the application structure with simplified logic
- **Event Management**: Better separation of opening page and game page events
- **State Management**: Improved game state handling and persistence
- **UI Responsiveness**: Enhanced user interface responsiveness
- **Debug Logging**: Added comprehensive console logging for troubleshooting

## Contributing

Feel free to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using a modern browser
3. Try refreshing the page
4. Check that all files are in the same directory

## Future Enhancements

Potential features for future versions:
- **AI Opponent**: Computer player with adjustable difficulty
- **Online Multiplayer**: Real-time games with other players
- **Game Analysis**: Move analysis and suggestions
- **Opening Database**: Common opening moves and strategies
- **Puzzle Mode**: Tactical puzzles and challenges
- **Tournament Mode**: Multiple game management
- **Export Games**: Save games in PGN format
- **Advanced Themes**: More board and piece themes
- **Game Replay**: Replay previous games move by move

---

**Enjoy playing Chess Master!** 🎯♟️
