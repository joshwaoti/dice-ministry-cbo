'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBanner({ message, linkText, linkHref }: { message: string, linkText: string, linkHref: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage first
    if (!sessionStorage.getItem('dismissed_banner')) {
      // Delay display by 800ms
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('dismissed_banner', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-orange-500 text-white h-9 flex items-center justify-center px-4 relative text-sm font-medium animate-in slide-in-from-top duration-500 z-50">
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <Link href={linkHref} className="underline hover:text-white/80 transition-colors">
          {linkText}
        </Link>
      </div>
      <button 
        onClick={handleDismiss}
        className="absolute right-4 hover:bg-white/20 p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
