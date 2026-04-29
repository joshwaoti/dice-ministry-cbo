'use client';

import { SignIn } from '@clerk/nextjs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotatingTestimonials } from '@/components/ui/RotatingTestimonials';
import { motion } from 'motion/react';

const MOCK_QUOTES = [
  { quote: 'The curriculum challenged me to grow in ways I never expected.', author: 'Daisy W.', cohort: 'SURGE 2024' },
  { quote: 'I found my purpose and a lifelong community of believers.', author: 'Mark O.', cohort: 'Ignite 2023' },
  { quote: "This is more than a course; it's a spiritual awakening.", author: 'Sarah M.', cohort: 'SURGE 2024' },
];

const PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  size: 4 + ((i * 7) % 12),
  left: (i * 17) % 100,
  delay: (i * 0.7) % 8,
  duration: 16 + (i % 7),
  color: ['#F6AC55', '#213E8C', '#0E2973'][i % 3],
}));

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">
      <div
        className="relative hidden h-screen w-[45%] flex-col overflow-hidden bg-[#213E8C] lg:flex"
        style={{ background: 'radial-gradient(circle at center, #6989E0 0%, #213E8C 70%)' }}
      >
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-10"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              bottom: '-20px',
              backgroundColor: particle.color,
              animation: `float-up ${particle.duration}s linear ${particle.delay}s infinite`,
            }}
          />
        ))}

        <style>{`
          @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.15; }
            90% { opacity: 0.15; }
            100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        <div className="relative z-10 flex items-center gap-3 p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-xl font-bold text-white">D</div>
          <span className="font-display text-lg font-bold text-white">DICE Ministry</span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-16">
          <div className="mb-12 border-l-4 border-accent pl-6">
            <h1 className="font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              Maximizing Your
              <br />
              God-Given Potential.
            </h1>
          </div>
          <RotatingTestimonials quotes={MOCK_QUOTES} interval={5000} />
        </div>

        <div className="relative z-10 p-10">
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
        className="relative z-10 flex min-h-screen w-full flex-1 items-center justify-center bg-white lg:w-[55%]"
      >
        <div className="mx-auto w-full max-w-[460px] px-6 py-12 sm:px-12">
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-xl font-bold text-white">D</div>
            <span className="font-display text-xl font-bold text-primary">DICE Ministry</span>
          </div>

          <div className="mb-8 text-center sm:text-left">
            <h1 className="mb-2 font-display text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted">Sign in to your DICE portal</p>
          </div>

          <Tabs defaultValue="student" className="mb-8 w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger value="student" className="rounded-none border-b-2 border-transparent px-4 py-3 font-medium shadow-none data-[state=active]:border-accent data-[state=active]:bg-accent/5 data-[state=active]:text-accent">
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-none border-b-2 border-transparent px-4 py-3 font-medium shadow-none data-[state=active]:border-accent data-[state=active]:bg-accent/5 data-[state=active]:text-accent">
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
        </div>
      </motion.div>
    </div>
  );
}
