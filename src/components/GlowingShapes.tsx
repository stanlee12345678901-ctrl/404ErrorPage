import { motion } from 'motion/react';

export function GlowingShapes() {
  const shapes = [
    { type: 'circle', size: 120, color: '#ff6b9d', x: '10%', y: '20%', delay: 0 },
    { type: 'circle', size: 80, color: '#4ecdc4', x: '85%', y: '15%', delay: 1 },
    { type: 'circle', size: 100, color: '#45b7d1', x: '15%', y: '70%', delay: 2 },
    { type: 'circle', size: 60, color: '#f9ca24', x: '80%', y: '75%', delay: 0.5 },
    { type: 'circle', size: 90, color: '#6c5ce7', x: '50%', y: '10%', delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-20"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: `radial-gradient(circle, ${shape.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${shape.size}px ${shape.color}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
      
      {/* Swirling shapes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`swirl-${i}`}
          className="absolute w-4 h-4 rounded-full"
          style={{
            background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
            boxShadow: '0 0 20px #ff6b9d',
          }}
          animate={{
            x: [0, 200, 400, 200, 0],
            y: [0, -100, 0, 100, 0],
            scale: [1, 1.5, 1, 0.5, 1],
            opacity: [0.6, 1, 0.6, 1, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${50}%`,
          }}
        />
      ))}
    </div>
  );
}