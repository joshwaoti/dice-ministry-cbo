import { Metadata } from 'next';
import Image from 'next/image';
import { AlumniCard } from '@/components/public/AlumniCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import alumniHero from '@/images/diceministry/work (1).avif';
import daisyImage from '@/images/diceministry/Jane Watetu.jpg';
import markImage from '@/images/diceministry/Maurice Agunda.jpg';
import sarahImage from '@/images/diceministry/Christine Sharon.jpg';
import johnImage from '@/images/diceministry/Salim Kwatsima.jpg';

export const metadata: Metadata = {
  title: 'Our Alumni | DICE Ministry',
};

const alumniData = [
  {
    name: 'Daisy Wairimu',
    cohort: 'SURGE 24',
    update: 'Now studying at University of Nairobi',
    quote: 'This experience has been transformative, challenging, and far more enriching than I ever expected. It built a strong foundation for my faith and gave me practical skills for the future.',
    image: daisyImage
  },
  {
    name: 'Mark Omondi',
    cohort: 'Ignite 2023',
    update: 'Started a tech business in Nairobi',
    quote: 'Through the Ignite program, I discovered my true calling. The mentorship and guidance provided by the leaders here gave me clarity in a world full of noise.',
    image: markImage
  },
  {
    name: 'Sarah Muthoni',
    cohort: 'SURGE 24',
    update: 'Volunteering with a local NGO',
    quote: 'The community I found here has become like family. Never have I felt so supported, spiritually fed, and equipped to face the challenges of university life.',
    image: sarahImage
  },
  {
    name: 'John Kamau',
    cohort: 'Ignite 2022',
    update: 'Pursuing a degree in Economics',
    quote: 'More stories coming soon...',
    image: johnImage,
    placeholder: true
  }
];

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

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input id="name" required placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="cohort" className="block text-sm font-medium text-gray-700 mb-1">Cohort Year</label>
                  <Input id="cohort" required placeholder="e.g. Ignite 2023" />
                </div>
              </div>
              <div>
                <label htmlFor="update" className="block text-sm font-medium text-gray-700 mb-1">Current Update</label>
                <Input id="update" required placeholder="e.g. Now studying at University of Nairobi" />
              </div>
              <div>
                <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                <Textarea id="story" required placeholder="How did the program impact you?" rows={4} />
              </div>
              <Button type="button" variant="primary" className="w-full">Submit Story</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
