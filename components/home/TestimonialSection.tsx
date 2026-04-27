'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import testimonialImage from '@/images/dice_II.avif';

const testimonials = [
  {
    quote: "This experience has been transformative, challenging, and far more enriching than I ever expected. It built a strong foundation for my faith and gave me practical skills for the future.",
    author: "Daisy Wairimu",
    cohort: "SURGE 24",
    image: testimonialImage
  },
  {
    quote: "Through the Ignite program, I discovered my true calling. The mentorship and guidance provided by the leaders here gave me clarity in a world full of noise.",
    author: "Mark Omondi",
    cohort: "Ignite 2023",
    image: testimonialImage
  },
  {
    quote: "The community I found here has become like family. Never have I felt so supported, spiritually fed, and equipped to face the challenges of university life.",
    author: "Sarah Muthoni",
    cohort: "SURGE 24",
    image: testimonialImage
  }
];

export function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  return (
    <section 
      className="py-32 bg-white relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.28em] text-gold">
          Testimonial
        </p>
        
        {/* Giant background quote mark */}
        <div className="absolute top-0 left-0 -translate-x-8 -translate-y-12 text-[200px] leading-none font-display text-primary/10 select-none z-0">
          &quot;
        </div>

        <div className="relative z-10 text-center min-h-[300px] flex flex-col justify-center">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d > 0 ? 100 : -100 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d > 0 ? -100 : 100 })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center items-center flex-col px-12"
            >
              {/* 5-star rating */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F4A623] text-[#F4A623]" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-primary leading-tight mb-12">
                &quot;{testimonials[index].quote}&quot;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden relative border border-border">
                  <Image
                    src={testimonials[index].image}
                    alt={testimonials[index].author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left flex flex-col justify-center">
                  <div className="font-bold text-primary">{testimonials[index].author}</div>
                  <div className="text-accent font-medium text-sm">{testimonials[index].cohort}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:-mx-8 z-20 pointer-events-none">
            <button 
              onClick={handlePrev}
              className="p-2 sm:p-3 rounded-full bg-white shadow-md text-primary hover:text-accent hover:bg-gray-50 transition-colors pointer-events-auto"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="p-2 sm:p-3 rounded-full bg-white shadow-md text-primary hover:text-accent hover:bg-gray-50 transition-colors pointer-events-auto"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i === index ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
