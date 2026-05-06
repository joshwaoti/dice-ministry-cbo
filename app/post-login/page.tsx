'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

const FIRST_SUPER_ADMIN_EMAIL = 'joshwaotieno643@gmail.com';
const FIRST_SUPER_ADMIN_NAME = 'Joshua Otieno';

function decodeJwtPayload(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return JSON.parse(atob(padded));
}

export default function PostLoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut, session } = useClerk();
  const profile = useQuery(api.profiles.current);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && session) {
      session.getToken({ template: 'convex' }).then((token) => {
        if (token) {
          try {
            console.log('Clerk JWT Payload:', decodeJwtPayload(token));
          } catch (e) {
            console.error('Failed to decode JWT payload', e);
          }
        }
      });
    }
  }, [session]);
  const bootstrapSuperAdmin = useMutation(api.profiles.bootstrapSuperAdmin);
  const claimSignedInProfile = useMutation(api.profiles.claimSignedInProfile);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? FIRST_SUPER_ADMIN_NAME;
  const claimInFlight = useRef(false);
  const claimAttempted = useRef(false);
  const [claimDenied, setClaimDenied] = useState(false);

  useEffect(() => {
    if (profile === undefined || !isLoaded) return;
    if (!profile) {
      if (email === FIRST_SUPER_ADMIN_EMAIL) {
        if (claimInFlight.current) return;
        claimInFlight.current = true;
        bootstrapSuperAdmin({ email: FIRST_SUPER_ADMIN_EMAIL, name: displayName }).catch((error) => {
          console.error('Failed to bootstrap first super admin', error);
        }).finally(() => {
          claimInFlight.current = false;
        });
        return;
      }
      if (claimAttempted.current || claimInFlight.current) return;
      claimInFlight.current = true;
      claimSignedInProfile().then((profileId) => {
        claimAttempted.current = true;
        if (!profileId) setClaimDenied(true);
      }).catch((error) => {
        console.error('Failed to claim DICE profile', error);
        claimAttempted.current = true;
        setClaimDenied(true);
      }).finally(() => {
        claimInFlight.current = false;
      });
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
  }, [bootstrapSuperAdmin, claimSignedInProfile, displayName, email, isLoaded, profile, router]);

  const isUnapprovedAccount = isLoaded && profile === null && email !== FIRST_SUPER_ADMIN_EMAIL && claimDenied;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div className="max-w-md">
        <div className="relative mx-auto mb-5 h-12 w-12">
          <Image
            src="/images/Logo-1.png"
            alt="DICE Ministry Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary">
          {isUnapprovedAccount ? 'No approved portal account found' : 'Opening your portal...'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isUnapprovedAccount
            ? 'Students must apply for Ignite and be approved before signing in. Admin users must accept the invitation sent from the admin portal.'
            : 'We are checking your DICE profile and sending you to the right dashboard.'}
        </p>
        {isUnapprovedAccount ? (
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="primary">
              <Link href="/apply">Apply for Ignite</Link>
            </Button>
            <Button variant="outline" onClick={() => signOut(() => router.push('/login'))}>
              Use another account
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
