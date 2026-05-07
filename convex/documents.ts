import { ConvexError, v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { assertDocumentContentType, assertDocumentSize, isAdminRole, requireAdmin, requireProfile, requireStudent } from './model';

type LibraryDocument = {
  _id: string;
  name: string;
  category: string;
  access: 'admin_only' | 'instructors' | 'admin_team' | 'students';
  storageId?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  sourcePath?: string;
  createdBy?: string;
  ownerProfileId?: string;
  createdAt: number;
  updatedAt: number;
  sourceTable: string;
  sourceId: string;
  owner?: Doc<'profiles'> | null;
};

function courseFolder(course: Doc<'courses'> | null, rest = 'Course Documents') {
  return `Courses/${course?.title ?? 'Unknown Course'}/${rest}`;
}

function normalizeFolderPath(path: string) {
  return path.trim().replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}

function matchesFolder(doc: LibraryDocument, folder?: string) {
  if (!folder) return true;
  const normalized = normalizeFolderPath(folder);
  return normalizeFolderPath(doc.sourcePath ?? '') === normalized || normalizeFolderPath(doc.category) === normalized;
}

async function courseForAdminDocument(ctx: QueryCtx, doc: Doc<'adminDocuments'>) {
  if (doc.category.startsWith('Course: ')) {
    const title = doc.category.slice('Course: '.length).trim();
    const courses = await ctx.db.query('courses').take(200);
    return courses.find((course) => course.title === title) ?? null;
  }
  if (doc.sourcePath?.startsWith('Courses/')) {
    const title = doc.sourcePath.split('/')[1];
    const courses = await ctx.db.query('courses').take(200);
    return courses.find((course) => course.title === title) ?? null;
  }
  return null;
}

async function storageIsKnownToAdmins(ctx: QueryCtx, storageId: string) {
  const [adminDoc, studentDoc, applicationDoc, submission, attachment, resource] = await Promise.all([
    ctx.db.query('adminDocuments').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
    ctx.db.query('studentDocuments').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
    ctx.db.query('applicationDocuments').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
    ctx.db.query('submissions').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
    ctx.db.query('messageAttachments').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
    ctx.db.query('unitResources').withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any)).first(),
  ]);
  return Boolean(adminDoc || studentDoc || applicationDoc || submission || attachment || resource);
}

async function studentCanAccessStorage(ctx: QueryCtx, profile: Doc<'profiles'>, studentProfile: Doc<'studentProfiles'>, storageId: string) {
  const studentDoc = await ctx.db
    .query('studentDocuments')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (studentDoc?.studentProfileId === studentProfile._id) return true;

  const submission = await ctx.db
    .query('submissions')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (submission?.studentProfileId === studentProfile._id) return true;

  const publicAdminDoc = await ctx.db
    .query('adminDocuments')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (publicAdminDoc?.access === 'students') return true;
  if (publicAdminDoc) {
    const course = await courseForAdminDocument(ctx, publicAdminDoc);
    if (course) {
      const enrollment = await ctx.db
        .query('enrollments')
        .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', course._id))
        .unique();
      if (enrollment?.status === 'active') return true;
    }
  }

  const attachment = await ctx.db
    .query('messageAttachments')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (attachment) {
    const message = await ctx.db.get(attachment.messageId);
    const conversation = message ? await ctx.db.get(message.conversationId) : null;
    if (conversation?.studentProfileId === studentProfile._id) return true;
  }

  const resource = await ctx.db
    .query('unitResources')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (resource) {
    const unit = await ctx.db.get(resource.unitId);
    if (unit) {
      const enrollment = await ctx.db
        .query('enrollments')
        .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', unit.courseId))
        .unique();
      if (enrollment?.status === 'active') return true;
    }
  }

  const applicationDoc = await ctx.db
    .query('applicationDocuments')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId as any))
    .first();
  if (applicationDoc) {
    const application = await ctx.db.get(applicationDoc.applicationId);
    if (application?.email.toLowerCase() === profile.email.toLowerCase()) return true;
  }

  return false;
}

export const getUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    if (isAdminRole(profile.role)) {
      const allowed = await storageIsKnownToAdmins(ctx, args.storageId);
      if (!allowed) throw new ConvexError('File access denied.');
      return await ctx.storage.getUrl(args.storageId);
    }
    const student = await ctx.db.query('studentProfiles').withIndex('by_profile', (q) => q.eq('profileId', profile._id)).unique();
    if (!student || !(await studentCanAccessStorage(ctx, profile, student, args.storageId))) {
      throw new ConvexError('File access denied.');
    }
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const listAdminLibrary = query({
  args: { category: v.optional(v.string()), sourcePath: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const docs = await collectLibraryDocuments(ctx);
    return docs
      .filter((doc) => matchesFolder(doc, args.sourcePath ?? args.category))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 200);
  },
});

export const listDocumentFolders = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await collectLibraryDocuments(ctx);
    const folderMap = new Map();
    for (const doc of docs) {
      const folder = normalizeFolderPath(doc.sourcePath || doc.category || 'General');
      if (!folderMap.has(folder)) {
        folderMap.set(folder, { name: folder, count: 0, sourcePath: folder });
      }
      folderMap.get(folder).count++;
    }
    return Array.from(folderMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  },
});

async function collectLibraryDocuments(ctx: QueryCtx): Promise<LibraryDocument[]> {
  const [
    adminDocs,
    unitResources,
    submissions,
    studentDocs,
    applicationDocs,
    messageAttachments,
  ] = await Promise.all([
    ctx.db.query('adminDocuments').order('desc').take(200),
    ctx.db.query('unitResources').order('desc').take(200),
    ctx.db.query('submissions').order('desc').take(200),
    ctx.db.query('studentDocuments').order('desc').take(200),
    ctx.db.query('applicationDocuments').order('desc').take(200),
    ctx.db.query('messageAttachments').order('desc').take(200),
  ]);

  const decoratedAdminDocs = await Promise.all(adminDocs.map(async (doc): Promise<LibraryDocument> => {
    const course = await courseForAdminDocument(ctx, doc);
    const sourcePath = doc.sourcePath ?? (course ? courseFolder(course) : doc.category);
    return {
      ...doc,
      _id: doc._id,
      storageId: doc.storageId,
      sourcePath,
      sourceTable: 'adminDocuments',
      sourceId: doc._id,
      owner: doc.ownerProfileId ? await ctx.db.get(doc.ownerProfileId) : null,
    };
  }));

  const decoratedResources = await Promise.all(unitResources.map(async (resource): Promise<LibraryDocument> => {
    const unit = await ctx.db.get(resource.unitId);
    const course = unit ? await ctx.db.get(unit.courseId) : null;
    const courseModule = unit ? await ctx.db.get(unit.moduleId) : null;
    const sourcePath = courseFolder(course, `${courseModule?.title ?? 'Unassigned Module'}/${unit?.title ?? 'Unknown Unit'}/Resources`);
    return {
      _id: `unitResources:${resource._id}`,
      name: resource.fileName,
      category: 'Course Resources',
      access: 'students',
      storageId: resource.storageId,
      fileName: resource.fileName,
      contentType: resource.contentType,
      size: resource.size,
      sourcePath,
      createdBy: resource.uploadedBy,
      ownerProfileId: resource.uploadedBy,
      createdAt: resource.uploadedAt,
      updatedAt: resource.uploadedAt,
      sourceTable: 'unitResources',
      sourceId: resource._id,
      owner: await ctx.db.get(resource.uploadedBy),
    };
  }));

  const decoratedSubmissions = await Promise.all(submissions.map(async (submission): Promise<LibraryDocument> => {
    const assignment = await ctx.db.get(submission.assignmentId);
    const course = assignment ? await ctx.db.get(assignment.courseId) : null;
    const studentProfile = await ctx.db.get(submission.studentProfileId);
    const profile = studentProfile ? await ctx.db.get(studentProfile.profileId) : null;
    const studentName = profile?.name ?? 'Unknown Student';
    return {
      _id: `submissions:${submission._id}`,
      name: `${studentName} - ${assignment?.title ?? 'Assignment Submission'} - ${submission.fileName}`,
      category: 'Student Assignments',
      access: 'admin_team',
      storageId: submission.storageId,
      fileName: submission.fileName,
      contentType: submission.contentType,
      size: submission.size,
      sourcePath: `Student Assignments/${studentName}/${course?.title ?? 'Unknown Course'}/${assignment?.title ?? 'Unknown Assignment'}`,
      createdAt: submission.submittedAt,
      updatedAt: submission.updatedAt,
      sourceTable: 'submissions',
      sourceId: submission._id,
      owner: profile,
    };
  }));

  const decoratedStudentDocs = await Promise.all(studentDocs.map(async (doc): Promise<LibraryDocument> => {
    const studentProfile = await ctx.db.get(doc.studentProfileId);
    const profile = studentProfile ? await ctx.db.get(studentProfile.profileId) : null;
    const studentName = profile?.name ?? 'Unknown Student';
    return {
      _id: `studentDocuments:${doc._id}`,
      name: `${studentName} - ${doc.fileName}`,
      category: doc.category,
      access: 'admin_team',
      storageId: doc.storageId,
      fileName: doc.fileName,
      contentType: doc.contentType,
      size: doc.size,
      sourcePath: `Students/${studentName}/${doc.category}`,
      createdAt: doc.uploadedAt,
      updatedAt: doc.uploadedAt,
      sourceTable: 'studentDocuments',
      sourceId: doc._id,
      owner: profile,
    };
  }));

  const decoratedApplicationDocs = await Promise.all(applicationDocs.map(async (doc): Promise<LibraryDocument> => {
    const application = await ctx.db.get(doc.applicationId);
    return {
      _id: `applicationDocuments:${doc._id}`,
      name: `${application?.fullName ?? 'Applicant'} - ${doc.fileName}`,
      category: doc.category,
      access: 'admin_team',
      storageId: doc.storageId,
      fileName: doc.fileName,
      contentType: doc.contentType,
      size: doc.size,
      sourcePath: `Applications/${application?.fullName ?? 'Unknown Applicant'}/${doc.category}`,
      createdAt: doc.uploadedAt,
      updatedAt: doc.uploadedAt,
      sourceTable: 'applicationDocuments',
      sourceId: doc._id,
      owner: null,
    };
  }));

  const decoratedAttachments = await Promise.all(messageAttachments.map(async (attachment): Promise<LibraryDocument> => {
    const message = await ctx.db.get(attachment.messageId);
    const conversation = message ? await ctx.db.get(message.conversationId) : null;
    const studentProfile = conversation ? await ctx.db.get(conversation.studentProfileId) : null;
    const profile = studentProfile ? await ctx.db.get(studentProfile.profileId) : null;
    const studentName = profile?.name ?? 'Unknown Student';
    return {
      _id: `messageAttachments:${attachment._id}`,
      name: `${studentName} - ${attachment.fileName}`,
      category: 'Message Attachments',
      access: 'admin_team',
      storageId: attachment.storageId,
      fileName: attachment.fileName,
      contentType: attachment.contentType,
      size: attachment.size,
      sourcePath: `Messages/${studentName}/${conversation?.subject ?? 'Conversation'}`,
      createdAt: attachment.uploadedAt,
      updatedAt: attachment.uploadedAt,
      sourceTable: 'messageAttachments',
      sourceId: attachment._id,
      owner: profile,
    };
  }));

  return [
    ...decoratedAdminDocs,
    ...decoratedResources,
    ...decoratedSubmissions,
    ...decoratedStudentDocs,
    ...decoratedApplicationDocs,
    ...decoratedAttachments,
  ];
}

export const createAdminDocument = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    access: v.union(v.literal('admin_only'), v.literal('instructors'), v.literal('admin_team'), v.literal('students')),
    storageId: v.optional(v.id('_storage')),
    fileName: v.optional(v.string()),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
    sourcePath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (args.contentType) assertDocumentContentType(args.contentType);
    if (args.size) assertDocumentSize(args.size);
    return await ctx.db.insert('adminDocuments', {
      ...args,
      contentType: args.contentType as any,
      createdBy: actor._id,
      ownerProfileId: actor._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateAdminDocument = mutation({
  args: {
    documentId: v.id('adminDocuments'),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    access: v.optional(v.union(v.literal('admin_only'), v.literal('instructors'), v.literal('admin_team'), v.literal('students'))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.documentId, {
      name: args.name,
      category: args.category,
      access: args.access,
      updatedAt: Date.now(),
    });
  },
});

export const removeAdminDocument = mutation({
  args: { documentId: v.id('adminDocuments') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.delete(args.documentId);
  },
});

export const generateAdminUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateStudentUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireStudent(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachApplicationDocument = mutation({
  args: {
    applicationId: v.id('applications'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await requireProfile(ctx);
    assertDocumentContentType(args.contentType);
    assertDocumentSize(args.size);
    return await ctx.db.insert('applicationDocuments', {
      applicationId: args.applicationId,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      category: args.category,
      uploadedAt: Date.now(),
    });
  },
});

export const attachStudentDocument = mutation({
  args: {
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    assertDocumentContentType(args.contentType);
    assertDocumentSize(args.size);
    return await ctx.db.insert('studentDocuments', {
      studentProfileId: studentProfile._id,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      category: args.category,
      uploadedAt: Date.now(),
    });
  },
});

export const attachStudentDocumentForAdmin = mutation({
  args: {
    studentProfileId: v.id('studentProfiles'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    assertDocumentContentType(args.contentType);
    assertDocumentSize(args.size);
    return await ctx.db.insert('studentDocuments', {
      studentProfileId: args.studentProfileId,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      category: args.category,
      uploadedAt: Date.now(),
    });
  },
});
