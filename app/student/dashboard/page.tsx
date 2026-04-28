'use client';

import Link from 'next/link';
import { Award, Bell, CheckCircle2, Clock, Flame, FolderUp, MessageSquareText, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseCatalog } from '@/lib/portal-data';
import { useToast } from '@/components/ui/toast';

export default function StudentDashboard() {
  const { toast } = useToast();
  const featured = courseCatalog[0];

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-1">Welcome back, Sarah!</h1>
          <p className="text-muted text-lg">You&apos;re making great progress. Keep it up.</p>
        </div>

        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl text-accent">
          <Flame className="w-5 h-5 fill-accent stroke-accent" />
          <span className="font-bold">14 Day Streak!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Jump Back In</h2>
            <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden shadow-lg border border-primary/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,172,85,0.3),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />

              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">{featured.title}</span>
                <h3 className="text-3xl font-display font-bold mb-2">{featured.nextUnit}</h3>
                <p className="text-white/80 mb-8 max-w-md">Module 1 • You are 12 minutes into this 25 minute guided lesson, with notes saved in your profile.</p>

                <div className="flex items-center gap-4">
                  <Button variant="white" size="lg" className="rounded-xl group" asChild>
                    <Link href={`/student/courses/${featured.id}/learn`}>
                      <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Resume Lesson
                    </Link>
                  </Button>
                  <span className="text-sm font-medium text-white/70">{featured.progress}% Course Complete</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">My Courses</h2>
              <Link href="/student/courses" className="text-sm font-medium text-accent hover:underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseCatalog.slice(1).map((course) => (
                <Link key={course.id} href={`/student/courses/${course.id}`} className="bg-white p-5 rounded-2xl border border-border hover:shadow-md hover:border-accent/30 transition-all group">
                  <h3 className="font-display font-bold text-lg text-primary mb-1 group-hover:text-accent transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted mb-4">Next up: {course.nextUnit}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted font-medium">
                    <span>{course.progress}% Complete</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Student Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => toast({ title: 'Upload panel ready', description: 'Student document submission is available from your assignments page.', tone: 'info' })}
                className="rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-3 text-accent"><FolderUp className="h-5 w-5" /></div>
                <h3 className="font-display text-lg font-bold text-primary">Upload coursework</h3>
                <p className="mt-2 text-sm text-muted-foreground">Static UI for document upload, submission rules, and confirmation toasts is already wired.</p>
              </button>
              <button
                type="button"
                onClick={() => toast({ title: 'Mentor inbox available', description: 'Open Messages to continue the conversation with your mentor or instructor.', tone: 'success' })}
                className="rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><MessageSquareText className="h-5 w-5" /></div>
                <h3 className="font-display text-lg font-bold text-primary">Mentor communication</h3>
                <p className="mt-2 text-sm text-muted-foreground">Direct messaging and notification surfaces are visible across the portal.</p>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Up Next</h2>
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-red-50/50 flex items-start gap-4">
                <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Career Reflection Essay</h4>
                  <p className="text-sm text-red-600 font-medium my-1">Due Today • 11:59 PM</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs border-red-200 hover:bg-red-50" asChild>
                    <Link href="/student/assignments">Submit Now</Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 border-b border-border flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">New Module Unlocked</h4>
                  <p className="text-sm text-gray-600 my-1">Digital Literacy: Presentations</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-4">
                <div className="bg-green-50 text-green-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Assignment Graded</h4>
                  <p className="text-sm text-gray-600 my-1">Discipleship 101: Week 2 Quiz</p>
                  <p className="text-xs font-bold text-green-600 mt-1">Score: 95%</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Recent Badges</h2>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-gray-700 block">Fast Learner</span>
              </div>
              <div className="text-center group opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2 border-2 border-gray-200 group-hover:scale-110 transition-transform">
                  <Flame className="w-8 h-8 text-gray-400 group-hover:text-orange-500" />
                </div>
                <span className="text-xs font-bold text-gray-700 block mt-2">1 Month Streak</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
