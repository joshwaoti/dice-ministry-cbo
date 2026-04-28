import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'Support Us | DICE Ministry',
};

export default function SupportPage() {
  const support = wixPublicContent.support;

  return (
    <div>
      <section className="bg-primary pt-32 pb-20 text-center text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{support.eyebrow}</p>
          <h1 className="mb-6 text-4xl font-display font-bold md:text-6xl">{support.title}</h1>
          <p className="mx-auto max-w-3xl text-xl text-white/84">{support.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="relative h-[420px] overflow-hidden rounded-[30px] border border-border shadow-[0_24px_60px_rgba(10,25,49,0.16)]">
            <Image src={support.leadImage} alt="Support DICE Ministry" fill className="object-cover" />
          </div>
          <div className="rounded-[28px] border border-border bg-surface p-10 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">Partnership</p>
            <h2 className="mb-5 text-3xl font-display font-bold text-primary">Every gift strengthens the work</h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Your generosity helps DICE Ministry keep discipleship, mentorship, and equipping opportunities within reach for teenagers and young adults.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {support.methods.map((method) => (
            <Card key={method.title} className={method.href ? 'border-accent shadow-md' : ''}>
              <CardContent className="flex h-full flex-col p-8">
                <CardTitle className="mb-4 text-2xl text-primary">{method.title}</CardTitle>
                <div className="mb-6 flex-1 space-y-3">
                  {method.details.map((detail) =>
                    detail.includes('Paybill') || detail.includes('Account') ? (
                      <div key={detail} className="rounded-xl bg-primary/5 p-4 text-center font-semibold text-primary">
                        {detail}
                      </div>
                    ) : (
                      <p key={detail} className="text-base leading-7 text-muted-foreground">
                        {detail}
                      </p>
                    ),
                  )}
                </div>
                {method.href ? (
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
                  >
                    {method.cta}
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
