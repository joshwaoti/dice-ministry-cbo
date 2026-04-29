'use client';

import Link from 'next/link';
import { Award, Bell, BookOpenCheck, CheckCircle2, Clock, Flame, FolderUp, MessageSquareText } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { courseCatalog } from '@/lib/portal-data';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

export default function StudentDashboard() {
  const { toast } = useToast();
  const dashboard = useQuery(api.portal.studentDashboard) as any | undefined;
  const liveCourses = dashboard?.courses?.map((entry: any) => ({
    id: entry.course?._id,
    title: entry.course?.title ?? 'Course',
    nextUnit: 'Continue reading',
    progress: entry.progressPercent ?? 0,
  }));
  const visibleCourses = liveCourses ?? courseCatalog;
  const featured = visibleCourses[0];
  const studentName = dashboard?.profile?.name?.split(' ')[0] ?? 'Sarah';

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-primary">Welcome back, {studentName}!</h1>
          <p className="text-lg text-muted">You&apos;re making great progress. Keep it up.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-accent">
          <Flame className="h-5 w-5 fill-accent stroke-accent" />
          <span className="font-bold">{dashboard?.progress ?? 0}% Program Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Jump Back In</h2>
            {dashboard === undefined ? <LoadingPortalState label="Loading your dashboard..." /> : null}
            {dashboard !== undefined && visibleCourses.length === 0 ? (
              <EmptyPortalState
                variant="learning"
                title="No courses assigned yet"
                description="Your enrolled Ignite courses will appear here as soon as an admin assigns them to your profile."
              />
            ) : null}
            {featured ? (
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary p-8 text-white shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,172,85,0.3),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
                <div className="relative z-10">
                  <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{featured.title}</span>
                  <h3 className="mb-2 font-display text-3xl font-bold">{featured.nextUnit}</h3>
                  <p className="mb-8 max-w-md text-white/80">Continue with your next reading unit, downloadable resource, or document-based assignment.</p>
                  <div className="flex items-center gap-4">
                    <Button variant="white" size="lg" className="rounded-xl group" asChild>
                      <Link href={`/student/courses/${featured.id}/learn`}>
                        <BookOpenCheck className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Resume Reading
                      </Link>
                    </Button>
                    <span className="text-sm font-medium text-white/70">{featured.progress}% Course Complete</span>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">My Courses</h2>
              <Link href="/student/courses" className="text-sm font-medium text-accent hover:underline">View All</Link>
            </div>
            {visibleCourses.length === 0 ? (
              <EmptyPortalState variant="learning" title="Course library empty" description="Your course cards will appear here after enrollment." />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {visibleCourses.slice(1).map((course: any) => (
                  <Link key={course.id} href={`/student/courses/${course.id}`} className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-accent/30 hover:shadow-md group">
                    <h3 className="mb-1 font-display text-lg font-bold text-primary transition-colors group-hover:text-accent">{course.title}</h3>
                    <p className="mb-4 text-sm text-muted">Next up: {course.nextUnit}</p>
                    <div className="mb-2 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-teal-500" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-muted">{course.progress}% Complete</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Student Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button type="button" onClick={() => toast({ title: 'Upload panel ready', description: 'Student document submission is available from your assignments page.', tone: 'info' })} className="rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-accent hover:shadow-md">
                <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-3 text-accent"><FolderUp className="h-5 w-5" /></div>
                <h3 className="font-display text-lg font-bold text-primary">Upload coursework</h3>
                <p className="mt-2 text-sm text-muted-foreground">Submit PDF, DOC, DOCX, or TXT documents from your assignments page.</p>
              </button>
              <button type="button" onClick={() => toast({ title: 'Mentor inbox available', description: 'Open Messages to continue the conversation with your mentor or instructor.', tone: 'success' })} className="rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-accent hover:shadow-md">
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><MessageSquareText className="h-5 w-5" /></div>
                <h3 className="font-display text-lg font-bold text-primary">Mentor communication</h3>
                <p className="mt-2 text-sm text-muted-foreground">Direct messaging and notification surfaces are connected to your portal profile.</p>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Up Next</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              {[
                { icon: Clock, title: 'Pending assignment', body: 'Open assignments to submit required documents.', tone: 'red' },
                { icon: Bell, title: 'New announcement', body: 'Recent notices appear here after admins publish them.', tone: 'blue' },
                { icon: CheckCircle2, title: 'Reviewed work', body: 'Grades and feedback are shown after instructor review.', tone: 'green' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 border-b border-border p-4 last:border-b-0">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-surface p-2 text-accent"><item.icon className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="my-1 text-sm text-gray-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Recent Badges</h2>
            <div className="flex gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="text-center group">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-100 transition-transform group-hover:scale-110">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <span className="block text-xs font-bold text-gray-700">First Unit</span>
              </div>
              <div className="text-center opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 group">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 transition-transform group-hover:scale-110">
                  <Flame className="h-8 w-8 text-gray-400 group-hover:text-orange-500" />
                </div>
                <span className="mt-2 block text-xs font-bold text-gray-700">Perfect Week</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
