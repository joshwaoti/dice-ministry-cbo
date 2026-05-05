'use client';

import { ClipboardCheck, Download, MailQuestion, UserRoundPlus } from 'lucide-react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

const PAGE_SIZE = 5;

type ReviewApplication = {
  id: string;
  name: string;
  school: string;
  status: string;
  submitted: string;
  track: string;
  documents: string[];
  invitation: any;
  isLive: boolean;
};

export default function AdminApplicationsPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const liveApplications = useQuery(api.applications.list, {}) as any[] | undefined;
  const invitationJobs = useQuery(api.invitations.listJobs, {}) as any[] | undefined;
  const approveApplication = useMutation(api.applications.approve);
  const updateApplicationStatus = useMutation(api.applications.updateStatus);
  const processInvitations = useAction(api.invitations.processQueue);
  const invitationByApplication = new Map((invitationJobs ?? []).map((job) => [job.applicationId, job]));
  const reviewQueue: ReviewApplication[] = liveApplications?.map((application) => ({
      id: application._id,
      name: application.fullName,
      school: application.highSchool ?? '',
      status: application.status === 'accepted' ? 'Approved' : application.status === 'under_review' ? 'Under Review' : application.status,
      submitted: new Date(application.submittedAt).toLocaleDateString(),
      track: 'Ignite',
      documents: [],
      invitation: invitationByApplication.get(application._id),
      isLive: true,
    })) ?? [];
  const { pageItems, totalPages } = paginate(reviewQueue, page, PAGE_SIZE);

  const handleExport = () => {
    const rows = [
      ['Name', 'School', 'Status', 'Submitted', 'Invitation'],
      ...reviewQueue.map((application) => [
        application.name,
        application.school,
        application.status,
        application.submitted,
        application.invitation?.status ?? 'not queued',
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ignite-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApprove = async (application: (typeof reviewQueue)[number]) => {
    const alreadyApproved = application.status === 'Approved' || application.invitation?.status === 'sent' || application.invitation?.status === 'accepted';
    if (alreadyApproved) {
      toast({ title: 'Already admitted', description: `${application.name} has already been approved, so another invite was not sent.`, tone: 'info' });
      return;
    }

    await approveApplication({ applicationId: application.id as any });
    await processInvitations({ limit: 5 }).catch((error) => {
      console.error('Failed to process invitation queue after approval', error);
    });
    toast({
      title: `${application.name} approved`,
      description: 'A Clerk invitation was queued and processing has started automatically. No Clerk dashboard step is needed.',
      tone: 'success',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Application Review"
        description="Review Ignite applications, request missing documents, and admit approved learners into the student roster."
        actions={<Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export Applications</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-2xl font-bold text-primary">Review Queue</h2>
          </div>
          <div className="space-y-4 p-4">
            {liveApplications === undefined ? <LoadingPortalState label="Loading applications..." /> : null}
            {liveApplications !== undefined && reviewQueue.length === 0 ? (
              <EmptyPortalState
                variant="students"
                title="No applications yet"
                description="New Ignite applications submitted from the public form will appear here for review, approval, and automatic Clerk invitation."
              />
            ) : null}
            {pageItems.map((application) => (
              <article key={application.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-primary">{application.name}</p>
                    <p className="text-sm text-muted-foreground">{application.school}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accent">{application.id} - {application.track}</p>
                  </div>
                  <StatusPill
                    label={application.status}
                    tone={application.status === 'Approved' || application.status === 'accepted' ? 'success' : application.status === 'Interview Ready' || application.status === 'under_review' ? 'info' : 'warning'}
                  />
                </div>
                <div className="mt-4 rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-primary">Attached documents</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(application.documents.length ? application.documents : ['Awaiting document records']).map((doc) => (
                      <span key={doc} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">{doc}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
                  Clerk invitation:{' '}
                  <span className="font-semibold text-primary">
                    {application.invitation?.status ?? (application.status === 'Approved' ? 'queued after live approval' : 'not queued')}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(() => {
                    const locked = application.status === 'Approved' || ['queued', 'sending', 'sent', 'accepted'].includes(application.invitation?.status);
                    return (
                      <>
                  <Button
                    variant="outline"
                    disabled={locked}
                    onClick={async () => {
                      await updateApplicationStatus({ applicationId: application.id as any, status: 'under_review', internalNotes: 'Requested missing admissions documents.' });
                      toast({ title: 'Document request logged', description: `${application.name} was moved to under review for missing documents.`, tone: 'warning' });
                    }}
                  >
                    <MailQuestion className="mr-2 h-4 w-4" /> Request Documents
                  </Button>
                  <Button
                    variant="outline"
                    disabled={locked}
                    onClick={async () => {
                      await updateApplicationStatus({ applicationId: application.id as any, status: 'under_review', internalNotes: 'Interview checklist opened for admissions review.' });
                      toast({ title: 'Checklist logged', description: `${application.name} is now marked under review.`, tone: 'info' });
                    }}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" /> Review Checklist
                  </Button>
                  <Button variant="primary" disabled={locked} onClick={() => handleApprove(application)}>
                    <UserRoundPlus className="mr-2 h-4 w-4" /> Admit Applicant
                  </Button>
                      </>
                    );
                  })()}
                </div>
              </article>
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} totalItems={reviewQueue.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </section>

        <aside className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-primary">Decision Guide</h2>
          <div className="mt-5 space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border px-4 py-3">Confirm the student has uploaded an academic result slip and a recommendation.</div>
            <div className="rounded-2xl border border-border px-4 py-3">Decide whether the application goes to interview, request-docs, or admit-now status.</div>
            <div className="rounded-2xl border border-border px-4 py-3">Approved students should be transferred to Student Management with their documents attached.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
