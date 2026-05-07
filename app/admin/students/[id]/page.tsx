'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { BookOpenCheck, CalendarClock, FileUp, GraduationCap, Mail, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending_invite: 'Pending Invite',
  suspended: 'Paused',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const liveStudent = useQuery(api.students.get, canQueryConvexId(id) ? { studentProfileId: id as any } : 'skip') as any | undefined;
  const liveSubmissions = useQuery(api.assignments.listSubmissions, {}) as any[] | undefined;
  const cohorts = useQuery(api.cohorts.list) as any[] | undefined;
  const admins = useQuery(api.adminUsers.list) as any[] | undefined;
  const courses = useQuery(api.courses.listAdmin) as any[] | undefined;
  const updateStudent = useMutation(api.students.update);
  const resolveFlag = useMutation(api.students.resolveFlag);
  const enrollInCourse = useMutation(api.students.enrollInCourse);
  const withdrawFromCourse = useMutation(api.students.withdrawFromCourse);
  const startConversation = useMutation(api.messages.startAdminConversation);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const attachStudentDocument = useMutation(api.documents.attachStudentDocumentForAdmin);

  const [editOpen, setEditOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [note, setNote] = useState('');
  const [courseId, setCourseId] = useState('');
  const [editForm, setEditForm] = useState({
    programTrack: 'Ignite',
    cohortId: '',
    mentorProfileId: '',
    enrollmentStatus: 'active',
  });

  const mentors = useMemo(() => (admins ?? []).filter((profile) => profile.role === 'moderator' || profile.role === 'admin'), [admins]);
  const student = liveStudent
    ? {
        id: liveStudent._id,
        code: liveStudent.studentCode,
        initials: (liveStudent.profile?.name ?? 'Student').split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase(),
        name: liveStudent.profile?.name ?? 'Student',
        email: liveStudent.profile?.email ?? 'No email',
        track: liveStudent.programTrack ?? 'Ignite',
        cohort: liveStudent.cohort?.name ?? 'Unassigned',
        status: statusLabels[liveStudent.enrollmentStatus] ?? liveStudent.enrollmentStatus,
        enrollmentStatus: liveStudent.enrollmentStatus,
        mentor: liveStudent.mentor?.name ?? 'Unassigned',
        progress: liveStudent.progressPercent ?? 0,
        flags: liveStudent.flags ?? [],
        enrollments: liveStudent.enrollments ?? [],
      }
    : null;

  const studentWork = liveStudent
    ? (liveSubmissions ?? [])
        .filter((submission) => submission.studentProfile?._id === liveStudent._id)
        .slice(0, 4)
        .map((submission) => ({
          id: submission._id,
          course: submission.course?.title ?? 'Course unavailable',
          title: submission.assignment?.title ?? 'Assignment',
          due: submission.assignment?.dueAt ? new Date(submission.assignment.dueAt).toLocaleDateString() : 'No due date',
          accepted: submission.fileName ?? 'Document submission',
          status: submission.status === 'pass' ? 'Graded' : submission.status === 'needs_revision' ? 'Revision' : 'Submitted',
        }))
    : [];

  const openEditor = () => {
    if (!liveStudent) return;
    setEditForm({
      programTrack: liveStudent.programTrack ?? 'Ignite',
      cohortId: liveStudent.cohortId ?? '',
      mentorProfileId: liveStudent.mentorProfileId ?? '',
      enrollmentStatus: liveStudent.enrollmentStatus === 'pending_invite' ? 'active' : liveStudent.enrollmentStatus,
    });
    setEditOpen(true);
  };

  const saveStudent = async () => {
    if (!liveStudent) return;
    await updateStudent({
      studentProfileId: liveStudent._id,
      programTrack: editForm.programTrack,
      cohortId: editForm.cohortId ? (editForm.cohortId as any) : undefined,
      mentorProfileId: editForm.mentorProfileId ? (editForm.mentorProfileId as any) : undefined,
      enrollmentStatus: editForm.enrollmentStatus as any,
    });
    toast({ title: 'Student updated', description: 'Profile, mentor, cohort, and access settings were saved.', tone: 'success' });
    setEditOpen(false);
  };

  if (canQueryConvexId(id) && liveStudent === undefined) return <LoadingPortalState label="Loading student profile..." />;
  if (!student) {
    return (
      <EmptyPortalState
        variant="students"
        title="Student not found"
        description="This profile could not be loaded from Convex."
        action={<Button className="mt-5" variant="outline" asChild><Link href="/admin/students">Back to students</Link></Button>}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PortalPageHeader
        eyebrow="Student Profile"
        title={student.name}
        description="Manage admissions, access, mentor assignment, cohort placement, course enrollment, documents, and support messages."
        actions={
          <>
            <Button variant="outline" onClick={() => setMessageOpen(true)}>
              <Mail className="mr-2 h-4 w-4" /> Message Student
            </Button>
            <Button variant="primary" onClick={openEditor}>
              <UserRoundCheck className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <section className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-white">{student.initials}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{student.code}</p>
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

          <div className="rounded-2xl bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">Progress Snapshot</p>
              <StatusPill label={`${student.progress}% complete`} tone={student.progress >= 70 ? 'success' : student.progress >= 30 ? 'info' : 'warning'} />
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-accent" style={{ width: `${student.progress}%` }} />
            </div>
          </div>

          <UploadDropzone
            title="Attach student document"
            description="Upload admissions notes, result slips, consent forms, and support documents."
            accepted="PDF, DOCX, TXT, JPG, PNG"
            showSuccessToast={false}
            onUploaded={async (file) => {
              await attachStudentDocument({
                studentProfileId: liveStudent._id,
                storageId: file.storageId as any,
                fileName: file.fileName,
                contentType: file.contentType,
                size: file.size,
                category: 'admin_upload',
              });
              toast({ title: 'Document attached', description: `${file.fileName} was stored on this student record.`, tone: 'success' });
            }}
            generateUploadUrl={generateUploadUrl}
          />
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">Support Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">These controls update the student record immediately.</p>
              </div>
              <StatusPill label={student.flags.some((flag: any) => flag.status === 'open') ? 'At Risk' : student.status} tone={student.flags.some((flag: any) => flag.status === 'open') ? 'warning' : 'info'} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ActionCard label="Edit profile" copy="Update track, cohort, mentor, and access." onClick={openEditor} />
              <ActionCard label="Move cohort" copy="Choose a different active cohort." onClick={openEditor} />
              <ActionCard
                label={liveStudent.enrollmentStatus === 'suspended' ? 'Restore access' : 'Pause access'}
                copy="Change whether this student can access the portal."
                onClick={async () => {
                  await updateStudent({ studentProfileId: liveStudent._id, enrollmentStatus: liveStudent.enrollmentStatus === 'suspended' ? 'active' : 'suspended' });
                  toast({ title: 'Access updated', description: `${student.name}'s portal access is now ${liveStudent.enrollmentStatus === 'suspended' ? 'active' : 'paused'}.`, tone: 'success' });
                }}
              />
              <ActionCard label="Assign mentor" copy="Select an admin or moderator mentor." onClick={openEditor} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-primary">Course Access</h2>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <select className="h-12 rounded-md border border-input bg-background px-3 text-sm text-primary outline-none focus:border-accent md:flex-1" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                <option value="">Choose published or draft course</option>
                {(courses ?? []).map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}
              </select>
              <Button
                variant="primary"
                onClick={async () => {
                  if (!courseId) {
                    toast({ title: 'Choose a course', description: 'Select a course before assigning access.', tone: 'warning' });
                    return;
                  }
                  await enrollInCourse({ studentProfileId: liveStudent._id, courseId: courseId as any });
                  toast({ title: 'Course assigned', description: `${student.name} now has access to the selected course.`, tone: 'success' });
                  setCourseId('');
                }}
              >
                <BookOpenCheck className="mr-2 h-4 w-4" /> Assign Course
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {student.enrollments.length === 0 ? (
                <EmptyPortalState variant="learning" title="No assigned courses" description="Assign a course above to make it visible in the student portal." />
              ) : null}
              {student.enrollments.map((enrollment: any) => (
                <div key={enrollment._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-semibold text-primary">{enrollment.course?.title ?? 'Deleted course'}</p>
                    <p className="text-sm text-muted-foreground">{enrollment.progressPercent ?? 0}% complete</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill label={enrollment.status} tone={enrollment.status === 'active' ? 'success' : 'warning'} />
                    {enrollment.status === 'active' ? (
                      <Button size="sm" variant="outline" onClick={async () => {
                        await withdrawFromCourse({ enrollmentId: enrollment._id });
                        toast({ title: 'Course access removed', description: `${student.name} was withdrawn from ${enrollment.course?.title ?? 'the course'}.`, tone: 'success' });
                      }}>Withdraw</Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-primary">Open Flags</h2>
            <div className="mt-5 space-y-3">
              {student.flags.length === 0 ? <EmptyPortalState variant="students" title="No open flags" description="Mentor review flags created from the roster appear here." /> : null}
              {student.flags.map((flag: any) => (
                <div key={flag._id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <StatusPill label={flag.severity} tone={flag.severity === 'high' ? 'danger' : flag.severity === 'medium' ? 'warning' : 'info'} />
                      <p className="mt-3 text-sm text-muted-foreground">{flag.reason}</p>
                    </div>
                    {flag.status === 'open' ? <Button size="sm" variant="outline" onClick={async () => {
                      await resolveFlag({ flagId: flag._id });
                      toast({ title: 'Flag resolved', description: 'The mentor review flag was closed.', tone: 'success' });
                    }}>Resolve</Button> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-primary">Recent Coursework</h2>
            <div className="mt-5 space-y-4">
              {liveSubmissions !== undefined && studentWork.length === 0 ? <EmptyPortalState variant="documents" title="No coursework yet" description="Submitted assignments and graded document work will appear here for this student." /> : null}
              {studentWork.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{assignment.course}</p>
                      <h3 className="mt-1 font-semibold text-primary">{assignment.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Due {assignment.due} - {assignment.accepted}</p>
                    </div>
                    <StatusPill label={assignment.status} tone={assignment.status === 'Graded' ? 'success' : assignment.status === 'Submitted' ? 'info' : 'warning'} />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-5" variant="outline" onClick={() => setMessageOpen(true)}>
              <FileUp className="mr-2 h-4 w-4" /> Add Academic Note
            </Button>
          </div>
        </section>
      </div>

      <PortalDialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit Student" description="Update the student's editable backend fields.">
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
            <Button variant="primary" onClick={saveStudent}>Save Changes</Button>
          </div>
        </div>
      </PortalDialog>

      <PortalDialog open={messageOpen} onClose={() => setMessageOpen(false)} title="Message Student" description="Creates a real conversation in the portal message center.">
        <div className="space-y-4">
          <Textarea placeholder="Message or academic note" value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMessageOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (!note.trim()) {
                  toast({ title: 'Message required', description: 'Write the note before sending it.', tone: 'warning' });
                  return;
                }
                await startConversation({ studentProfileId: liveStudent._id, subject: `Support note for ${student.name}`, body: note });
                toast({ title: 'Message sent', description: 'A new conversation was created for this student.', tone: 'success' });
                setNote('');
                setMessageOpen(false);
              }}
            >
              Send Message
            </Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}

function ActionCard({ label, copy, onClick }: { label: string; copy: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border border-border bg-slate-50 p-4 text-left transition hover:border-accent hover:bg-accent/5">
      <p className="font-semibold text-primary">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
    </button>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-3 text-accent shadow-sm"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">{label}</p>
          <p className="mt-1 font-medium text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}
