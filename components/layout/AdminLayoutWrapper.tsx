'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Menu, X, LayoutDashboard, Users, BookOpen, FileCheck, MessageSquare, Megaphone, Settings, LogOut, ClipboardList, FolderKanban, UserCog, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useClerk } from '@clerk/nextjs';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  
  const dashboard = useQuery(api.portal.adminDashboard) as any | undefined;
  const metrics = dashboard?.metrics;
  
  const pendingCount = metrics?.pendingSubmissions ?? 0;
  const unreadMessages = metrics?.unreadMessages ?? 0;
  const newApplications = metrics?.newApplications ?? 0;

  const LINKS = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Applications', href: '/admin/applications', icon: ClipboardList, badge: newApplications > 0 ? newApplications : undefined },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Assignments', href: '/admin/assignments', icon: FileCheck, badge: pendingCount > 0 ? pendingCount : undefined },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined, badgeClass: 'bg-gold text-primary' },
    { name: 'Documents', href: '/admin/documents', icon: FolderKanban },
    { name: 'Admin Users', href: '/admin/users', icon: UserCog },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  ];

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
          {!collapsed ? <span className="font-display font-bold text-lg text-white">DICE Admin</span> : null}
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
                {!collapsed ? <span className="truncate">{link.name}</span> : null}
              </div>
              {!collapsed && link.badge !== undefined && link.badge > 0 && (
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full shrink-0", link.badgeClass || "bg-accent text-white")}>{link.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
          <Settings className="w-5 h-5 shrink-0" /> {!collapsed ? 'Settings' : null}
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors w-full">
          <LogOut className="w-5 h-5 shrink-0" /> {!collapsed ? 'Logout' : null}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden w-full">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary z-20 px-4 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/images/Logo-1-White.png"
              alt="DICE Ministry Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display font-bold text-lg text-white">DICE Admin</span>
        </div>
        <button className="text-white p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn("hidden bg-primary text-white md:flex md:flex-col shrink-0 h-full overflow-y-auto border-r border-white/10 transition-[width] duration-300", desktopSidebarOpen ? 'md:w-64' : 'md:w-[92px]')}>
        {renderSidebarContent(!desktopSidebarOpen)}
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
              {renderSidebarContent(false)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="mt-16 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:mt-0 md:p-8">
        <div className="mx-auto max-w-7xl w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
