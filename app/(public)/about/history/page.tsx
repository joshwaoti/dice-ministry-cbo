import { Metadata } from 'next';
import Image from 'next/image';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'Our History | DICE Ministry',
};

export default function HistoryPage() {
  const history = wixPublicContent.history;
  const [baptistSection, highSchoolSection, surgeSection, missionsSection] = history.sections;

  return (
    <div>
      <section className="bg-primary pt-32 pb-20 text-center text-white">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{history.eyebrow}</p>
          <h1 className="text-4xl font-display font-bold md:text-6xl">{history.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            {history.intro.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-border shadow-[0_24px_60px_rgba(10,25,49,0.14)]">
            <Image src={history.leadImage} alt="Maurice Agunda portrait" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-4 rounded-[28px] border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">2008-2009</p>
              <h2 className="text-3xl font-display font-bold text-primary">{baptistSection.title}</h2>
              <p className="text-base leading-8 text-muted-foreground">{baptistSection.body}</p>
            </div>
            <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-border shadow-sm">
              <Image src={baptistSection.image!} alt={baptistSection.title} fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="relative order-2 h-[360px] overflow-hidden rounded-[28px] border border-border shadow-sm lg:order-1">
              <Image src={highSchoolSection.image!} alt={highSchoolSection.title} fill className="object-cover" />
            </div>
            <div className="order-1 space-y-4 rounded-[28px] border border-border bg-white p-8 shadow-sm lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">2010-2011</p>
              <h2 className="text-3xl font-display font-bold text-primary">{highSchoolSection.title}</h2>
              <p className="text-base leading-8 text-muted-foreground">{highSchoolSection.body}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="max-w-4xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">2012</p>
              <h2 className="text-3xl font-display font-bold text-primary">{surgeSection.title}</h2>
              <p className="text-base leading-8 text-muted-foreground">{surgeSection.body}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {history.galleries.surge.map((image, index) => (
                <div key={index} className="relative h-72 overflow-hidden rounded-[24px] border border-border shadow-sm">
                  <Image src={image} alt={`SURGE history gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="max-w-4xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">2015 to present</p>
              <h2 className="text-3xl font-display font-bold text-primary">{missionsSection.title}</h2>
              <p className="text-base leading-8 text-muted-foreground">{missionsSection.body}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {history.galleries.missions.map((image, index) => (
                <div key={index} className="relative h-72 overflow-hidden rounded-[24px] border border-border shadow-sm">
                  <Image src={image} alt={`Missions history gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
