import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium text-primary">
                    {contact.labels.firstName}
                  </label>
                  <Input id="first-name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium text-primary">
                    {contact.labels.lastName}
                  </label>
                  <Input id="last-name" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-primary">
                  {contact.labels.email}
                </label>
                <Input id="email" type="email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary">
                  {contact.labels.message}
                </label>
                <textarea
                  id="message"
                  className="min-h-[180px] w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                />
              </div>
              <Button size="lg" variant="primary" type="button">
                {contact.labels.submit}
              </Button>
            </form>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{contact.success}</p>
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
