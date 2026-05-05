'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAction, useMutation, useQuery } from 'convex/react';
import { AlertTriangle, Eye, GraduationCap, Pencil, Search, ShieldBan, UserPlus, Users2 } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

const PAGE_SIZE = 10;

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending_invite: 'Pending Invite',
  suspended: 'Paused',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

export default function AdminStudentsPage() {
  const { toast } = useToast();
  const liveStudents = useQuery(api.students.list) as any[] | undefined;
  const liveApplications = useQuery(api.applications.list, {}) as any[] | undefined;
  const cohorts = useQuery(api.cohorts.list) as any[] | undefined;
  const admins = useQuery(api.adminUsers.list) as any[] | undefined;
  const approveApplication = useMutation(api.applications.approve);
  const submitApplication = useMutation(api.applications.submitApplication);
  const updateStudent = useMutation(api.students.update);
  const flagStudent = useMutation(api.students.flag);
  const processInvitations = useAction(api.invitations.processQueue);

  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', email: '', notes: '' });
  const [editForm, setEditForm] = useState({
    programTrack: 'Ignite',
    cohortId: '',
    mentorProfileId: '',
    enrollmentStatus: 'active',
  });
  const [flagForm, setFlagForm] = useState({ severity: 'medium', reason: '' });

  const mentors = useMemo(() => (admins ?? []).filter((profile) => profile.role === 'moderator' || profile.role === 'admin'), [admins]);
  const roster = useMemo(
    () =>
      (liveStudents ?? []).map((student) => {
        const profile = student.profile ?? {};
        const openFlags = student.flags ?? [];
        return {
          raw: student,
          id: student._id,
          initials:
            (profile.name ?? '')
              .split(' ')
              .map((part: string) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'ST',
          name: profile.name ?? 'Unnamed student',
          email: profile.email ?? '',
          cohort: student.cohort?.name ?? 'Unassigned',
          cohortId: student.cohortId ?? '',
          progress: student.progressPercent ?? 0,
          status: statusLabels[student.enrollmentStatus] ?? student.enrollmentStatus,
          enrollmentStatus: student.enrollmentStatus,
          track: student.programTrack ?? 'Ignite',
          mentor: student.mentor?.name ?? 'Unassigned',
          mentorProfileId: student.mentorProfileId ?? '',
          flagCount: openFlags.length,
          isAtRisk: openFlags.length > 0,
        };
      }),
    [liveStudents],
  );

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return roster.filter((student) => {
      const matchesTerm = !term || [student.name, student.email, student.mentor, student.cohort, student.track].join(' ').toLowerCase().includes(term);
      const matchesCohort = cohortFilter === 'all' || student.cohortId === cohortFilter;
      return matchesTerm && matchesCohort;
    });
  }, [cohortFilter, roster, search]);

  const applicationQueue = useMemo(
    () =>
      (liveApplications ?? []).map((application) => ({
        id: application._id,
        name: application.fullName,
        school: application.highSchool ?? '',
        status: application.status === 'accepted' ? 'Approved' : application.status,
        submitted: new Date(application.submittedAt).toLocaleDateString(),
      })),
    [liveApplications],
  );

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredStudents]);

  const openEdit = (student: any) => {
    setSelected(student);
    setEditForm({
      programTrack: student.track,
      cohortId: student.cohortId,
      mentorProfileId: student.mentorProfileId,
      enrollmentStatus: student.enrollmentStatus,
    });
    setEditOpen(true);
  };

  const openFlag = (student: any) => {
    setSelected(student);
    setFlagForm({ severity: 'medium', reason: '' });
    setFlagOpen(true);
  };

  const saveStudent = async () => {
    if (!selected) return;
    await updateStudent({
      studentProfileId: selected.id,
      programTrack: editForm.programTrack.trim() || 'Ignite',
      cohortId: editForm.cohortId ? (editForm.cohortId as any) : undefined,
      mentorProfileId: editForm.mentorProfileId ? (editForm.mentorProfileId as any) : undefined,
      enrollmentStatus: editForm.enrollmentStatus as any,
    });
    toast({ title: 'Student updated', description: `${selected.name}'s profile, cohort, mentor, and access state were saved.`, tone: 'success' });
    setEditOpen(false);
  };

  const saveFlag = async () => {
    if (!selected || !flagForm.reason.trim()) {
      toast({ title: 'Reason required', description: 'Add the intervention reason before flagging this student.', tone: 'warning' });
      return;
    }
    await flagStudent({
      studentProfileId: selected.id,
      severity: flagForm.severity as any,
      reason: flagForm.reason,
    });
    toast({ title: 'Student flagged', description: `${selected.name} now has an open mentor review flag.`, tone: 'warning' });
    setFlagOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Student Management"
        description="Admit students, assign mentors, manage cohort placement, pause access, and track risk flags from live Convex records."
        actions={
          <Button variant="primary" onClick={() => setNewOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Create Application
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Active Students', value: `${roster.filter((student) => student.enrollmentStatus === 'active').length}`, icon: Users2, hint: 'Students with active portal access' },
          { label: 'Pending Admissions', value: `${applicationQueue.filter((app) => app.status !== 'Approved').length}`, icon: GraduationCap, hint: 'Applications awaiting review or approval' },
          { label: 'At-Risk Learners', value: `${roster.filter((student) => student.isAtRisk).length}`, icon: AlertTriangle, hint: 'Open mentor review flags' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
              <card.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{card.label}</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Roster</h2>
            <p className="text-sm text-muted-foreground">Every action here writes to Convex and changes the student record.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 md:w-72" placeholder="Search students, mentors, cohorts" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <select
              className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent"
              value={cohortFilter}
              onChange={(event) => {
                setCohortFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Cohorts</option>
              {(cohorts ?? []).map((cohort) => (
                <option key={cohort._id} value={cohort._id}>
                  {cohort.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {liveStudents === undefined ? <LoadingPortalState label="Loading students..." /> : null}
        {liveStudents !== undefined && filteredStudents.length === 0 ? (
          <div className="p-6">
            <EmptyPortalState
              variant="students"
              title="No matching students"
              description="Approved applications create student records here. Change the filters or create an application to begin intake."
              action={<Button className="mt-5" variant="primary" onClick={() => setNewOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Create Application</Button>}
            />
          </div>
        ) : null}

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
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="align-top hover:bg-surface/50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{student.initials}</div>
                      <div>
                        <p className="font-semibold text-primary">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">{student.raw.studentCode}</p>
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
                    <StatusPill label={student.isAtRisk ? 'At Risk' : student.status} tone={student.isAtRisk ? 'warning' : student.enrollmentStatus === 'active' ? 'success' : 'info'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/students/${student.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(student)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openFlag(student)}>
                        <ShieldBan className="mr-2 h-4 w-4" /> Flag
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 p-4 md:hidden">
          {paginatedStudents.map((student) => (
            <article key={student.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{student.initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info label="Cohort" value={student.cohort} />
                    <Info label="Track" value={student.track} />
                    <Info label="Mentor" value={student.mentor} />
                    <Info label="Status" value={student.isAtRisk ? 'At Risk' : student.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild><Link href={`/admin/students/${student.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(student)}><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => openFlag(student)}><ShieldBan className="mr-2 h-4 w-4" /> Flag</Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</Button>
              <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</Button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h3 className="font-display text-xl font-bold text-primary">Admissions Pipeline</h3>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {applicationQueue.length === 0 ? (
            <EmptyPortalState variant="students" title="No applications yet" description="Public Ignite applications and admin-created intake records will appear here for approval." />
          ) : null}
          {applicationQueue.map((app) => (
            <div key={app.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.school || 'No school provided'}</p>
                </div>
                <StatusPill label={app.status} tone={app.status === 'Approved' ? 'success' : app.status === 'under_review' ? 'info' : 'warning'} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{app.submitted}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild><Link href="/admin/applications">Review</Link></Button>
                {app.status !== 'Approved' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={async () => {
                      await approveApplication({ applicationId: app.id as any });
                      await processInvitations({ limit: 5 }).catch((error) => console.error('Failed to process invitation queue after admission', error));
                      toast({ title: 'Student admitted', description: `${app.name} was approved and their Clerk invitation was queued.`, tone: 'success' });
                    }}
                  >
                    Admit
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PortalDialog open={newOpen} onClose={() => setNewOpen(false)} title="Create Student Application" description="This creates the intake application first. Approval then creates the student profile and sends the Clerk invitation.">
        <div className="space-y-4">
          <Input placeholder="Student full name" value={newStudent.name} onChange={(event) => setNewStudent((current) => ({ ...current, name: event.target.value }))} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input type="email" placeholder="Email address" value={newStudent.email} onChange={(event) => setNewStudent((current) => ({ ...current, email: event.target.value }))} />
            <Input placeholder="Phone number" value={newStudent.phone} onChange={(event) => setNewStudent((current) => ({ ...current, phone: event.target.value }))} />
          </div>
          <Textarea placeholder="Admission notes or motivation" value={newStudent.notes} onChange={(event) => setNewStudent((current) => ({ ...current, notes: event.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (!newStudent.name.trim() || !newStudent.email.trim()) {
                  toast({ title: 'Name and email required', description: 'Applications need a student name and email before they can be approved.', tone: 'warning' });
                  return;
                }
                await submitApplication({
                  fullName: newStudent.name,
                  email: newStudent.email,
                  phone: newStudent.phone || 'Not provided',
                  motivation: newStudent.notes || 'Created from admin student intake.',
                });
                toast({ title: 'Application created', description: 'The applicant is now in the admissions pipeline for review and approval.', tone: 'success' });
                setNewStudent({ name: '', phone: '', email: '', notes: '' });
                setNewOpen(false);
              }}
            >
              Create Application
            </Button>
          </div>
        </div>
      </PortalDialog>

      <PortalDialog open={editOpen} onClose={() => setEditOpen(false)} title={`Edit ${selected?.name ?? 'student'}`} description="Assign the program track, cohort, mentor, and portal access state.">
        <div className="space-y-4">
          <Input value={editForm.programTrack} onChange={(event) => setEditForm((current) => ({ ...current, programTrack: event.target.value }))} placeholder="Program track" />
          <div className="grid gap-4 md:grid-cols-2">
            <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent" value={editForm.cohortId} onChange={(event) => setEditForm((current) => ({ ...current, cohortId: event.target.value }))}>
              <option value="">Unassigned cohort</option>
              {(cohorts ?? []).map((cohort) => <option key={cohort._id} value={cohort._id}>{cohort.name}</option>)}
            </select>
            <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent" value={editForm.mentorProfileId} onChange={(event) => setEditForm((current) => ({ ...current, mentorProfileId: event.target.value }))}>
              <option value="">Unassigned mentor</option>
              {mentors.map((mentor) => <option key={mentor._id} value={mentor._id}>{mentor.name} ({mentor.role})</option>)}
            </select>
          </div>
          <select className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent" value={editForm.enrollmentStatus} onChange={(event) => setEditForm((current) => ({ ...current, enrollmentStatus: event.target.value }))}>
            <option value="active">Active access</option>
            <option value="suspended">Paused access</option>
            <option value="completed">Completed</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveStudent}>Save Student</Button>
          </div>
        </div>
      </PortalDialog>

      <PortalDialog open={flagOpen} onClose={() => setFlagOpen(false)} title={`Flag ${selected?.name ?? 'student'}`} description="Create a mentor review flag that remains open until an admin resolves it.">
        <div className="space-y-4">
          <select className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent" value={flagForm.severity} onChange={(event) => setFlagForm((current) => ({ ...current, severity: event.target.value }))}>
            <option value="low">Low severity</option>
            <option value="medium">Medium severity</option>
            <option value="high">High severity</option>
          </select>
          <Textarea placeholder="Reason for flagging this student" value={flagForm.reason} onChange={(event) => setFlagForm((current) => ({ ...current, reason: event.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setFlagOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveFlag}>Create Flag</Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-3 text-sm text-muted-foreground">
      <p className="font-semibold text-primary">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
