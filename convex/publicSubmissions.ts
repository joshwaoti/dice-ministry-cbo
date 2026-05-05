import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { normalizeEmail, requireAdmin } from './model';

const TEN_MINUTES = 10 * 60 * 1000;

function clean(value: string, max: number) {
  return value.trim().replace(/\s+/g, ' ').slice(0, max);
}

function assertEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ConvexError('Enter a valid email address.');
  }
  return normalized;
}

async function hasRecentDuplicate(ctx: any, email: string, type: 'contact' | 'alumni_story') {
  const recent = await ctx.db.query('publicSubmissions').withIndex('by_email', (q: any) => q.eq('email', email)).order('desc').take(10);
  return recent.some((submission: any) => submission.type === type && submission.submittedAt > Date.now() - TEN_MINUTES);
}

export const submitContact = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const firstName = clean(args.firstName, 80);
    const lastName = clean(args.lastName, 80);
    const email = assertEmail(args.email);
    const message = args.message.trim().slice(0, 3000);
    if (!firstName || !lastName || message.length < 10) {
      throw new ConvexError('Please complete the required contact fields.');
    }
    if (await hasRecentDuplicate(ctx, email, 'contact')) {
      throw new ConvexError('We received a recent message from this email. Please wait a few minutes before sending another.');
    }
    const now = Date.now();
    return await ctx.db.insert('publicSubmissions', {
      type: 'contact',
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      message,
      status: 'new',
      submittedAt: now,
      updatedAt: now,
    });
  },
});

export const submitAlumniStory = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    cohort: v.string(),
    currentUpdate: v.string(),
    story: v.string(),
  },
  handler: async (ctx, args) => {
    const fullName = clean(args.fullName, 120);
    const email = assertEmail(args.email);
    const cohort = clean(args.cohort, 80);
    const currentUpdate = clean(args.currentUpdate, 180);
    const message = args.story.trim().slice(0, 5000);
    if (!fullName || !cohort || !currentUpdate || message.length < 20) {
      throw new ConvexError('Please complete the required alumni story fields.');
    }
    if (await hasRecentDuplicate(ctx, email, 'alumni_story')) {
      throw new ConvexError('We received a recent story from this email. Please wait a few minutes before sending another.');
    }
    const now = Date.now();
    return await ctx.db.insert('publicSubmissions', {
      type: 'alumni_story',
      fullName,
      email,
      cohort,
      currentUpdate,
      message,
      status: 'new',
      submittedAt: now,
      updatedAt: now,
    });
  },
});

export const listAdmin = query({
  args: {
    type: v.optional(v.union(v.literal('contact'), v.literal('alumni_story'))),
    status: v.optional(v.union(v.literal('new'), v.literal('reviewed'), v.literal('archived'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.type && args.status) {
      return await ctx.db
        .query('publicSubmissions')
        .withIndex('by_type_and_status', (q) => q.eq('type', args.type!).eq('status', args.status!))
        .order('desc')
        .take(100);
    }
    if (args.type) {
      return await ctx.db.query('publicSubmissions').withIndex('by_type', (q) => q.eq('type', args.type!)).order('desc').take(100);
    }
    if (args.status) {
      return await ctx.db.query('publicSubmissions').withIndex('by_status', (q) => q.eq('status', args.status!)).order('desc').take(100);
    }
    return await ctx.db.query('publicSubmissions').order('desc').take(100);
  },
});

export const updateStatus = mutation({
  args: {
    submissionId: v.id('publicSubmissions'),
    status: v.union(v.literal('new'), v.literal('reviewed'), v.literal('archived')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.submissionId, { status: args.status, updatedAt: Date.now() });
  },
});
