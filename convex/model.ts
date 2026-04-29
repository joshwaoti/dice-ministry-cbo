// @ts-nocheck
import { ConvexError } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx } from './_generated/server';

export type AdminRole = 'super_admin' | 'admin' | 'moderator';
export type Role = AdminRole | 'student';

export function isAdminRole(role: Role): role is AdminRole {
  return role === 'super_admin' || role === 'admin' || role === 'moderator';
}

export async function getProfileByClerkUserId(ctx: QueryCtx | MutationCtx, clerkUserId: string) {
  return await ctx.db
    .query('profiles')
    .withIndex('by_clerk_user_id', (q) => q.eq('clerkUserId', clerkUserId))
    .unique();
}

export async function getCurrentProfile(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await getProfileByClerkUserId(ctx, identity.subject);
}

export async function requireProfile(ctx: QueryCtx | MutationCtx) {
  const profile = await getCurrentProfile(ctx);
  if (!profile) throw new ConvexError('Authenticated user does not have a DICE profile.');
  if (profile.status !== 'active') throw new ConvexError('Profile is not active.');
  return profile;
}

export async function requireStudent(ctx: QueryCtx | MutationCtx) {
  const profile = await requireProfile(ctx);
  if (profile.role !== 'student') throw new ConvexError('Student access required.');
  const studentProfile = await ctx.db
    .query('studentProfiles')
    .withIndex('by_profile', (q) => q.eq('profileId', profile._id))
    .unique();
  if (!studentProfile || studentProfile.enrollmentStatus !== 'active') {
    throw new ConvexError('Active student profile required.');
  }
  return { profile, studentProfile };
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx, allowed: AdminRole[] = ['super_admin', 'admin', 'moderator']) {
  const profile = await requireProfile(ctx);
  if (!isAdminRole(profile.role) || !allowed.includes(profile.role)) {
    throw new ConvexError('Admin access required.');
  }
  return profile as Doc<'profiles'> & { role: AdminRole };
}

export function canSeeAdmin(actor: Doc<'profiles'>, target: Doc<'profiles'>) {
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'admin') return target.role !== 'super_admin';
  if (actor.role === 'moderator') return actor._id === target._id;
  return false;
}

export function canManageStudents(actor: Doc<'profiles'>) {
  return actor.role === 'super_admin' || actor.role === 'admin';
}

export function canApproveApplications(actor: Doc<'profiles'>) {
  return actor.role === 'super_admin' || actor.role === 'admin';
}

export function canEditCoursework(actor: Doc<'profiles'>) {
  return actor.role === 'super_admin' || actor.role === 'admin' || actor.role === 'moderator';
}

export function canPublishCourse(actor: Doc<'profiles'>) {
  return actor.role === 'super_admin' || actor.role === 'admin';
}

export function canGrade(actor: Doc<'profiles'>) {
  return actor.role === 'super_admin' || actor.role === 'admin' || actor.role === 'moderator';
}

export async function writeAudit(
  ctx: MutationCtx,
  args: {
    actorProfileId?: Id<'profiles'>;
    action: string;
    targetTable: string;
    targetId?: string;
    summary: string;
  },
) {
  await ctx.db.insert('auditLogs', {
    actorProfileId: args.actorProfileId,
    action: args.action,
    targetTable: args.targetTable,
    targetId: args.targetId,
    summary: args.summary,
    createdAt: Date.now(),
  });
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function assertDocumentContentType(contentType: string) {
  const allowed = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]);
  if (!allowed.has(contentType)) {
    throw new ConvexError('Only document and image files are allowed. Video, audio, and ZIP uploads are not supported.');
  }
}
