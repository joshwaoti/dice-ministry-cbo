// @ts-nocheck
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin, requireProfile } from './model';

export const listVisible = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireProfile(ctx);
    if (profile.role === 'student') {
      return await ctx.db.query('announcements').withIndex('by_audience', (q) => q.eq('audience', 'students')).collect();
    }
    return await ctx.db.query('announcements').withIndex('by_audience', (q) => q.eq('audience', 'admins')).collect();
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query('announcements').order('desc').collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    audience: v.union(v.literal('all'), v.literal('students'), v.literal('admins'), v.literal('cohort')),
    cohortId: v.optional(v.id('cohorts')),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const now = Date.now();
    return await ctx.db.insert('announcements', {
      ...args,
      status: args.scheduledAt ? 'scheduled' : 'sent',
      sentAt: args.scheduledAt ? undefined : now,
      createdBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    announcementId: v.id('announcements'),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    audience: v.optional(v.union(v.literal('all'), v.literal('students'), v.literal('admins'), v.literal('cohort'))),
    status: v.optional(v.union(v.literal('draft'), v.literal('scheduled'), v.literal('sent'))),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.patch(args.announcementId, {
      title: args.title,
      body: args.body,
      audience: args.audience,
      status: args.status,
      scheduledAt: args.scheduledAt,
      sentAt: args.status === 'sent' ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { announcementId: v.id('announcements') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.delete(args.announcementId);
  },
});
