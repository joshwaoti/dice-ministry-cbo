'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from '@/components/ui/toast';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

export default function StudentMessages() {
  const liveConversations = useQuery(api.messages.listConversations, {}) as any[] | undefined;
  const sendMessage = useMutation(api.messages.send);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const { toast } = useToast();

  const threads = liveConversations?.map((conversation) => ({
    id: conversation._id,
    name: conversation.admin?.name ?? 'DICE Support',
    subject: conversation.subject,
    unread: conversation.unreadCount ?? 0,
    lastMessage: conversation.lastMessage?.body ?? 'No messages yet.',
    time: conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : 'New thread',
    isLive: true,
  })) ?? [];
  const thread = threads.find((item) => item.id === selectedId) ?? threads[0];
  const liveMessages = useQuery(api.messages.listMessages, thread?.isLive ? { conversationId: thread.id as any } : 'skip') as any[] | undefined;
  const messages = thread?.isLive
    ? liveMessages?.map((message) => ({
        id: message._id,
        body: message.body,
        mine: message.sender?.role === 'student',
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })) ?? []
    : [
        { id: 'mock-1', body: "Hello there! Your recent assignment on Discipleship Foundations looks great. I've left a few minor notes in the graded document, but overall fantastic work. Keep it up!", mine: false, time: '10:45 AM' },
        { id: 'mock-2', body: 'Thank you! I will review the notes right away.', mine: true, time: 'Just now' },
      ];

  const handleSend = async () => {
    if (!thread || !reply.trim()) return;
    if (!thread.isLive) {
      toast({ title: 'Message sent', description: 'Live Convex threads will persist this reply once a conversation exists.', tone: 'success' });
      setReply('');
      return;
    }
    await sendMessage({ conversationId: thread.id as any, body: reply.trim() });
    setReply('');
    toast({ title: 'Message sent', description: 'Your mentor will see this in the conversation thread.', tone: 'success' });
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] min-h-[620px] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:flex-row">
      <div className="w-full lg:w-80 border-b lg:border-r border-border flex flex-col shrink-0 lg:h-full h-[50vh] min-h-[300px]">
        <div className="p-4 border-b border-border bg-surface shrink-0">
          <h2 className="font-bold text-primary">Conversations</h2>
        </div>
        <div className="overflow-y-auto flex-1 h-full min-h-0">
          {liveConversations === undefined ? <LoadingPortalState label="Loading conversations..." /> : null}
          {liveConversations !== undefined && threads.length === 0 ? (
            <EmptyPortalState
              variant="messages"
              title="No conversations yet"
              description="When your mentor or admin team starts a thread, it will appear here with its message history."
            />
          ) : null}
          {threads.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full p-4 border-b border-border text-left transition-colors cursor-pointer ${thread?.id === item.id ? 'bg-accent/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-primary truncate pr-2">{item.name}</span>
                {item.unread > 0 ? <span className="bg-accent w-2 h-2 rounded-full mt-1.5 shrink-0" /> : null}
              </div>
              <p className="text-sm text-muted line-clamp-2 leading-tight">{item.lastMessage}</p>
              <span className="text-[10px] text-muted mt-2 block uppercase text-right">{item.time}</span>
            </button>
          ))}
        </div>
      </div>

      {thread ? (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden lg:h-full lg:flex h-[50vh] min-h-[300px]">
          <div className="p-4 border-b border-border bg-surface font-semibold text-primary flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{thread.name.slice(0, 2).toUpperCase()}</div>
            <span className="truncate">{thread.name}</span>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
            {thread.isLive && liveMessages === undefined ? <LoadingPortalState label="Loading messages..." /> : null}
            {messages.length === 0 ? <EmptyPortalState variant="messages" title="No messages yet" description="Send a note once this thread is ready for student replies." /> : null}
            {messages.map((message) => (
              <div key={message.id} className={`${message.mine ? 'bg-accent self-end text-white rounded-tl-2xl' : 'bg-white self-start text-primary rounded-tr-2xl border border-border'} p-4 rounded-bl-2xl rounded-br-2xl shadow-sm max-w-[90%] lg:max-w-[75%]`}>
                <p className="text-sm break-words">{message.body}</p>
                <span className={`${message.mine ? 'text-white/70' : 'text-muted'} text-[10px] mt-2 block text-right`}>{message.time}</span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-white flex flex-col sm:flex-row gap-3 shrink-0">
            <input
              type="text"
              className="flex-1 min-w-0 px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm w-full"
              placeholder="Type your message..."
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
            <button
              className="bg-accent text-white px-6 py-2.5 sm:py-2 rounded-lg font-medium shrink-0 text-sm hover:bg-accent/90 transition-colors w-full sm:w-auto"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
