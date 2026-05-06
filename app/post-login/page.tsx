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

export default function PostLoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut, session } = useClerk();
  const profile = useQuery(api.profiles.current);

  const [jwtClaims, setJwtClaims] = useState<{ iss?: string; aud?: string } | null>(null);

  useEffect(() => {
    if (session) {
      session.getToken({ template: 'convex' }).then((token) => {
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            try {
              const payload = JSON.parse(atob(parts[1]));
              console.log('Clerk JWT Payload:', payload);
              setJwtClaims({ iss: payload.iss, aud: payload.aud });
            } catch (e) {
              console.error('Failed to decode JWT payload', e);
            }
          }
        }
      });
    }
  }, [session]);
  const bootstrapSuperAdmin = useMutation(api.profiles.bootstrapSuperAdmin);
  const claimSignedInProfile = useMutation(api.profiles.claimSignedInProfile);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const claimInFlight = useRef(false);
  const claimAttempted = useRef(false);
  const [claimDenied, setClaimDenied] = useState(false);

  useEffect(() => {
    if (profile === undefined || !isLoaded) return;
    if (!profile) {
      if (email === FIRST_SUPER_ADMIN_EMAIL) {
        if (claimInFlight.current) return;
        claimInFlight.current = true;
        bootstrapSuperAdmin({ email: FIRST_SUPER_ADMIN_EMAIL, name: FIRST_SUPER_ADMIN_NAME }).catch((error) => {
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
  }, [bootstrapSuperAdmin, claimSignedInProfile, email, isLoaded, profile, router]);

  const isUnapprovedAccount = isLoaded && profile === null && email !== FIRST_SUPER_ADMIN_EMAIL && claimDenied;
  const isAuthError = isLoaded && profile === undefined && session;

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
          {isAuthError ? 'Authentication issue' : isUnapprovedAccount ? 'No approved portal account found' : 'Opening your portal...'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isAuthError
            ? 'We are having trouble connecting your account to our backend database.'
            : isUnapprovedAccount
            ? 'Students must apply for Ignite and be approved before signing in. Admin users must accept the invitation sent from the admin portal.'
            : 'We are checking your DICE profile and sending you to the right dashboard.'}
        </p>
        {isAuthError && jwtClaims && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-left text-xs font-mono text-red-800 border border-red-200">
            <p className="font-bold mb-1">Diagnostic Info:</p>
            <p>Issuer: {jwtClaims.iss}</p>
            <p>Audience: {jwtClaims.aud}</p>
            <p className="mt-2 italic text-[10px]">Please provide this info to the developer.</p>
          </div>
        )}
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
