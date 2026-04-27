'use client';

import { use, type ComponentType } from 'react';
import { CalendarClock, FileUp, GraduationCap, Mail, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { StatusPill } from '@/components/portal/StatusPill';
import { useToast } from '@/components/ui/toast';
import { getStudentById, studentAssignments } from '@/lib/portal-data';

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = getStudentById(id);
  const studentWork = studentAssignments.slice(0, 2);
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-10">
      <PortalPageHeader
        eyebrow="Student Profile"
        title={student.name}
        description="Admissions, cohort progress, uploaded documents, and support actions are all visible in one place."
        actions={(
          <>
            <Button variant="outline" onClick={() => toast({ title: 'Mentor notified', description: `A progress check-in request was sent to ${student.mentor}.`, tone: 'info' })}>
              <Mail className="mr-2 h-4 w-4" /> Message Mentor
            </Button>
            <Button variant="primary" onClick={() => toast({ title: 'Student updated', description: `${student.name}'s status has been saved.`, tone: 'success' })}>
              <UserRoundCheck className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <section className="space-y-6 rounded-[24px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-2xl font-bold text-white">
              {student.initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{student.id}</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-primary">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={GraduationCap} label="Program Track" value={student.track} />
            <InfoCard icon={CalendarClock} label="Cohort" value={student.cohort} />
            <InfoCard icon={ShieldCheck} label="Status" value={student.status} />
            <InfoCard icon={Mail} label="Assigned Mentor" value={student.mentor} />
          </div>

          <div className="rounded-[22px] bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">Progress Snapshot</p>
              <StatusPill
                label={`${student.progress}% complete`}
                tone={student.progress >= 70 ? 'success' : student.progress >= 30 ? 'info' : 'warning'}
              />
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-accent" style={{ width: `${student.progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">This UI gives admissions, instructors, and cohort leads a stable view of student momentum before backend analytics land.</p>
          </div>

          <UploadDropzone
            title="Student documents"
            description="Admissions files, guardian consent forms, result slips, and pastoral recommendations."
            accepted="PDF, JPG, PNG"
            helper="The PRD calls for document handling in the portal, so this detail route exposes the upload surface directly."
          />
        </section>

        <section className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">Support Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">Visible CRUD-oriented controls for cohort management, even while the data remains static.</p>
              </div>
              <StatusPill
                label={student.status}
                tone={student.status === 'Completed' ? 'success' : student.status === 'At Risk' ? 'danger' : 'info'}
              />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['Edit profile', 'Refresh bio, cohort, contact info, and guardian data.'],
                ['Move cohort', 'Reassign the student to a different intake or program track.'],
                ['Pause access', 'Temporarily lock course progress during review or leave.'],
                ['Admit to Ignite', 'Convert an application or orientation record into active enrollment.'],
              ].map(([label, copy]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toast({ title: label, description: `${student.name} is ready for this workflow.`, tone: 'info' })}
                  className="rounded-[22px] border border-border bg-slate-50 p-4 text-left transition hover:border-accent hover:bg-accent/5"
                >
                  <p className="font-semibold text-primary">{label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-primary">Recent Coursework</h2>
            <div className="mt-5 space-y-4">
              {studentWork.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{assignment.course}</p>
                      <h3 className="mt-1 font-semibold text-primary">{assignment.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Due {assignment.due} • {assignment.accepted}</p>
                    </div>
                    <StatusPill
                      label={assignment.status}
                      tone={assignment.status === 'Graded' ? 'success' : assignment.status === 'Submitted' ? 'info' : 'warning'}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-5" variant="outline" onClick={() => toast({ title: 'Academic note added', description: 'An intervention note was attached to this student record.', tone: 'success' })}>
              <FileUp className="mr-2 h-4 w-4" /> Add Academic Note
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white p-3 text-accent shadow-sm"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/55">{label}</p>
          <p className="mt-1 font-medium text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}
