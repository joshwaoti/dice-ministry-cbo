// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { MutationCtx, mutation, query } from './_generated/server';
import { canApproveApplications, normalizeEmail, requireAdmin, writeAudit } from './model';

function studentCodeFromApplication(applicationId: Id<'applications'>) {
  return `STU-${applicationId.slice(-6).toUpperCase()}`;
}

async function approveApplication(
  ctx: MutationCtx,
  args: { applicationId: Id<'applications'>; cohortId?: Id<'cohorts'>; mentorProfileId?: Id<'profiles'> },
  actor: Awaited<ReturnType<typeof requireAdmin>>,
) {
  if (!canApproveApplications(actor)) throw new ConvexError('You cannot approve applications.');

  const application = await ctx.db.get(args.applicationId);
  if (!application) throw new ConvexError('Application not found.');
  if (application.status === 'accepted') throw new ConvexError('Application is already accepted.');

  const now = Date.now();
  const email = normalizeEmail(application.email);
  let profile = await ctx.db.query('profiles').withIndex('by_email', (q) => q.eq('email', email)).unique();

  if (profile && profile.role !== 'student') {
    throw new ConvexError('This email is already assigned to a non-student profile.');
  }

  let profileId = profile?._id;
  if (!profileId) {
    profileId = await ctx.db.insert('profiles', {
      email,
      name: application.fullName,
      role: 'student',
      status: 'pending_invite',
      phone: application.phone,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await ctx.db.patch(profileId, {
      name: application.fullName,
      phone: application.phone,
      status: profile?.status === 'active' ? 'active' : 'pending_invite',
      updatedAt: now,
    });
  }

  let student = await ctx.db
    .query('studentProfiles')
    .withIndex('by_application', (q) => q.eq('applicationId', args.applicationId))
    .unique();
  let studentProfileId = student?._id;
  if (!studentProfileId) {
    studentProfileId = await ctx.db.insert('studentProfiles', {
      profileId,
      applicationId: args.applicationId,
      studentCode: studentCodeFromApplication(args.applicationId),
      cohortId: args.cohortId,
      enrollmentStatus: 'pending_invite',
      mentorProfileId: args.mentorProfileId,
      progressPercent: 0,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await ctx.db.patch(studentProfileId, {
      profileId,
      cohortId: args.cohortId,
      mentorProfileId: args.mentorProfileId,
      enrollmentStatus: 'pending_invite',
      updatedAt: now,
    });
  }

  await ctx.db.patch(args.applicationId, {
    status: 'accepted',
    reviewedBy: actor._id,
    reviewedAt: now,
    updatedAt: now,
  });

  const existingJob = await ctx.db
    .query('studentInvitationJobs')
    .withIndex('by_application', (q) => q.eq('applicationId', args.applicationId))
    .first();
  if (!existingJob) {
    await ctx.db.insert('studentInvitationJobs', {
      applicationId: args.applicationId,
      studentProfileId,
      email,
      status: 'queued',
      attemptCount: 0,
      nextAttemptAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeAudit(ctx, {
    actorProfileId: actor._id,
    action: 'applications.approve',
    targetTable: 'applications',
    targetId: args.applicationId,
    summary: `Approved ${application.fullName} and queued Clerk invitation.`,
  });

  return { studentProfileId };
}

export const submitApplication = mutation({
  args: {
    fullName: v.string(),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    residentialArea: v.optional(v.string()),
    highSchool: v.optional(v.string()),
    completionYear: v.optional(v.string()),
    kcseGrade: v.optional(v.string()),
    motivation: v.optional(v.string()),
    hopes: v.optional(v.string()),
    referralSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('applications', {
      ...args,
      email: normalizeEmail(args.email),
      status: 'new',
      submittedAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: {
    status: v.optional(v.union(v.literal('new'), v.literal('under_review'), v.literal('accepted'), v.literal('rejected'), v.literal('waitlisted'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    if (args.status) {
      return await ctx.db.query('applications').withIndex('by_status', (q) => q.eq('status', args.status!)).collect();
    }
    return await ctx.db.query('applications').order('desc').collect();
  },
});

export const approve = mutation({
  args: {
    applicationId: v.id('applications'),
    cohortId: v.optional(v.id('cohorts')),
    mentorProfileId: v.optional(v.id('profiles')),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    return await approveApplication(ctx, args, actor);
  },
});

export const approveMany = mutation({
  args: {
    applicationIds: v.array(v.id('applications')),
    cohortId: v.optional(v.id('cohorts')),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const results = [];
    for (const applicationId of args.applicationIds) {
      results.push(await approveApplication(ctx, { applicationId, cohortId: args.cohortId }, actor));
    }
    return results;
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id('applications'),
    status: v.union(v.literal('under_review'), v.literal('rejected'), v.literal('waitlisted')),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const now = Date.now();
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      internalNotes: args.internalNotes,
      reviewedBy: actor._id,
      reviewedAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: `applications.${args.status}`,
      targetTable: 'applications',
      targetId: args.applicationId,
      summary: `Application moved to ${args.status}.`,
    });
  },
});
