import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface FireworksEffectProps {
  trigger: boolean;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export function FireworksEffect({ trigger }: FireworksEffectProps) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (trigger) {
      // Create fewer, more elegant fireworks
      const newFireworks: Firework[] = [];
      const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff9f43'];
      
      // Generate 4 fireworks at different positions (reduced from 6)
      for (let i = 0; i < 4; i++) {
        newFireworks.push({
          id: Date.now() + i,
          x: 25 + Math.random() * 50, // More centered distribution
          y: 25 + Math.random() * 30, // Upper portion of screen
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: i * 0.5, // More spaced out timing
        });
      }
      
      setFireworks(newFireworks);
      
      // Clear fireworks after animation
      setTimeout(() => setFireworks([]), 4000); // Shorter duration
    }
  }, [trigger]);

  if (!trigger || fireworks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {fireworks.map((firework) => (
        <motion.div
          key={firework.id}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: firework.delay }}
        >
          {/* Central burst */}
          <motion.div
            className="absolute w-4 h-4 rounded-full"
            style={{ backgroundColor: firework.color }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ 
              duration: 0.8,
              delay: firework.delay,
              ease: "easeOut"
            }}
          />
          
          {/* Burst particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 12;
            const distance = 50 + Math.random() * 30; // Reduced spread
            
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full" // Smaller particles
                style={{
                  backgroundColor: firework.color,
                  boxShadow: `0 0 6px ${firework.color}`, // Softer glow
                }}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{ 
                  scale: [0, 1, 0.7, 0], // Gentler scaling
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 1, 0.6, 0], // Smoother fade
                }}
                transition={{ 
                  duration: 1.8, // Slightly longer for elegance
                  delay: firework.delay,
                  ease: "easeOut"
                }}
              />
            );
          })}
          
          {/* Secondary sparkles */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8 + Math.PI / 8; // Offset from main particles
            const distance = 30 + Math.random() * 20;
            
            return (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                }}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 0.8, 0],
                }}
                transition={{ 
                  duration: 1.2,
                  delay: firework.delay + 0.2,
                  ease: "easeOut"
                }}
              />
            );
          })}
          
          {/* Trailing sparks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 12;
            const distance = 80 + Math.random() * 30;
            
            return (
              <motion.div
                key={`trail-${i}`}
                className="absolute w-1 h-6 rounded-full"
                style={{
                  backgroundColor: firework.color,
                  opacity: 0.6,
                  transformOrigin: 'center bottom',
                }}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: (angle * 180) / Math.PI,
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(angle) * distance * 0.7,
                  y: Math.sin(angle) * distance * 0.7,
                }}
                transition={{ 
                  duration: 1,
                  delay: firework.delay + 0.1,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.div>
      ))}
      
      {/* Screen flash effect - gentler */}
      <motion.div
        className="absolute inset-0 bg-white/10" // Reduced opacity
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }} // Much gentler flash
        transition={{ 
          duration: 0.8, // Longer, more subtle
          delay: 0.3,
        }}
      />
      
      {/* Celebration text */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }} // Delayed appearance
      >
        <motion.h2
          className="text-4xl font-black text-white mb-4" // Smaller text
          style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.6)', // Softer glow
            background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4, #45b7d1, #f9ca24)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            scale: [1, 1.05, 1], // Gentler scaling
          }}
          transition={{
            backgroundPosition: {
              duration: 2.5, // Slower animation
              repeat: 1, // Less repetition
              ease: "easeInOut",
            },
            scale: {
              duration: 1.5, // Gentler timing
              repeat: 1,
              ease: "easeInOut",
            }
          }}
        >
          🎉 Wonderful! 🎉
        </motion.h2>
        <motion.p
          className="text-xl text-white font-bold" // Smaller text
          style={{
            textShadow: '0 0 15px rgba(255, 255, 255, 0.4)', // Softer glow
          }}
          animate={{
            y: [0, -8, 0], // Gentler movement
          }}
          transition={{
            duration: 1.5, // Slower
            repeat: 1,
            ease: "easeInOut",
          }}
        >
          You reached 100 points!
        </motion.p>
      </motion.div>
    </div>
  );
}