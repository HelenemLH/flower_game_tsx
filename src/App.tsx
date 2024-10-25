import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function getRandomWord() {
  const words = [
    "sunshine",
    "blossom",
    "nature",
    "garden",
    "flowers",
    "green",
    "tree",
    "ocean",
    "mountain",
  ];
  return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

function FlowerGame() {
  const [word, setWord] = useState<string>(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuessCount, setWrongGuessCount] = useState<number>(0);
  const maxWrongGuesses = 8;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false); // Track win condition

  useEffect(() => {
    const allLettersGuessed = word
      .split("")
      .every((letter) => guessedLetters.includes(letter));
    if (allLettersGuessed) {
      setIsGameOver(true);
      setIsWinner(true);
    } else if (wrongGuessCount >= maxWrongGuesses) {
      setIsGameOver(true);
      setIsWinner(false);
    }
  }, [guessedLetters, wrongGuessCount, word]);

  const guessLetter = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setWrongGuessCount(wrongGuessCount + 1);
      }
    }
  };

  const startNewGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuessCount(0);
    setIsGameOver(false);
    setIsWinner(false);
  };

  const showFlower = () => {
    const centerX = 100;
    const centerY = 130;
    const radius = 37;
    const petalWidth = 40;
    const petalHeight = 25;
    const petalCount = 8;

    const petals = [];

    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 360) / petalCount;
      const radians = (angle * Math.PI) / 180;

      const petalX = centerX + radius * Math.cos(radians);
      const petalY = centerY + radius * Math.sin(radians);

      petals.push(
        <ellipse
          key={i}
          cx={petalX}
          cy={petalY}
          rx={petalWidth / 2}
          ry={petalHeight / 2}
          fill="#FF69B4"
          transform={`rotate(${angle}, ${petalX}, ${petalY})`}
        />
      );
    }

    return (
      <svg width="200" height="250" viewBox="0 0 200 250">
        <path d="M100 130 L100 230" stroke="green" strokeWidth="4" />
        <path d="M100 180 Q70 170 60 190 Q70 210 100 200" fill="green" />
        <path d="M100 200 Q130 180 140 190 Q130 210 100 210" fill="green" />
        <circle cx="100" cy="130" r="15" fill="#FFD700" />
        <circle cx="100" cy="130" r="10" fill="#FFA500" />
        {wrongGuessCount < 1 && petals[0]}
        {wrongGuessCount < 2 && petals[1]}
        {wrongGuessCount < 3 && petals[2]}
        {wrongGuessCount < 4 && petals[3]}
        {wrongGuessCount < 5 && petals[4]}
        {wrongGuessCount < 6 && petals[5]}
        {wrongGuessCount < 7 && petals[6]}
        {wrongGuessCount < 8 && petals[7]}
      </svg>
    );
  };

  return (
    <div className="game-container">
      {isWinner && <Confetti />}

      <h1 className="game-title">Flower Game</h1>

      <div className="game-layout">
        <div className="flower-container">{showFlower()}</div>
        <div className="word-display">
          <p>
            {word
              .split("")
              .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
              .join(" ")}
          </p>
        </div>
      </div>

      {isGameOver ? (
        <div>
          <h2 className="game-status">{isWinner ? "You won!" : "You lost!"}</h2>
          <button className="new-game-button" onClick={startNewGame}>
            New Game
          </button>
        </div>
      ) : (
        <>
          <p className="guess-prompt">Guess a letter!</p>
          <div className="letter-grid">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={guessedLetters.includes(letter)}
                className={`letter-button ${
                  guessedLetters.includes(letter)
                    ? "letter-disabled"
                    : "letter-active"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FlowerGame;
