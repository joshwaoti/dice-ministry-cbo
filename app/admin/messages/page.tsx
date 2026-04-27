'use client';

import { useState } from 'react';
import { Send, UserRoundSearch, BookText, BadgeCheck } from 'lucide-react';
import { adminThreads } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

export default function AdminMessagesPage() {
  const [thread, setThread] = useState(adminThreads[0]);
  const { toast } = useToast();

  return (
    <div className="space-y-6 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Communication Center"
        description="Manage instructor-student communication, internal coordination, and follow-up on assignments and admissions."
      />

      <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-sm lg:grid-cols-[340px_1fr]">
        <aside className="border-r border-border">
          <div className="border-b border-border p-5">
            <Input placeholder="Search threads, learners, or staff" />
          </div>
          <div className="space-y-1 p-3">
            {adminThreads.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setThread(item)}
                className={`w-full rounded-2xl p-4 text-left transition ${thread.id === item.id ? 'bg-accent/6' : 'hover:bg-surface'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.subject}</p>
                  </div>
                  {item.unread ? <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-bold text-white">{item.unread}</span> : null}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.lastMessage}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.time}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[720px] flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">{thread.name}</h2>
              <p className="text-sm text-muted-foreground">{thread.subject}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast({ title: 'Escalation assigned', description: 'The thread was tagged for instructor follow-up.', tone: 'info' })}>
                <UserRoundSearch className="mr-2 h-4 w-4" /> Assign Owner
              </Button>
              <Button variant="outline" onClick={() => toast({ title: 'Thread resolved', description: 'The conversation was marked as resolved and archived.', tone: 'success' })}>
                <BadgeCheck className="mr-2 h-4 w-4" /> Resolve
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-5 bg-surface/50 px-6 py-6">
            <div className="max-w-3xl rounded-3xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-primary">Can we extend the deadline for Peter Maina? His guardian only delivered the reflection file this morning and the mentorship team agreed to a pastoral extension.</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Instructor Davis • 10:45 AM</p>
            </div>
            <div className="ml-auto max-w-3xl rounded-3xl bg-primary p-5 text-white shadow-sm">
              <p className="text-sm leading-relaxed">Yes. Please log the extension on the assignment record and request a resubmission window through the assignment review panel so the learner sees the updated state in the student portal.</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/70">You • 11:02 AM</p>
            </div>
            <div className="max-w-3xl rounded-3xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-primary">Understood. I will also attach the updated feedback rubric.</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Instructor Davis • 11:09 AM</p>
            </div>
          </div>

          <div className="border-t border-border px-6 py-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <Textarea className="min-h-32" placeholder="Write an update, pastoral note, or instruction for the selected thread." />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => toast({ title: 'Template inserted', description: 'Assignment follow-up template added to the reply box.', tone: 'info' })}>
                    <BookText className="mr-2 h-4 w-4" /> Insert Template
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: 'Attachment stub ready', description: 'Upload controls prepared for a supporting rubric or memo.', tone: 'info' })}>
                    Attach Document
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-primary">Routing</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Owner: Grace Njeri</li>
                  <li>Context: Assignment review</li>
                  <li>Priority: Needs action today</li>
                </ul>
                <Button className="mt-5 w-full" variant="primary" onClick={() => toast({ title: 'Reply sent', description: 'The conversation update was delivered and logged in the activity history.', tone: 'success' })}>
                  <Send className="mr-2 h-4 w-4" /> Send Reply
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
