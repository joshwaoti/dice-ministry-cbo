import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'Our Programs | DICE Ministry',
};

export default function OurWorkPage() {
  const ourWork = wixPublicContent.ourWork;

  return (
    <div>
      <section className="bg-primary px-4 pt-32 pb-20 text-center text-white">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{ourWork.eyebrow}</p>
        <h1 className="mb-4 text-4xl font-display font-bold md:text-5xl">{ourWork.title}</h1>
        <p className="mx-auto max-w-2xl text-xl text-white/80">{ourWork.subtitle}</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ourWork.programs.map((program) => (
            <article
              key={program.title}
              className="group relative isolate flex min-h-[440px] overflow-hidden rounded-[28px] border border-primary/10 bg-primary text-white shadow-[0_20px_60px_rgba(10,25,49,0.18)]"
            >
              <Image src={program.image} alt={program.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/78 to-primary/18" />
              <div className="relative z-10 mt-auto flex w-full flex-col p-8">
                {program.title.includes('Ignite') ? (
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-gold">Flagship Program</p>
                ) : null}
                <h2 className="mb-4 text-3xl font-display font-bold">{program.title}</h2>
                <p className="mb-6 flex-1 text-base leading-7 text-white/84">{program.body}</p>
                {program.title.includes('Ignite') ? (
                  <Link
                    href="/ignite"
                    className="inline-flex w-fit items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
                  >
                    Learn More
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
