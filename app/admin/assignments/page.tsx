'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { CheckCircle2, Download, Eye, FileText, MessageSquareMore, RotateCcw, UploadCloud } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { assignments, students } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';

const PAGE_SIZE = 6;

type ReviewItem = {
  id: string;
  learner: { id: string; name: string };
  assignment: { id: string; title: string; course: string; due: string; format: string };
  submitted: string;
  note: string;
  score: string;
  fileName?: string;
  status: string;
  isLive: boolean;
};

const fallbackReviewQueue: ReviewItem[] = [
  {
    id: 'mock-1',
    learner: { id: students[1].id, name: students[1].name },
    assignment: { id: assignments[0].id, title: assignments[0].title, course: assignments[0].course, due: assignments[0].due, format: assignments[0].format },
    submitted: 'Today, 8:44 AM',
    note: 'I reflected on grace and how it changed my relationship with prayer.',
    score: '',
    fileName: 'reflection-essay.pdf',
    status: 'pending_review',
    isLive: false,
  },
  {
    id: 'mock-2',
    learner: { id: students[2].id, name: students[2].name },
    assignment: { id: assignments[1].id, title: assignments[1].title, course: assignments[1].course, due: assignments[1].due, format: assignments[1].format },
    submitted: 'Yesterday, 5:10 PM',
    note: 'Attached the worksheet and my career mapping draft.',
    score: '',
    fileName: 'career-map.pdf',
    status: 'pending_review',
    isLive: false,
  },
];

export default function AdminAssignmentsPage() {
  const liveSubmissions = useQuery(api.assignments.listSubmissions, {}) as any[] | undefined;
  const reviewSubmission = useMutation(api.assignments.reviewSubmission);
  const reviewQueue: ReviewItem[] = liveSubmissions?.map((submission) => ({
    id: submission._id,
    learner: {
      id: submission.studentProfile?._id ?? submission.profile?._id ?? submission._id,
      name: submission.profile?.name ?? 'Unknown student',
    },
    assignment: {
      id: submission.assignment?._id ?? submission.assignmentId,
      title: submission.assignment?.title ?? 'Untitled assignment',
      course: submission.course?.title ?? 'Course unavailable',
      due: submission.assignment?.dueAt ? new Date(submission.assignment.dueAt).toLocaleDateString() : 'No due date',
      format: submission.assignment?.allowedTypes?.join(', ').toUpperCase() ?? 'PDF, DOCX, TXT',
    },
    submitted: submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Not submitted',
    note: submission.notes ?? 'No student note was included with this submission.',
    score: submission.grade ?? '',
    fileName: submission.fileName,
    status: submission.status,
    isLive: true,
  })) ?? fallbackReviewQueue;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [score, setScore] = useState('88 / 100');
  const [feedback, setFeedback] = useState('Strong submission. Your reflection clearly connected grace to daily practice. Tighten the second paragraph and add one more scripture reference before publication.');
  const { toast } = useToast();
  const { pageItems, totalPages } = paginate(reviewQueue, page, PAGE_SIZE);
  const selected = reviewQueue.find((item) => item.id === selectedId) ?? reviewQueue[0];

  const handleReview = async (status: 'pass' | 'needs_revision' | 'pending_review') => {
    if (!selected) return;
    if (!selected.isLive) {
      toast({ title: status === 'pass' ? 'Submission approved' : 'Feedback draft saved', description: 'Live Convex submissions will persist grades and feedback here.', tone: status === 'pass' ? 'success' : 'info' });
      return;
    }
    await reviewSubmission({ submissionId: selected.id as any, status, grade: score, comment: feedback, notifyStudent: true });
    toast({ title: status === 'pass' ? 'Submission approved' : 'Submission updated', description: 'The grade and feedback were saved to Convex and published to the learner portal.', tone: status === 'pass' ? 'success' : 'info' });
  };

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Assignment Review"
        description="Review submissions, open uploaded documents, return feedback, and keep instructors aligned on grading."
        actions={
          <Button variant="outline" onClick={() => toast({ title: 'Export queued', description: 'A grading report will be generated for the current filters.', tone: 'info' })}>
            <Download className="mr-2 h-4 w-4" /> Export Queue
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-2xl font-bold text-primary">Submissions Awaiting Review</h2>
            <p className="mt-1 text-sm text-muted-foreground">The PRD calls this the most urgent admin metric. Keep this queue moving.</p>
          </div>
          <div className="space-y-3 p-4">
            {liveSubmissions === undefined ? <LoadingPortalState label="Loading submissions..." /> : null}
            {liveSubmissions !== undefined && reviewQueue.length === 0 ? (
              <EmptyPortalState
                variant="documents"
                title="No submissions waiting"
                description="Student document submissions will appear here with grading controls, feedback, and review history."
              />
            ) : null}
            {pageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === item.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30 hover:bg-surface'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{item.assignment.course}</p>
                  </div>
                  <StatusPill label={item.status === 'pass' ? 'Passed' : item.status === 'needs_revision' ? 'Revision' : 'Pending'} tone={item.status === 'pass' ? 'success' : item.status === 'needs_revision' ? 'danger' : 'warning'} />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-primary">{item.learner.name}</p>
                    <p className="text-muted-foreground">{item.submitted}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent">{item.assignment.format}</span>
                </div>
              </button>
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} totalItems={reviewQueue.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </section>

        {selected ? (
        <section className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{selected.assignment.course}</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-primary">{selected.assignment.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Submitted by {selected.learner.name} on {selected.submitted}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast({ title: 'Document opened', description: 'Submission preview launched in a new review tab.', tone: 'info' })}>
                  <Eye className="mr-2 h-4 w-4" /> View Document
                </Button>
                <Button variant="outline" onClick={() => toast({ title: 'Original file downloaded', description: 'The learner submission package has been downloaded.', tone: 'info' })}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-primary">Student note</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.note}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-primary">Submission requirements</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Accepted formats: {selected.assignment.format}</li>
                  <li>Due date: {selected.assignment.due}</li>
                  <li>Expected reflection length: 500-700 words</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white p-3 text-accent shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Submission Summary</h3>
                  <p className="text-sm text-muted-foreground">A static document card is shown here to represent the uploaded learner file, file size, and stored URL actions.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">{selected.fileName ?? 'reflection-essay.pdf'}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">2.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl font-bold text-primary">Feedback and Decision</h3>
              <StatusPill label="Instructor Review" tone="info" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-primary">Rubric</p>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-primary">Biblical understanding</p>
                    <p>0-40 points</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Practical application</p>
                    <p>0-30 points</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Clarity & structure</p>
                    <p>0-30 points</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="h-12 rounded-md border border-input px-3 text-sm outline-none focus:border-accent" value={score} onChange={(event) => setScore(event.target.value)} />
                  <select className="h-12 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent">
                    <option>Decision: Approve</option>
                    <option>Return for revision</option>
                    <option>Reopen submission</option>
                  </select>
                </div>
                <Textarea className="min-h-40" value={feedback} onChange={(event) => setFeedback(event.target.value)} />
                <UploadDropzone
                  title="Attach annotated feedback"
                  description="Upload a marked PDF, rubric sheet, or instructor memo for the learner to download."
                  accepted="PDF or DOCX up to 10MB"
                />
                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" onClick={() => handleReview('needs_revision')}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Request Resubmission
                  </Button>
                  <Button variant="outline" onClick={() => handleReview('pending_review')}>
                    <MessageSquareMore className="mr-2 h-4 w-4" /> Save Draft
                  </Button>
                  <Button variant="primary" onClick={() => handleReview('pass')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Publish Grade
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : null}
      </div>
    </div>
  );
}
