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
        mentor: student.mentorProfileId ? await ctx.db.get(student.mentorProfileId) : null,
        flags: await ctx.db
          .query('studentFlags')
          .withIndex('by_student', (q) => q.eq('studentProfileId', student._id))
          .filter((q) => q.eq(q.field('status'), 'open'))
          .collect(),
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
      mentor: student.mentorProfileId ? await ctx.db.get(student.mentorProfileId) : null,
      flags: await ctx.db
        .query('studentFlags')
        .withIndex('by_student', (q) => q.eq('studentProfileId', student._id))
        .collect(),
      enrollments: await Promise.all(
        (
          await ctx.db.query('enrollments').withIndex('by_student', (q) => q.eq('studentProfileId', student._id)).collect()
        ).map(async (enrollment) => ({ ...enrollment, course: await ctx.db.get(enrollment.courseId) })),
      ),
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
    programTrack: v.optional(v.string()),
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
      programTrack: args.programTrack,
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

export const flag = mutation({
  args: {
    studentProfileId: v.id('studentProfiles'),
    severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin', 'moderator']);
    const student = await ctx.db.get(args.studentProfileId);
    if (!student) throw new ConvexError('Student not found.');
    const now = Date.now();
    const flagId = await ctx.db.insert('studentFlags', {
      studentProfileId: args.studentProfileId,
      createdBy: actor._id,
      severity: args.severity,
      reason: args.reason.trim(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'students.flag',
      targetTable: 'studentProfiles',
      targetId: args.studentProfileId,
      summary: `Flagged student as ${args.severity}: ${args.reason}`,
    });
    return flagId;
  },
});

export const resolveFlag = mutation({
  args: { flagId: v.id('studentFlags') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.patch(args.flagId, {
      status: 'resolved',
      resolvedBy: actor._id,
      resolvedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const enrollInCourse = mutation({
  args: {
    studentProfileId: v.id('studentProfiles'),
    courseId: v.id('courses'),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const student = await ctx.db.get(args.studentProfileId);
    if (!student) throw new ConvexError('Student not found.');
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new ConvexError('Course not found.');
    const existing = await ctx.db
      .query('enrollments')
      .withIndex('by_student_course', (q) => q.eq('studentProfileId', args.studentProfileId).eq('courseId', args.courseId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { status: 'active', updatedAt: Date.now() });
      return existing._id;
    }
    const now = Date.now();
    return await ctx.db.insert('enrollments', {
      studentProfileId: args.studentProfileId,
      courseId: args.courseId,
      cohortId: student.cohortId,
      assignedBy: actor._id,
      status: 'active',
      progressPercent: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const withdrawFromCourse = mutation({
  args: {
    enrollmentId: v.id('enrollments'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.patch(args.enrollmentId, { status: 'withdrawn', updatedAt: Date.now() });
  },
});
