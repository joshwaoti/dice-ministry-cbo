// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { assertDocumentContentType, requireAdmin, requireProfile, requireStudent } from './model';

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
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError('Conversation not found.');
    if (profile.role === 'student') {
      const student = await ctx.db
        .query('studentProfiles')
        .withIndex('by_profile', (q) => q.eq('profileId', profile._id))
        .unique();
      if (!student || conversation.studentProfileId !== student._id) throw new ConvexError('Conversation access denied.');
    }
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

export const send = mutation({
  args: { conversationId: v.id('conversations'), body: v.string() },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderProfileId: profile._id,
      body: args.body,
      createdAt: Date.now(),
    });
    await ctx.db.patch(args.conversationId, { lastMessageAt: Date.now(), updatedAt: Date.now() });
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
    await requireProfile(ctx);
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
