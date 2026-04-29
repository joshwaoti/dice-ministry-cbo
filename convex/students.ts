// @ts-nocheck
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { canManageStudents, requireAdmin, requireStudent, writeAudit } from './model';

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const students = await ctx.db.query('studentProfiles').collect();
    return await Promise.all(
      students.map(async (student) => ({
        ...student,
        profile: await ctx.db.get(student.profileId),
        cohort: student.cohortId ? await ctx.db.get(student.cohortId) : null,
      })),
    );
  },
});

export const get = query({
  args: { studentProfileId: v.id('studentProfiles') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const student = await ctx.db.get(args.studentProfileId);
    if (!student) throw new ConvexError('Student not found.');
    return {
      ...student,
      profile: await ctx.db.get(student.profileId),
      cohort: student.cohortId ? await ctx.db.get(student.cohortId) : null,
      actorRole: actor.role,
    };
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const { profile, studentProfile } = await requireStudent(ctx);
    return { profile, studentProfile };
  },
});

export const update = mutation({
  args: {
    studentProfileId: v.id('studentProfiles'),
    cohortId: v.optional(v.id('cohorts')),
    mentorProfileId: v.optional(v.id('profiles')),
    enrollmentStatus: v.optional(v.union(v.literal('active'), v.literal('completed'), v.literal('withdrawn'), v.literal('suspended'))),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    if (!canManageStudents(actor)) throw new ConvexError('You cannot edit student records.');
    const student = await ctx.db.get(args.studentProfileId);
    if (!student) throw new ConvexError('Student not found.');

    await ctx.db.patch(args.studentProfileId, {
      cohortId: args.cohortId,
      mentorProfileId: args.mentorProfileId,
      enrollmentStatus: args.enrollmentStatus,
      updatedAt: Date.now(),
    });
    if (args.enrollmentStatus === 'suspended') {
      await ctx.db.patch(student.profileId, { status: 'suspended', updatedAt: Date.now() });
    }
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'students.update',
      targetTable: 'studentProfiles',
      targetId: args.studentProfileId,
      summary: 'Updated student profile.',
    });
  },
});
