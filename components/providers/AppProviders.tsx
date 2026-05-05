'use client';

import { useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const convex = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder.convex.cloud';
    return new ConvexReactClient(convexUrl);
  }, []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </ConvexProviderWithClerk>
  );
}
