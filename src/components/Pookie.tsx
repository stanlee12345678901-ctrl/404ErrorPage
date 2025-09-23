import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';

interface PookieProps {
  score: number;
  onPookieClick: () => void; // New prop for handling clicks
  balloonsPopped: number;
}

export function Pookie({ score, onPookieClick, balloonsPopped }: PookieProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHidden, setIsHidden] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'surprised' | 'mischief' | 'eating' | 'dancing'>('happy');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [showGiggle, setShowGiggle] = useState(false);

  // Function to get random edge position (no center zone)
  const getRandomEdgePosition = () => {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    
    switch (edge) {
      case 0: // Top edge
        x = Math.random() * 80 + 10; // 10% to 90% horizontally
        y = Math.random() * 15 + 5;   // 5% to 20% from top
        break;
      case 1: // Right edge
        x = Math.random() * 15 + 80; // 80% to 95% from left
        y = Math.random() * 60 + 20;  // 20% to 80% vertically
        break;
      case 2: // Bottom edge
        x = Math.random() * 80 + 10; // 10% to 90% horizontally
        y = Math.random() * 15 + 80; // 80% to 95% from top
        break;
      case 3: // Left edge
        x = Math.random() * 15 + 5;  // 5% to 20% from left
        y = Math.random() * 60 + 20; // 20% to 80% vertically
        break;
      default:
        x = 10;
        y = 10;
    }
    
    return { x, y };
  };

  // Initialize with edge position
  useEffect(() => {
    setPosition(getRandomEdgePosition());
  }, []);

  // Peek-a-boo behavior with edge positioning
  useEffect(() => {
    const peekabooInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setIsHidden(true);
        setTimeout(() => {
          // Move to a new random edge position
          setPosition(getRandomEdgePosition());
          setIsHidden(false);
          setExpression('surprised');
          setTimeout(() => setExpression('happy'), 1000);
        }, 1500);
      }
    }, 4000);

    return () => clearInterval(peekabooInterval);
  }, []);

  // Blinking behavior
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Dance when scoring
  useEffect(() => {
    if (score > 0) {
      setIsDancing(true);
      setExpression('dancing');
      setTimeout(() => {
        setIsDancing(false);
        setExpression('happy');
      }, 2000);
    }
  }, [score]);

  // Eating animation
  const eatHotDog = useCallback(() => {
    setIsEating(true);
    setExpression('eating');
    
    // Chewing animation sequence
    setTimeout(() => {
      setExpression('happy');
      setIsEating(false);
      onPookieClick(); // Call the new prop for handling clicks
      // Show giggle after eating
      setShowGiggle(true);
      setTimeout(() => setShowGiggle(false), 1000);
    }, 1500);
  }, [score, onPookieClick]);

  const handleClick = () => {
    // Call the parent's click handler for score (+1 point)
    onPookieClick();
    
    const reactions = ['mischief', 'surprised', 'happy'];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    if (Math.random() < 0.4) {
      setExpression(randomReaction as any);
      setTimeout(() => setExpression('happy'), 1500);
    } else {
      // Random jump to new edge position when clicked
      setPosition(getRandomEdgePosition());
      setExpression('happy');
      setShowGiggle(true);
      setTimeout(() => setShowGiggle(false), 1200);
    }
  };

  return (
    <>
      {/* Pookie Character */}
      <motion.div
        className="fixed cursor-pointer z-20"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        animate={{
          x: isDancing ? [0, -10, 10, -5, 5, 0] : 0,
          y: isHidden ? 100 : [0, -5, 0],
          scale: isHidden ? 0 : 1,
          rotate: isDancing ? [0, -5, 5, -3, 3, 0] : 0,
        }}
        transition={{
          x: { duration: 0.5, repeat: isDancing ? Infinity : 0 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.5 },
          rotate: { duration: 0.8, repeat: isDancing ? Infinity : 0 }
        }}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pookie's Peppa Pig Style Body */}
        <motion.div
          className="relative"
          animate={{
            rotate: isDancing ? [0, -3, 3, -2, 2, 0] : 0,
            scale: isEating ? [1, 1.05, 1] : 1,
          }}
          transition={{
            rotate: { duration: 0.8, repeat: isDancing ? Infinity : 0 },
            scale: { duration: 0.3, repeat: isEating ? 3 : 0 }
          }}
        >
          {/* Head - Rounded like Peppa Pig */}
          <motion.div
            className="relative w-24 h-20 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"
            style={{
              boxShadow: '0 5px 20px rgba(255, 182, 193, 0.4)',
              borderRadius: '50% 50% 45% 45%', // More rounded top
            }}
            animate={{
              y: isDancing ? [0, -3, 0] : [0, -1, 0],
            }}
            transition={{
              y: { duration: isDancing ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Simple Hair Tuft */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />

            {/* Big Expressive Eyes - Peppa Style */}
            <motion.div
              className="absolute top-4 left-3 w-6 h-7 bg-white rounded-full border-3 border-black overflow-hidden"
              animate={{ scaleY: isBlinking ? 0.1 : 1 }}
              transition={{ duration: 0.15 }}
              style={{ borderRadius: '50% 50% 40% 60%' }}
            >
              <motion.div 
                className="w-4 h-5 bg-black rounded-full absolute top-1 left-1"
                animate={{
                  x: expression === 'mischief' ? 1 : expression === 'surprised' ? 0.5 : 0,
                  y: expression === 'surprised' ? -0.5 : 0,
                  scale: expression === 'surprised' ? 1.4 : expression === 'happy' ? 1.2 : 1
                }}
              />
              {/* Large eye shine for expressiveness */}
              <div className="absolute top-1.5 left-2.5 w-1.5 h-1.5 bg-white rounded-full" />
              <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white rounded-full" />
            </motion.div>
            
            <motion.div
              className="absolute top-4 right-3 w-6 h-7 bg-white rounded-full border-3 border-black overflow-hidden"
              animate={{ scaleY: isBlinking ? 0.1 : 1 }}
              transition={{ duration: 0.15 }}
              style={{ borderRadius: '50% 50% 60% 40%' }}
            >
              <motion.div 
                className="w-4 h-5 bg-black rounded-full absolute top-1 left-1"
                animate={{
                  x: expression === 'mischief' ? -1 : expression === 'surprised' ? -0.5 : 0,
                  y: expression === 'surprised' ? -0.5 : 0,
                  scale: expression === 'surprised' ? 1.4 : expression === 'happy' ? 1.2 : 1
                }}
              />
              {/* Large eye shine for expressiveness */}
              <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-white rounded-full" />
              <div className="absolute top-3 left-1.5 w-0.5 h-0.5 bg-white rounded-full" />
            </motion.div>

            {/* Small Snout-like Nose */}
            <motion.div
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
              animate={{
                scale: expression === 'surprised' ? 1.2 : 1,
                y: expression === 'surprised' ? -1 : 0
              }}
            >
              <div className="w-3 h-2 bg-pink-400 rounded-full relative">
                {/* Nostrils */}
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-pink-600 rounded-full" />
                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-pink-600 rounded-full" />
              </div>
            </motion.div>

            {/* Cheerful Smile - Peppa Style */}
            <motion.div
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
              animate={{
                scaleX: expression === 'surprised' ? 0.4 : expression === 'eating' ? [1, 0.6, 1] : 1,
                scaleY: expression === 'eating' ? [1, 1.3, 1] : expression === 'surprised' ? 1.2 : 1,
                rotate: expression === 'mischief' ? [0, 8, -8, 0] : 0
              }}
              transition={{
                scaleX: { duration: expression === 'eating' ? 0.3 : 0.5, repeat: expression === 'eating' ? 3 : 0 },
                scaleY: { duration: 0.3, repeat: expression === 'eating' ? 3 : 0 },
                rotate: { duration: 0.5, repeat: expression === 'mischief' ? 2 : 0 }
              }}
            >
              {expression === 'eating' ? (
                <div className="w-6 h-4 bg-red-600 rounded-full border-2 border-red-700 relative">
                  {/* Tongue */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-1 bg-pink-500 rounded-full" />
                </div>
              ) : expression === 'surprised' ? (
                <div className="w-4 h-5 bg-gray-800 rounded-full" />
              ) : expression === 'mischief' ? (
                <div className="w-8 h-3 border-b-4 border-gray-800 rounded-full" style={{ borderRadius: '0 0 100% 100%' }} />
              ) : (
                <div className="w-7 h-3 border-b-4 border-gray-800 rounded-full" style={{ borderRadius: '0 0 100% 100%' }} />
              )}
            </motion.div>

            {/* Rosy Cheeks - Always visible */}
            <div className="absolute bottom-5 left-1 w-4 h-3 bg-pink-400 rounded-full opacity-70" />
            <div className="absolute bottom-5 right-1 w-4 h-3 bg-pink-400 rounded-full opacity-70" />
            
            {/* Extra rosy when happy or dancing */}
            {(expression === 'happy' || isDancing) && (
              <>
                <motion.div 
                  className="absolute bottom-5 left-1 w-4 h-3 bg-pink-500 rounded-full opacity-40"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-5 right-1 w-4 h-3 bg-pink-500 rounded-full opacity-40"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </>
            )}
          </motion.div>

          {/* Simple Round Body */}
          <motion.div
            className="relative w-18 h-16 bg-gradient-to-b from-red-400 to-red-500 rounded-full mx-3 mt-1"
            style={{
              boxShadow: '0 5px 15px rgba(239, 68, 68, 0.3)',
            }}
            animate={{
              scaleY: isDancing ? [1, 1.03, 1] : 1,
              scaleX: isDancing ? [1, 0.98, 1] : 1,
            }}
            transition={{
              scaleY: { duration: 0.5, repeat: isDancing ? Infinity : 0 },
              scaleX: { duration: 0.5, repeat: isDancing ? Infinity : 0 }
            }}
          >
            {/* Simple dress/shirt details */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full" />
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full" />
          </motion.div>

          {/* Simple Short Arms */}
          <motion.div
            className="absolute top-12 -left-1 w-2 h-8 bg-pink-300 rounded-full"
            animate={{
              rotate: isDancing ? [0, -15, 15, 0] : expression === 'surprised' ? -30 : expression === 'mischief' ? [0, 20, -20, 0] : 0,
              y: isDancing ? [0, -1, 0] : 0,
            }}
            transition={{
              rotate: { duration: 0.6, repeat: isDancing || expression === 'mischief' ? Infinity : 0 },
              y: { duration: 0.6, repeat: isDancing ? Infinity : 0 }
            }}
          />
          <motion.div
            className="absolute top-12 -right-1 w-2 h-8 bg-pink-300 rounded-full"
            animate={{
              rotate: isDancing ? [0, 15, -15, 0] : expression === 'surprised' ? 30 : expression === 'mischief' ? [0, -20, 20, 0] : 0,
              y: isDancing ? [0, -1, 0] : 0,
            }}
            transition={{
              rotate: { duration: 0.6, repeat: isDancing || expression === 'mischief' ? Infinity : 0 },
              y: { duration: 0.6, repeat: isDancing ? Infinity : 0 }
            }}
          />

          {/* Simple Short Legs */}
          <motion.div
            className="absolute bottom-0 left-4 w-3 h-6 bg-pink-300 rounded-full"
            animate={{
              scaleY: isDancing ? [1, 0.9, 1] : 1,
              x: isDancing ? [0, -0.5, 0.5, 0] : 0,
            }}
            transition={{
              scaleY: { duration: 0.3, repeat: isDancing ? Infinity : 0 },
              x: { duration: 0.6, repeat: isDancing ? Infinity : 0 }
            }}
          />
          <motion.div
            className="absolute bottom-0 right-4 w-3 h-6 bg-pink-300 rounded-full"
            animate={{
              scaleY: isDancing ? [1, 0.9, 1] : 1,
              x: isDancing ? [0, 0.5, -0.5, 0] : 0,
            }}
            transition={{
              scaleY: { duration: 0.3, repeat: isDancing ? Infinity : 0 },
              x: { duration: 0.6, repeat: isDancing ? Infinity : 0 }
            }}
          />

          {/* Simple shoes */}
          <div className="absolute -bottom-1 left-3 w-5 h-2 bg-black rounded-full" />
          <div className="absolute -bottom-1 right-3 w-5 h-2 bg-black rounded-full" />

          {/* Hot Dog in hand when eating */}
          {isEating && (
            <motion.div
              className="absolute top-16 right-2 transform rotate-45"
              initial={{ x: 20, opacity: 1, rotate: 45 }}
              animate={{ x: -3, opacity: 0, rotate: 25 }}
              transition={{ duration: 1.5 }}
            >
              <div className="w-6 h-2 bg-yellow-600 rounded-full relative">
                <div className="absolute top-0 left-1 w-0.5 h-2 bg-red-500 rounded-full" />
                <div className="absolute top-0 right-1 w-0.5 h-2 bg-green-500 rounded-full" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sparkles around Pookie */}
        {(isDancing || showGiggle) && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: `${10 + i * 10}%`,
                  left: `${15 + (i % 3) * 25}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  rotate: 360,
                  x: [0, (i % 2 ? 15 : -15)],
                  y: [0, (i % 2 ? -15 : 15)]
                }}
                transition={{
                  duration: 1,
                  repeat: 2,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}

        {/* Reactions */}
        {showGiggle && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold bg-purple-600 px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
          >
            {isDancing ? "Woohoo! 🎉" : isEating ? "Yummy! 😋" : Math.random() < 0.5 ? "Hehe! 😄" : "Hi there! 👋"}
          </motion.div>
        )}

        {/* Gesture Effects */}
        {expression === 'mischief' && (
          <motion.div
            className="absolute -top-8 right-2 text-2xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            😉
          </motion.div>
        )}

        {expression === 'surprised' && (
          <motion.div
            className="absolute -top-8 left-2 text-2xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            😲
          </motion.div>
        )}
      </motion.div>

      {/* Hot Dog Feeding Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-30 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 15px 40px rgba(255, 107, 57, 0.6)',
        }}
        whileTap={{ scale: 0.95 }}
        onClick={eatHotDog}
        disabled={isEating}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🌭 Feed Pookie
      </motion.button>
    </>
  );
}