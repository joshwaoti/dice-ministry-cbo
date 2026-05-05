import { ConvexError, v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { assertDocumentContentType, assertDocumentSize, canGrade, requireAdmin, requireStudent, writeAudit } from './model';

export const listForStudent = query({
  args: {},
  handler: async (ctx) => {
    const { studentProfile } = await requireStudent(ctx);
    const enrollments = await ctx.db
      .query('enrollments')
      .withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id))
      .collect();
    const assignments = [];
    for (const enrollment of enrollments) {
      const course = await ctx.db.get(enrollment.courseId);
      const courseAssignments = await ctx.db
        .query('assignments')
        .withIndex('by_course', (q) => q.eq('courseId', enrollment.courseId))
        .collect();
      for (const assignment of courseAssignments) {
        const submission = await ctx.db
          .query('submissions')
          .withIndex('by_assignment', (q) => q.eq('assignmentId', assignment._id))
          .filter((q) => q.eq(q.field('studentProfileId'), studentProfile._id))
          .first();
        assignments.push({ ...assignment, course, submission });
      }
    }
    return assignments;
  },
});

export const listSubmissions = query({
  args: {
    status: v.optional(v.union(v.literal('submitted'), v.literal('pending_review'), v.literal('pass'), v.literal('needs_revision'))),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canGrade(actor)) throw new ConvexError('You cannot review submissions.');
    const decorate = async (submission: Doc<'submissions'>) => {
      const assignment = await ctx.db.get(submission.assignmentId);
      const studentProfile = await ctx.db.get(submission.studentProfileId);
      const profile = studentProfile ? await ctx.db.get(studentProfile.profileId) : null;
      const course = assignment ? await ctx.db.get(assignment.courseId) : null;
      const comments = await ctx.db
        .query('submissionComments')
        .withIndex('by_submission', (q) => q.eq('submissionId', submission._id))
        .collect();
      return { ...submission, assignment, course, studentProfile, profile, comments };
    };
    if (args.status) {
      const submissions = await ctx.db.query('submissions').withIndex('by_status', (q) => q.eq('status', args.status!)).collect();
      return await Promise.all(submissions.map(decorate));
    }
    const submissions = await ctx.db.query('submissions').order('desc').collect();
    return await Promise.all(submissions.map(decorate));
  },
});

export const submit = mutation({
  args: {
    assignmentId: v.id('assignments'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    assertDocumentContentType(args.contentType);
    assertDocumentSize(args.size, 25 * 1024 * 1024);
    if (args.contentType.startsWith('image/') || args.contentType.includes('spreadsheet') || args.contentType.includes('presentation')) {
      throw new ConvexError('Assignment submissions must be PDF, DOC, DOCX, or TXT documents.');
    }
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new ConvexError('Assignment not found.');
    if (args.size > assignment.maxFileSizeMB * 1024 * 1024) throw new ConvexError('File exceeds assignment size limit.');

    const now = Date.now();
    const existing = await ctx.db
      .query('submissions')
      .withIndex('by_assignment', (q) => q.eq('assignmentId', args.assignmentId))
      .filter((q) => q.eq(q.field('studentProfileId'), studentProfile._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        fileName: args.fileName,
        contentType: args.contentType as any,
        size: args.size,
        notes: args.notes,
        status: 'pending_review',
        submittedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('submissions', {
      assignmentId: args.assignmentId,
      studentProfileId: studentProfile._id,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      notes: args.notes,
      status: 'pending_review',
      submittedAt: now,
      updatedAt: now,
    });
  },
});

export const reviewSubmission = mutation({
  args: {
    submissionId: v.id('submissions'),
    status: v.union(v.literal('pass'), v.literal('needs_revision'), v.literal('pending_review')),
    grade: v.optional(v.string()),
    comment: v.optional(v.string()),
    notifyStudent: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canGrade(actor)) throw new ConvexError('You cannot review submissions.');
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new ConvexError('Submission not found.');
    const now = Date.now();
    await ctx.db.patch(args.submissionId, {
      status: args.status,
      grade: args.grade,
      reviewedBy: actor._id,
      reviewedAt: now,
      updatedAt: now,
    });
    if (args.comment) {
      await ctx.db.insert('submissionComments', {
        submissionId: args.submissionId,
        authorProfileId: actor._id,
        body: args.comment,
        notifyStudent: args.notifyStudent ?? true,
        editedUntil: now + 15 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      });
    }
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'assignments.reviewSubmission',
      targetTable: 'submissions',
      targetId: args.submissionId,
      summary: `Submission marked ${args.status}.`,
    });
  },
});
