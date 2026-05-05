import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { requireAdmin, requireProfile } from './model';

function latestFirst(a: Doc<'announcements'>, b: Doc<'announcements'>) {
  return (b.sentAt ?? b.updatedAt ?? b.createdAt) - (a.sentAt ?? a.updatedAt ?? a.createdAt);
}

export const listVisible = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireProfile(ctx);
    const audience = profile.role === 'student' ? 'students' : 'admins';
    const [targeted, global] = await Promise.all([
      ctx.db.query('announcements').withIndex('by_status_and_audience', (q) => q.eq('status', 'sent').eq('audience', audience)).take(50),
      ctx.db.query('announcements').withIndex('by_status_and_audience', (q) => q.eq('status', 'sent').eq('audience', 'all')).take(50),
    ]);
    return [...targeted, ...global].sort(latestFirst).slice(0, 50);
  },
});

export const listPublicBanner = query({
  args: {},
  handler: async (ctx) => {
    const sentPublic = await ctx.db
      .query('announcements')
      .withIndex('by_status_and_audience', (q) => q.eq('status', 'sent').eq('audience', 'all'))
      .take(20);
    return sentPublic.sort(latestFirst)[0] ?? null;
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query('announcements').order('desc').take(200);
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
    const status = args.scheduledAt ? 'scheduled' : 'sent';
    return await ctx.db.insert('announcements', {
      title: args.title.trim(),
      body: args.body.trim(),
      audience: args.audience,
      cohortId: args.audience === 'cohort' ? args.cohortId : undefined,
      scheduledAt: args.scheduledAt,
      status,
      sentAt: status === 'sent' ? now : undefined,
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
    const existing = await ctx.db.get(args.announcementId);
    const now = Date.now();
    const patch: Partial<Doc<'announcements'>> = { updatedAt: now };
    if (args.title !== undefined) patch.title = args.title.trim();
    if (args.body !== undefined) patch.body = args.body.trim();
    if (args.audience !== undefined) patch.audience = args.audience;
    if (args.scheduledAt !== undefined) patch.scheduledAt = args.scheduledAt;
    if (args.status !== undefined) {
      patch.status = args.status;
      if (args.status === 'sent') patch.sentAt = existing?.sentAt ?? now;
    }
    await ctx.db.patch(args.announcementId, patch);
  },
});

export const remove = mutation({
  args: { announcementId: v.id('announcements') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.delete(args.announcementId);
  },
});
