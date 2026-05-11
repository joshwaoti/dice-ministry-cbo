import { Metadata } from 'next';
import Image from 'next/image';
import { AlumniCard } from '@/components/public/AlumniCard';
import { AlumniStoryForm } from '@/components/public/AlumniStoryForm';
import { testimonials } from '@/components/home/testimonials';
import alumniHero from '@/images/diceministry/work (1).avif';

export const metadata: Metadata = {
  title: 'Our Alumni | DICE Ministry',
};

const alumniData = testimonials.map((t) => ({
  name: t.author,
  cohort: t.cohort,
  quote: t.quote,
  image: typeof t.image === 'string' ? t.image : (t.image as any)?.src || '/images/dice_II.avif',
  update: 'Alumni updates coming soon...',
}));

export default function AlumniPage() {
  return (
    <>
      <section className="bg-primary py-24 md:py-32 relative overflow-hidden">
        <Image src={alumniHero} alt="DICE alumni" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-primary/72" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Our Alumni</h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">Lives Changed, Futures Shaped.</p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {alumniData.map((alumni, i) => (
              <AlumniCard key={i} {...alumni} />
            ))}
          </div>

          <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-2">Are you an Ignite alumnus?</h2>
              <p className="text-muted">Share your story. Submissions go to our admin team for review before publishing.</p>
            </div>

            <AlumniStoryForm />
          </div>
        </div>
      </section>
    </>
  );
}
