import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

export function ConfettiEffect({ trigger }: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff9f43'];
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 50 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 50,
      velocityY: Math.random() * -30 - 10,
    }));

    setConfetti(newConfetti);

    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  }, [trigger]);

  const renderShape = (piece: ConfettiPiece) => {
    const baseStyle = {
      width: piece.size,
      height: piece.size,
      backgroundColor: piece.color,
    };

    switch (piece.shape) {
      case 'circle':
        return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div style={baseStyle} />;
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
            }}
          />
        );
      default:
        return <div style={baseStyle} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
          }}
          initial={{
            rotate: piece.rotation,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            rotate: piece.rotation + 360,
            x: piece.velocityX,
            y: piece.velocityY + 200,
            opacity: 0,
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        >
          {renderShape(piece)}
        </motion.div>
      ))}
    </div>
  );
}