'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { adminUsers } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { BadgePlus, ShieldCheck, UserCog2 } from 'lucide-react';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

const PAGE_SIZE = 6;

export default function AdminUsersPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator' | 'super_admin'>('moderator');
  const [scope, setScope] = useState('');
  const { toast } = useToast();
  const liveUsers = useQuery(api.adminUsers.list) as any[] | undefined;
  const inviteAdmin = useMutation(api.adminUsers.inviteAdmin);
  const updateStatus = useMutation(api.adminUsers.updateStatus);
  const normalizedUsers =
    liveUsers?.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin / Teacher' : 'Moderator',
      scope: 'Portal access',
      status: user.status === 'active' ? 'Active' : user.status === 'suspended' ? 'Suspended' : 'Pending Invite',
      isLive: true,
    })) ?? adminUsers.map((user) => ({ ...user, isLive: false }));
  const { pageItems, totalPages } = paginate(normalizedUsers, page, PAGE_SIZE);

  const handleInvite = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Name and email required', description: 'Add the admin name and email before inviting.', tone: 'warning' });
      return;
    }
    await inviteAdmin({ name, email, role, scope });
    toast({ title: 'Admin profile created', description: 'The user is pending invite/activation in the admin directory.', tone: 'success' });
    setName('');
    setEmail('');
    setScope('');
    setRole('moderator');
    setOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Admin Users"
        description="Manage super admins, instructors, admissions officers, and content managers with clear role boundaries."
        actions={<Button variant="primary" onClick={() => setOpen(true)}><BadgePlus className="mr-2 h-4 w-4" /> Invite Admin User</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-2xl font-bold text-primary">Team Directory</h2>
          </div>
          <div className="space-y-4 p-4">
            {liveUsers === undefined ? <LoadingPortalState label="Loading admin users..." /> : null}
            {liveUsers !== undefined && normalizedUsers.length === 0 ? (
              <EmptyPortalState
                variant="users"
                title="No admin users visible"
                description="Invite a moderator or admin user. Super admin visibility is protected by backend role rules."
                action={<div className="mt-5"><Button variant="primary" onClick={() => setOpen(true)}><BadgePlus className="mr-2 h-4 w-4" /> Invite Admin User</Button></div>}
              />
            ) : null}
            {pageItems.map((user) => (
              <article key={user.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-primary">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accent">{user.id}</p>
                  </div>
                  <StatusPill label={user.status} tone={user.status === 'Active' ? 'success' : 'warning'} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-sm font-semibold text-primary">Role</p>
                    <p className="mt-2 text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-sm font-semibold text-primary">Scope</p>
                    <p className="mt-2 text-sm text-muted-foreground">{user.scope}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => toast({ title: `${user.name} edited`, description: 'Role permissions are ready for adjustment.', tone: 'info' })}>Edit Role</Button>
                  <Button variant="outline" onClick={() => toast({ title: `${user.name} invited again`, description: 'A fresh invitation email was sent with portal access instructions.', tone: 'success' })}>Resend Invite</Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (user.isLive) await updateStatus({ profileId: user.id as any, status: 'suspended' });
                      toast({ title: `${user.name} deactivated`, description: 'Access was suspended pending approval.', tone: 'warning' });
                    }}
                  >
                    Deactivate
                  </Button>
                </div>
              </article>
            ))}
            <PaginationControls page={page} totalPages={totalPages} totalItems={normalizedUsers.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Role Matrix</h2>
                <p className="text-sm text-muted-foreground">High-level visibility of who can do what.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border px-4 py-3">Super Admins: full portal control, publishing, and user management.</div>
              <div className="rounded-2xl border border-border px-4 py-3">Instructors: assignments, course documents, learner messaging.</div>
              <div className="rounded-2xl border border-border px-4 py-3">Admissions Officers: applications, student creation, and intake documents.</div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent/10 p-3 text-accent"><UserCog2 className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Audit Notes</h2>
                <p className="text-sm text-muted-foreground">Recent admin access changes.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-2xl bg-surface px-4 py-3">Grace Njeri promoted to Instructor • Today</li>
              <li className="rounded-2xl bg-surface px-4 py-3">Mark Were pending first-login verification • Yesterday</li>
              <li className="rounded-2xl bg-surface px-4 py-3">Lydia Mwangi granted document upload rights • Apr 25</li>
            </ul>
          </div>
        </aside>
      </div>

      <PortalDialog open={open} onClose={() => setOpen(false)} title="Invite Admin User" description="Add instructors, admissions staff, or other administrators and define their permissions.">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select className="h-12 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent" value={role} onChange={(event) => setRole(event.target.value as any)}>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin / Teacher</option>
              <option value="moderator">Moderator</option>
            </select>
            <Input placeholder="Scope or team (e.g. Ignite 2025)" value={scope} onChange={(event) => setScope(event.target.value)} />
          </div>
          <Textarea className="min-h-28" placeholder="Optional onboarding note or temporary access instructions." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleInvite}>Send Invite</Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
