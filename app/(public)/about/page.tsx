import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Story & Mission | DICE Ministry',
};

export default function AboutPage() {
  return (
    <div>
      <section className="h-[50vh] min-h-[400px] relative flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/diceabout/1920/1080")' }}
        >
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">About Us</h1>
          <p className="text-gold font-medium tracking-wider uppercase text-sm">Empowering the Next Generation</p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              DICE [Discipleship In Context of Evangelism] Ministry CBO is a faith-based organization that was founded in March 2008 by Maurice Agunda.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              It was founded as a 9-month discipleship and evangelism training program for the youth. It is duly registered as a community-based organization by the Directorate of Social Development in accordance with The Community Groups Registration Act.
            </p>
            <p className="text-lg text-muted-foreground">
              DICE is dedicated to helping young people maximize their God-given potential by applying spiritual principles in all spheres of life resulting in a lifestyle that is balanced, focused, and purposeful.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
             <Image src="https://picsum.photos/seed/hist/800/600" alt="History" fill className="object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <div className="bg-surface rounded-3xl p-10 border-t-4 border-accent shadow-sm">
            <h3 className="font-display font-bold text-2xl text-primary mb-4">Our Mission</h3>
            <p className="text-xl text-muted-foreground">&quot;We exist to mobilize resources and design programs that promote godliness, skillfulness, and empowerment!&quot;</p>
          </div>
          <div className="bg-surface rounded-3xl p-10 border-t-4 border-primary shadow-sm">
            <h3 className="font-display font-bold text-2xl text-primary mb-4">Our Vision</h3>
            <p className="text-xl text-muted-foreground">&quot;We see a generation of young people who know God, are skillful, and empowered!&quot;</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/about/history" className="group block p-8 border border-border rounded-2xl hover:border-accent hover:shadow-md transition-all">
            <h4 className="font-display font-bold text-xl text-primary mb-2 group-hover:text-accent transition-colors">Our History Timeline &rarr;</h4>
            <p className="text-muted-foreground">Trace the journey of DICE Ministry from 2008 to present.</p>
          </Link>
          <Link href="/about/belief" className="group block p-8 border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all">
            <h4 className="font-display font-bold text-xl text-primary mb-2 group-hover:text-primary transition-colors">What We Believe &rarr;</h4>
            <p className="text-muted-foreground">Discover the faith foundations that guide our ministry.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
