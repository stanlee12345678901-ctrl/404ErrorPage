import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { FloatingParticles } from './components/FloatingParticles';
import { MiniGame } from './components/MiniGame';
import { GlowingShapes } from './components/GlowingShapes';
import { Pookie } from './components/Pookie';
import { ConfettiEffect } from './components/ConfettiEffect';
import { FireworksEffect } from './components/FireworksEffect';
import { Leaderboard } from './components/Leaderboard';

export default function App() {
  const [pookieScore, setPookieScore] = useState(0); // Score from clicking Pookie
  const [balloonScore, setBalloonScore] = useState(0); // Score from balloons
  const [balloonsPopped, setBalloonsPopped] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [hasTriggeredFireworks, setHasTriggeredFireworks] = useState(false);
  
  // Audio refs for sound effects
  const chimeAudioRef = useRef<HTMLAudioElement>(null);
  const celebrationAudioRef = useRef<HTMLAudioElement>(null);
  const popAudioRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);

  const totalScore = pookieScore + balloonScore;

  // Handle Pookie clicks (+1 point each)
  const handlePookieClick = () => {
    setPookieScore(prev => prev + 1);
    // Play soft chime sound
    if (chimeAudioRef.current) {
      chimeAudioRef.current.currentTime = 0;
      chimeAudioRef.current.volume = 0.4; // Soft, pleasant volume
      chimeAudioRef.current.play().catch(() => {
        // Silently handle audio play failure
      });
    }
  };

  // Handle balloon score changes
  const handleBalloonScoreChange = (newBalloonScore: number) => {
    setBalloonScore(newBalloonScore);
    if (newBalloonScore > 0 && newBalloonScore % 50 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    }
  };

  // Handle balloon pops with sound
  const handleBalloonPopped = () => {
    setBalloonsPopped(prev => prev + 1);
    // Play soft pop sound
    if (popAudioRef.current) {
      popAudioRef.current.currentTime = 0;
      popAudioRef.current.volume = 0.3; // Soft puff sound
      popAudioRef.current.play().catch(() => {
        // Silently handle audio play failure
      });
    }
  };

  // Check for fireworks trigger at 100 total points
  useEffect(() => {
    if (totalScore >= 100 && !hasTriggeredFireworks) {
      setShowFireworks(true);
      setHasTriggeredFireworks(true);
      
      // Play gentle celebration sound
      if (celebrationAudioRef.current) {
        celebrationAudioRef.current.currentTime = 0;
        celebrationAudioRef.current.volume = 0.5; // Gentle but audible
        celebrationAudioRef.current.play().catch(() => {
          // Silently handle audio play failure
        });
      }
      
      // Show leaderboard after fireworks
      setTimeout(() => {
        setShowFireworks(false);
        setShowLeaderboard(true);
      }, 5000);
    }
  }, [totalScore, hasTriggeredFireworks]);

  // Start ambient background music on component mount
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.08; // Even lower, more ambient volume
      bgMusicRef.current.play().catch(() => {
        // Silently handle audio play failure
      });
    }
  }, []);

  // Reset all game state
  const resetGame = () => {
    setPookieScore(0);
    setBalloonScore(0);
    setBalloonsPopped(0);
    setHasTriggeredFireworks(false);
    setShowFireworks(false);
    setShowConfetti(false);
    setShowLeaderboard(false);
  };

  // Handle leaderboard close
  const handleLeaderboardClose = () => {
    setShowLeaderboard(false);
  };

  // Handle play again from leaderboard
  const handlePlayAgain = () => {
    resetGame();
    setShowLeaderboard(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b9d 100%)'
    }}>
      {/* Audio Elements - Calm, ambient sounds */}
      <audio ref={chimeAudioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRhABAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YewAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeAzuR2Oy95wkG" type="audio/wav"/>
      </audio>
      <audio ref={celebrationAudioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRhwBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfgAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeAzuR2Oy95+kG" type="audio/wav"/>
      </audio>
      <audio ref={popAudioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRhABAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YewAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeAzuR2Oy95wk" type="audio/wav"/>
      </audio>
      {/* Ambient Background Music - Peaceful lo-fi/synth style, very low volume */}
      <audio ref={bgMusicRef} preload="auto" loop>
        <source src="data:audio/wav;base64,UklGRqAKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXwKAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeAzuR2Oy95+kFNH7U5+qJMwoWdL/k6KZVEA1To+Dyu2QdAzyS1/LLeCoGInnA8tyOPwgVZKfm46xUFApKneDyu2QeAzqR1+3A5+gHMYLX5emOOAoaY7Xs459OEAxOn97wu2QcAzyR1vTO" type="audio/wav"/>
      </audio>

      {/* Background Effects */}
      <GlowingShapes />
      <FloatingParticles />
      <ConfettiEffect trigger={showConfetti} />
      <FireworksEffect trigger={showFireworks} />
      
      {/* Score Counter - Top Right Corner */}
      <motion.div
        className="fixed top-6 right-6 z-40 bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-white text-center">
          <p className="text-2xl font-bold text-yellow-300">{totalScore}</p>
          <p className="text-sm opacity-80">Score</p>
          <div className="text-xs opacity-60 mt-1">
            <p>Pookie: {pookieScore}</p>
            <p>Balloons: {balloonScore}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Pookie Character - Edge positioning only */}
      <Pookie 
        score={totalScore}
        onPookieClick={handlePookieClick}
        balloonsPopped={balloonsPopped}
      />
      
      {/* Leaderboard Modal */}
      <Leaderboard 
        isOpen={showLeaderboard}
        currentScore={totalScore}
        onClose={handleLeaderboardClose}
        onPlayAgain={handlePlayAgain}
      />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* 404 Title with Enhanced Bounce Animation - Above balloon zone */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black text-white mb-4"
            style={{
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4, #45b7d1, #f9ca24)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              scale: [1, 1.05, 1],
            }}
            transition={{
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          >
            404
          </motion.h1>
          
          <motion.h2
            className="text-2xl md:text-3xl text-white mb-4 font-bold"
            animate={{
              scale: [1, 1.06, 1],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Oops! You wandered into the void...
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-white/90 mb-2 font-medium"
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            Want to play with Pookie instead? 🎮
          </motion.p>
        </motion.div>

        {/* Center Balloon Play Area - No Pookie Zone */}
        <div className="flex justify-center w-full max-w-4xl">
          <motion.div
            className="balloon-play-zone"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          >
            <MiniGame 
              onScoreChange={handleBalloonScoreChange}
              onBalloonPopped={handleBalloonPopped}
              popAudioRef={popAudioRef}
            />
          </motion.div>
        </div>

        {/* Game Instructions */}
        <motion.div
          className="mt-8 text-center text-white/80 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p className="text-lg mb-2">
            🎯 Click Pookie for +1 point • 🎈 Pop balloons for bonus points
          </p>
          <p className="text-sm text-white/60">
            Get 100 points total for fireworks and leaderboard access! ✨
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1, ease: "easeOut" }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg font-medium"
            style={{
              boxShadow: '0 10px 30px rgba(255, 107, 157, 0.4)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 40px rgba(255, 107, 157, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            ← Go Back Home
          </motion.button>
          
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full shadow-lg font-medium"
            style={{
              boxShadow: '0 10px 30px rgba(69, 183, 209, 0.4)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 40px rgba(69, 183, 209, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
          >
            🎲 Reset Game
          </motion.button>
          
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full shadow-lg font-medium"
            style={{
              boxShadow: '0 10px 30px rgba(144, 238, 144, 0.4)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 40px rgba(144, 238, 144, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeaderboard(true)}
          >
            🏆 Leaderboard
          </motion.button>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          className="mt-8 text-center text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <p className="text-sm mb-2">
            You're the {Math.floor(Math.random() * 1000) + 1}th visitor to discover Pookie's playground! ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}