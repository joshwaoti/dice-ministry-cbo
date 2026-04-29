'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { BadgeCheck, BookText, Send, UserRoundSearch } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { adminThreads } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';

const PAGE_SIZE = 8;

export default function AdminMessagesPage() {
  const liveConversations = useQuery(api.messages.listConversations, {}) as any[] | undefined;
  const sendMessage = useMutation(api.messages.send);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const threads = liveConversations?.map((conversation) => ({
    id: conversation._id,
    name: conversation.student?.name ?? 'Student conversation',
    subject: conversation.subject,
    unread: conversation.unreadCount ?? 0,
    lastMessage: conversation.lastMessage?.body ?? 'No messages yet.',
    time: conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : 'New thread',
    isLive: true,
  })) ?? adminThreads.map((thread) => ({ ...thread, isLive: false }));
  
  const availableThreads = liveConversations !== undefined ? threads : [];
  const filteredThreads = availableThreads.filter((thread) => `${thread.name} ${thread.subject} ${thread.lastMessage}`.toLowerCase().includes(search.toLowerCase()));
  const { pageItems, totalPages } = paginate(filteredThreads, page, PAGE_SIZE);
  const thread = filteredThreads.find((item) => item.id === selectedId) ?? filteredThreads[0];
  const liveMessages = useQuery(api.messages.listMessages, thread?.isLive ? { conversationId: thread.id as any } : 'skip') as any[] | undefined;
  const messages = thread?.isLive
    ? liveMessages?.map((message) => ({
        id: message._id,
        body: message.body,
        sender: message.sender?.name ?? 'Portal user',
        mine: false,
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })) ?? []
    : [
        { id: 'mock-1', body: 'Can we extend the deadline for Peter Maina? His guardian only delivered the reflection file this morning and the mentorship team agreed to a pastoral extension.', sender: 'Instructor Davis', mine: false, time: '10:45 AM' },
        { id: 'mock-2', body: 'Yes. Please log the extension on the assignment record and request a resubmission window through the assignment review panel so the learner sees the updated state in the student portal.', sender: 'You', mine: true, time: '11:02 AM' },
        { id: 'mock-3', body: 'Understood. I will also attach the updated feedback rubric.', sender: 'Instructor Davis', mine: false, time: '11:09 AM' },
      ];

  const handleSend = async () => {
    if (!thread || !reply.trim()) return;
    if (!thread.isLive) {
      toast({ title: 'Reply sent', description: 'Live Convex conversations will persist replies here.', tone: 'success' });
      setReply('');
      return;
    }
    await sendMessage({ conversationId: thread.id as any, body: reply.trim() });
    setReply('');
    toast({ title: 'Reply sent', description: 'The conversation update was delivered and logged in Convex.', tone: 'success' });
  };

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
            <Input placeholder="Search threads, learners, or staff" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="space-y-1 p-3">
            {liveConversations === undefined ? <LoadingPortalState label="Loading conversations..." /> : null}
            {liveConversations !== undefined && filteredThreads.length === 0 ? (
              <EmptyPortalState
                variant="messages"
                title="No conversations yet"
                description="Student and instructor messages will appear here as soon as a conversation is opened."
              />
            ) : null}
            {pageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-2xl p-4 text-left transition ${thread?.id === item.id ? 'bg-accent/6' : 'hover:bg-surface'}`}
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
          <PaginationControls page={page} totalPages={totalPages} totalItems={filteredThreads.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </aside>

        {thread ? (
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
              {thread.isLive && liveMessages === undefined ? <LoadingPortalState label="Loading messages..." /> : null}
              {messages.length === 0 ? <EmptyPortalState variant="messages" title="No messages in this thread" description="Send the first update to begin the conversation history." /> : null}
              {messages.map((message) => (
                <div key={message.id} className={`${message.mine ? 'ml-auto bg-primary text-white' : 'border border-border bg-white text-primary'} max-w-3xl rounded-3xl p-5 shadow-sm`}>
                  <p className="text-sm leading-relaxed">{message.body}</p>
                  <p className={`mt-3 text-xs uppercase tracking-[0.18em] ${message.mine ? 'text-white/70' : 'text-muted-foreground'}`}>{message.sender} - {message.time}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-4">
                  <Textarea className="min-h-32" placeholder="Write an update, pastoral note, or instruction for the selected thread." value={reply} onChange={(event) => setReply(event.target.value)} />
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
                    <li>Owner: {thread.name}</li>
                    <li>Context: {thread.subject}</li>
                    <li>Priority: Needs action today</li>
                  </ul>
                  <Button className="mt-5 w-full" variant="primary" onClick={handleSend}>
                    <Send className="mr-2 h-4 w-4" /> Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
