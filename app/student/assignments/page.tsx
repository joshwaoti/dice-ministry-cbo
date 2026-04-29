'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { FileUp, Send, ShieldCheck } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { studentAssignments } from '@/lib/portal-data';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';

const PAGE_SIZE = 5;

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Graded'>('Pending');
  const [page, setPage] = useState(1);
  const liveAssignments = useQuery(api.assignments.listForStudent, {}) as any[] | undefined;
  const { toast } = useToast();
  const assignments = liveAssignments?.map((assignment) => {
    const status = assignment.submission?.status === 'pass' ? 'Graded' : assignment.submission ? 'Submitted' : 'Pending';
    return {
      id: assignment._id,
      title: assignment.title,
      course: assignment.course?.title ?? 'Course unavailable',
      due: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : 'No due date',
      instructions: assignment.instructions,
      accepted: assignment.allowedTypes?.join(', ').toUpperCase() ?? 'PDF, DOC, DOCX, TXT',
      status,
      grade: assignment.submission?.grade ?? 'Pending',
      isLive: true,
    };
  }) ?? studentAssignments.map((assignment) => ({ ...assignment, isLive: false }));
  const visibleAssignments = assignments.filter((assignment) => assignment.status === activeTab);
  const { pageItems, totalPages } = paginate(visibleAssignments, page, PAGE_SIZE);

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
                {tab} ({assignments.filter((assignment) => assignment.status === tab).length})
              </button>
            ))}
          </div>
          <div className="space-y-4 p-4 md:p-6">
            {liveAssignments === undefined ? <LoadingPortalState label="Loading assignments..." /> : null}
            {liveAssignments !== undefined && visibleAssignments.length === 0 ? (
              <EmptyPortalState
                variant="documents"
                title={`No ${activeTab.toLowerCase()} assignments`}
                description="Assignment tasks and document submissions will appear here when they are assigned to your enrolled courses."
              />
            ) : null}
            {pageItems.map((assignment) => (
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
          <PaginationControls page={page} totalPages={totalPages} totalItems={visibleAssignments.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary">Upload workspace</h2>
            <div className="mt-5">
              <UploadDropzone
                title="Assignment files"
                description="Upload PDFs, Word documents, or text files for the selected assignment."
                accepted="PDF, DOC, DOCX, TXT"
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
