'use client';

import { motion } from 'motion/react';
import Image, { type StaticImageData } from 'next/image';

interface AlumniCardProps {
  name: string;
  cohort: string;
  update: string;
  quote: string;
  image: string | StaticImageData;
  placeholder?: boolean;
}

export function AlumniCard({ name, cohort, update, quote, image, placeholder }: AlumniCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-border flex flex-col h-full"
    >
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-accent/20">
          <Image 
            src={image} 
            alt={name} 
            fill 
            className={`object-cover ${placeholder ? 'grayscale opacity-50' : ''}`}
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-primary">{name}</h3>
          <p className="text-accent font-medium text-sm mb-1">{cohort}</p>
          <p className="text-muted-foreground text-sm line-clamp-1">{update}</p>
        </div>
      </div>
      <blockquote className={`flex-1 text-lg italic ${placeholder ? 'text-gray-400' : 'text-gray-700'}`}>
        &quot;{quote}&quot;
      </blockquote>
    </motion.div>
  );
}
