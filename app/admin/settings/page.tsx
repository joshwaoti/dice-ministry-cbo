'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { BellRing, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { Input } from '@/components/ui/input';
import { UploadDropzone } from '@/components/portal/UploadDropzone';

export default function AdminSettingsPage() {
  const settings = useQuery(api.settings.getAll, {}) as any | undefined;
  const profile = useQuery(api.profiles.current, {}) as any | null | undefined;
  const avatarUrl = useQuery(api.profiles.avatarUrl, profile?.avatarStorageId ? { storageId: profile.avatarStorageId } : {}) as string | null | undefined;
  const saveSetting = useMutation(api.settings.upsert);
  const updateSelf = useMutation(api.profiles.updateSelf);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const [notifications, setNotifications] = useState({
    applicationSubmitted: true,
    assignmentReview: true,
    studentAtRisk: true,
    documentUploadAlert: true,
  });
  const [operations, setOperations] = useState({
    defaultAssignmentFileLimitMB: 10,
    reminderHoursBeforeDeadline: 24,
    courseAutosaveSeconds: 2,
  });
  const [dirty, setDirty] = useState(false);
  const [profileDirty, setProfileDirty] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const { toast } = useToast();
  const visibleNotifications = dirty ? notifications : settings?.notifications ?? notifications;
  const visibleOperations = dirty ? operations : settings?.operations ?? operations;
  const visibleProfile = profileDirty ? profileForm : { name: profile?.name ?? '', phone: profile?.phone ?? '' };

  const handleSave = async () => {
    await Promise.all([
      saveSetting({ key: 'notifications', value: visibleNotifications }),
      saveSetting({ key: 'operations', value: visibleOperations }),
      updateSelf({ name: visibleProfile.name, phone: visibleProfile.phone }),
    ]);
    setDirty(false);
    setProfileDirty(false);
    toast({ title: 'Settings updated', description: 'Portal preferences and notification rules were saved to Convex.', tone: 'success' });
  };

  const notificationRows = [
    ['applicationSubmitted', 'New Ignite application submitted', 'Email + in-app notification'],
    ['assignmentReview', 'Assignment requires review', 'In-app only, escalates to email after 12 hours'],
    ['studentAtRisk', 'Student marked at risk', 'Email mentor + cohort lead'],
    ['documentUploadAlert', 'Document upload failed compliance checks', 'Admin security alert'],
  ] as const;

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Platform Settings"
        description="Tune notifications, publishing defaults, admissions policy, and admin permission boundaries."
        actions={<Button variant="primary" onClick={handleSave}>Save Settings</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent"><BellRing className="h-5 w-5" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Notifications</h2>
              <p className="text-sm text-muted-foreground">Set the channels and thresholds that matter most to the admin team.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {settings === undefined ? <LoadingPortalState label="Loading settings..." /> : null}
            {notificationRows.map(([key, label, hint]) => (
              <label key={label} className="flex items-start gap-4 rounded-2xl border border-border p-4">
                <input
                  type="checkbox"
                  checked={visibleNotifications[key]}
                  onChange={(event) => {
                    setDirty(true);
                    setNotifications({ ...visibleNotifications, [key]: event.target.checked });
                  }}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <div>
                  <p className="font-medium text-primary">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent/10 p-3 text-accent"><UserRound className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Profile</h2>
                <p className="text-sm text-muted-foreground">Update your admin profile and avatar.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 font-bold text-primary">
                {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : (profile?.name ?? 'A').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-primary">{profile?.name ?? 'Admin profile'}</p>
                <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Input placeholder="Full name" value={visibleProfile.name} onChange={(event) => {
                setProfileDirty(true);
                setProfileForm({ ...visibleProfile, name: event.target.value });
              }} />
              <Input placeholder="Phone number" value={visibleProfile.phone ?? ''} onChange={(event) => {
                setProfileDirty(true);
                setProfileForm({ ...visibleProfile, phone: event.target.value });
              }} />
              <UploadDropzone
                title="Profile photo"
                description="Upload a JPG or PNG profile image."
                accepted="JPG, PNG"
                generateUploadUrl={generateUploadUrl}
                onUploaded={async (file) => {
                  if (!file.contentType.startsWith('image/')) {
                    toast({ title: 'Image required', description: 'Profile photos must be JPG or PNG files.', tone: 'warning' });
                    return;
                  }
                  await updateSelf({ avatarStorageId: file.storageId as any });
                  toast({ title: 'Photo updated', description: 'Your profile image was saved.', tone: 'success' });
                }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Permissions</h2>
                <p className="text-sm text-muted-foreground">Role-sensitive defaults for instructors, admissions, and coordinators.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                'Course publishing requires super_admin role.',
                'Admissions can approve but cannot delete users.',
                'Instructors can upload docs and review assignments.',
              ].map((rule) => (
                <div key={rule} className="rounded-2xl border border-border bg-surface px-4 py-3 text-muted-foreground">{rule}</div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold/20 p-3 text-gold"><SlidersHorizontal className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Operational Defaults</h2>
                <p className="text-sm text-muted-foreground">Portal behavior that shapes day-to-day workflow.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
              <label className="block rounded-2xl border border-border px-4 py-3">
                <span className="text-sm font-semibold text-primary">Default assignment file limit (MB)</span>
                <input
                  type="number"
                  min={1}
                  className="mt-2 h-10 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-accent"
                  value={visibleOperations.defaultAssignmentFileLimitMB}
                  onChange={(event) => {
                    setDirty(true);
                    setOperations({ ...visibleOperations, defaultAssignmentFileLimitMB: Number(event.target.value) });
                  }}
                />
              </label>
              <label className="block rounded-2xl border border-border px-4 py-3">
                <span className="text-sm font-semibold text-primary">Reminder cadence (hours before deadlines)</span>
                <input
                  type="number"
                  min={1}
                  className="mt-2 h-10 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-accent"
                  value={visibleOperations.reminderHoursBeforeDeadline}
                  onChange={(event) => {
                    setDirty(true);
                    setOperations({ ...visibleOperations, reminderHoursBeforeDeadline: Number(event.target.value) });
                  }}
                />
              </label>
              <label className="block rounded-2xl border border-border px-4 py-3">
                <span className="text-sm font-semibold text-primary">Course editor autosave cadence (seconds)</span>
                <input
                  type="number"
                  min={1}
                  className="mt-2 h-10 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-accent"
                  value={visibleOperations.courseAutosaveSeconds}
                  onChange={(event) => {
                    setDirty(true);
                    setOperations({ ...visibleOperations, courseAutosaveSeconds: Number(event.target.value) });
                  }}
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
