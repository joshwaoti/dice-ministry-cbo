'use client';

import { useState } from 'react';
import { FileUp, Send, ShieldCheck } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { studentAssignments } from '@/lib/portal-data';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Graded'>('Pending');
  const { toast } = useToast();
  const visibleAssignments = studentAssignments.filter((assignment) => assignment.status === activeTab);

  return (
    <div className="space-y-8 max-w-full pb-10">
      <PortalPageHeader
        eyebrow="Student Work"
        title="Assignments"
        description="Submission requirements, upload surfaces, and grading visibility are all present in the student experience."
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="overflow-hidden rounded-[24px] border border-border bg-white shadow-sm">
          <div className="flex border-b border-border bg-surface overflow-x-auto overflow-y-hidden no-scrollbar w-full">
            {(['Pending', 'Submitted', 'Graded'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 md:px-6 py-4 text-sm font-bold whitespace-nowrap shrink-0 ${
                  activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-primary'
                }`}
              >
                {tab} ({studentAssignments.filter((assignment) => assignment.status === tab).length})
              </button>
            ))}
          </div>
          <div className="space-y-4 p-4 md:p-6">
            {visibleAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-[22px] border border-border p-5 transition hover:border-accent">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <StatusPill
                      label={assignment.status}
                      tone={assignment.status === 'Graded' ? 'success' : assignment.status === 'Submitted' ? 'info' : 'warning'}
                    />
                    <h3 className="mt-3 font-display text-2xl font-bold text-primary">{assignment.title}</h3>
                    <p className="mt-2 text-sm font-medium text-primary/75">{assignment.course} • Due {assignment.due}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{assignment.instructions}</p>
                    <p className="mt-3 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">{assignment.accepted}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {assignment.status === 'Pending' ? (
                      <Button variant="primary" onClick={() => toast({ title: 'Submission staged', description: `Files for ${assignment.title} are ready to upload.`, tone: 'success' })}>
                        <FileUp className="mr-2 h-4 w-4" /> Submit Assignment
                      </Button>
                    ) : null}
                    {assignment.status === 'Submitted' ? (
                      <Button variant="outline" onClick={() => toast({ title: 'Resubmission opened', description: `A new upload slot is available for ${assignment.title}.`, tone: 'info' })}>
                        <Send className="mr-2 h-4 w-4" /> Resubmit Work
                      </Button>
                    ) : null}
                    {assignment.status === 'Graded' ? (
                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                        Grade received: {assignment.grade}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary">Upload workspace</h2>
            <div className="mt-5">
              <UploadDropzone
                title="Assignment files"
                description="Upload documents, spreadsheets, or PDFs for the selected assignment."
                accepted="PDF, DOCX, XLSX"
                helper="A confirmation toast fires on upload actions so students receive immediate feedback."
              />
            </div>
          </div>
          <div className="rounded-[24px] border border-border bg-primary p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold">Submission guidance</h2>
                <p className="mt-1 text-sm text-white/78">Files are virus-checked and locked to the assignment format rules shown on the left.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
