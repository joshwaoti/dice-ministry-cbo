'use client';

import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';

interface BeliefCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export function BeliefCard({ icon: Icon, title, description, delay }: BeliefCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 8, perspective: 800, y: 30 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-border group hover:shadow-md transition-shadow h-full flex flex-col"
    >
      <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-accent" />
      </div>
      <h3 className="font-display font-bold text-2xl text-primary mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </motion.div>
  );
}
