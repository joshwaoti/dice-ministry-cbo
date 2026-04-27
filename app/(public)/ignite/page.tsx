import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ignite Program | DICE Ministry',
};

export default function IgnitePage() {
  return (
    <div className="py-32 max-w-5xl mx-auto px-4">
      <h1 className="text-5xl md:text-6xl font-display font-bold text-primary text-center mb-6">Ignite (formerly SURGE)</h1>
      <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
        A 6-month fully-sponsored discipleship and mentorship program for recent high school graduates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-surface p-8 rounded-2xl border border-border">
          <h3 className="font-display font-bold text-2xl text-primary mb-4">Discipleship Foundations</h3>
          <p className="text-muted-foreground mb-4">Covers basic concepts on cultivating our relationship with God and discipleship concepts.</p>
        </div>
        <div className="bg-surface p-8 rounded-2xl border border-border">
          <h3 className="font-display font-bold text-2xl text-primary mb-4">Life Skills</h3>
          <p className="text-muted-foreground mb-4">Covers basic concepts on personality traits, career choice, and healthy relationships.</p>
        </div>
        <div className="bg-surface p-8 rounded-2xl border border-border">
          <h3 className="font-display font-bold text-2xl text-primary mb-4">Computer Skills</h3>
          <p className="text-muted-foreground mb-4">Covers eight basic Microsoft Office packages to prepare you for the modern workforce.</p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/apply" className="inline-block bg-accent hover:bg-accent/90 text-white font-medium px-8 py-4 rounded-xl text-lg transition-colors">
          Apply for Ignite
        </Link>
      </div>
    </div>
  );
}
