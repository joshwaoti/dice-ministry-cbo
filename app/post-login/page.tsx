'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const FIRST_SUPER_ADMIN_EMAIL = 'joshwaotieno643@gmail.com';
const FIRST_SUPER_ADMIN_NAME = 'Joshua Otieno';

export default function PostLoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const profile = useQuery(api.profiles.current);
  const bootstrapSuperAdmin = useMutation(api.profiles.bootstrapSuperAdmin);

  useEffect(() => {
    if (profile === undefined || !isLoaded) return;
    if (!profile) {
      const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
      if (email === FIRST_SUPER_ADMIN_EMAIL) {
        bootstrapSuperAdmin({ email: FIRST_SUPER_ADMIN_EMAIL, name: FIRST_SUPER_ADMIN_NAME }).catch((error) => {
          console.error('Failed to bootstrap first super admin', error);
        });
      }
      return;
    }
    if (profile.status !== 'active') {
      router.replace('/login?status=pending');
      return;
    }
    if (profile.role === 'student') {
      router.replace('/student/dashboard');
      return;
    }
    router.replace('/admin/dashboard');
  }, [bootstrapSuperAdmin, isLoaded, profile, router, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div>
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-white">D</div>
        <h1 className="font-display text-2xl font-bold text-primary">Opening your portal...</h1>
        <p className="mt-2 text-sm text-muted-foreground">We are checking your DICE profile and sending you to the right dashboard.</p>
      </div>
    </main>
  );
}
