// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { canSeeAdmin, normalizeEmail, requireAdmin, writeAudit } from './model';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const actor = await requireAdmin(ctx);
    const profiles = await ctx.db.query('profiles').collect();
    return profiles.filter((profile) => profile.role !== 'student' && canSeeAdmin(actor, profile));
  },
});

export const inviteAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('moderator'), v.literal('super_admin')),
    title: v.optional(v.string()),
    scope: v.optional(v.string()),
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
      createdBy: actor._id,
      approvedBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'adminUsers.invite',
      targetTable: 'profiles',
      targetId: profileId,
      summary: `Created pending ${args.role} profile for ${email}.`,
    });
    return profileId;
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
