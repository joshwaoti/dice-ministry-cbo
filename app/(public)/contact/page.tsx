import { Metadata } from 'next';
import Image from 'next/image';
import { ContactForm } from '@/components/public/ContactForm';
import { ImageCarousel } from '@/components/public/ImageCarousel';
import { wixPublicContent } from '@/lib/wix-public-content';

export const metadata: Metadata = {
  title: 'Contact Us | DICE Ministry',
};

export default function ContactPage() {
  const contact = wixPublicContent.contact;

  return (
    <div>
      <section className="relative bg-primary pt-32 pb-20 text-center text-white">
        <div className="absolute inset-0">
          <Image src={contact.heroImage} alt="Contact DICE Ministry" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-gold">{contact.eyebrow}</p>
          <h1 className="text-4xl font-display font-bold md:text-6xl">{contact.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-border bg-surface p-8 shadow-sm md:p-10">
            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-display font-bold text-primary">{contact.introTitle}</h2>
              <p className="text-base leading-8 text-muted-foreground">{contact.intro}</p>
            </div>
            <ContactForm labels={contact.labels} success={contact.success} />
          </div>

          <div className="space-y-6">
            <ImageCarousel images={contact.gallery} altPrefix="Contact gallery" />
            <div className="space-y-5 rounded-[28px] border border-border bg-white p-8 shadow-sm">
              {contact.details.map((detail) => (
                <div key={detail.title} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="mb-2 text-base font-semibold text-primary">{detail.title}</h3>
                  <p className="whitespace-pre-line text-base leading-7 text-muted-foreground">{detail.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
