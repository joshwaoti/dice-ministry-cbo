'use client';

import Link from 'next/link';
import { SignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-white">
            D
          </Link>
          <h1 className="mt-5 font-display text-3xl font-bold text-primary">Accept Your DICE Invitation</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Create your portal password, then we will send you to the correct dashboard.
          </p>
        </div>

        {isLoaded && isSignedIn ? (
          <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
            <h2 className="font-display text-2xl font-bold text-primary">Invitation accepted</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your account is signed in. Continue to finish portal setup.</p>
            <Button className="mt-6 w-full" variant="primary" onClick={() => router.push('/post-login')}>
              Continue to portal
            </Button>
          </div>
        ) : null}

        {isLoaded && !isSignedIn ? (
          <SignUp
            routing="hash"
            signInUrl="/login"
            fallbackRedirectUrl="/post-login"
            forceRedirectUrl="/post-login"
            appearance={{
              elements: {
                cardBox: 'shadow-none border border-border rounded-2xl',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-accent hover:bg-accent/90 rounded-xl',
              },
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
