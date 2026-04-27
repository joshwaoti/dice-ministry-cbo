'use client';

import { useState } from 'react';
import { CheckCircle2, Download, Eye, FileText, MessageSquareMore, RotateCcw, UploadCloud } from 'lucide-react';
import { assignments, students } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

const reviewQueue = [
  { learner: students[1], assignment: assignments[0], submitted: 'Today, 8:44 AM', note: 'I reflected on grace and how it changed my relationship with prayer.', score: '' },
  { learner: students[2], assignment: assignments[1], submitted: 'Yesterday, 5:10 PM', note: 'Attached the worksheet and my career mapping draft.', score: '' },
];

export default function AdminAssignmentsPage() {
  const [selected, setSelected] = useState(reviewQueue[0]);
  const { toast } = useToast();

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
            {reviewQueue.map((item) => (
              <button
                key={`${item.learner.id}-${item.assignment.id}`}
                type="button"
                onClick={() => setSelected(item)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selected.learner.id === item.learner.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30 hover:bg-surface'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{item.assignment.course}</p>
                  </div>
                  <StatusPill label="Pending" tone="warning" />
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
        </section>

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
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">reflection-essay.pdf</span>
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
                  <input className="h-12 rounded-md border border-input px-3 text-sm outline-none focus:border-accent" defaultValue="88 / 100" />
                  <select className="h-12 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent">
                    <option>Decision: Approve</option>
                    <option>Return for revision</option>
                    <option>Reopen submission</option>
                  </select>
                </div>
                <Textarea className="min-h-40" defaultValue="Strong submission. Your reflection clearly connected grace to daily practice. Tighten the second paragraph and add one more scripture reference before publication." />
                <UploadDropzone
                  title="Attach annotated feedback"
                  description="Upload a marked PDF, rubric sheet, or instructor memo for the learner to download."
                  accepted="PDF or DOCX up to 10MB"
                />
                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" onClick={() => toast({ title: 'Marked for resubmission', description: 'The learner can now replace the current file with a revised submission.', tone: 'warning' })}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Request Resubmission
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: 'Feedback draft saved', description: 'Your grading notes were saved to the review workspace.', tone: 'info' })}>
                    <MessageSquareMore className="mr-2 h-4 w-4" /> Save Draft
                  </Button>
                  <Button variant="primary" onClick={() => toast({ title: 'Submission approved', description: 'The grade, feedback, and attached review document were published to the learner portal.', tone: 'success' })}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Publish Grade
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
