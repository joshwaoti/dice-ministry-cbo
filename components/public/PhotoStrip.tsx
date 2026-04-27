'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

export function PhotoStrip({ photos }: { photos: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constrainsRect, setConstrainsRect] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      setConstrainsRect({
        left: -(scrollWidth - clientWidth),
        right: 0
      });
    }
  }, [photos]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">See DICE in Action</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Moments from our programs and community.</p>
      </div>

      <div className="w-full pl-4 sm:pl-6 lg:pl-8 cursor-grab active:cursor-grabbing overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar">
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={constrainsRect}
          dragElastic={0.1}
          className="flex gap-6 w-max pb-8"
        >
          {photos.map((src, i) => (
            <motion.div 
              key={i} 
              className="relative w-[280px] h-[280px] shrink-0 rounded-2xl overflow-hidden shadow-lg snap-center"
              style={{ rotate: i % 2 === 0 ? 2 : -2 }}
              whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
            >
              <Image 
                src={src} 
                alt={`Moment ${i+1}`} 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
                sizes="280px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />
    </section>
  );
}
