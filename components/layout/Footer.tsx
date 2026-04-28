import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-xl font-bold text-white">
                D
              </div>
              <span className="font-display text-xl font-bold tracking-tight">DICE Ministry</span>
            </Link>
            <p className="text-white/70">
              Discipleship In Context of Evangelism. Empowering teenagers and young adults in Kenya to maximize their
              God-given potential.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:contents">
            <div>
              <h3 className="mb-6 text-lg font-bold text-gold">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-white/70 transition-colors hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-white/70 transition-colors hover:text-white">About Us</Link></li>
                <li><Link href="/our-work" className="text-white/70 transition-colors hover:text-white">Our Work</Link></li>
                <li><Link href="/team" className="text-white/70 transition-colors hover:text-white">Our Team</Link></li>
                <li><Link href="/contact" className="text-white/70 transition-colors hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold text-gold">Ignite Program</h3>
              <ul className="space-y-4">
                <li><Link href="/ignite" className="text-white/70 transition-colors hover:text-white">Program Overview</Link></li>
                <li><Link href="/ignite/courses" className="text-white/70 transition-colors hover:text-white">Course Library</Link></li>
                <li><Link href="/apply" className="text-white/70 transition-colors hover:text-white">Apply for Ignite</Link></li>
                <li><Link href="/student" className="text-white/70 transition-colors hover:text-white">Student Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-sm">
            <h3 className="mb-6 text-lg font-bold text-gold">Contact Info</h3>
            <ul className="space-y-4 text-white/70">
              <li>Baba Dogo, Kanyoro House</li>
              <li>3rd Floor, Nairobi</li>
              <li>P.O. Box 15368-00400</li>
              <li className="pt-2 text-accent/90 hover:text-accent"><a href="tel:+254725248788">+254 725 248 788</a></li>
              <li className="text-accent/90 hover:text-accent"><a href="mailto:diceministrykenya@gmail.com">diceministrykenya@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} Ministry CBO. All rights reserved.</p>
          <a
            href="https://otieno.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            Made with 🧡 Zitrion.
          </a>
        </div>
      </div>
    </footer>
  );
}
