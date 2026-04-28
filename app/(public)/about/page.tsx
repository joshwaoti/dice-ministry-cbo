import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'Our Story & Mission | DICE Ministry',
};

export default function AboutPage() {
  const about = wixPublicContent.about;

  return (
    <div>
      <section className="relative bg-primary pt-32 pb-20 text-center text-white">
        <div className="absolute inset-0">
          <Image src={about.heroImage} alt="About DICE Ministry" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-primary/78" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{about.eyebrow}</p>
          <h1 className="text-4xl font-display font-bold md:text-6xl">{about.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">{about.subtitle}</p>
            {about.story.map((paragraph) => (
              <p key={paragraph} className="mb-5 text-lg leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_60px_rgba(10,25,49,0.18)]">
            <Image src={about.storyImage} alt="DICE Ministry story" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
        </div>

        <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-3xl border-t-4 border-accent bg-surface p-10 shadow-sm">
            <h2 className="mb-4 text-2xl font-display font-bold text-primary">Our Mission</h2>
            <p className="text-xl text-muted-foreground">{about.mission}</p>
          </div>
          <div className="rounded-3xl border-t-4 border-primary bg-surface p-10 shadow-sm">
            <h2 className="mb-4 text-2xl font-display font-bold text-primary">Our Vision</h2>
            <p className="text-xl text-muted-foreground">{about.vision}</p>
          </div>
        </div>

        <div className="mb-24 grid gap-5 md:grid-cols-3">
          {[about.storyImage, about.heroImage, about.storyImage].map((image, index) => (
            <div key={index} className="relative h-64 overflow-hidden rounded-[24px] border border-border shadow-sm">
              <Image src={image} alt={`About story gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/about/history" className="group block rounded-2xl border border-border p-8 transition-all hover:border-accent hover:shadow-md">
            <h3 className="mb-2 text-xl font-display font-bold text-primary transition-colors group-hover:text-accent">Our History Timeline &rarr;</h3>
            <p className="text-muted-foreground">Trace the journey of DICE Ministry from 2008 to present.</p>
          </Link>
          <Link href="/about/belief" className="group block rounded-2xl border border-border p-8 transition-all hover:border-primary hover:shadow-md">
            <h3 className="mb-2 text-xl font-display font-bold text-primary">What We Believe &rarr;</h3>
            <p className="text-muted-foreground">Discover the faith foundations that guide our ministry.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
