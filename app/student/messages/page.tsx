'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { FileText, Pencil, Save } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

export default function StudentMessages() {
  const { toast } = useToast();
  const profile = useQuery(api.profiles.current, {}) as any | null | undefined;
  const liveConversations = useQuery(api.messages.listConversations, {}) as any[] | undefined;
  const sendMessage = useMutation(api.messages.send);
  const editMessage = useMutation(api.messages.edit);
  const markRead = useMutation(api.messages.markRead);
  const attachDocument = useMutation(api.messages.attachDocument);
  const generateUploadUrl = useMutation(api.documents.generateStudentUploadUrl);
  const startConversation = useMutation(api.messages.startStudentConversation);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [subject, setSubject] = useState('Mentor support request');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const threads =
    liveConversations?.map((conversation) => ({
      id: conversation._id,
      name: conversation.admin?.name ?? 'DICE Support',
      subject: conversation.subject,
      unread: conversation.unreadCount ?? 0,
      lastMessage: conversation.lastMessage?.body ?? 'No messages yet.',
      time: conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : 'New thread',
    })) ?? [];
  const thread = threads.find((item) => item.id === selectedId) ?? threads[0];
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
      mine: message.sender?._id === profile?._id,
      edited: Boolean(message.editedAt),
      attachments: message.attachments ?? [],
      time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })) ?? [];

  const handleSend = async () => {
    if (!reply.trim()) return;
    if (!thread) {
      const conversationId = await startConversation({ subject, body: reply.trim() });
      setSelectedId(conversationId as string);
      setReply('');
      toast({ title: 'Conversation started', description: 'Your message was sent to the DICE support team.', tone: 'success' });
      return;
    }
    await sendMessage({ conversationId: thread.id as any, body: reply.trim() });
    setReply('');
    toast({ title: 'Message sent', description: 'Your mentor will see this in the conversation thread.', tone: 'success' });
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] min-h-[620px] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:flex-row">
      <div className="flex h-[50vh] min-h-[300px] w-full shrink-0 flex-col border-b border-border lg:h-full lg:w-80 lg:border-b-0 lg:border-r">
        <div className="shrink-0 border-b border-border bg-surface p-4">
          <h2 className="font-bold text-primary">Conversations</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {liveConversations === undefined ? <LoadingPortalState label="Loading conversations..." /> : null}
          {liveConversations !== undefined && threads.length === 0 ? (
            <EmptyPortalState variant="messages" title="No conversations yet" description="Start a support conversation below or reply when your mentor sends a message." />
          ) : null}
          {threads.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full border-b border-border p-4 text-left transition-colors ${thread?.id === item.id ? 'bg-accent/10' : 'hover:bg-gray-50'}`}
            >
              <div className="mb-1 flex items-start justify-between">
                <span className="truncate pr-2 font-semibold text-primary">{item.name}</span>
                {item.unread > 0 ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" /> : null}
              </div>
              <p className="line-clamp-2 text-sm leading-tight text-muted-foreground">{item.lastMessage}</p>
              <span className="mt-2 block text-right text-[10px] uppercase text-muted-foreground">{item.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[50vh] min-h-[300px] flex-1 flex-col overflow-hidden bg-gray-50 lg:h-full">
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface p-4 font-semibold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{thread ? thread.name.slice(0, 2).toUpperCase() : 'DS'}</div>
          <span className="truncate">{thread ? thread.name : 'Start a conversation'}</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
          {liveMessages === undefined && thread ? <LoadingPortalState label="Loading messages..." /> : null}
          {!thread ? (
            <div className="rounded-2xl border border-border bg-white p-4">
              <label className="text-sm font-semibold text-primary">Subject</label>
              <input className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm outline-none focus:border-accent" value={subject} onChange={(event) => setSubject(event.target.value)} />
            </div>
          ) : null}
          {messages.length === 0 && thread ? <EmptyPortalState variant="messages" title="No messages yet" description="Send a note once this thread is ready for replies." /> : null}
          {messages.map((message) => (
            <div key={message.id} className={`${message.mine ? 'self-end rounded-tl-2xl bg-accent text-white' : 'self-start rounded-tr-2xl border border-border bg-white text-primary'} max-w-[90%] rounded-bl-2xl rounded-br-2xl p-4 shadow-sm lg:max-w-[75%]`}>
              {editingId === message.id ? (
                <div className="space-y-3">
                  <Textarea value={editingBody} onChange={(event) => setEditingBody(event.target.value)} />
                  <Button size="sm" variant="secondary" onClick={async () => {
                    await editMessage({ messageId: message.id as any, body: editingBody });
                    setEditingId(null);
                    toast({ title: 'Message edited', description: 'Your message was updated.', tone: 'success' });
                  }}>
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              ) : (
                <>
                  <p className="break-words text-sm">{message.body}</p>
                  {message.attachments.length ? (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment: any) => <AttachmentLink key={attachment._id} attachment={attachment} />)}
                    </div>
                  ) : null}
                  <div className={`${message.mine ? 'text-white/70' : 'text-muted-foreground'} mt-2 flex items-center justify-end gap-3 text-[10px] uppercase`}>
                    <span>{message.time}{message.edited ? ' - edited' : ''}</span>
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

        <div className="shrink-0 space-y-3 border-t border-border bg-white p-4">
          {thread ? (
            <UploadDropzone
              title="Attach document"
              description="Upload a PDF, DOCX, or TXT support document to this conversation."
              accepted="PDF, DOCX, TXT"
              generateUploadUrl={generateUploadUrl}
              onUploaded={async (file) => {
                const messageId = await sendMessage({ conversationId: thread.id as any, body: `Attached document: ${file.fileName}` });
                await attachDocument({ messageId: messageId as any, storageId: file.storageId as any, fileName: file.fileName, contentType: file.contentType, size: file.size });
                toast({ title: 'Document attached', description: `${file.fileName} was added to this conversation.`, tone: 'success' });
              }}
            />
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              className="min-w-0 flex-1 rounded-lg border border-border px-4 py-2 text-sm outline-none focus:border-accent"
              placeholder="Type your message..."
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
            <button className="w-full shrink-0 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 sm:w-auto" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
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
