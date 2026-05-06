'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, HeartHandshake, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparentMode = isHome && !isScrolled && !mobileMenuOpen;

  const links = [
    { name: 'Home', href: '/' },
    { 
      name: 'About Us', 
      href: '/about',
      subLinks: [
        { name: 'Our Story', href: '/about' },
        { name: 'Our History', href: '/about/history' },
        { name: 'What We Believe', href: '/about/belief' },
        { name: 'Alumni', href: '/alumni' },
        { name: 'Our Team', href: '/team' },
      ]
    },
    { name: 'Our Work', href: '/our-work' },
    { name: 'Ignite', href: '/ignite', subLinks: [{ name: 'Program Overview', href: '/ignite' }, { name: 'Course Library', href: '/course-library' }] },
    { name: 'Our Team', href: '/team' },
    { name: 'Support Us', href: '/support' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] transition-all duration-300',
        transparentMode ? 'bg-transparent py-4 md:py-6' : 'bg-white/90 backdrop-blur-md shadow-sm py-3 md:py-4 border-b border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={transparentMode ? "/images/Logo-1-White.png" : "/images/Logo-1.png"}
                alt="DICE Ministry Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className={cn('font-display font-bold text-xl tracking-tight transition-colors', 
              transparentMode ? 'text-white' : 'text-primary'
            )}>
              DICE Ministry CBO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 relative',
                    transparentMode ? 'text-white/90' : 'text-primary'
                  )}
                >
                  {link.name}
                  {link.subLinks && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {link.subLinks && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 border-t-2 border-transparent translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-3 w-48 flex flex-col">
                      {link.subLinks.map(sub => (
                        <Link 
                          key={sub.name} 
                          href={sub.href}
                          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-accent hover:bg-orange-50 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant={transparentMode ? 'whiteOutline' : 'outline'} asChild>
              <Link href="/login">Student Login</Link>
            </Button>
            <Button variant={transparentMode ? 'white' : 'primary'} asChild>
              <Link href="/support">Donate</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden rounded-full bg-white/10 p-2 text-primary backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className={cn("w-6 h-6", transparentMode ? "text-white" : "text-primary")} />
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[999] overflow-y-auto bg-white md:hidden"
              >
                <div className="flex min-h-dvh flex-col p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-primary">Menu</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-gray-100 p-2 text-primary"
                      aria-label="Close navigation menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-6">
                    {links.map((link) => (
                      <div key={link.name} className="flex flex-col gap-3">
                        <Link
                          href={link.href}
                          className="block border-b border-gray-100 pb-2 font-display text-2xl font-bold text-primary transition-colors hover:text-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                        {link.subLinks && (
                          <div className="flex flex-col gap-3 border-l-2 border-accent/20 pl-4">
                            {link.subLinks.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className="text-lg font-medium text-gray-600 transition-colors hover:text-accent"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-surface p-4">
                    <Link href="/course-library" className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-4 text-center text-sm font-medium text-primary transition hover:border-accent hover:text-accent" onClick={() => setMobileMenuOpen(false)}>
                      <GraduationCap className="h-5 w-5" />
                      Course Library
                    </Link>
                    <Link href="/team" className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-4 text-center text-sm font-medium text-primary transition hover:border-accent hover:text-accent" onClick={() => setMobileMenuOpen(false)}>
                      <Users className="h-5 w-5" />
                      Our Team
                    </Link>
                    <Link href="/support" className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-4 text-center text-sm font-medium text-primary transition hover:border-accent hover:text-accent" onClick={() => setMobileMenuOpen(false)}>
                      <HeartHandshake className="h-5 w-5" />
                      Support
                    </Link>
                  </div>
                  <div className="mt-auto flex flex-col gap-4 pt-8">
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Student Login</Link>
                    </Button>
                    <Button variant="primary" size="lg" className="w-full bg-accent hover:bg-accent/90" asChild>
                      <Link href="/support" onClick={() => setMobileMenuOpen(false)}>Donate</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
