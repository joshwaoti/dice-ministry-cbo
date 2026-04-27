'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import supportImage from '@/images/dice_II.avif';

export function MissionStrip() {
  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-8 leading-tight">
              Discipleship In Context of Evangelism
            </h2>
            <div className="mb-8 border-l-4 border-accent pl-6 py-2">
              <p className="text-lg leading-relaxed text-muted-foreground">
                DICE Ministry CBO (Discipleship In Context of Evangelism) was founded in March 2008 by Maurice Agunda. What began as a small discipleship program at Baptist Chapel in Lucky Summer, Nairobi, has grown into a multi-faceted ministry serving teenagers and young adults across the city.
              </p>
            </div>
            <div className="space-y-3 text-base text-primary/85">
              <p>
                We exist to mobilize resources and design programs that promote godliness, skillfulness, and empowerment.
              </p>
              <p>
                We see a generation of young people who know God, are skillful, and empowered.
              </p>
            </div>
            <Button size="lg" variant="default" asChild className="mt-8">
              <Link href="/about">Our Mission</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] overflow-hidden rounded-3xl shadow-2xl md:h-[500px]"
          >
            <Image
              src={supportImage}
              alt="DICE Ministry students learning together"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
