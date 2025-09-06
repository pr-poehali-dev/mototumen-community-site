/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  swayOffset: number;
  swaySpeed: number;
}

const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Создаем начальные листья
    const initialLeaves: Leaf[] = [];
    for (let i = 0; i < 30; i++) {
      initialLeaves.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        speed: 0.5 + Math.random() * 1.5,
        swayOffset: Math.random() * 100,
        swaySpeed: 0.02 + Math.random() * 0.02,
      });
    }
    setLeaves(initialLeaves);

    const animateLeaves = () => {
      setLeaves(prevLeaves => 
        prevLeaves.map(leaf => {
          let newY = leaf.y + leaf.speed;
          let newX = leaf.x + Math.sin((newY + leaf.swayOffset) * leaf.swaySpeed) * 0.5;
          let newRotation = leaf.rotation + 0.5;

          // Если лист упал за экран, перемещаем наверх
          if (newY > window.innerHeight + 50) {
            newY = -50;
            newX = Math.random() * window.innerWidth;
          }

          // Если лист ушел за границы по X, корректируем
          if (newX < -50) newX = window.innerWidth + 50;
          if (newX > window.innerWidth + 50) newX = -50;

          return {
            ...leaf,
            x: newX,
            y: newY,
            rotation: newRotation,
          };
        })
      );
    };

    const interval = setInterval(animateLeaves, 8);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute text-2xl opacity-70"
          style={{
            left: `${leaf.x}px`,
            top: `${leaf.y}px`,
            transform: `rotate(${leaf.rotation}deg)`,
            transition: 'none',
          }}
        >
          🍁
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;