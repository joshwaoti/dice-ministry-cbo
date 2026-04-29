'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type PortalKind = 'admin' | 'student';

export function PortalAuthGate({ kind, children }: { kind: PortalKind; children: ReactNode }) {
  const router = useRouter();
  const profile = useQuery(api.profiles.current);

  useEffect(() => {
    if (!profile) return;
    if (profile.status !== 'active') {
      router.replace('/login?status=pending');
      return;
    }
    if (kind === 'admin' && !['super_admin', 'admin', 'moderator'].includes(profile.role)) {
      router.replace('/student/dashboard');
    }
    if (kind === 'student' && profile.role !== 'student') {
      router.replace('/admin/dashboard');
    }
  }, [kind, profile, router]);

  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-primary">
        Loading portal...
      </div>
    );
  }

  if (!profile || profile.status !== 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-primary">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
