import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
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
    "animal",
    "cat",
  ];
  return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

function FlowerGame() {
  const [word, setWord] = useState<string>(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuessCount, setWrongGuessCount] = useState<number>(0);
  const maxWrongGuesses = 8;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const stemRef = useRef<SVGPathElement>(null);
  const petalRefs = useRef<Array<SVGEllipseElement | null>>([]);
  const centerRef = useRef<SVGCircleElement>(null);

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

  useEffect(() => {
    resetAnimation(); // Call resetAnimation when game starts
  }, []);

  const resetAnimation = () => {
    gsap.fromTo(
      stemRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1, transformOrigin: "top" }
    );

    gsap.fromTo(
      centerRef.current,
      { scale: 0 },
      { scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );

    petalRefs.current.forEach((petal, index) => {
      gsap.fromTo(
        petal,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.2 * index,
          ease: "back.out(1.7)",
        }
      );
    });
  };

  const guessLetter = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setWrongGuessCount(wrongGuessCount + 1);
        setMessage("Wrong guess!");
        const petalIndex = wrongGuessCount;
        const petal = petalRefs.current[petalIndex];
        if (petal) {
          gsap.to(petal, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            onComplete: () => {
              petalRefs.current[petalIndex] = null;
            },
          });
        }
      } else {
        setMessage("Correct guess!");
      }
    }
  };

  const startNewGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuessCount(0);
    setIsGameOver(false);
    setIsWinner(false);
    setMessage("");
    petalRefs.current = [];
    resetAnimation(); // Reset animation when starting a new game
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
          ref={(el) => (petalRefs.current[i] = el)}
          transform={`rotate(${angle}, ${petalX}, ${petalY})`}
        />
      );
    }

    return (
      <svg width="200" height="250" viewBox="0 0 200 250">
        <path
          ref={stemRef}
          d="M100 130 L100 230"
          stroke="green"
          strokeWidth="4"
        />
        <path d="M100 180 Q70 170 60 190 Q70 210 100 200" fill="green" />
        <path d="M100 200 Q130 180 140 190 Q130 210 100 210" fill="green" />
        <circle ref={centerRef} cx="100" cy="130" r="15" fill="#FFD700" />
        <circle cx="100" cy="130" r="10" fill="#FFA500" />
        {wrongGuessCount < maxWrongGuesses && petals}
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
          <p className="guess-prompt">{message || "Guess a letter!"}</p>
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
