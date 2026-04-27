import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Programs | DICE Ministry',
};

export default function OurWorkPage() {
  return (
    <div>
      <section className="bg-primary pt-32 pb-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Our Work</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Discover the programs we run to empower teenagers and young adults in Kenya.
        </p>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-64 bg-gray-200" style={{ backgroundImage: 'url(https://picsum.photos/seed/hs/600/400)', backgroundSize: 'cover' }}></div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-2xl text-primary mb-3">High School Ministry</h3>
              <p className="text-muted flex-1">Weekly discipleship at local high schools encouraging students to walk closely with God and form healthy habits early in life.</p>
            </div>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-64 bg-gray-200" style={{ backgroundImage: 'url(https://picsum.photos/seed/missons/600/400)', backgroundSize: 'cover' }}></div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-2xl text-primary mb-3">Missions Hosting</h3>
              <p className="text-muted flex-1">Short-term missions and partnerships with local and international ministries to provide hands-on service opportunities.</p>
            </div>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col shadow-accent/10 border-accent/30">
            <div className="h-64 bg-gray-200" style={{ backgroundImage: 'url(https://picsum.photos/seed/ignit/600/400)', backgroundSize: 'cover' }}></div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-accent text-sm font-bold tracking-wider uppercase mb-2">Flagship Program</div>
              <h3 className="font-display font-bold text-2xl text-primary mb-3">Ignite Program</h3>
              <p className="text-muted flex-1 mb-6">6-month discipleship and mentorship program for recent high school graduates.</p>
              <Link href="/ignite" className="text-white bg-accent hover:bg-accent/90 py-3 rounded-lg text-center font-medium transition-colors">
                Learn More
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
