import Link from 'next/link';
import { BookOpenCheck, Clock3, GraduationCap } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { courseCatalog } from '@/lib/portal-data';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';

export default function StudentCourses() {
  return (
    <div className="space-y-8 max-w-full pb-10">
      <PortalPageHeader
        eyebrow="Student Portal"
        title="My Courses"
        description="Every enrolled course has a visible overview, next-step guidance, and a route into modules and lessons."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseCatalog.map((course) => (
          <div key={course.id} className="flex flex-col overflow-hidden rounded-[24px] border border-border bg-white shadow-sm">
            <div className="h-40 shrink-0 bg-[linear-gradient(135deg,rgba(10,25,49,0.92),rgba(13,115,119,0.84))] p-6 text-white">
              <div className="flex items-start justify-between gap-3">
                <StatusPill label={`${course.unitCount} units`} tone="info" />
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
                  {course.progress}% complete
                </span>
              </div>
              <h2 className="mt-7 font-display text-2xl font-bold leading-tight">{course.title}</h2>
              <p className="mt-2 max-w-sm text-sm text-white/75">{course.synopsis}</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-accent" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="grid gap-3 text-sm text-primary/80">
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent" /> Duration: {course.duration}</p>
                <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-accent" /> Mentor: {course.mentor}</p>
                <p className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-accent" /> Next up: {course.nextUnit}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.badges.map((badge) => (
                  <span key={badge} className="rounded-full bg-accent/8 px-3 py-1 text-xs font-medium text-primary">{badge}</span>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="outline">
                  <Link href={`/student/courses/${course.id}`}>View Course</Link>
                </Button>
                <Button asChild variant="primary">
                  <Link href={`/student/courses/${course.id}/learn`}>Continue Learning</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
