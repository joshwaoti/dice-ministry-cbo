'use client';

import { BellRing, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Platform Settings"
        description="Tune notifications, publishing defaults, admissions policy, and admin permission boundaries."
        actions={<Button variant="primary" onClick={() => toast({ title: 'Settings updated', description: 'Portal preferences and notification rules were saved.', tone: 'success' })}>Save Settings</Button>}
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
            {[
              ['New Ignite application submitted', 'Email + in-app notification'],
              ['Assignment requires review', 'In-app only, escalates to email after 12 hours'],
              ['Student marked at risk', 'Email mentor + cohort lead'],
              ['Document upload failed compliance checks', 'Admin security alert'],
            ].map(([label, hint]) => (
              <label key={label} className="flex items-start gap-4 rounded-2xl border border-border p-4">
                <input type="checkbox" defaultChecked className="mt-1 h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" />
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
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Permissions</h2>
                <p className="text-sm text-muted-foreground">Role-sensitive defaults for instructors, admissions, and coordinators.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                'Only super admins can publish courses.',
                'Admissions officers can approve applications but cannot delete users.',
                'Instructors can upload learning documents and review assignments.',
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
              <div className="rounded-2xl border border-border px-4 py-3">Default assignment file limit: 10 MB</div>
              <div className="rounded-2xl border border-border px-4 py-3">Reminder cadence: 24 hours before deadlines</div>
              <div className="rounded-2xl border border-border px-4 py-3">Autosave cadence for course editor: 2 seconds after last edit</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
