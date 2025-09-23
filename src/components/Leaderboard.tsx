import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  currentScore: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

export function Leaderboard({ isOpen, currentScore, onClose, onPlayAgain }: LeaderboardProps) {
  const [highScores, setHighScores] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('pookie-highscores');
    if (saved) {
      try {
        setHighScores(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse high scores from localStorage');
      }
    }
  }, []);

  // Save high scores to localStorage whenever they change
  useEffect(() => {
    if (highScores.length > 0) {
      localStorage.setItem('pookie-highscores', JSON.stringify(highScores));
    }
  }, [highScores]);

  const submitScore = () => {
    if (!playerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: currentScore,
      date: new Date().toLocaleDateString()
    };

    const updatedScores = [...highScores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10 scores

    setHighScores(updatedScores);
    setHasSubmitted(true);
  };

  const handlePlayAgain = () => {
    setPlayerName('');
    setHasSubmitted(false);
    onPlayAgain();
  };

  const isNewHighScore = currentScore > 0 && (highScores.length < 10 || currentScore > Math.min(...highScores.map(s => s.score)));

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Celebration Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Amazing Score!</h2>
          <p className="text-xl text-yellow-300 font-bold">{currentScore} Points</p>
          {isNewHighScore && !hasSubmitted && (
            <motion.p
              className="text-sm text-green-300 mt-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              🏆 New High Score!
            </motion.p>
          )}
        </motion.div>

        {/* Score Submission */}
        {!hasSubmitted && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-white text-sm mb-2">
              Enter your name for the leaderboard:
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name..."
                maxLength={20}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    submitScore();
                  }
                }}
              />
              <Button
                onClick={submitScore}
                disabled={!playerName.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                Submit
              </Button>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasSubmitted ? 0.1 : 0.4 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 text-center">🏆 Leaderboard</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {highScores.length === 0 ? (
              <p className="text-white/60 text-center py-4">No scores yet. Be the first!</p>
            ) : (
              highScores.map((entry, index) => (
                <motion.div
                  key={`${entry.name}-${entry.score}-${entry.date}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.score === currentScore && entry.name === playerName && hasSubmitted
                      ? 'bg-yellow-500/20 border border-yellow-400/30'
                      : 'bg-white/5'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 font-mono text-sm w-6">
                      #{index + 1}
                    </span>
                    <span className="text-white font-medium">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-300 font-bold">{entry.score}</span>
                    <div className="text-white/40 text-xs">{entry.date}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handlePlayAgain}
            className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0"
          >
            🎮 Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}