// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentProfile, normalizeEmail, writeAudit } from './model';

function getPrimaryEmail(data: any) {
  const primaryId = data.primary_email_address_id;
  const emails = data.email_addresses ?? [];
  const primary = emails.find((entry: any) => entry.id === primaryId) ?? emails[0];
  return normalizeEmail(primary?.email_address ?? data.email_address ?? '');
}

function getDisplayName(data: any) {
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ').trim();
  return fullName || data.username || getPrimaryEmail(data);
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    const profile = await getCurrentProfile(ctx);
    if (!profile) return null;
    return {
      _id: profile._id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      status: profile.status,
      portal: profile.role === 'student' ? 'student' : 'admin',
    };
  },
});

export const bootstrapSuperAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Sign in with Clerk before bootstrapping the first super admin.');
    const identityEmail = normalizeEmail(identity.email ?? '');
    if (!identityEmail || identityEmail !== normalizeEmail(args.email)) {
      throw new ConvexError('The signed-in Clerk email must match the first super admin email.');
    }

    const existingProfiles = await ctx.db.query('profiles').take(1);
    if (existingProfiles.length > 0) throw new ConvexError('Bootstrap is only available before any profiles exist.');

    const now = Date.now();
    const profileId = await ctx.db.insert('profiles', {
      clerkUserId: identity.subject,
      email: normalizeEmail(args.email),
      name: args.name,
      role: 'super_admin',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert('adminProfiles', {
      profileId,
      role: 'super_admin',
      title: 'Super Admin',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: profileId,
      action: 'profiles.bootstrap_super_admin',
      targetTable: 'profiles',
      targetId: profileId,
      summary: `Bootstrapped ${args.email} as the first super admin.`,
    });
    return profileId;
  },
});

export const completeFirstLogin = mutation({
  args: {},
  handler: async (ctx) => {
    const profile = await getCurrentProfile(ctx);
    if (!profile) throw new ConvexError('Profile not found.');
    if (!profile.firstLoginAt) {
      await ctx.db.patch(profile._id, { firstLoginAt: Date.now(), lastActiveAt: Date.now(), updatedAt: Date.now() });
    } else {
      await ctx.db.patch(profile._id, { lastActiveAt: Date.now(), updatedAt: Date.now() });
    }
  },
});

export const updateSelf = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await getCurrentProfile(ctx);
    if (!profile) throw new ConvexError('Profile not found.');
    await ctx.db.patch(profile._id, {
      name: args.name?.trim() || profile.name,
      phone: args.phone,
      avatarUrl: args.avatarUrl,
      updatedAt: Date.now(),
    });
    return profile._id;
  },
});

export const syncFromClerkWebhook = mutation({
  args: {
    syncSecret: v.string(),
    eventType: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    if (!process.env.CLERK_WEBHOOK_SYNC_SECRET || args.syncSecret !== process.env.CLERK_WEBHOOK_SYNC_SECRET) {
      throw new ConvexError('Invalid webhook sync secret.');
    }

    const clerkUserId = args.data.id as string | undefined;
    if (!clerkUserId) return { ok: true };

    if (args.eventType === 'user.deleted') {
      const existing = await ctx.db
        .query('profiles')
        .withIndex('by_clerk_user_id', (q) => q.eq('clerkUserId', clerkUserId))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { status: 'suspended', updatedAt: Date.now() });
      }
      return { ok: true };
    }

    const email = getPrimaryEmail(args.data);
    if (!email) throw new ConvexError('Clerk user webhook did not include an email address.');
    const name = getDisplayName(args.data);
    const now = Date.now();

    const byClerkId = await ctx.db
      .query('profiles')
      .withIndex('by_clerk_user_id', (q) => q.eq('clerkUserId', clerkUserId))
      .unique();
    const byEmail = await ctx.db.query('profiles').withIndex('by_email', (q) => q.eq('email', email)).unique();
    const profile = byClerkId ?? byEmail;

    if (profile) {
      const patch: any = { clerkUserId, email, name, updatedAt: now };
      if (profile.role === 'student' && profile.status === 'pending_invite') patch.status = 'active';
      await ctx.db.patch(profile._id, patch);

      if (profile.role === 'student') {
        const student = await ctx.db
          .query('studentProfiles')
          .withIndex('by_profile', (q) => q.eq('profileId', profile._id))
          .unique();
        if (student && student.enrollmentStatus === 'pending_invite') {
          await ctx.db.patch(student._id, { enrollmentStatus: 'active', updatedAt: now });
          const job = await ctx.db
            .query('studentInvitationJobs')
            .withIndex('by_student_profile', (q) => q.eq('studentProfileId', student._id))
            .first();
          if (job) await ctx.db.patch(job._id, { status: 'accepted', updatedAt: now });
        }
      }
      return { ok: true, profileId: profile._id };
    }

    const metadataRole = args.data.public_metadata?.role;
    if (metadataRole !== 'student') {
      return { ok: true, skipped: 'No pre-approved profile exists for this non-student Clerk user.' };
    }

    const profileId = await ctx.db.insert('profiles', {
      clerkUserId,
      email,
      name,
      role: 'student',
      status: 'active',
      firstLoginAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return { ok: true, profileId };
  },
});
