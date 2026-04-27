'use client';

import { ClipboardCheck, Download, MailQuestion, UserRoundPlus } from 'lucide-react';
import { applications } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function AdminApplicationsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Application Review"
        description="Review Ignite applications, request missing documents, and admit approved learners into the student roster."
        actions={<Button variant="outline" onClick={() => toast({ title: 'Application report queued', description: 'A summary export is being prepared for the admissions team.', tone: 'info' })}><Download className="mr-2 h-4 w-4" /> Export Applications</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-2xl font-bold text-primary">Review Queue</h2>
          </div>
          <div className="space-y-4 p-4">
            {applications.map((application) => (
              <article key={application.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-primary">{application.name}</p>
                    <p className="text-sm text-muted-foreground">{application.school}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accent">{application.id} • {application.track}</p>
                  </div>
                  <StatusPill
                    label={application.status}
                    tone={application.status === 'Approved' ? 'success' : application.status === 'Interview Ready' ? 'info' : 'warning'}
                  />
                </div>
                <div className="mt-4 rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-primary">Attached documents</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {application.documents.map((doc) => (
                      <span key={doc} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">{doc}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => toast({ title: 'Document request sent', description: `A follow-up request was sent to ${application.name}.`, tone: 'warning' })}>
                    <MailQuestion className="mr-2 h-4 w-4" /> Request Documents
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: 'Interview checklist opened', description: 'The admissions interview guide is ready for this applicant.', tone: 'info' })}>
                    <ClipboardCheck className="mr-2 h-4 w-4" /> Review Checklist
                  </Button>
                  <Button variant="primary" onClick={() => toast({ title: `${application.name} admitted`, description: 'The application has been approved and the student onboarding record was created.', tone: 'success' })}>
                    <UserRoundPlus className="mr-2 h-4 w-4" /> Admit Applicant
                  </Button>
                </div>
              </article>
            ))}
          </div>
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
