'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CalendarDays, Users, HandHeart, GraduationCap } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

function StatItem({ icon: Icon, value, suffix, label, inView, delay }: any) {
  const count = useCountUp(value, 2000, inView);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center px-4"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/6">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="mb-2 whitespace-nowrap font-display text-5xl font-bold leading-none text-primary md:text-7xl">
        {count}{suffix}
      </div>
      <div className="whitespace-nowrap text-base font-medium text-muted-foreground md:text-lg">{label}</div>
    </motion.div>
  );
}

export function ImpactStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    { value: 17, suffix: '+', label: 'Years Active', icon: CalendarDays },
    { value: 500, suffix: '+', label: 'Students Trained', icon: Users },
    { value: 5, suffix: '+', label: 'Partner Organizations', icon: HandHeart },
    { value: 3, suffix: '+', label: 'Programs Running', icon: GraduationCap },
  ];

  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="text-center mb-16 px-4">
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-5xl">Our Built Impact</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Lives changed and futures shaped through discipleship, mentorship, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-3xl border border-border bg-white px-6 py-10 shadow-sm">
              <StatItem 
                {...stat} 
                inView={isInView}
                delay={0.1 * i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
