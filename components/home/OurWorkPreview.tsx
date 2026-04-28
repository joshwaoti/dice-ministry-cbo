'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import workOne from '@/images/diceministry/Mission-4_edited.jpg';
import workTwo from '@/images/diceministry/Mission-5_edited.jpg';
import workThree from '@/images/diceministry/Edit-171_edited.jpg';

const works = [
  {
    title: 'High School Ministry',
    description: "We're actively engaged in weekly discipleship programs at local high schools.",
    image: workOne,
    slug: '/our-work#high-school',
  },
  {
    title: 'Missions Hosting',
    description: 'We partner with like-minded Christian organizations, both locally and internationally.',
    image: workTwo,
    slug: '/our-work#missions',
  },
  {
    title: 'Ignite Program',
    description: 'A 6-month discipleship & mentorship program for high school graduates.',
    image: workThree,
    slug: '/ignite',
  },
];

export function OurWorkPreview() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-primary md:text-5xl"
          >
            What We Do
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Program highlights from the ministries we run to disciple, equip, and empower young people.
          </motion.p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {works.map((work, index) => {
            const isActive = activeCard === work.title;

            return (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[400px] overflow-hidden rounded-2xl border-l-4 border-transparent text-left shadow-md transition-colors duration-300 hover:border-accent focus-visible:border-accent focus-visible:outline-none"
                onClick={() => setActiveCard((current) => (current === work.title ? null : work.title))}
                onTouchStart={() => setActiveCard(work.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveCard((current) => (current === work.title ? null : work.title));
                  }
                }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className={`object-cover transition-all duration-500 ${
                      isActive ? 'opacity-100 saturate-100' : 'opacity-60 saturate-0 group-hover:opacity-100 group-hover:saturate-100'
                    }`}
                  />
                </div>

                <div
                  className={`absolute inset-0 bg-gradient-to-t to-transparent transition-colors duration-300 ${
                    isActive
                      ? 'from-primary/95 via-primary/50'
                      : 'from-primary/90 via-primary/40 group-hover:from-primary/95 group-hover:via-primary/50'
                  }`}
                />

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="relative z-10 mb-2 text-2xl font-bold text-white">{work.title}</h3>
                  <div className="overflow-hidden">
                    <div
                      className={`flex flex-col items-start gap-4 pt-2 transition-all duration-300 ease-[0.22,1,0.36,1] ${
                        isActive
                          ? 'h-auto translate-y-0 opacity-100'
                          : 'h-0 translate-y-full opacity-0 group-hover:h-auto group-hover:translate-y-0 group-hover:opacity-100'
                      }`}
                    >
                      <p className="text-white/80">{work.description}</p>
                      <Button
                        variant="outline"
                        className="h-9 rounded-full border-white/30 bg-transparent px-4 text-sm text-white transition-colors hover:bg-white hover:text-primary"
                        asChild
                      >
                        <Link href={work.slug}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild className="rounded-full border-border hover:bg-black/5">
            <Link href="/our-work">See All Programs</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
