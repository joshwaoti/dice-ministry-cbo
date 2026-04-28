'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import igniteImage from '@/images/diceministry/ignite.webp';

export function IgniteFeature() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Ignite
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl">
              IGNITE is a 6-month fully-sponsored program designed to equip recent high school graduates for success in campus life, community involvement, or the marketplace.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                Discipleship Foundations
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                Peer Mentoring &amp; Practical Life Skills
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                Basic Computer Skills
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="primary" asChild>
                <Link href="/ignite">Learn About Ignite</Link>
              </Button>
              <Button size="lg" variant="whiteOutline" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
          >
            <Image
              src={igniteImage}
              alt="Ignite Program students"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
