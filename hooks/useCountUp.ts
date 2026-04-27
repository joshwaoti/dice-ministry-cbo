'use client';
import { useState, useEffect } from 'react';

export function useCountUp(end: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      
      if (progress < duration) {
        // Calculate the current value using easing
        const currentCount = Math.floor(end * easeOutQuart(progress / duration));
        setCount(currentCount);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it ends exactly on the target
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, start]);

  return count;
}
