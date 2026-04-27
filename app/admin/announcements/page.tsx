'use client';

import { useState } from 'react';
import { CalendarClock, Megaphone, Send, Sparkles } from 'lucide-react';
import { announcements } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

export default function AdminAnnouncementsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Announcements"
        description="Prepare portal announcements, banner messages, instructor notices, and scheduled communications."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Megaphone className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <section className="space-y-4">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{announcement.channel}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-primary">{announcement.title}</h2>
                </div>
                <StatusPill
                  label={announcement.status}
                  tone={announcement.status === 'Sent' ? 'success' : announcement.status === 'Scheduled' ? 'info' : 'warning'}
                />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-primary">Audience</p>
                  <p className="mt-2 text-sm text-muted-foreground">{announcement.audience}</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-primary">Delivery</p>
                  <p className="mt-2 text-sm text-muted-foreground">{announcement.channel}</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-sm font-semibold text-primary">Timing</p>
                  <p className="mt-2 text-sm text-muted-foreground">{announcement.date}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast({ title: 'Announcement duplicated', description: 'A copy has been opened in the composer as a new draft.', tone: 'success' })}>Duplicate</Button>
                <Button variant="outline" onClick={() => toast({ title: 'Audience updated', description: 'Segment targeting controls are ready for review.', tone: 'info' })}>Edit Audience</Button>
                <Button variant="primary" onClick={() => toast({ title: 'Announcement sent', description: 'The message was delivered to its selected channels.', tone: 'success' })}>
                  <Send className="mr-2 h-4 w-4" /> Send Now
                </Button>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-primary">Scheduling Rules</h3>
              <p className="mt-2 text-sm text-muted-foreground">Use this side panel to plan timing, publishing windows, and per-channel rollout.</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border px-4 py-3">Public banner messages expire automatically after the campaign end date.</div>
            <div className="rounded-2xl border border-border px-4 py-3">Instructor notices can be restricted to admin users or instructors only.</div>
            <div className="rounded-2xl border border-border px-4 py-3">Portal announcements should include a CTA destination whenever the user must take action.</div>
          </div>
        </aside>
      </div>

      <PortalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create Announcement"
        description="Compose a banner, student update, or instructor notice and decide how it should be delivered."
      >
        <div className="space-y-4">
          <Input placeholder="Announcement title" />
          <div className="grid gap-4 md:grid-cols-3">
            <select className="h-12 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent">
              <option>Audience</option>
              <option>Public visitors</option>
              <option>Students</option>
              <option>Instructors</option>
              <option>All admins</option>
            </select>
            <select className="h-12 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent">
              <option>Channel</option>
              <option>Portal banner</option>
              <option>Email</option>
              <option>Portal notification</option>
              <option>All selected channels</option>
            </select>
            <Input type="datetime-local" />
          </div>
          <Textarea className="min-h-36" placeholder="Message body, CTA copy, follow-up instructions, or mentor note." />
          <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            Preview: a compact orange banner for urgent messages, or a card-style notification inside the relevant portal area.
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { toast({ title: 'Announcement drafted', description: 'The new announcement is ready for preview, scheduling, or publication.', tone: 'success' }); setOpen(false); }}>
              <Sparkles className="mr-2 h-4 w-4" /> Save Draft
            </Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
