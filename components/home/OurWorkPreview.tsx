'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import supportImage from '@/images/dice_II.avif';

const works = [
  {
    title: 'High School Ministry',
    description: "We're actively engaged in weekly discipleship programs at local high schools.",
    image: supportImage,
    slug: '/our-work#high-school'
  },
  {
    title: 'Missions Hosting',
    description: 'We partner with like-minded Christian organizations, both locally and internationally.',
    image: supportImage,
    slug: '/our-work#missions'
  },
  {
    title: 'Ignite Program',
    description: 'A 6-month discipleship & mentorship program for high school graduates.',
    image: supportImage,
    slug: '/ignite'
  }
];

export function OurWorkPreview() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-primary mb-4"
          >
            What We Do
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Program highlights from the ministries we run to disciple, equip, and empower young people.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {works.map((work, index) => (
            <motion.div
              key={work.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-[400px] relative rounded-2xl overflow-hidden group border-l-4 border-transparent hover:border-accent transition-colors duration-300 shadow-md"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover saturate-0 opacity-60 group-hover:saturate-100 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent group-hover:from-primary/95 group-hover:via-primary/50 transition-colors duration-300" />
              
              {/* Content Box */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-display font-bold text-2xl text-white mb-2 relative z-10">{work.title}</h3>
                
                {/* Sliding description container */}
                <div className="overflow-hidden">
                  <div className="translate-y-full h-0 opacity-0 group-hover:h-auto group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[0.22,1,0.36,1] flex flex-col items-start gap-4 pt-2">
                    <p className="text-white/80">{work.description}</p>
                    <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-primary transition-colors text-sm h-9 px-4 rounded-full" asChild>
                      <Link href={work.slug}>Learn More <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild className="rounded-full border-border hover:bg-black/5">
            <Link href="/our-work">See All Programs</Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
