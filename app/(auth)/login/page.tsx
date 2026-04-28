'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RotatingTestimonials } from '@/components/ui/RotatingTestimonials';

const MOCK_QUOTES = [
  { quote: "The curriculum challenged me to grow in ways I never expected.", author: "Daisy W.", cohort: "SURGE 2024" },
  { quote: "I found my purpose and a lifelong community of believers.", author: "Mark O.", cohort: "Ignite 2023" },
  { quote: "This is more than a course; it's a spiritual awakening.", author: "Sarah M.", cohort: "SURGE 2024" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    } else if (isLocked && lockoutTime <= 0) {
      setTimeout(() => {
        setIsLocked(false);
        setErrorCount(0);
      }, 0);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked) return;
    
    setHasError(false);
    setIsLoading(true);
    
    const email = new FormData(e.currentTarget).get('email') as string;
    const password = new FormData(e.currentTarget).get('password') as string;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple demo routing logic
    if (!email || !password || email.includes('wrong')) {
      setHasError(true);
      handleFailedAttempt();
    } else {
      setLoginSuccess(true);
      setTimeout(() => {
        if (role === 'admin' || email.toLowerCase().includes('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }, 800);
    }
    
    setIsLoading(false);
  };

  const handleFailedAttempt = () => {
    setErrorCount(prev => prev + 1);
    if (errorCount + 1 >= 5) {
      setIsLocked(true);
      setLockoutTime(300); // 5 minutes
    }
  };

  const formatLockoutTime = () => {
    const mins = Math.floor(lockoutTime / 60);
    const secs = lockoutTime % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setForgotSuccess(true);
    setIsLoading(false);
  };

  // Generate 12 random particles
  const [particles] = useState<any[]>(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: 4 + Math.random() * 12,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 15,
                  color: ['#F6AC55', '#213E8C', '#0E2973'][Math.floor(Math.random() * 3)]
    }))
  );

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-white">
      {/* LEFT PANEL - Hidden on mobile */}
      <div 
            className="hidden lg:flex h-screen w-[45%] flex-col overflow-hidden bg-[#213E8C] relative"
            style={{ background: 'radial-gradient(circle at center, #6989E0 0%, #213E8C 70%)' }}
      >
        {/* Particles */}
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full opacity-10"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: '-20px',
              backgroundColor: p.color,
              animation: `float-up ${p.duration}s linear ${p.delay}s infinite`
            }}
          />
        ))}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.15; }
            90% { opacity: 0.15; }
            100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
          .shine-sweep {
            position: relative;
            overflow: hidden;
          }
          .shine-sweep::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
            transform: skewX(-20deg);
            transition: none;
          }
          .shine-sweep:hover::after {
            left: 200%;
            transition: left 0.7s ease;
          }
        `}} />

        <div className="p-8 relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-display font-bold text-xl">D</div>
          <span className="font-display font-bold text-lg text-white">DICE Ministry</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <div className="border-l-4 border-accent pl-6 mb-12">
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight">
              Maximizing Your<br />God-Given Potential.
            </h1>
          </div>
          
          <RotatingTestimonials quotes={MOCK_QUOTES} interval={5000} />
        </div>

        <div className="p-10 relative z-10">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 text-white text-sm font-medium">500+ Students</div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 text-white text-sm font-medium">3 Programs</div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 text-white text-sm font-medium">17 Years</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <AnimatePresence>
        {!loginSuccess ? (
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center min-h-screen bg-white relative z-10 w-full lg:w-[55%]"
          >
            <div className="w-full max-w-[420px] px-6 sm:px-12 py-12 mx-auto">
              {/* Mobile Branding Header */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-display font-bold text-xl">D</div>
                <span className="font-display font-bold text-xl text-primary">DICE Ministry</span>
              </div>

              <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-display font-bold text-primary mb-2">Welcome Back</h1>
                <p className="text-muted">Sign in to your DICE portal</p>
              </div>

              <Tabs defaultValue="student" value={role} onValueChange={(v) => setRole(v as any)} className="w-full mb-8">
                <TabsList className="w-full grid grid-cols-2 bg-transparent border-b border-border h-auto p-0 rounded-none">
                  <TabsTrigger 
                    value="student" 
                    className={`rounded-none border-b-2 border-transparent px-4 py-3 font-medium transition-all data-[state=active]:border-accent data-[state=active]:bg-accent/5 data-[state=active]:text-accent shadow-none`}
                  >
                    Student
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin" 
                    className={`rounded-none border-b-2 border-transparent px-4 py-3 font-medium transition-all data-[state=active]:border-accent data-[state=active]:bg-accent/5 data-[state=active]:text-accent shadow-none`}
                  >
                    Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl text-primary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all peer"
                    placeholder="Email address"
                    autoFocus
                  />
                  <label htmlFor="email" className="absolute left-10 -top-2.5 bg-white px-1 text-xs font-medium text-muted peer-focus:text-accent peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs transition-all pointer-events-none">
                    Email address
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl text-primary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all peer"
                    placeholder="Password"
                  />
                  <label htmlFor="password" className="absolute left-10 -top-2.5 bg-white px-1 text-xs font-medium text-muted peer-focus:text-accent peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs transition-all pointer-events-none">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer sr-only" id="remember-me" />
                      <div className="w-5 h-5 border-2 border-border rounded transition-colors peer-checked:bg-accent peer-checked:border-accent group-hover:border-accent"></div>
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-sm text-muted group-hover:text-primary transition-colors">Keep me signed in for 30 days.</span>
                  </label>
                </div>

                {hasError && !isLocked && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake">
                    <span className="font-bold shrink-0">Error:</span> <span>Incorrect email or password.</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading || isLocked}
                  className={`w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shine-sweep ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   isLocked ? `Try again in ${formatLockoutTime()}` :
                   `Sign In as ${role === 'admin' ? 'Admin' : 'Student'}`}
                </Button>
                
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-muted hover:text-accent transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {showForgot && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    {!forgotSuccess ? (
                      <form onSubmit={handleForgotSubmit} className="space-y-4 p-5 bg-gray-50 border border-border rounded-xl mt-6">
                        <p className="text-sm font-medium text-primary">Reset Password</p>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="block w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                          placeholder="Enter your email"
                        />
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" variant="primary" className="flex-1" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setShowForgot(false)}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-800 font-medium">Check your inbox!</span>
                        </div>
                        <button type="button" onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail(''); }} className="text-xs text-green-700 hover:underline">Close</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="flex-1 flex items-center justify-center min-h-screen bg-white"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
