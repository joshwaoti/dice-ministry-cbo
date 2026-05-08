'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Download, FileText, FileUp, Send, ShieldCheck } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';

const PAGE_SIZE = 5;

function stripHtml(value?: string) {
  if (!value) return 'Upload your completed assignment document.';
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() || 'Upload your completed assignment document.';
}

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Graded'>('Pending');
  const [page, setPage] = useState(1);
  const liveAssignments = useQuery(api.assignments.listForStudent, {}) as any[] | undefined;
  const generateUploadUrl = useMutation(api.documents.generateStudentUploadUrl);
  const submitAssignment = useMutation(api.assignments.submit);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const { toast } = useToast();
  const assignments = liveAssignments?.map((assignment) => {
    const status = assignment.submission?.status === 'pass' ? 'Graded' : assignment.submission ? 'Submitted' : 'Pending';
    return {
      id: assignment._id,
      title: assignment.title,
      course: assignment.course?.title ?? 'Course unavailable',
      due: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : 'No due date',
      instructions: stripHtml(assignment.instructions),
      accepted: assignment.allowedTypes?.join(', ').toUpperCase() ?? 'PDF, DOC, DOCX, TXT',
      status,
      grade: assignment.submission?.grade ?? 'Pending',
      submission: assignment.submission,
      feedbackDocuments: assignment.feedbackDocuments ?? [],
      isLive: true,
    };
  }) ?? [];
  const visibleAssignments = assignments.filter((assignment) => assignment.status === activeTab);
  const { pageItems, totalPages } = paginate(visibleAssignments, page, PAGE_SIZE);
  const selectedAssignment = assignments.find((assignment) => assignment.id === selectedAssignmentId);

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
            {pageItems.map((assignment) => {
              const isSelected = assignment.id === selectedAssignmentId;
              return (
              <div
                key={assignment.id}
                className={`rounded-[22px] border p-5 transition ${
                  isSelected
                    ? 'border-accent bg-accent/5 shadow-[0_0_0_3px_rgba(255,160,64,0.18)]'
                    : 'border-border hover:border-accent'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <StatusPill
                      label={isSelected ? 'Selected for upload' : assignment.status}
                      tone={assignment.status === 'Graded' ? 'success' : assignment.status === 'Submitted' ? 'info' : 'warning'}
                    />
                    <h3 className="mt-3 font-display text-2xl font-bold text-primary">{assignment.title}</h3>
                    <p className="mt-2 text-sm font-medium text-primary/75">{assignment.course} • Due {assignment.due}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{assignment.instructions}</p>
                    <p className="mt-3 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">{assignment.accepted}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {assignment.status === 'Pending' ? (
                      <Button variant="primary" onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        toast({ title: 'Assignment selected', description: `You can now choose a file for ${assignment.title}.`, tone: 'info' });
                      }}>
                        <FileUp className="mr-2 h-4 w-4" /> Submit Assignment
                      </Button>
                    ) : null}
                    {assignment.status === 'Submitted' ? (
                      <Button variant="outline" onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        toast({ title: 'Assignment selected', description: `You can now upload a replacement for ${assignment.title}.`, tone: 'info' });
                      }}>
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
                {assignment.submission || assignment.feedbackDocuments.length > 0 ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {assignment.submission ? (
                      <div className="rounded-2xl border border-border bg-surface p-4">
                        <div className="flex items-start gap-3">
                          <FileText className="mt-1 h-5 w-5 shrink-0 text-accent" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-primary">Your submitted file</p>
                            <p className="mt-1 break-words text-sm text-muted-foreground">{assignment.submission.fileName}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <AssignmentDownloadButton storageId={assignment.submission.storageId} label="Download" />
                              <Button size="sm" variant="outline" onClick={() => {
                                setSelectedAssignmentId(assignment.id);
                                toast({ title: 'Assignment selected', description: `You can now upload a replacement for ${assignment.title}.`, tone: 'info' });
                              }}>
                                <FileUp className="mr-2 h-3.5 w-3.5" /> Replace
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {assignment.feedbackDocuments.length > 0 ? (
                      <div className="rounded-2xl border border-border bg-emerald-50 p-4">
                        <p className="font-semibold text-emerald-900">Teacher feedback files</p>
                        <div className="mt-3 space-y-2">
                          {assignment.feedbackDocuments.map((document: any) => (
                            <div key={document._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                              <span className="break-words font-medium text-primary">{document.fileName || document.name}</span>
                              <AssignmentDownloadButton storageId={document.storageId} label="Download" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              );
            })}
          </div>
          <PaginationControls page={page} totalPages={totalPages} totalItems={visibleAssignments.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary">Upload workspace</h2>
            <div className="mt-5">
              <UploadDropzone
                title="Assignment files"
                description={selectedAssignment ? `Selected: ${selectedAssignment.title}` : 'Choose Submit Assignment on the left before selecting a file.'}
                accepted="PDF, DOC, DOCX, TXT"
                accept=".pdf,.doc,.docx,.txt"
                disabled={!selectedAssignmentId}
                disabledReason="Select a specific assignment first by clicking Submit Assignment, Resubmit Work, or Replace on an assignment card."
                generateUploadUrl={generateUploadUrl}
                onUploaded={async (file) => {
                  if (!selectedAssignmentId) return;
                  await submitAssignment({
                    assignmentId: selectedAssignmentId as any,
                    storageId: file.storageId as any,
                    fileName: file.fileName,
                    contentType: file.contentType,
                    size: file.size,
                    notes: 'Uploaded from student assignment workspace.',
                  });
                  setSelectedAssignmentId(null);
                }}
                helper="Required: active student profile, active course enrollment, an assignment on that course, and a selected assignment before choosing a PDF, DOC, DOCX, or TXT file."
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

function AssignmentDownloadButton({ storageId, label }: { storageId?: string; label: string }) {
  const url = useQuery(api.documents.getUrl, storageId ? { storageId: storageId as any } : 'skip') as string | null | undefined;
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={!url}
      onClick={() => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }}
    >
      <Download className="mr-2 h-3.5 w-3.5" /> {label}
    </Button>
  );
}
