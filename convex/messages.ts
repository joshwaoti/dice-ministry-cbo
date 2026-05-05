// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { assertDocumentContentType, requireAdmin, requireProfile, requireStudent } from './model';

async function assertConversationAccess(ctx: any, profile: any, conversationId: any) {
  const conversation = await ctx.db.get(conversationId);
  if (!conversation) throw new ConvexError('Conversation not found.');
  if (profile.role === 'student') {
    const student = await ctx.db
      .query('studentProfiles')
      .withIndex('by_profile', (q: any) => q.eq('profileId', profile._id))
      .unique();
    if (!student || conversation.studentProfileId !== student._id) throw new ConvexError('Conversation access denied.');
  }
  return conversation;
}

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireProfile(ctx);
    const decorate = async (conversation: any) => {
      const studentProfile = await ctx.db.get(conversation.studentProfileId);
      const student = studentProfile ? await ctx.db.get(studentProfile.profileId) : null;
      const admin = conversation.adminProfileId ? await ctx.db.get(conversation.adminProfileId) : null;
      const lastMessage = await ctx.db
        .query('messages')
        .withIndex('by_conversation', (q) => q.eq('conversationId', conversation._id))
        .order('desc')
        .first();
      const unread = await ctx.db
        .query('messages')
        .withIndex('by_conversation', (q) => q.eq('conversationId', conversation._id))
        .filter((q) => q.eq(q.field('readAt'), undefined))
        .collect();
      return {
        ...conversation,
        studentProfile,
        student,
        admin,
        lastMessage,
        unreadCount: unread.filter((message) => message.senderProfileId !== profile._id).length,
      };
    };
    if (profile.role === 'student') {
      const student = await ctx.db
        .query('studentProfiles')
        .withIndex('by_profile', (q) => q.eq('profileId', profile._id))
        .unique();
      if (!student) throw new ConvexError('Student profile not found.');
      const conversations = await ctx.db.query('conversations').withIndex('by_student', (q) => q.eq('studentProfileId', student._id)).collect();
      return await Promise.all(conversations.map(decorate));
    }
    await requireAdmin(ctx);
    const conversations = await ctx.db.query('conversations').order('desc').collect();
    return await Promise.all(conversations.map(decorate));
  },
});

export const listMessages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    await assertConversationAccess(ctx, profile, args.conversationId);
    const messages = await ctx.db.query('messages').withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId)).collect();
    return await Promise.all(
      messages.map(async (message) => ({
        ...message,
        sender: await ctx.db.get(message.senderProfileId),
        attachments: await ctx.db.query('messageAttachments').withIndex('by_message', (q) => q.eq('messageId', message._id)).collect(),
      })),
    );
  },
});

export const startStudentConversation = mutation({
  args: { subject: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const { profile, studentProfile } = await requireStudent(ctx);
    const now = Date.now();
    const conversationId = await ctx.db.insert('conversations', {
      studentProfileId: studentProfile._id,
      subject: args.subject,
      status: 'open',
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert('messages', {
      conversationId,
      senderProfileId: profile._id,
      body: args.body,
      createdAt: now,
    });
    return conversationId;
  },
});

export const startAdminConversation = mutation({
  args: { studentProfileId: v.id('studentProfiles'), subject: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const student = await ctx.db.get(args.studentProfileId);
    if (!student) throw new ConvexError('Student not found.');
    const now = Date.now();
    const conversationId = await ctx.db.insert('conversations', {
      studentProfileId: args.studentProfileId,
      adminProfileId: actor._id,
      subject: args.subject,
      status: 'open',
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert('messages', {
      conversationId,
      senderProfileId: actor._id,
      body: args.body,
      createdAt: now,
    });
    return conversationId;
  },
});

export const assignToMe = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    await assertConversationAccess(ctx, actor, args.conversationId);
    await ctx.db.patch(args.conversationId, {
      adminProfileId: actor._id,
      status: 'open',
      updatedAt: Date.now(),
    });
  },
});

export const resolve = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    await assertConversationAccess(ctx, actor, args.conversationId);
    await ctx.db.patch(args.conversationId, {
      status: 'resolved',
      resolvedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const send = mutation({
  args: { conversationId: v.id('conversations'), body: v.string() },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    await assertConversationAccess(ctx, profile, args.conversationId);
    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderProfileId: profile._id,
      body: args.body,
      createdAt: Date.now(),
    });
    await ctx.db.patch(args.conversationId, { status: 'open', lastMessageAt: Date.now(), updatedAt: Date.now() });
    return messageId;
  },
});

export const markRead = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    await assertConversationAccess(ctx, profile, args.conversationId);
    const messages = await ctx.db.query('messages').withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId)).collect();
    const now = Date.now();
    for (const message of messages) {
      if (message.senderProfileId !== profile._id && !message.readAt) {
        await ctx.db.patch(message._id, { readAt: now, updatedAt: now });
      }
    }
  },
});

export const edit = mutation({
  args: { messageId: v.id('messages'), body: v.string() },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError('Message not found.');
    await assertConversationAccess(ctx, profile, message.conversationId);
    if (message.senderProfileId !== profile._id) throw new ConvexError('You can edit only messages you sent.');
    const now = Date.now();
    await ctx.db.patch(args.messageId, {
      body: args.body.trim(),
      editedAt: now,
      updatedAt: now,
    });
  },
});

export const attachDocument = mutation({
  args: {
    messageId: v.id('messages'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError('Message not found.');
    await assertConversationAccess(ctx, profile, message.conversationId);
    assertDocumentContentType(args.contentType);
    if (args.contentType.startsWith('image/') || args.contentType.includes('spreadsheet') || args.contentType.includes('presentation')) {
      throw new ConvexError('Message attachments must be PDF, DOC, DOCX, or TXT documents.');
    }
    return await ctx.db.insert('messageAttachments', {
      messageId: args.messageId,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      uploadedAt: Date.now(),
    });
  },
});
