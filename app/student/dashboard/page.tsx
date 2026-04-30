'use client';

import Link from 'next/link';
import { Bell, BookOpenCheck, CheckCircle2, Clock, Flame, FolderUp, MessageSquareText } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

export default function StudentDashboard() {
  const { toast } = useToast();
  const dashboard = useQuery(api.portal.studentDashboard) as any | undefined;
  const profile = dashboard?.profile;
  const studentProfile = dashboard?.studentProfile;
  const enrollments = dashboard?.courses ?? [];
  
  const liveCourses = enrollments.map((entry: any) => ({
    id: entry.course?._id,
    title: entry.course?.title ?? 'Untitled Course',
    nextUnit: 'Continue reading',
    progress: entry.progressPercent ?? 0,
  }));
  
  const featured = liveCourses[0];
  const studentName = profile?.name?.split(' ')[0] ?? 'Student';
  const progress = studentProfile?.progressPercent ?? 0;
  
  const submissions = dashboard?.submissions ?? [];
  const conversations = dashboard?.conversations ?? [];
  const pendingCount = submissions.filter((s: any) => s.status === 'pending_review').length;
  const unreadCount = conversations.filter((c: any) => c.unreadCount > 0).length;

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-primary">Welcome back, {studentName}!</h1>
          <p className="text-lg text-muted">You&apos;re making great progress. Keep it up.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-accent">
          <Flame className="h-5 w-5 fill-accent stroke-accent" />
          <span className="font-bold">{progress}% Program Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Jump Back In</h2>
            {dashboard === undefined ? <LoadingPortalState label="Loading your dashboard..." /> : null}
            {dashboard !== undefined && liveCourses.length === 0 ? (
              <EmptyPortalState
                variant="learning"
                title="No courses assigned yet"
                description="Your enrolled Ignite courses will appear here as soon as an admin assigns them to your profile."
              />
            ) : null}
            {featured ? (
              <Link href={`/student/courses/${featured.id}/learn`} className="group block rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-accent hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Continue Learning</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-primary">{featured.title}</h3>
                  </div>
                  <div className="shrink-0 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">{featured.progress}%</div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full bg-accent transition-all" style={{ width: `${featured.progress}%` }} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Continue Learning</span>
                </div>
              </Link>
            ) : null}
            {liveCourses.length > 1 && (
              <div className="mt-4 grid gap-4">
                {liveCourses.slice(1).map((course: any) => (
                  <Link key={course.id} href={`/student/courses/${course.id}`} className="group flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-accent hover:shadow-md">
                    <div>
                      <h4 className="font-bold text-primary">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                    </div>
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full bg-accent" style={{ width: `${course.progress}%` }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Quick Actions</h2>
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
              {pendingCount > 0 && (
                <div className="flex items-start gap-4 border-b border-border p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-surface p-2 text-accent"><Clock className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Pending assignment</h4>
                    <p className="my-1 text-sm text-gray-600">You have {pendingCount} submission(s) awaiting review.</p>
                  </div>
                </div>
              )}
              {unreadCount > 0 && (
                <div className="flex items-start gap-4 border-b border-border p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-surface p-2 text-accent"><Bell className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">New announcement</h4>
                    <p className="my-1 text-sm text-gray-600">You have {unreadCount} unread message(s).</p>
                  </div>
                </div>
              )}
              {pendingCount === 0 && unreadCount === 0 && (
                <div className="flex items-start gap-4 border-b border-border p-4">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-surface p-2 text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">All caught up</h4>
                    <p className="my-1 text-sm text-gray-600">No pending items at the moment.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}