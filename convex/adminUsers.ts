// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { action, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { canSeeAdmin, normalizeEmail, requireAdmin, writeAudit } from './model';

function appBaseUrl() {
  const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const actor = await requireAdmin(ctx);
    const profiles = await ctx.db.query('profiles').collect();
    return profiles.filter((profile) => profile.role !== 'student' && canSeeAdmin(actor, profile));
  },
});

export const authorizeInviteAdmin = internalQuery({
  args: {
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('moderator'), v.literal('super_admin')),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    if (args.role === 'super_admin' && actor.role !== 'super_admin') {
      throw new ConvexError('Only a super admin can create another super admin.');
    }
    if (actor.role === 'admin' && args.role !== 'moderator') {
      throw new ConvexError('Admins can only invite moderators.');
    }

    const now = Date.now();
    const email = normalizeEmail(args.email);
    const existing = await ctx.db.query('profiles').withIndex('by_email', (q) => q.eq('email', email)).unique();
    if (existing) throw new ConvexError('A profile already exists for this email.');
    return { actorProfileId: actor._id, email };
  },
});

export const createInvitedAdmin = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('moderator'), v.literal('super_admin')),
    title: v.optional(v.string()),
    scope: v.optional(v.string()),
    actorProfileId: v.id('profiles'),
    clerkInvitationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = normalizeEmail(args.email);
    const profileId = await ctx.db.insert('profiles', {
      email,
      name: args.name,
      role: args.role,
      status: 'pending_invite',
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert('adminProfiles', {
      profileId,
      role: args.role,
      title: args.title,
      scope: args.scope,
      status: 'pending_invite',
      createdBy: args.actorProfileId,
      approvedBy: args.actorProfileId,
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: args.actorProfileId,
      action: 'adminUsers.invite',
      targetTable: 'profiles',
      targetId: profileId,
      summary: `Created pending ${args.role} profile for ${email}${args.clerkInvitationId ? ` with Clerk invitation ${args.clerkInvitationId}` : ''}.`,
    });
    return profileId;
  },
});

export const authorizeResendAdminInvite = internalQuery({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const target = await ctx.db.get(args.profileId);
    if (!target || target.role === 'student') throw new ConvexError('Admin profile not found.');
    if (!canSeeAdmin(actor, target)) throw new ConvexError('You cannot invite this admin profile.');
    if (actor.role === 'admin' && target.role !== 'moderator') {
      throw new ConvexError('Admins can only invite moderators.');
    }
    if (target.status === 'active') {
      throw new ConvexError('This admin has already accepted their invitation.');
    }
    return {
      actorProfileId: actor._id,
      profileId: target._id,
      email: target.email,
      name: target.name,
      role: target.role,
    };
  },
});

export const recordAdminInviteResent = internalMutation({
  args: {
    actorProfileId: v.id('profiles'),
    profileId: v.id('profiles'),
    clerkInvitationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, { status: 'pending_invite', updatedAt: Date.now() });
    const adminProfile = await ctx.db
      .query('adminProfiles')
      .withIndex('by_profile', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (adminProfile) await ctx.db.patch(adminProfile._id, { status: 'pending_invite', updatedAt: Date.now() });
    await writeAudit(ctx, {
      actorProfileId: args.actorProfileId,
      action: 'adminUsers.resendInvite',
      targetTable: 'profiles',
      targetId: args.profileId,
      summary: `Resent admin Clerk invitation${args.clerkInvitationId ? ` ${args.clerkInvitationId}` : ''}.`,
    });
  },
});

async function createClerkInvitation(args: { secretKey: string; appUrl: string; email: string; role: string }) {
  const response = await fetch('https://api.clerk.com/v1/invitations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: args.email,
      redirect_url: `${args.appUrl.replace(/\/$/, '')}/accept-invitation`,
      notify: true,
      ignore_existing: true,
      public_metadata: {
        role: args.role,
        portal: 'admin',
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ConvexError(`Clerk admin invitation failed: ${body.slice(0, 500)}`);
  }

  return await response.json();
}

export const inviteAdmin = action({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('moderator'), v.literal('super_admin')),
    title: v.optional(v.string()),
    scope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authorization = await ctx.runQuery(internal.adminUsers.authorizeInviteAdmin, {
      email: args.email,
      role: args.role,
    });
    const secretKey = process.env.CLERK_SECRET_KEY;
    const appUrl = appBaseUrl();
    if (!secretKey) throw new ConvexError('CLERK_SECRET_KEY is required to invite admin users.');

    const invitation = await createClerkInvitation({ secretKey, appUrl, email: authorization.email, role: args.role });
    return await ctx.runMutation(internal.adminUsers.createInvitedAdmin, {
      ...args,
      email: authorization.email,
      actorProfileId: authorization.actorProfileId,
      clerkInvitationId: invitation.id ?? invitation.invitation?.id,
    });
  },
});

export const resendAdminInvite = action({
  args: { profileId: v.id('profiles') },
  handler: async (ctx, args) => {
    const authorization = await ctx.runQuery(internal.adminUsers.authorizeResendAdminInvite, args);
    const secretKey = process.env.CLERK_SECRET_KEY;
    const appUrl = appBaseUrl();
    if (!secretKey) throw new ConvexError('CLERK_SECRET_KEY is required to invite admin users.');
    const invitation = await createClerkInvitation({
      secretKey,
      appUrl,
      email: authorization.email,
      role: authorization.role,
    });
    await ctx.runMutation(internal.adminUsers.recordAdminInviteResent, {
      actorProfileId: authorization.actorProfileId,
      profileId: authorization.profileId,
      clerkInvitationId: invitation.id ?? invitation.invitation?.id,
    });
    return { ok: true };
  },
});

export const updateStatus = mutation({
  args: {
    profileId: v.id('profiles'),
    status: v.union(v.literal('active'), v.literal('pending_invite'), v.literal('suspended'), v.literal('rejected')),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const target = await ctx.db.get(args.profileId);
    if (!target || target.role === 'student') throw new ConvexError('Admin profile not found.');
    if (!canSeeAdmin(actor, target)) throw new ConvexError('You cannot manage this admin profile.');
    if (actor.role === 'admin' && target.role !== 'moderator') {
      throw new ConvexError('Admins can only manage moderators.');
    }

    await ctx.db.patch(args.profileId, { status: args.status, updatedAt: Date.now() });
    const adminProfile = await ctx.db
      .query('adminProfiles')
      .withIndex('by_profile', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (adminProfile) await ctx.db.patch(adminProfile._id, { status: args.status, updatedAt: Date.now() });
  },
});

export const updateRole = mutation({
  args: {
    profileId: v.id('profiles'),
    role: v.union(v.literal('admin'), v.literal('moderator'), v.literal('super_admin')),
    scope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const target = await ctx.db.get(args.profileId);
    if (!target || target.role === 'student') throw new ConvexError('Admin profile not found.');
    if (!canSeeAdmin(actor, target)) throw new ConvexError('You cannot manage this admin profile.');
    if (actor.role !== 'super_admin' && args.role !== 'moderator') {
      throw new ConvexError('Admins can only assign moderator role.');
    }
    if (target.role === 'super_admin' && actor.role !== 'super_admin') {
      throw new ConvexError('Only super admins can update super admin records.');
    }

    await ctx.db.patch(args.profileId, { role: args.role, updatedAt: Date.now() });
    const adminProfile = await ctx.db
      .query('adminProfiles')
      .withIndex('by_profile', (q) => q.eq('profileId', args.profileId))
      .unique();
    if (adminProfile) await ctx.db.patch(adminProfile._id, { role: args.role, scope: args.scope, updatedAt: Date.now() });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'adminUsers.updateRole',
      targetTable: 'profiles',
      targetId: args.profileId,
      summary: `Updated admin role to ${args.role}.`,
    });
  },
});
