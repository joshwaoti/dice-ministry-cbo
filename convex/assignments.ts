import { ConvexError, v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { assertDocumentContentType, assertDocumentSize, canGrade, requireAdmin, requireStudent, writeAudit } from './model';
import { assignmentFeedbackFolder } from './documents';

function plainText(value?: string) {
  if (!value) return 'Upload your completed assignment document.';
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() || 'Upload your completed assignment document.';
}

function isAssignmentDoc(doc: unknown): doc is Doc<'assignments'> {
  return Boolean(
    doc
    && typeof doc === 'object'
    && 'unitId' in doc
    && 'allowedTypes' in doc
    && 'maxFileSizeMB' in doc
  );
}

function isAssignmentUnitDoc(doc: unknown): doc is Doc<'units'> {
  return Boolean(doc && typeof doc === 'object' && 'type' in doc && (doc as Doc<'units'>).type === 'assignment');
}

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
      const courseUnits = await ctx.db
        .query('units')
        .withIndex('by_course', (q) => q.eq('courseId', enrollment.courseId))
        .collect();
      const assignmentUnits = courseUnits.filter((unit) => unit.type === 'assignment');
      const assignmentsByUnit = new Map(courseAssignments.map((assignment) => [assignment.unitId, assignment]));
      const visibleAssignments = [
        ...courseAssignments,
        ...assignmentUnits
          .filter((unit) => !assignmentsByUnit.has(unit._id))
          .map((unit) => ({
            _id: unit._id,
            _creationTime: unit._creationTime,
            unitId: unit._id,
            courseId: unit.courseId,
            title: unit.title,
            instructions: plainText(unit.richText),
            allowedTypes: ['pdf', 'doc', 'docx', 'txt'] as Array<'pdf' | 'doc' | 'docx' | 'txt'>,
            maxFileSizeMB: 20,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
            isVirtualAssignment: true,
          })),
      ];
      for (const assignment of visibleAssignments) {
        const submission = await ctx.db
          .query('submissions')
          .withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id))
          .collect()
          .then((rows) => rows.find((submission) => String(submission.assignmentId) === String(assignment._id) || String(submission.assignmentId) === String(assignment.unitId)));
        const profile = await ctx.db.get(studentProfile.profileId);
        const feedbackDocuments = profile && course
          ? await ctx.db
            .query('adminDocuments')
            .withIndex('by_source_path', (q) => q.eq('sourcePath', assignmentFeedbackFolder(profile.name, course.title, assignment.title)))
            .collect()
          : [];
        assignments.push({ ...assignment, course, submission, feedbackDocuments });
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
      const feedbackDocuments = assignment && course && profile
        ? await ctx.db
          .query('adminDocuments')
          .withIndex('by_source_path', (q) => q.eq('sourcePath', assignmentFeedbackFolder(profile.name, course.title, assignment.title)))
          .collect()
        : [];
      const comments = await ctx.db
        .query('submissionComments')
        .withIndex('by_submission', (q) => q.eq('submissionId', submission._id))
        .collect();
      return { ...submission, assignment, course, studentProfile, profile, comments, feedbackDocuments };
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
    assignmentId: v.union(v.id('assignments'), v.id('units')),
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
    const selectedDocument = await ctx.db.get(args.assignmentId as any);
    let assignment = isAssignmentDoc(selectedDocument) ? selectedDocument : null;
    if (!assignment) {
      const unit = isAssignmentUnitDoc(selectedDocument) ? selectedDocument : null;
      if (!unit) throw new ConvexError('Assignment not found.');
      const now = Date.now();
      const existingForUnit = await ctx.db
        .query('assignments')
        .withIndex('by_unit', (q) => q.eq('unitId', unit._id))
        .first();
      assignment = existingForUnit ?? {
        _id: await ctx.db.insert('assignments', {
          unitId: unit._id,
          courseId: unit.courseId,
          title: unit.title,
          instructions: plainText(unit.richText),
          allowedTypes: ['pdf', 'doc', 'docx', 'txt'],
          maxFileSizeMB: 20,
          createdAt: now,
          updatedAt: now,
        }),
        _creationTime: now,
        unitId: unit._id,
        courseId: unit.courseId,
        title: unit.title,
        instructions: plainText(unit.richText),
        allowedTypes: ['pdf', 'doc', 'docx', 'txt'],
        maxFileSizeMB: 20,
        createdAt: now,
        updatedAt: now,
      };
    }
    const enrollment = await ctx.db
      .query('enrollments')
      .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', assignment.courseId))
      .unique();
    if (enrollment?.status !== 'active') throw new ConvexError('You are not enrolled in this assignment course.');
    if (args.size > assignment.maxFileSizeMB * 1024 * 1024) throw new ConvexError('File exceeds assignment size limit.');

    const now = Date.now();
    const existing = await ctx.db
      .query('submissions')
      .withIndex('by_assignment_and_student', (q) => q.eq('assignmentId', assignment._id).eq('studentProfileId', studentProfile._id))
      .unique();

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
      assignmentId: assignment._id,
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
