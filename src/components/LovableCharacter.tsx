import { motion } from 'motion/react';
import { useState } from 'react';

export function LovableCharacter() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setIsClicked(true);
    setClickCount(prev => prev + 1);
    setTimeout(() => setIsClicked(false), 500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Main blob body */}
        <motion.div
          className="w-32 h-32 rounded-full relative"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
          }}
          animate={{
            scale: isClicked ? 1.2 : isHovered ? 1.1 : 1,
            rotate: isClicked ? 360 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {/* Eyes */}
          <motion.div
            className="absolute top-8 left-6 w-4 h-4 bg-white rounded-full"
            animate={{
              scaleY: isHovered ? 0.1 : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
          </motion.div>
          <motion.div
            className="absolute top-8 right-6 w-4 h-4 bg-white rounded-full"
            animate={{
              scaleY: isHovered ? 0.1 : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
          </motion.div>

          {/* Mouth */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: isHovered ? 1.3 : 1,
            }}
          >
            <div className="w-8 h-4 border-b-4 border-white rounded-full" />
          </motion.div>

          {/* Sparkles around character */}
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${10 + (i % 3) * 30}%`,
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    rotate: 360,
                    x: [0, (i % 2 ? 20 : -20)],
                    y: [0, (i % 2 ? -20 : 20)]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Bounce effect on click */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-yellow-300"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>

      {/* Click counter */}
      <motion.div
        className="text-center"
        animate={{ scale: clickCount > 0 ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-white/80">Clicks: {clickCount}</p>
        <p className="text-white/60 text-sm">Keep clicking me!</p>
      </motion.div>
    </div>
  );
}