'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AnnouncementBanner() {
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const announcement = useQuery(api.announcements.listPublicBanner);
  const dismissalKey = announcement ? `dismissed_banner_${announcement._id}` : null;

  useEffect(() => {
    if (!dismissalKey || !announcement) return;
    if (!sessionStorage.getItem(dismissalKey)) {
      const timer = window.setTimeout(() => setVisibleId(announcement._id), 0);
      return () => window.clearTimeout(timer);
    }
  }, [announcement, dismissalKey]);

  const handleDismiss = () => {
    setVisibleId(null);
    if (dismissalKey) sessionStorage.setItem(dismissalKey, 'true');
  };

  if (announcement === undefined) {
    return (
      <div className="flex min-h-10 items-center justify-center bg-primary text-white">
        <LoadingSpinner label="Loading announcement..." className="text-white" />
      </div>
    );
  }
  if (!announcement) return null;
  if (visibleId !== announcement._id) return null;

  return (
    <div className="relative z-50 flex min-h-11 items-center justify-center bg-primary px-12 py-2 text-center text-sm font-medium text-white shadow-sm animate-in slide-in-from-top duration-500">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-semibold text-gold">{announcement.title}</span>
        <span className="text-white/90">{announcement.body}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 rounded p-1 transition-colors hover:bg-white/20"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
