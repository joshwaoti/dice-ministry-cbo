import { Metadata } from 'next';
import { BeliefGrid } from '@/components/public/BeliefGrid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'What We Believe | DICE Ministry',
};

export default function BeliefPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/belief/1920/1080")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">What We Believe</h1>
          <p className="text-xl md:text-2xl text-white/90">The convictions that ground everything we do.</p>
        </div>
      </section>

      <section className="py-24 bg-surface relative -mt-8 rounded-t-3xl border-t border-border z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BeliefGrid />
        </div>
      </section>
      
      {/* Scripture pull-quote with slow background pan */}
      <section className="py-32 relative overflow-hidden bg-[#0A1931]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 animate-pan-slow pointer-events-none"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/scripture/1920/1080")', backgroundSize: '120%' }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pan-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-pan-slow {
            animation: pan-slow 60s ease-in-out infinite;
          }
        `}} />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="text-[#F4A623] text-8xl font-display leading-none mb-4">&quot;</div>
          <blockquote className="text-3xl md:text-5xl font-display font-medium text-white leading-tight mb-8">
            Don&apos;t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.
          </blockquote>
          <cite className="block text-[#F4A623] font-bold text-xl uppercase tracking-widest not-italic">
            1 Timothy 4:12
          </cite>
        </div>
      </section>

      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">See Our Beliefs in Action</h2>
          <Button size="lg" variant="primary" asChild>
            <Link href="/our-work">Learn more about our programs</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
