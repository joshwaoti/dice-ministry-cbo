import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'What We Believe | DICE Ministry',
};

export default function BeliefPage() {
  const belief = wixPublicContent.belief;

  return (
    <>
      <section className="bg-primary pt-32 pb-20 text-center text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{belief.eyebrow}</p>
          <h1 className="mb-6 text-4xl font-display font-bold md:text-6xl">{belief.title}</h1>
          <p className="text-xl text-white/88 md:text-2xl">{belief.subtitle}</p>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {belief.statements.map((statement, index) => (
              <article key={statement.title} className="flex h-full flex-col rounded-[26px] border border-border bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 text-sm font-bold text-accent">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-primary">{statement.title}</h2>
                </div>
                <p className="text-base leading-8 text-muted-foreground">{statement.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden bg-[#0A1931]">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="text-[#F4A623] text-8xl font-display leading-none mb-4">&quot;</div>
          <blockquote className="text-3xl md:text-5xl font-display font-medium text-white leading-tight mb-8">
            Don&apos;t let anyone look down on you because you are young, but set an example for the believers in speech,
            in conduct, in love, in faith and in purity.
          </blockquote>
          <cite className="block text-[#F4A623] font-bold text-xl uppercase tracking-widest not-italic">1 Timothy 4:12</cite>
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
