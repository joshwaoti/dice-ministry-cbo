'use client';

import { use } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

export default function UnitViewer({ params }: { params: Promise<{ courseId: string; moduleId: string; unitId: string }> }) {
  const { courseId, moduleId, unitId } = use(params);
  const liveCourse = useQuery(api.courses.getStudentCourse, canQueryConvexId(courseId) ? { courseId: courseId as any } : 'skip') as any | undefined;
  const markComplete = useMutation(api.courses.markUnitComplete);
  const { toast } = useToast();
  if (canQueryConvexId(courseId) && liveCourse === undefined) {
    return <LoadingPortalState label="Loading unit..." />;
  }
  const course = liveCourse
    ? {
        id: liveCourse._id,
        modules: liveCourse.modules.map((module: any) => ({
          id: module._id,
          title: module.title,
          units: module.units.map((unit: any) => ({
            id: unit._id,
            title: unit.title,
            type: unit.type === 'assignment' ? 'Assignment' : 'Reading',
            richText: unit.richText,
          })),
        })),
      }
    : { id: courseId, modules: [] };
  if (course.modules.length === 0) {
    return <EmptyPortalState variant="learning" title="No lesson content yet" description="Published document lessons will appear here after this course is assigned and populated." />;
  }
  const selectedModule = course.modules.find((entry: any) => entry.id === moduleId) ?? course.modules[0];
  const activeUnit = selectedModule.units.find((entry: any) => entry.id === unitId) ?? selectedModule.units[0];
  const currentIndex = selectedModule.units.findIndex((entry: any) => entry.id === activeUnit.id);
  const previousUnit = selectedModule.units[currentIndex - 1];
  const nextUnit = selectedModule.units[currentIndex + 1];

  const handleComplete = async () => {
    if (canQueryConvexId(courseId)) {
      await markComplete({ courseId: courseId as any, moduleId: selectedModule.id as any, unitId: activeUnit.id as any, lastReadPosition: 100 });
    }
    toast({ title: 'Unit marked complete', description: 'Your course progress has been updated.', tone: 'success' });
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm border border-border overflow-hidden lg:h-[calc(100vh-8rem)] lg:min-h-[600px] w-full max-w-full">
      {canQueryConvexId(courseId) && liveCourse === undefined ? <LoadingPortalState label="Loading unit..." /> : null}
      <div className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 border-border p-4 lg:p-6 bg-surface shrink-0 flex flex-col">
        <h3 className="font-bold text-primary mb-2 lg:mb-4 flex pl-2 justify-between items-center text-sm lg:text-base">
          <span>Course Outline</span>
          <span className="lg:hidden text-accent text-xs uppercase font-bold cursor-pointer hover:underline tracking-wider">Hide</span>
        </h3>

        <div className="flex-1 overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2 mt-4 px-2">Module: {selectedModule.title}</p>

          <div className="flex flex-col gap-1">
            {selectedModule.units.map((unit: any, index: number) => (
              <Link
                key={unit.id}
                href={`/student/courses/${course.id}/${selectedModule.id}/${unit.id}`}
                className={`${unit.id === activeUnit.id ? 'bg-white shadow-sm border border-accent/20 text-primary font-medium' : 'text-muted hover:bg-white'} p-3 rounded-lg text-sm transition-colors flex items-center gap-3`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${unit.id === activeUnit.id ? 'bg-accent/20 text-accent' : 'bg-gray-200 text-gray-500'}`}>{index + 1}</div>
                <span className="truncate">{unit.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-[60vh] lg:h-full">
        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-surface shrink-0 w-full overflow-hidden">
          <div className="min-w-0 mr-4">
            <p className="font-medium text-primary text-sm lg:text-base truncate">{activeUnit.title}</p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 text-xs md:text-sm h-8 md:h-9">
            <Link href={`/student/courses/${course.id}`}>Back to Course</Link>
          </Button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
          <div className="max-w-3xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6 text-wrap break-words leading-tight">{activeUnit.title}</h1>
            <p className="text-base md:text-lg text-muted mb-8 leading-relaxed text-wrap break-words">
              {activeUnit.richText ?? 'This learning screen supports primary teaching content, notes, progression controls, and a stable outline.'}
            </p>

            <div className="rounded-xl border border-border bg-surface p-6 mb-8 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{activeUnit.type}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This unit supports rich text, inline PDFs, downloadable documents, and assignment instructions.
              </p>
            </div>

            {course.modules.length === 0 ? (
              <EmptyPortalState variant="learning" title="No learning content yet" description="Published document lessons will appear here after the course team adds them." />
            ) : (
              <div className="rounded-[22px] bg-surface p-5">
                <h2 className="font-display text-xl font-bold text-primary">Lesson objectives</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>Understand the core principle being taught in this unit.</li>
                  <li>Connect the teaching to scripture, reflection, and everyday practice.</li>
                  <li>Prepare for the related assignment or mentor conversation where relevant.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-border flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 bg-surface w-full shrink-0">
          <Button asChild={Boolean(previousUnit)} variant="outline" className="w-full sm:w-auto order-2 sm:order-1 font-medium bg-white" disabled={!previousUnit}>
            {previousUnit ? <Link href={`/student/courses/${course.id}/${selectedModule.id}/${previousUnit.id}`}>Previous Unit</Link> : <span>Previous Unit</span>}
          </Button>
          <Button variant="primary" className="w-full sm:w-auto order-1 sm:order-2 font-bold shadow-sm" onClick={handleComplete}>Mark as Complete</Button>
          <Button asChild={Boolean(nextUnit)} variant="outline" className="w-full sm:w-auto order-3 sm:order-3 font-medium bg-white" disabled={!nextUnit}>
            {nextUnit ? <Link href={`/student/courses/${course.id}/${selectedModule.id}/${nextUnit.id}`}>Next Unit</Link> : <span>Next Unit</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
