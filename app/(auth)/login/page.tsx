'use client';

import { SignIn, useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { RotatingTestimonials } from '@/components/ui/RotatingTestimonials';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const MOCK_QUOTES = [
  { quote: 'The curriculum challenged me to grow in ways I never expected.', author: 'Daisy W.', cohort: 'SURGE 2024' },
  { quote: 'I found my purpose and a lifelong community of believers.', author: 'Mark O.', cohort: 'Ignite 2023' },
  { quote: "This is more than a course; it's a spiritual awakening.", author: 'Sarah M.', cohort: 'SURGE 2024' },
];

export default function LoginPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded } = useUser();
  const [portal, setPortal] = useState<'student' | 'admin'>('student');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f4ef]">
      <div className="relative hidden h-screen w-[44%] flex-col overflow-hidden bg-primary lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,41,115,1),rgba(33,62,140,0.94))]" />
        <div className="relative z-10 flex items-center gap-3 p-6">
          <div className="relative h-10 w-10">
            <Image
              src="/images/Logo-1-White.png"
              alt="DICE Ministry Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display text-lg font-bold text-white">DICE Ministry</span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-12">
          <div className="mb-8 max-w-md">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-accent">Secure Portal Access</p>
            <h1 className="font-display text-5xl font-bold leading-tight text-white">DICE Ministry Portal</h1>
            <p className="mt-5 text-base leading-7 text-white/78">Students enter only after approved Ignite admission. Admins and moderators enter through invited staff accounts.</p>
          </div>
          <RotatingTestimonials quotes={MOCK_QUOTES} interval={5000} />
        </div>

        <div className="relative z-10 p-6">
          <div className="flex flex-wrap gap-4">
            {['500+ Students', '3 Programs', '17 Years'].map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex h-screen w-full flex-1 items-center justify-center overflow-hidden bg-[#f7f4ef] lg:w-[56%]"
      >
        <div className="mx-auto flex h-screen w-full max-w-[520px] flex-col justify-center px-5 py-4 sm:px-8">
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <div className="relative h-10 w-10">
              <Image
                src="/images/Logo-1.png"
                alt="DICE Ministry Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-xl font-bold text-primary">DICE Ministry</span>
          </div>

          <div className="mb-4 text-center">
            <h1 className="mb-2 font-display text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted-foreground">{portal === 'student' ? 'Approved students sign in to continue coursework.' : 'Invited admins and moderators sign in to manage the portal.'}</p>
          </div>

          {isLoaded && isSignedIn ? (
            <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <h2 className="font-display text-2xl font-bold text-primary">You are already signed in</h2>
              <p className="mt-2 text-sm text-muted-foreground">Continue to your current portal session, or sign out first to use a different admin or student account.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button variant="primary" onClick={() => router.push('/post-login')}>Continue</Button>
                <Button variant="outline" onClick={() => signOut(() => router.push('/login'))}>Use another account</Button>
              </div>
            </div>
          ) : null}

          {isLoaded && !isSignedIn ? (
            <>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPortal('student')}
                className={`rounded-2xl border p-4 text-left transition ${portal === 'student' ? 'border-accent bg-white shadow-md ring-2 ring-accent/20' : 'border-border bg-white/70 hover:bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${portal === 'student' ? 'bg-accent text-white' : 'bg-surface text-primary'}`}><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-primary">Student Portal</p>
                    <p className="mt-1 text-xs text-muted-foreground">Approved Ignite learners</p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPortal('admin')}
                className={`rounded-2xl border p-4 text-left transition ${portal === 'admin' ? 'border-primary bg-white shadow-md ring-2 ring-primary/20' : 'border-border bg-white/70 hover:bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${portal === 'admin' ? 'bg-primary text-white' : 'bg-surface text-primary'}`}><ShieldCheck className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-primary">Admin Portal</p>
                    <p className="mt-1 text-xs text-muted-foreground">Staff and moderators</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="clerk-login-shell">
              <SignIn
                routing="hash"
                withSignUp={false}
                fallbackRedirectUrl="/post-login"
                forceRedirectUrl="/post-login"
                appearance={{
                  elements: {
                    cardBox: 'shadow-none border border-border rounded-2xl',
                    card: 'shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'rounded-xl',
                    formButtonPrimary: 'bg-accent hover:bg-accent/90 rounded-xl',
                  },
                }}
              />
            </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
