'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Upload, UserPlus, Users2, AlertTriangle, Search, FileUp, Eye, Pencil, ShieldBan } from 'lucide-react';
import { students, applications } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

export default function AdminStudentsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Student Management"
        description="Admit new students, manage cohort placements, track risk flags, and keep student records complete."
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: 'CSV template downloaded', description: 'Use the roster import sheet to bulk-create student records.', tone: 'info' })}>
              <Upload className="mr-2 h-4 w-4" /> Import Roster
            </Button>
            <Button variant="primary" onClick={() => setOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Admit New Student
            </Button>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Active Students', value: '124', icon: Users2, hint: 'Across Ignite and alumni pathways' },
          { label: 'Pending Admissions', value: `${applications.length}`, icon: GraduationCap, hint: 'Applications awaiting interviews or approval' },
          { label: 'At-Risk Learners', value: '7', icon: AlertTriangle, hint: 'Need mentor intervention this week' },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-3 text-accent">
              <card.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.label}</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Roster</h2>
              <p className="text-sm text-muted-foreground">Search, filter, and take action on every student record.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 md:w-72" placeholder="Search students or mentors" />
              </div>
              <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent">
                <option>All Cohorts</option>
                <option>Ignite 25</option>
                <option>SURGE 24</option>
              </select>
            </div>
          </div>

          <div className="block md:hidden space-y-4 p-4">
            {students.map((student) => (
              <article key={student.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-primary">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">{student.id}</p>
                      </div>
                      <StatusPill
                        label={student.status}
                        tone={student.status === 'Active' ? 'success' : student.status === 'At Risk' ? 'warning' : 'info'}
                      />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground">
                        <p className="font-semibold text-primary">Cohort</p>
                        <p className="mt-1">{student.cohort}</p>
                      </div>
                      <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground">
                        <p className="font-semibold text-primary">Track</p>
                        <p className="mt-1">{student.track}</p>
                      </div>
                      <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground sm:col-span-2">
                        <p className="font-semibold text-primary">Mentor</p>
                        <p className="mt-1">{student.mentor}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-primary">{student.progress}% complete</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/students/${student.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast({ title: `${student.name} updated`, description: 'Student enrollment fields are ready for editing.', tone: 'info' })}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast({ title: `${student.name} flagged`, description: 'Mentor review task added to the at-risk queue.', tone: 'warning' })}>
                        <ShieldBan className="mr-2 h-4 w-4" /> Flag
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left">
              <thead className="bg-surface">
                <tr className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Cohort</th>
                  <th className="px-6 py-4">Track</th>
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student.id} className="align-top hover:bg-surface/50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {student.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{student.cohort}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.track}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.mentor}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-2.5 w-32 overflow-hidden rounded-full bg-surface">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-primary">{student.progress}% complete</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill
                        label={student.status}
                        tone={student.status === 'Active' ? 'success' : student.status === 'At Risk' ? 'warning' : 'info'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/students/${student.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: `${student.name} updated`, description: 'Student enrollment fields are ready for editing.', tone: 'info' })}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast({ title: `${student.name} flagged`, description: 'Mentor review task added to the at-risk queue.', tone: 'warning' })}>
                          <ShieldBan className="mr-2 h-4 w-4" /> Flag
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-primary">Admissions Pipeline</h3>
            <div className="mt-5 space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.school}</p>
                    </div>
                    <StatusPill label={app.status} tone={app.status === 'Approved' ? 'success' : app.status === 'Interview Ready' ? 'info' : 'warning'} />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{app.submitted}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/admin/applications">Review</Link>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => toast({ title: `${app.name} admitted`, description: 'Application moved into the new-student onboarding queue.', tone: 'success' })}>
                      Admit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-primary">Required Documents</h3>
            <p className="mt-2 text-sm text-muted-foreground">Every admitted student needs a verified admissions packet before course access is enabled.</p>
            <div className="mt-5 space-y-3">
              {['National ID / Birth Certificate', 'KCSE Result Slip', 'Guardian Consent Form', 'Pastor Recommendation Letter'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                  <span className="text-sm font-medium text-primary">{item}</span>
                  <FileUp className="h-4 w-4 text-accent" />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <PortalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Admit New Student"
        description="Create a student profile, place the learner into a cohort, and capture the admissions documents required by the PRD."
        size="lg"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Student full name" />
              <Input placeholder="Preferred phone number" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input type="email" placeholder="Email address" />
              <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent">
                <option>Assign cohort</option>
                <option>Ignite 2025</option>
                <option>SURGE 2024</option>
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent">
                <option>Track</option>
                <option>Discipleship Foundations</option>
                <option>Peer Mentoring</option>
                <option>Basic Computer Skills</option>
              </select>
              <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent">
                <option>Assigned mentor</option>
                <option>Grace Njeri</option>
                <option>Mark Omondi</option>
                <option>Maurice Agunda</option>
              </select>
            </div>
            <Textarea placeholder="Admission notes, interview summary, support needs, or housing follow-up." className="min-h-32" />
          </div>

          <div className="space-y-4">
            <UploadDropzone
              title="Upload admissions packet"
              description="Collect the learner's onboarding documents and verify they are attached before activation."
              accepted="PDF, DOCX, JPG up to 10MB"
              helper="Suggested packet: ID, transcript, recommendation, guardian consent."
            />
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
              Once admitted, the student will appear in the roster, gain portal credentials, and be queued for orientation tasks.
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => {
                  toast({ title: 'Student admitted', description: 'The onboarding record, cohort placement, and document request were created.', tone: 'success' });
                  setOpen(false);
                }}
              >
                Save Admission
              </Button>
            </div>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
