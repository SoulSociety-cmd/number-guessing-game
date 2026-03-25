// Difficulty configurations
const difficulties = {
    easy: { min: 1, max: 50, guesses: 8 },
    medium: { min: 1, max: 100, guesses: 7 },
    hard: { min: 1, max: 200, guesses: 7 },
    extreme: { min: 1, max: 500, guesses: 8 }
};

// Game state variables
let secretNumber; // The randomly generated number to guess
let attempts; // Number of guesses made
let maxGuesses; // Maximum allowed guesses for current difficulty
let currentDifficulty; // Current selected difficulty
let gameOver; // Flag to prevent further guesses after correct answer

// DOM element references for easy access
const subtitleEl = document.getElementById('subtitle');
const difficultySelect = document.getElementById('difficulty');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const resetBtn = document.getElementById('reset-btn');

/**
 * Initializes a new game by generating a random number,
 * resetting attempts, and updating the UI
 */
function initGame(difficulty = 'medium') {
    currentDifficulty = difficulty;
    const config = difficulties[currentDifficulty];
    secretNumber = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    attempts = 0;
    maxGuesses = config.guesses;
    gameOver = false;
    updateUI();
    guessInput.focus();
}

/**
 * Updates all UI elements to reflect current game state
 */
function updateUI() {
    const config = difficulties[currentDifficulty];
    subtitleEl.textContent = `I'm thinking of a number between ${config.min} and ${config.max}. Can you guess it?`;
    attemptsEl.textContent = `Guesses: ${attempts}/${maxGuesses}`;
    messageEl.className = 'message'; // Reset message classes
    guessInput.disabled = gameOver; // Disable input if game is over
    guessBtn.disabled = gameOver; // Disable button if game is over
    if (!gameOver) {
        guessInput.value = ''; // Clear input for new guess
    }
}

/**
 * Processes the player's guess and provides feedback
 */
function makeGuess() {
    if (gameOver) return; // Prevent guesses after game ends

    const config = difficulties[currentDifficulty];
    const guess = parseInt(guessInput.value); // Convert input to number

    // Validate input
    if (isNaN(guess) || guess < config.min || guess > config.max) {
        showMessage(`Please enter a valid number between ${config.min} and ${config.max}! 🚫`, 'error');
        return;
    }

    attempts++; // Increment attempt counter

    addGuessEffect(); // Add visual effect on guess

    // Check guess against secret number
    if (guess === secretNumber) {
        showMessage(`🎉 Correct! You guessed it in ${attempts} attempts!`, 'correct');
        gameOver = true; // End the game
        // Trigger confetti celebration
        triggerConfetti();
    } else if (guess < secretNumber) {
        showMessage('📈 Too low! Try a higher number.', 'too-low');
    } else {
        showMessage('📉 Too high! Try a lower number.', 'too-high');
    }

    // Check if out of guesses
    if (attempts >= maxGuesses && !gameOver) {
        showMessage(`😞 Out of guesses! The number was ${secretNumber}.`, 'error');
        gameOver = true;
    }

    updateUI(); // Update display after guess
}

/**
 * Displays a message with appropriate styling and animation
 * @param {string} text - The message text to display
 * @param {string} type - The type of message (affects styling)
 */
function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    // Trigger animation by adding 'show' class after a brief delay
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 50);
}

/**
 * Triggers a confetti animation when the player wins
 */
function triggerConfetti() {
    // Multiple bursts for a more exciting effect
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4', '#6bcf7f'];

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Event listeners for user interactions
guessBtn.addEventListener('click', makeGuess); // Guess button click
guessInput.addEventListener('keypress', (e) => { // Enter key in input
    if (e.key === 'Enter') {
        makeGuess();
    }
});
resetBtn.addEventListener('click', () => initGame(currentDifficulty)); // Reset button click
difficultySelect.addEventListener('change', () => initGame(difficultySelect.value)); // Difficulty change

// Start the game when page loads
initGame();

// Mouse interaction for background effects
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.floating-shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add guess effect
function addGuessEffect() {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.width = '10px';
    effect.style.height = '10px';
    effect.style.background = 'rgba(255, 255, 255, 0.8)';
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';
    effect.style.animation = 'guessPulse 0.5s ease-out';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes guessPulse {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(20); opacity: 0; }
    }
`;
document.head.appendChild(style);