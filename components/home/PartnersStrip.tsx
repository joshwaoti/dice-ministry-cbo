'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import engagedInternationalLogo from '@/images/engaged internation.avif';
import reignMinistriesLogo from '@/images/reign-ministries.avif';
import gpcBroncityLogo from '@/images/gpt-hebron.avif';

const partners = [
  { name: 'Engaged International', logo: engagedInternationalLogo },
  { name: 'Reign Ministries', logo: reignMinistriesLogo },
  { name: 'GPC The Broncity', logo: gpcBroncityLogo }
];

export function PartnersStrip() {
  return (
    <section className="py-20 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8"
        >
          Our Partners
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex w-[220px] flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-6 py-7 text-center transition-colors hover:border-accent/30 hover:bg-white"
            >
              <div className="relative h-14 w-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain grayscale transition duration-300 group-hover:grayscale-0"
                  sizes="220px"
                />
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/70">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
