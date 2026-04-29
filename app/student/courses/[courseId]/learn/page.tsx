'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { CheckCircle2, ChevronLeft, FileText, Menu, Save, X } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getCourseById } from '@/lib/portal-data';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const liveCourse = useQuery(api.courses.getStudentCourse, canQueryConvexId(courseId) ? { courseId: courseId as any } : 'skip') as any | undefined;
  const fallbackCourse = getCourseById(courseId);
  const firstLiveUnit = liveCourse?.modules?.[0]?.units?.[0];
  const course = liveCourse
    ? {
        id: liveCourse._id,
        title: liveCourse.title,
        progress: liveCourse.enrollment?.progressPercent ?? 0,
        nextUnit: firstLiveUnit?.title ?? 'Start course',
        lessonBody: firstLiveUnit?.richText ?? 'This document lesson is ready for reading, reflection, and downloadable resources.',
        modules: liveCourse.modules.map((module: any) => ({
          id: module._id,
          title: module.title,
          units: module.units.map((unit: any, index: number) => ({
            id: unit._id,
            title: unit.title,
            type: unit.type === 'assignment' ? 'Assignment' : 'Reading',
            active: index === 0,
            completed: false,
          })),
        })),
      }
    : { ...fallbackCourse, lessonBody: 'Welcome to this lesson surface. It is designed for focused reading, scripture engagement, downloadable documents, and private notes.' };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-900 border-x border-[#1e293b]">
      {canQueryConvexId(courseId) && liveCourse === undefined ? <LoadingPortalState label="Loading lesson reader..." /> : null}
      <header className="h-16 border-b border-white/10 shrink-0 flex items-center justify-between px-4 lg:px-6 z-20 bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href={`/student/courses/${course.id}`} className="text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-white font-bold hidden sm:block">{course.title}</h1>
            <h1 className="text-white font-bold sm:hidden text-sm line-clamp-1">{course.nextUnit}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-xs text-white/50 font-medium">{course.progress}%</span>
          </div>
          <Button variant="outline" size="sm" className="hidden lg:flex border-white/20 text-slate-800 bg-white/5 hover:bg-white/10 hover:text-white border-none rounded-lg">
            <FileText className="w-4 h-4 mr-2" /> Notes
          </Button>
          <button className="lg:hidden text-white p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full border-b border-white/10 bg-slate-950 px-6 py-10 shadow-2xl">
            <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <div className="mb-4 flex items-center gap-3 text-accent">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.22em]">Document lesson</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Student units are designed for reading, reflection, downloadable resources, and document-based assignments.
              </p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-accent" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-display font-bold text-white mb-2">{course.nextUnit}</h2>
              <p className="text-slate-400">Current lesson in {course.title}</p>

              <div className="prose prose-invert mt-8 max-w-none">
                <p>{course.lessonBody}</p>
                <p><strong>Key learning intent:</strong> move from passive consumption to active reflection, scripture engagement, and practical application.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-6 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center"><FileText className="w-4 h-4 mr-2 text-accent" /> Private Notes</h3>
                <span className="text-xs text-slate-500">Auto-saved to your profile</span>
              </div>
              <Textarea
                placeholder="Type your notes here. Press Enter for a new line. Your notes are saved automatically..."
                className="bg-slate-900 border-white/10 text-white min-h-[150px] resize-none focus-visible:ring-accent/50"
              />
              <div className="flex justify-end mt-4">
                <Button size="sm" className="bg-slate-700 hover:bg-slate-600 border-none text-white">
                  <Save className="w-4 h-4 mr-2" /> Save Notes
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={`fixed inset-y-0 right-0 z-30 w-80 bg-slate-900 border-l border-white/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 pt-16 lg:pt-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Course Content</h3>
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {(course.modules as any[]).map((module: any, moduleIndex: number) => (
              <div key={module.id} className="border-b border-white/5">
                <div className="p-4 bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm border-b border-white/5">
                  <h4 className="text-sm font-bold text-white">Module {moduleIndex + 1}</h4>
                  <span className="text-xs text-slate-400">{module.title}</span>
                </div>
                <div className="flex flex-col">
                  {(module.units as any[]).map((unit: any, unitIndex: number) => (
                    <Link
                      key={unit.id}
                      href={`/student/courses/${course.id}/${module.id}/${unit.id}`}
                      className={`text-left p-4 flex gap-3 hover:bg-slate-800 transition-colors border-l-2 ${unit.active ? 'border-accent bg-slate-800/50' : 'border-transparent'}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {unit.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        ) : unit.active ? (
                          <FileText className="w-5 h-5 text-accent" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[9px] text-slate-500 font-bold">{unitIndex + 1}</div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${unit.active ? 'text-white' : unit.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                          {unit.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{unit.type}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
