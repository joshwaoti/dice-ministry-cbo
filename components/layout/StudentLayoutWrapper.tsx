'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Menu, X, LayoutDashboard, BookOpen, FileText, MessageSquare, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useClerk } from '@clerk/nextjs';

type LinkItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

const LINKS_DEFAULT: LinkItem[] = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/student/courses', icon: BookOpen },
  { name: 'Assignments', href: '/student/assignments', icon: FileText },
  { name: 'Messages', href: '/student/messages', icon: MessageSquare },
];

export function StudentLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  
  const dashboard = useQuery(api.portal.studentDashboard) as any | undefined;
  const submissions = dashboard?.submissions ?? [];
  const conversations = dashboard?.conversations ?? [];
  
  const pendingCount = submissions.filter((s: any) => s.status === 'pending_review').length;
  const unreadMessages = conversations.filter((c: any) => c.unreadCount > 0).length;

  const LINKS = LINKS_DEFAULT.map(link => {
    if (link.name === 'Assignments') {
      return { ...link, badge: pendingCount > 0 ? pendingCount : undefined };
    }
    if (link.name === 'Messages') {
      return { ...link, badge: unreadMessages > 0 ? unreadMessages : undefined };
    }
    return link;
  });

  const handleLogout = () => {
    signOut(() => router.push('/'));
  };

  const renderSidebarContent = (collapsed = false) => (
    <>
      <div className="p-6 flex items-center justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/images/Logo-1-White.png"
                alt="DICE Ministry Logo"
                fill
                className="object-contain"
              />
            </div>
            {!collapsed ? <span className="font-display font-bold text-lg text-white">DICE Student</span> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="hidden rounded-full bg-white/10 p-2 text-white md:inline-flex"
              onClick={() => setDesktopSidebarOpen((open) => !open)}
              aria-label={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {desktopSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  {!collapsed ? link.name : null}
                </div>
                {!collapsed && link.badge !== undefined && link.badge > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <User className="w-5 h-5" /> {!collapsed ? 'Profile' : null}
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors w-full">
            <LogOut className="w-5 h-5" /> {!collapsed ? 'Logout' : null}
          </button>
        </div>
      </>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden w-full">
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary z-20 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/images/Logo-1-White.png"
              alt="DICE Ministry Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-bold text-lg text-white">DICE Student</span>
        </div>
        <button className="text-white p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <aside className={cn('hidden bg-primary text-white md:flex md:flex-col shrink-0 overflow-y-auto transition-[width] duration-300', desktopSidebarOpen ? 'md:w-64' : 'md:w-[92px]')}>
        {renderSidebarContent(!desktopSidebarOpen)}
      </aside>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 bottom-0 left-0 w-[280px] max-w-[80vw] bg-primary flex flex-col shadow-xl"
            >
              {renderSidebarContent(false)}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="mt-16 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:mt-0 md:p-8">
        <div className="mx-auto w-full max-w-7xl min-w-0">{children}</div>
      </main>
    </div>
  );
}
