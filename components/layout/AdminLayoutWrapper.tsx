'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, BookOpen, FileCheck, MessageSquare, Megaphone, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const LINKS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Assignments', href: '/admin/assignments', icon: FileCheck, badge: 5 },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: 1, badgeClass: 'bg-gold text-primary' },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const renderSidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white">D</div>
          <span className="font-display font-bold text-lg text-white">DICE Admin</span>
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto w-full">
        {LINKS.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors w-full",
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5 shrink-0" /> 
                <span className="truncate">{link.name}</span>
              </div>
              {link.badge && (
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full shrink-0", link.badgeClass || "bg-accent text-white")}>{link.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
          <Settings className="w-5 h-5 shrink-0" /> Settings
        </Link>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
          <LogOut className="w-5 h-5 shrink-0" /> Logout
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden w-full">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary z-20 px-4 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white">D</div>
          <span className="font-display font-bold text-lg text-white">DICE Admin</span>
        </div>
        <button className="text-white p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col shrink-0 h-full overflow-y-auto border-r border-white/10">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
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
              {renderSidebarContent()}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 w-full min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
