'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { BookOpen, GraduationCap, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const cards = [
  {
    title: 'Our Programs',
    description: 'High School Ministry, Missions Hosting, and Ignite.',
    icon: Heart,
    href: '/our-work',
    delay: 0,
  },
  {
    title: 'Student Services',
    description: 'Access the course library and student learning resources.',
    icon: BookOpen,
    href: '/course-library',
    delay: 0.1,
  },
  {
    title: 'Apply for Ignite',
    description: 'Join our fully-sponsored 6-month discipleship program.',
    icon: GraduationCap,
    href: '/apply',
    delay: 0.2,
  },
];

export function QuickNavCards() {
  return (
    <section className="relative z-20 -mt-16 md:-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.28em] text-white/70 md:text-left">
          Quick Links
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: card.delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={card.href} className="block group">
                <Card className="h-full border border-white/15 bg-white/95 shadow-[0_24px_60px_rgba(10,25,49,0.12)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(10,25,49,0.18)]">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/6 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                      <card.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2 text-primary">{card.title}</h3>
                    <p className="mb-8 flex-grow text-muted-foreground">{card.description}</p>
                    <div className="flex items-center text-accent font-medium mt-auto group-hover:translate-x-2 transition-transform">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
