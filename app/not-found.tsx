'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-24">
        
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <div className="text-[120px] font-display font-bold text-primary leading-none mb-4">404</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">This page went dark.</h1>
          <p className="text-lg text-muted mb-10">But we can help you find your way.</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button variant="primary" asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted mb-4">Quick Links</p>
            <div className="flex justify-center gap-6">
              <Link href="/about" className="text-primary hover:text-accent transition-colors font-medium">About Us</Link>
              <Link href="/ignite" className="text-primary hover:text-accent transition-colors font-medium">Ignite Program</Link>
              <Link href="/apply" className="text-primary hover:text-accent transition-colors font-medium">Apply Now</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
