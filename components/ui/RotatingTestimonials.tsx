'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Quote {
  quote: string;
  author: string;
  cohort: string;
}

export function RotatingTestimonials({ quotes, interval = 5000 }: { quotes: Quote[], interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  return (
    <div className="relative h-32 w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col justify-center"
        >
          <p className="text-xl text-white/90 italic mb-4 font-medium leading-relaxed">
            &quot;{quotes[index].quote}&quot;
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{quotes[index].author}</span>
            <span className="text-white/50 text-sm">— {quotes[index].cohort}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
