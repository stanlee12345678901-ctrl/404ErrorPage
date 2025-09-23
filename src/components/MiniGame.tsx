import { motion } from 'motion/react';
import { useState, useEffect, RefObject } from 'react';

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  popped: boolean;
}

interface MiniGameProps {
  onScoreChange: (score: number) => void;
  onBalloonPopped: () => void;
  popAudioRef?: RefObject<HTMLAudioElement>;
}

export function MiniGame({ onScoreChange, onBalloonPopped, popAudioRef }: MiniGameProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff9f43'];

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setBalloons(prev => {
        const newBalloon: Balloon = {
          id: Date.now(),
          // Spawn balloons at bottom of center area, they'll float upward
          x: Math.random() * 60 + 20, // 20% to 80% horizontally 
          y: 75 + Math.random() * 15, // Start near bottom (75%-90%)
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 20 + 30,
          velocityX: (Math.random() - 0.5) * 1.5, // Reduced horizontal movement
          velocityY: -1 - Math.random() * 1.5, // Always float upward (-1 to -2.5)
          popped: false,
        };
        return [...prev.filter(balloon => !balloon.popped), newBalloon];
      });
    }, 2000); // Slower spawn rate for upward floating

    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const moveInterval = setInterval(() => {
      setBalloons(prev => 
        prev.map(balloon => {
          let newX = balloon.x + balloon.velocityX;
          let newY = balloon.y + balloon.velocityY;
          let newVelX = balloon.velocityX;
          let newVelY = balloon.velocityY;

          // Horizontal boundaries - keep in center zone
          if (newX <= 20 || newX >= 80) newVelX = -newVelX;
          
          // Remove balloons that float above the visible area
          if (newY < 10) {
            return null; // Mark for removal
          }

          return {
            ...balloon,
            x: Math.max(20, Math.min(80, newX)),
            y: newY, // Allow balloons to float upward
            velocityX: newVelX,
            velocityY: newVelY,
          };
        }).filter(Boolean) // Remove null entries (balloons that floated away)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted]);

  const popBalloon = (id: number) => {
    setBalloons(prev => 
      prev.map(balloon => 
        balloon.id === id ? { ...balloon, popped: true } : balloon
      )
    );
    
    const newScore = score + (15 * (comboCount + 1));
    setScore(newScore);
    setComboCount(prev => prev + 1);
    onScoreChange(newScore);
    onBalloonPopped();
    
    setTimeout(() => {
      setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    }, 500);

    // Reset combo after 3 seconds
    setTimeout(() => {
      setComboCount(0);
    }, 3000);

    // Play pop audio if provided
    if (popAudioRef && popAudioRef.current) {
      popAudioRef.current.play();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setBalloons([]);
    setComboCount(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setBalloons([]);
    setComboCount(0);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-96 h-[500px] relative overflow-hidden border border-white/20 shadow-2xl">
      <div className="text-center mb-4">
        <h3 className="text-xl text-white mb-2">🎈 Balloon Pop Fun!</h3>
        <div className="flex justify-between items-center mb-2">
          <div className="text-white/80">
            <p>Score: {score}</p>
            {comboCount > 0 && (
              <motion.p 
                className="text-yellow-300 text-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                Combo x{comboCount + 1}!
              </motion.p>
            )}
          </div>
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Start Game
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all"
            >
              Reset
            </button>
          )}
        </div>
        <p className="text-white/60 text-sm">Pop balloons as they float upward!</p>
      </div>

      <div className="relative h-96 overflow-hidden rounded-xl border-2 border-white/10">
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            className="absolute cursor-pointer"
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              width: balloon.size,
              height: balloon.size * 1.2,
            }}
            onClick={() => !balloon.popped && popBalloon(balloon.id)}
            animate={{
              scale: balloon.popped ? [1, 0] : [1, 1.05, 1],
              rotate: balloon.popped ? [0, 180] : [0, 5, -5, 0],
            }}
            transition={{
              scale: { duration: balloon.popped ? 0.5 : 2, repeat: balloon.popped ? 0 : Infinity },
              rotate: { duration: balloon.popped ? 0.5 : 3, repeat: balloon.popped ? 0 : Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Balloon */}
            <div
              className="w-full h-full rounded-full relative cursor-pointer"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.8), ${balloon.color})`,
                boxShadow: `0 5px 20px ${balloon.color}40, inset -5px -5px 10px rgba(0,0,0,0.1)`,
              }}
            >
              {/* Balloon highlight */}
              <div 
                className="absolute bg-white/90 rounded-full blur-sm"
                style={{
                  top: `${balloon.size * 0.15}px`,
                  left: `${balloon.size * 0.25}px`,
                  width: `${balloon.size * 0.25}px`,
                  height: `${balloon.size * 0.3}px`,
                }}
              />
              <div 
                className="absolute bg-white rounded-full"
                style={{
                  top: `${balloon.size * 0.2}px`,
                  left: `${balloon.size * 0.2}px`,
                  width: `${balloon.size * 0.1}px`,
                  height: `${balloon.size * 0.1}px`,
                }}
              />
              
              {/* Balloon string */}
              <div 
                className="absolute bg-gray-600 transform -translate-x-1/2"
                style={{
                  top: '100%',
                  left: '50%',
                  width: '1px',
                  height: `${balloon.size * 0.4}px`,
                }}
              />
              
              {/* String knot */}
              <div 
                className="absolute bg-gray-700 rounded-full transform -translate-x-1/2"
                style={{
                  top: `${100 + balloon.size * 0.4}%`,
                  left: '50%',
                  width: '3px',
                  height: '3px',
                }}
              />
            </div>

            {/* Pop effect */}
            {balloon.popped && (
              <>
                {/* Multiple particle burst */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: balloon.color,
                      top: '50%',
                      left: '50%',
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((i * Math.PI) / 6) * 40,
                      y: Math.sin((i * Math.PI) / 6) * 40,
                      scale: [1, 0.5, 0],
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                ))}
                
                {/* Main pop effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-yellow-300 text-2xl">🎉</span>
                </motion.div>
                
                {/* Shockwave rings */}
                {[0, 0.1, 0.2].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute top-1/2 left-1/2 border-2 border-white rounded-full"
                    style={{
                      marginTop: `-${balloon.size/4}px`,
                      marginLeft: `-${balloon.size/4}px`,
                    }}
                    initial={{ width: 0, height: 0, opacity: 0.8 }}
                    animate={{ 
                      width: balloon.size * 2, 
                      height: balloon.size * 2, 
                      opacity: 0,
                      marginTop: `-${balloon.size}px`,
                      marginLeft: `-${balloon.size}px`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut", delay }}
                  />
                ))}
                
                {/* Score popup */}
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-300 font-bold text-lg"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8 }}
                >
                  +{15 * (comboCount + 1)}
                </motion.div>
              </>
            )}
          </motion.div>
        ))}

        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎈</div>
              <p className="text-white/80 text-lg mb-2">
                Click "Start Game" to begin!
              </p>
              <p className="text-white/60 text-sm">
                Pop the balloons as they float upward to score points!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}