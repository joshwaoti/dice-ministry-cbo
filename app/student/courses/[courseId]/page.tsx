'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { ArrowRight, BookOpen, Clock3, FileText } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/portal/StatusPill';
import { getCourseById } from '@/lib/portal-data';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

export default function CourseDetail({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const liveCourse = useQuery(api.courses.getStudentCourse, canQueryConvexId(courseId) ? { courseId: courseId as any } : 'skip') as any | undefined;
  const fallbackCourse = getCourseById(courseId);
  const course = liveCourse
    ? {
        id: liveCourse._id,
        title: liveCourse.title,
        synopsis: liveCourse.synopsis,
        progress: liveCourse.enrollment?.progressPercent ?? 0,
        moduleCount: liveCourse.modules.length,
        mentor: 'Assigned mentor',
        nextUnit: liveCourse.modules[0]?.units[0]?.title ?? 'Open first unit',
        modules: liveCourse.modules.map((module: any) => ({
          id: module._id,
          title: module.title,
          status: 'Open',
          units: module.units.map((unit: any) => ({
            id: unit._id,
            title: unit.title,
            type: unit.type === 'assignment' ? 'Assignment' : 'Reading',
            duration: unit.estimatedMinutes ? `${unit.estimatedMinutes} min` : 'Self-paced',
          })),
        })),
      }
    : fallbackCourse;

  return (
    <div className="space-y-8 pb-10">
      {canQueryConvexId(courseId) && liveCourse === undefined ? <LoadingPortalState label="Loading course..." /> : null}
      <PortalPageHeader
        eyebrow="Course Overview"
        title={course.title}
        description={course.synopsis}
        actions={(
          <Button asChild variant="primary">
            <Link href={`/student/courses/${course.id}/learn`}>
              <FileText className="mr-2 h-4 w-4" /> Resume Reading
            </Link>
          </Button>
        )}
      />

      <section className="rounded-[26px] border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-3">
          <Metric label="Course progress" value={`${course.progress}%`} copy="Visible completion so students always know where they stand." />
          <Metric label="Modules" value={`${course.moduleCount}`} copy="Structured for predictable navigation and cohort facilitation." />
          <Metric label="Mentor" value={course.mentor} copy="Direct support remains visible from every major course route." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-4 rounded-[26px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Modules and Units</h2>
              <p className="mt-1 text-sm text-muted-foreground">Every module exposes its unit list and a direct route into the learning surface.</p>
            </div>
            <StatusPill label="Active" tone={course.progress > 70 ? 'success' : 'info'} />
          </div>

          {course.modules.length === 0 ? (
            <EmptyPortalState variant="learning" title="No modules published yet" description="Published reading units and assignment units will appear here once the course team adds them." />
          ) : null}
          {course.modules.map((module: any, moduleIndex: number) => (
            <div key={module.id} className="rounded-[22px] border border-border bg-slate-50/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Module {moduleIndex + 1}</p>
                  <h3 className="mt-1 font-display text-xl font-bold text-primary">{module.title}</h3>
                </div>
                <StatusPill label={module.status} tone={module.status === 'Completed' ? 'success' : module.status === 'Locked' ? 'warning' : 'info'} />
              </div>
              <div className="mt-4 space-y-3">
                {module.units.map((unit: any, unitIndex: number) => (
                  <Link
                    key={unit.id}
                    href={`/student/courses/${course.id}/${module.id}/${unit.id}`}
                    className="grid gap-3 rounded-2xl border border-white bg-white p-4 transition hover:border-accent hover:shadow-sm md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/55">Unit {unitIndex + 1}</p>
                      <h4 className="mt-1 font-semibold text-primary">{unit.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4 text-accent" /> {unit.type}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4 text-accent" /> {unit.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                      Open unit <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[26px] border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary">This course includes</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Reading units, downloadable worksheets, private notes, and assignment upload surfaces.</p>
              <p>Progress indicators stay visible so students can self-orient without hunting through the interface.</p>
            </div>
          </div>
          <div className="rounded-[26px] border border-border bg-primary p-6 text-white shadow-sm">
            <h2 className="font-display text-xl font-bold">Next recommended step</h2>
            <p className="mt-2 text-sm text-white/80">Continue with <span className="font-semibold text-white">{course.nextUnit}</span> to keep your current streak active.</p>
            <Button asChild className="mt-5" variant="white">
              <Link href={`/student/courses/${course.id}/learn`}>Open lesson reader</Link>
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value, copy }: { label: string; value: string; copy: string }) {
  return (
    <div className="rounded-[22px] bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-primary">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
    </div>
  );
}
