'use client';

import { use, useState } from 'react';
import { BookOpenCheck, ClipboardCheck, FileUp, ListTree, Plus, Save, Send } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { useToast } from '@/components/ui/toast';
import { getCourseById } from '@/lib/portal-data';

export default function CourseEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const course = getCourseById(id);
  const [publishChecklist, setPublishChecklist] = useState({
    outcomes: true,
    media: true,
    assignment: false,
  });
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-10">
      <PortalPageHeader
        eyebrow="Course Builder"
        title={course.title}
        description="Static course authoring UI for modules, units, documents, publish readiness, and assignment settings."
        actions={(
          <>
            <Button variant="outline" onClick={() => toast({ title: 'Draft saved', description: `${course.title} was saved to the editorial queue.`, tone: 'success' })}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button variant="primary" onClick={() => toast({ title: 'Publish review started', description: 'The course has been sent for final approval.', tone: 'info' })}>
              <Send className="mr-2 h-4 w-4" /> Submit for Publish
            </Button>
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6 rounded-[24px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Module Outline</h2>
              <p className="mt-1 text-sm text-muted-foreground">Every module and unit has a visible instructional surface, even before backend wiring.</p>
            </div>
            <Button variant="outline" onClick={() => toast({ title: 'Module added', description: 'A new module shell has been appended to the outline.', tone: 'success' })}>
              <Plus className="mr-2 h-4 w-4" /> Add Module
            </Button>
          </div>

          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div key={module.id} className="rounded-[22px] border border-border bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Module {index + 1}</p>
                    <h3 className="mt-2 font-display text-xl font-bold text-primary">{module.title}</h3>
                  </div>
                  <StatusPill
                    label={module.status}
                    tone={module.status === 'Completed' ? 'success' : module.status === 'In progress' ? 'info' : 'warning'}
                  />
                </div>
                <div className="mt-4 grid gap-3">
                  {module.units.map((unit, unitIndex) => (
                    <div key={unit.id} className="grid gap-3 rounded-2xl border border-white bg-white p-4 md:grid-cols-[1.1fr_0.8fr_0.7fr_auto] md:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/60">Unit {unitIndex + 1}</p>
                        <h4 className="mt-1 font-semibold text-primary">{unit.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{unit.type} • {unit.duration}</p>
                      </div>
                      <div className="rounded-xl bg-surface p-3 text-sm text-primary">
                        Outcome card, scripture prompts, and facilitation notes are available on this unit shell.
                      </div>
                      <div className="rounded-xl bg-accent/5 p-3 text-sm text-primary">
                        Uploads: slides, reading PDFs, facilitator notes, and downloadable worksheets.
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => toast({ title: 'Unit editor opened', description: `${unit.title} is ready for content editing.`, tone: 'info' })}
                      >
                        <BookOpenCheck className="mr-2 h-4 w-4" /> Edit Unit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <UploadDropzone
            title="Unit documents and teaching assets"
            description="Upload curriculum files, student worksheets, lesson guides, and assignment attachments."
            accepted="PDF, DOCX, PPTX, XLSX"
            helper="Every uploaded file is represented in the UI even before storage integration, per the PRD expectation for course materials."
          />
        </section>

        <section className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent/10 p-3 text-accent"><ListTree className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Publish Checklist</h2>
                <p className="text-sm text-muted-foreground">A visible UI for the last-mile readiness checks mentioned in the supplement.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ['outcomes', 'Learning outcomes added to all modules'],
                ['media', 'Required media and downloadable files attached'],
                ['assignment', 'Assignment settings reviewed and graded rubric attached'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-start gap-3 rounded-2xl border border-border p-4">
                  <input
                    type="checkbox"
                    checked={publishChecklist[key as keyof typeof publishChecklist]}
                    onChange={() => setPublishChecklist((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className="mt-1 h-4 w-4 rounded border-border accent-[#F6AC55]"
                  />
                  <div>
                    <p className="font-medium text-primary">{label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">This stays visible so admins can verify readiness before publishing.</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold/15 p-3 text-gold"><ClipboardCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Assignment Settings</h2>
                <p className="text-sm text-muted-foreground">Submission requirements, format rules, and review expectations.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-surface p-4">
                <p className="font-medium text-primary">File restrictions</p>
                <p className="mt-1 text-sm text-muted-foreground">Accepted: PDF and DOCX, up to 10MB, one resubmission allowed before grading closes.</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="font-medium text-primary">Rubric visibility</p>
                <p className="mt-1 text-sm text-muted-foreground">Students see scoring criteria before upload, matching the assignment workflow in the PRD.</p>
              </div>
              <Button variant="outline" onClick={() => toast({ title: 'Rubric uploaded', description: 'Assignment rubric has been attached to this course.', tone: 'success' })}>
                <FileUp className="mr-2 h-4 w-4" /> Upload Rubric
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
