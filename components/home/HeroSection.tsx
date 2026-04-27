'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/images/dice_I.avif';

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary">
      <Image
        src={heroImage}
        alt="DICE Ministry participants gathered together"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,25,49,0.94)_0%,rgba(10,25,49,0.88)_38%,rgba(10,25,49,0.45)_62%,rgba(10,25,49,0.08)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-gold"
          >
            DICE Ministry CBO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-5xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-[4rem]"
          >
            Empowering Teenagers &amp; Young Adults
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/88 md:text-xl"
          >
            A faith-based organization dedicated to helping young people maximize their God-given potential through spiritual principles.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button size="lg" variant="primary" asChild>
              <Link href="/ignite">Explore Ignite</Link>
            </Button>
            <Button size="lg" variant="whiteOutline" asChild>
              <Link href="/support">Support Us</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 lg:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
        >
          <ChevronDown className="h-5 w-5 text-white/75" />
        </motion.div>
      </motion.div>
    </section>
  );
}
