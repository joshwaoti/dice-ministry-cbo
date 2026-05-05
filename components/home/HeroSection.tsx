'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/images/dice_I.avif';

const heroSlides = [
  { src: '/images/Edit-215.jpg.jpeg', alt: 'DICE Ministry event' },
  { src: '/images/SURGE 24 Retreat-17.jpg.jpeg', alt: 'SURGE 24 Retreat' },
  { src: '/images/SURGE 24-24.jpg.jpeg', alt: 'SURGE 24 gathering' },
  { src: heroImage.src, alt: 'DICE Ministry participants gathered together' },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#111111]">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={`object-cover object-center transition-opacity duration-[1800ms] ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="100vw"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.9)_0%,rgba(17,17,17,0.76)_38%,rgba(17,17,17,0.38)_68%,rgba(17,17,17,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_45%,rgba(246,172,85,0.18),transparent_34%)]" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
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
            Walking with young people as they grow in faith, purpose, leadership, and community.
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

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
