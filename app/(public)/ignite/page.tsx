import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { wixPublicContent } from '@/lib/wix-public-content';
import discipleshipImage from '@/images/diceministry/discipleship-foundation.avif';

export const metadata: Metadata = {
  title: 'Ignite Program | DICE Ministry',
};

export default function IgnitePage() {
  const ignite = wixPublicContent.ignite;

  return (
    <div>
      <section className="bg-primary pt-32 pb-20 text-center text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{ignite.eyebrow}</p>
          <h1 className="text-4xl font-display font-bold md:text-6xl">{ignite.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-5">
            {ignite.overview.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-[30px] border border-border shadow-[0_24px_60px_rgba(10,25,49,0.18)]">
            <Image src={ignite.leadImage} alt="Ignite program overview" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">Curriculum</p>
            <h2 className="text-4xl font-display font-bold text-primary">Ignite Courses</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {ignite.courses.map((course) => (
              <article key={course.title} className="overflow-hidden rounded-[28px] border border-border bg-white shadow-sm">
                {course.image ? (
                  <div className="relative h-56">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="relative flex h-56 items-end overflow-hidden bg-primary p-8">
                    <Image src={discipleshipImage} alt={course.title} fill className="object-cover opacity-45" />
                    <div className="absolute inset-0 bg-primary/55" />
                    <div>
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-gold">Core course</p>
                      <h3 className="text-3xl font-display font-bold text-white">{course.title}</h3>
                    </div>
                  </div>
                )}
                <div className="space-y-4 p-8">
                  {course.image ? <h3 className="text-2xl font-display font-bold text-primary">{course.title}</h3> : null}
                  <p className="text-base leading-8 text-muted-foreground">{course.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/apply" className="inline-flex items-center rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white transition hover:bg-accent/90">
              Apply for Ignite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
