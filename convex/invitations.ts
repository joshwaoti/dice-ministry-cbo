// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { action, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { requireAdmin, writeAudit } from './model';

const MAX_BATCH_SIZE = 20;

function appBaseUrl() {
  const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

export const listJobs = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('queued'),
        v.literal('sending'),
        v.literal('sent'),
        v.literal('failed'),
        v.literal('accepted'),
        v.literal('expired'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    if (args.status) {
      return await ctx.db
        .query('studentInvitationJobs')
        .withIndex('by_status_next_attempt', (q) => q.eq('status', args.status!))
        .collect();
    }
    return await ctx.db.query('studentInvitationJobs').order('desc').collect();
  },
});

export const resend = mutation({
  args: { jobId: v.id('studentInvitationJobs') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError('Invitation job not found.');
    if (job.status === 'accepted') throw new ConvexError('The student already accepted this invitation.');
    await ctx.db.patch(args.jobId, {
      status: 'queued',
      lastError: undefined,
      nextAttemptAt: Date.now(),
      updatedAt: Date.now(),
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'invitations.resend',
      targetTable: 'studentInvitationJobs',
      targetId: args.jobId,
      summary: `Requeued invitation for ${job.email}.`,
    });
  },
});

export const pendingJobs = internalQuery({
  args: { limit: v.number(), now: v.number() },
  handler: async (ctx, args) => {
    const queued = await ctx.db
      .query('studentInvitationJobs')
      .withIndex('by_status_next_attempt', (q) => q.eq('status', 'queued').lte('nextAttemptAt', args.now))
      .take(args.limit);
    const failed = await ctx.db
      .query('studentInvitationJobs')
      .withIndex('by_status_next_attempt', (q) => q.eq('status', 'failed').lte('nextAttemptAt', args.now))
      .take(Math.max(0, args.limit - queued.length));
    return [...queued, ...failed];
  },
});

export const markSending = internalMutation({
  args: { jobId: v.id('studentInvitationJobs') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: 'sending',
      attemptCount: (await ctx.db.get(args.jobId))!.attemptCount + 1,
      updatedAt: Date.now(),
    });
  },
});

export const markSent = internalMutation({
  args: { jobId: v.id('studentInvitationJobs'), clerkInvitationId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: 'sent',
      clerkInvitationId: args.clerkInvitationId,
      lastError: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const markRetry = internalMutation({
  args: { jobId: v.id('studentInvitationJobs'), error: v.string(), nextAttemptAt: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: 'failed',
      lastError: args.error,
      nextAttemptAt: args.nextAttemptAt,
      updatedAt: Date.now(),
    });
  },
});

export const processQueue = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<{ processed: number; stoppedForRateLimit: boolean }> => {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const appUrl = appBaseUrl();
    if (!secretKey) throw new ConvexError('CLERK_SECRET_KEY is required to process invitation jobs.');

    const limit = Math.min(args.limit ?? MAX_BATCH_SIZE, MAX_BATCH_SIZE);
    const jobs = await ctx.runQuery(internal.invitations.pendingJobs, { limit, now: Date.now() });
    let processed = 0;

    for (const job of jobs) {
      await ctx.runMutation(internal.invitations.markSending, { jobId: job._id as Id<'studentInvitationJobs'> });

      const response = await fetch('https://api.clerk.com/v1/invitations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: job.email,
          redirect_url: `${appUrl}/accept-invitation`,
          notify: true,
          ignore_existing: true,
          public_metadata: {
            role: 'student',
            applicationId: job.applicationId,
            studentProfileId: job.studentProfileId,
          },
        }),
      });

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get('Retry-After') ?? '3600');
        await ctx.runMutation(internal.invitations.markRetry, {
          jobId: job._id as Id<'studentInvitationJobs'>,
          error: 'Clerk invitation rate limit reached.',
          nextAttemptAt: Date.now() + retryAfter * 1000,
        });
        return { processed, stoppedForRateLimit: true };
      }

      if (!response.ok) {
        const body = await response.text();
        const backoffMs = Math.min(60 * 60 * 1000, Math.pow(2, job.attemptCount + 1) * 60 * 1000);
        await ctx.runMutation(internal.invitations.markRetry, {
          jobId: job._id as Id<'studentInvitationJobs'>,
          error: body.slice(0, 500),
          nextAttemptAt: Date.now() + backoffMs,
        });
        continue;
      }

      const invitation = await response.json();
      await ctx.runMutation(internal.invitations.markSent, {
        jobId: job._id as Id<'studentInvitationJobs'>,
        clerkInvitationId: invitation.id ?? invitation.invitation?.id ?? 'unknown',
      });
      processed += 1;
    }

    return { processed, stoppedForRateLimit: false };
  },
});
