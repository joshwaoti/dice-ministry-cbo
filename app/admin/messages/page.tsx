'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { BadgeCheck, BookText, FileText, Pencil, Save, Send, UserRoundSearch } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

const PAGE_SIZE = 8;

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const profile = useQuery(api.profiles.current, {}) as any | null | undefined;
  const liveConversations = useQuery(api.messages.listConversations, {}) as any[] | undefined;
  const publicSubmissions = useQuery(api.publicSubmissions.listAdmin, { status: 'new' }) as any[] | undefined;
  const sendMessage = useMutation(api.messages.send);
  const updatePublicSubmissionStatus = useMutation(api.publicSubmissions.updateStatus);
  const editMessage = useMutation(api.messages.edit);
  const markRead = useMutation(api.messages.markRead);
  const attachDocument = useMutation(api.messages.attachDocument);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const assignConversation = useMutation(api.messages.assignToMe);
  const resolveConversation = useMutation(api.messages.resolve);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const threads =
    liveConversations?.map((conversation) => ({
      id: conversation._id,
      name: conversation.student?.name ?? 'Student conversation',
      subject: conversation.subject,
      unread: conversation.unreadCount ?? 0,
      status: conversation.status ?? 'open',
      lastMessage: conversation.lastMessage?.body ?? 'No messages yet.',
      time: conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : 'New thread',
    })) ?? [];
  const filteredThreads = threads.filter((thread) => `${thread.name} ${thread.subject} ${thread.lastMessage}`.toLowerCase().includes(search.toLowerCase()));
  const { pageItems, totalPages } = paginate(filteredThreads, page, PAGE_SIZE);
  const thread = filteredThreads.find((item) => item.id === selectedId) ?? filteredThreads[0];
  const threadId = thread?.id;
  const liveMessages = useQuery(api.messages.listMessages, thread ? { conversationId: thread.id as any } : 'skip') as any[] | undefined;

  useEffect(() => {
    if (!threadId) return;
    markRead({ conversationId: threadId as any }).catch((error) => console.error('Failed to mark conversation read', error));
  }, [markRead, threadId]);

  const messages =
    liveMessages?.map((message) => ({
      id: message._id,
      body: message.body,
      sender: message.sender?.name ?? 'Portal user',
      mine: message.sender?._id === profile?._id,
      edited: Boolean(message.editedAt),
      attachments: message.attachments ?? [],
      time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })) ?? [];

  const handleSend = async () => {
    if (!thread || !reply.trim()) return;
    await sendMessage({ conversationId: thread.id as any, body: reply.trim() });
    setReply('');
    toast({ title: 'Reply sent', description: 'The conversation update was delivered and logged in Convex.', tone: 'success' });
  };

  return (
    <div className="space-y-6 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Communication Center"
        description="Manage student communication, message ownership, attachments, edits, and read states from live Convex data."
      />

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-primary">Public Inquiries</h2>
            <p className="text-sm text-muted-foreground">New contact messages and alumni stories submitted from the public site.</p>
          </div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">{publicSubmissions?.length ?? 0} new</span>
        </div>
        {publicSubmissions === undefined ? <LoadingPortalState label="Loading public inquiries..." /> : null}
        {publicSubmissions !== undefined && publicSubmissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new public submissions.</p>
        ) : null}
        <div className="grid gap-3 md:grid-cols-2">
          {publicSubmissions?.slice(0, 4).map((submission) => (
            <article key={submission._id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{submission.type === 'contact' ? 'Contact' : 'Alumni Story'}</p>
                  <h3 className="mt-1 font-semibold text-primary">{submission.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                </div>
                <Button size="sm" variant="outline" onClick={async () => {
                  await updatePublicSubmissionStatus({ submissionId: submission._id as any, status: 'reviewed' });
                  toast({ title: 'Marked reviewed', tone: 'success' });
                }}>
                  Review
                </Button>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{submission.message}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:grid-cols-[340px_1fr]">
        <aside className="border-r border-border">
          <div className="border-b border-border p-5">
            <Input placeholder="Search threads, learners, or staff" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="space-y-1 p-3">
            {liveConversations === undefined ? <LoadingPortalState label="Loading conversations..." /> : null}
            {liveConversations !== undefined && filteredThreads.length === 0 ? <EmptyPortalState variant="messages" title="No conversations yet" description="Student and instructor messages will appear here as soon as a conversation is opened." /> : null}
            {pageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-2xl p-4 text-left transition ${thread?.id === item.id ? 'bg-accent/10' : 'hover:bg-surface'}`}
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
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">{thread.name}</h2>
                <p className="text-sm text-muted-foreground">{thread.subject}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={async () => {
                  await assignConversation({ conversationId: thread.id as any });
                  toast({ title: 'Thread assigned', description: 'This conversation is now assigned to you.', tone: 'success' });
                }}>
                  <UserRoundSearch className="mr-2 h-4 w-4" /> Assign Owner
                </Button>
                <Button variant="outline" onClick={async () => {
                  await resolveConversation({ conversationId: thread.id as any });
                  toast({ title: 'Thread resolved', description: 'The conversation was marked resolved in Convex.', tone: 'success' });
                }}>
                  <BadgeCheck className="mr-2 h-4 w-4" /> Resolve
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-5 bg-surface/50 px-6 py-6">
              {liveMessages === undefined ? <LoadingPortalState label="Loading messages..." /> : null}
              {messages.length === 0 ? <EmptyPortalState variant="messages" title="No messages in this thread" description="Send the first update to begin the conversation history." /> : null}
              {messages.map((message) => (
                <div key={message.id} className={`${message.mine ? 'ml-auto bg-primary text-white' : 'border border-border bg-white text-primary'} max-w-3xl rounded-2xl p-5 shadow-sm`}>
                  {editingId === message.id ? (
                    <div className="space-y-3">
                      <Textarea value={editingBody} onChange={(event) => setEditingBody(event.target.value)} />
                      <Button size="sm" variant="secondary" onClick={async () => {
                        await editMessage({ messageId: message.id as any, body: editingBody });
                        setEditingId(null);
                        toast({ title: 'Message edited', description: 'Your message was updated in Convex.', tone: 'success' });
                      }}>
                        <Save className="mr-2 h-4 w-4" /> Save Edit
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed">{message.body}</p>
                      {message.attachments.length ? (
                        <div className="mt-4 space-y-2">
                          {message.attachments.map((attachment: any) => <AttachmentLink key={attachment._id} attachment={attachment} />)}
                        </div>
                      ) : null}
                      <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] ${message.mine ? 'text-white/70' : 'text-muted-foreground'}`}>
                        <span>{message.sender} - {message.time}{message.edited ? ' - edited' : ''}</span>
                        {message.mine ? (
                          <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => {
                            setEditingId(message.id);
                            setEditingBody(message.body);
                          }}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                <div className="space-y-4">
                  <Textarea className="min-h-32" placeholder="Write an update, pastoral note, or instruction for the selected thread." value={reply} onChange={(event) => setReply(event.target.value)} />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setReply((current) => current || 'Thank you for the update. I have reviewed this and will follow up with the next step shortly.')}>
                      <BookText className="mr-2 h-4 w-4" /> Insert Template
                    </Button>
                  </div>
                  <UploadDropzone
                    title="Attach document"
                    description="Upload a rubric, memo, PDF, DOCX, or TXT file into this thread."
                    accepted="PDF, DOCX, TXT"
                    generateUploadUrl={generateUploadUrl}
                    onUploaded={async (file) => {
                      const messageId = await sendMessage({ conversationId: thread.id as any, body: `Attached document: ${file.fileName}` });
                      await attachDocument({ messageId: messageId as any, storageId: file.storageId as any, fileName: file.fileName, contentType: file.contentType, size: file.size });
                      toast({ title: 'Document attached', description: `${file.fileName} was added to the conversation.`, tone: 'success' });
                    }}
                  />
                </div>
                <div className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold text-primary">Routing</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>Student: {thread.name}</li>
                    <li>Status: {thread.status}</li>
                    <li>Unread: {thread.unread}</li>
                  </ul>
                  <Button className="mt-5 w-full" variant="primary" onClick={handleSend}>
                    <Send className="mr-2 h-4 w-4" /> Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="p-6"><EmptyPortalState variant="messages" title="No thread selected" description="Open a conversation to read, reply, edit your messages, or attach documents." /></div>
        )}
      </div>
    </div>
  );
}

function AttachmentLink({ attachment }: { attachment: any }) {
  const url = useQuery(api.documents.getUrl, { storageId: attachment.storageId }) as string | null | undefined;
  return (
    <a className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-primary" href={url ?? '#'} target="_blank" rel="noreferrer">
      <FileText className="h-4 w-4" /> {attachment.fileName}
    </a>
  );
}
