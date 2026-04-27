import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-display font-bold text-xl">
                D
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                DICE Ministry
              </span>
            </Link>
            <p className="text-white/70">
              Discipleship In Context of Evangelism. Empowering teenagers and young adults in Kenya to maximize their God-given potential.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-gold">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/our-work" className="text-white/70 hover:text-white transition-colors">Our Work</Link></li>
              <li><Link href="/team" className="text-white/70 hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-gold">Ignite Program</h3>
            <ul className="space-y-4">
              <li><Link href="/ignite" className="text-white/70 hover:text-white transition-colors">Program Overview</Link></li>
              <li><Link href="/ignite/courses" className="text-white/70 hover:text-white transition-colors">Course Library</Link></li>
              <li><Link href="/apply" className="text-white/70 hover:text-white transition-colors">Apply for Ignite</Link></li>
              <li><Link href="/student" className="text-white/70 hover:text-white transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-gold">Contact Info</h3>
            <ul className="space-y-4 text-white/70">
              <li>Baba Dogo, Kanyoro House</li>
              <li>3rd Floor, Nairobi</li>
              <li>P.O. Box 15368-00400</li>
              <li className="pt-2 text-accent/90 hover:text-accent"><a href="tel:+254725248788">+254 725 248 788</a></li>
              <li className="text-accent/90 hover:text-accent"><a href="mailto:diceministrykenya@gmail.com">diceministrykenya@gmail.com</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© {(new Date()).getFullYear()} DICE Ministry CBO. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
