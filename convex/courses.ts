import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { sanitizeRichText } from './richText';
import { assertDocumentContentType, assertDocumentSize, canEditCoursework, canPublishCourse, requireAdmin, requireStudent, writeAudit } from './model';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const courses = await ctx.db.query('courses').order('desc').take(100);
    return await Promise.all(
      courses.map(async (course) => {
        const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', course._id)).collect();
        const units = await ctx.db.query('units').withIndex('by_course', (q) => q.eq('courseId', course._id)).collect();
        const enrollments = await ctx.db.query('enrollments').withIndex('by_course', (q) => q.eq('courseId', course._id)).collect();
        return { ...course, moduleCount: modules.length, unitCount: units.length, studentCount: enrollments.length };
      }),
    );
  },
});

export const deleteCourse = mutation({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot delete courses.');
    const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    for (const mod of modules) {
      const units = await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', mod._id)).collect();
      for (const unit of units) {
        const resources = await ctx.db.query('unitResources').withIndex('by_unit', (q) => q.eq('unitId', unit._id)).collect();
        for (const res of resources) {
          await ctx.db.delete(res._id);
        }
        const assignments = await ctx.db.query('assignments').withIndex('by_unit', (q) => q.eq('unitId', unit._id)).collect();
        for (const a of assignments) {
          await ctx.db.delete(a._id);
        }
        await ctx.db.delete(unit._id);
      }
      await ctx.db.delete(mod._id);
    }
    const enrollments = await ctx.db.query('enrollments').withIndex('by_course', (q) => q.eq('courseId', args.courseId)).collect();
    for (const e of enrollments) {
      await ctx.db.delete(e._id);
    }
    await ctx.db.delete(args.courseId);
    await writeAudit(ctx, { actorProfileId: actor._id, action: 'courses.delete', targetTable: 'courses', targetId: args.courseId, summary: 'Deleted course and all related data.' });
  },
});

export const deleteModule = mutation({
  args: { moduleId: v.id('modules') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot delete modules.');
    const mod = await ctx.db.get(args.moduleId);
    if (!mod) throw new ConvexError('Module not found.');
    const units = await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', args.moduleId)).collect();
    for (const unit of units) {
      const resources = await ctx.db.query('unitResources').withIndex('by_unit', (q) => q.eq('unitId', unit._id)).collect();
      for (const res of resources) {
        await ctx.db.delete(res._id);
      }
      await ctx.db.delete(unit._id);
    }
    await ctx.db.delete(args.moduleId);
    await writeAudit(ctx, { actorProfileId: actor._id, action: 'modules.delete', targetTable: 'modules', targetId: args.moduleId, summary: `Deleted module "${mod.title}".` });
  },
});

export const deleteUnit = mutation({
  args: { unitId: v.id('units') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot delete units.');
    const unit = await ctx.db.get(args.unitId);
    if (!unit) throw new ConvexError('Unit not found.');
    const resources = await ctx.db.query('unitResources').withIndex('by_unit', (q) => q.eq('unitId', args.unitId)).collect();
    for (const res of resources) {
      await ctx.db.delete(res._id);
    }
    const assignments = await ctx.db.query('assignments').withIndex('by_unit', (q) => q.eq('unitId', args.unitId)).collect();
    for (const a of assignments) {
      await ctx.db.delete(a._id);
    }
    await ctx.db.delete(args.unitId);
    await writeAudit(ctx, { actorProfileId: actor._id, action: 'units.delete', targetTable: 'units', targetId: args.unitId, summary: `Deleted unit "${unit.title}".` });
  },
});

export const searchCourses = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const q = args.query.toLowerCase().trim();
    if (!q) return [];
    const courses = await ctx.db.query('courses').take(200);
    const results = courses.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.synopsis.toLowerCase().includes(q),
    );
    return await Promise.all(
      results.map(async (course) => {
        const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', course._id)).collect();
        const units = await ctx.db.query('units').withIndex('by_course', (q) => q.eq('courseId', course._id)).collect();
        const enrollments = await ctx.db.query('enrollments').withIndex('by_course', (q) => q.eq('courseId', course._id)).collect();
        return { ...course, moduleCount: modules.length, unitCount: units.length, studentCount: enrollments.length };
      }),
    );
  },
});

export const reorderModules = mutation({
  args: { moduleId: v.id('modules'), newOrder: v.number() },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot reorder modules.');
    const mod = await ctx.db.get(args.moduleId);
    if (!mod) throw new ConvexError('Module not found.');
    await ctx.db.patch(args.moduleId, { order: args.newOrder, updatedAt: Date.now() });
  },
});

export const reorderUnits = mutation({
  args: { unitId: v.id('units'), newOrder: v.number() },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot reorder units.');
    const unit = await ctx.db.get(args.unitId);
    if (!unit) throw new ConvexError('Unit not found.');
    await ctx.db.patch(args.unitId, { order: args.newOrder, updatedAt: Date.now() });
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
  return await ctx.db.query('courses').withIndex('by_status', (q) => q.eq('status', 'published')).take(100);
  },
});

export const create = mutation({
  args: { title: v.string(), synopsis: v.string() },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot create courses.');
    const now = Date.now();
    return await ctx.db.insert('courses', {
      title: args.title,
      slug: slugify(args.title),
      synopsis: args.synopsis,
      status: 'draft',
      createdBy: actor._id,
      updatedBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    courseId: v.id('courses'),
    title: v.optional(v.string()),
    synopsis: v.optional(v.string()),
    status: v.optional(v.union(v.literal('draft'), v.literal('published'), v.literal('archived'))),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot update courses.');
    if (args.status === 'published' && !canPublishCourse(actor)) throw new ConvexError('You cannot publish courses.');
    await ctx.db.patch(args.courseId, {
      title: args.title,
      slug: args.title ? slugify(args.title) : undefined,
      synopsis: args.synopsis,
      status: args.status,
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });
  },
});

export const archive = mutation({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    await ctx.db.patch(args.courseId, { status: 'archived', updatedBy: actor._id, updatedAt: Date.now() });
  },
});

export const duplicate = mutation({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot duplicate courses.');
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new ConvexError('Course not found.');
    const now = Date.now();
    const copyId = await ctx.db.insert('courses', {
      title: `${course.title} Copy`,
      slug: `${course.slug}-copy-${now}`,
      synopsis: course.synopsis,
      status: 'draft',
      coverStorageId: course.coverStorageId,
      createdBy: actor._id,
      updatedBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
    const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    for (const courseModule of modules) {
      const newModuleId = await ctx.db.insert('modules', {
        courseId: copyId,
        title: courseModule.title,
        description: courseModule.description,
        order: courseModule.order,
        createdAt: now,
        updatedAt: now,
      });
      const units = await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', courseModule._id)).collect();
      for (const unit of units) {
        await ctx.db.insert('units', {
          courseId: copyId,
          moduleId: newModuleId,
          title: unit.title,
          order: unit.order,
          type: unit.type,
          richText: unit.richText,
          estimatedMinutes: unit.estimatedMinutes,
          status: 'draft',
          createdAt: now,
          updatedAt: now,
        });
      }
    }
    return copyId;
  },
});

export const createModule = mutation({
  args: { courseId: v.id('courses'), title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot edit coursework.');
    const existing = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    const now = Date.now();
    return await ctx.db.insert('modules', {
      courseId: args.courseId,
      title: args.title,
      description: args.description,
      order: existing.length,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateModule = mutation({
  args: { moduleId: v.id('modules'), title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot edit coursework.');
    await ctx.db.patch(args.moduleId, {
      title: args.title,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

export const getAdminCourse = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) return null;
    const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    const modulesWithUnits = await Promise.all(
      modules.map(async (courseModule) => ({
        ...courseModule,
        units: await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', courseModule._id)).collect(),
      })),
    );
    return { ...course, modules: modulesWithUnits };
  },
});

export const getUnitResources = query({
  args: { unitId: v.id('units') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.query('unitResources').withIndex('by_unit', (q) => q.eq('unitId', args.unitId)).collect();
  },
});

export const createCourseWithDocuments = mutation({
  args: {
    title: v.string(),
    synopsis: v.string(),
    storageIds: v.array(v.id('_storage')),
    fileNames: v.array(v.string()),
    contentTypes: v.array(v.string()),
    sizes: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot create courses.');
    args.contentTypes.forEach((contentType, index) => {
      assertDocumentContentType(contentType);
      assertDocumentSize(args.sizes[index]);
    });
    const now = Date.now();
    const courseId = await ctx.db.insert('courses', {
      title: args.title,
      slug: slugify(args.title),
      synopsis: args.synopsis,
      status: 'draft',
      createdBy: actor._id,
      updatedBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
    for (let i = 0; i < args.storageIds.length; i++) {
      await ctx.db.insert('adminDocuments', {
        name: args.fileNames[i],
        category: `Course: ${args.title}`,
        access: 'instructors',
        storageId: args.storageIds[i],
        fileName: args.fileNames[i],
        contentType: args.contentTypes[i] as any,
        size: args.sizes[i],
        createdBy: actor._id,
        ownerProfileId: actor._id,
        createdAt: now,
        updatedAt: now,
      });
    }
    return courseId;
  },
});

export const saveUnit = mutation({
  args: {
    courseId: v.id('courses'),
    moduleId: v.id('modules'),
    unitId: v.optional(v.id('units')),
    title: v.string(),
    type: v.union(v.literal('text'), v.literal('assignment')),
    richText: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot edit coursework.');
    const now = Date.now();
    const richText = args.richText ? sanitizeRichText(args.richText) : undefined;
    if (args.unitId) {
      await ctx.db.patch(args.unitId, {
        title: args.title,
        type: args.type,
        richText,
        estimatedMinutes: args.estimatedMinutes,
        order: args.order,
        updatedAt: now,
      });
      return args.unitId;
    }
    return await ctx.db.insert('units', {
      courseId: args.courseId,
      moduleId: args.moduleId,
      title: args.title,
      order: args.order,
      type: args.type,
      richText,
      estimatedMinutes: args.estimatedMinutes,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addUnitResource = mutation({
  args: {
    unitId: v.id('units'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    resourceType: v.union(v.literal('inline_pdf'), v.literal('download'), v.literal('image')),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (!canEditCoursework(actor)) throw new ConvexError('You cannot edit coursework.');
    assertDocumentContentType(args.contentType);
    assertDocumentSize(args.size);
    return await ctx.db.insert('unitResources', {
      unitId: args.unitId,
      storageId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType as any,
      size: args.size,
      resourceType: args.resourceType,
      uploadedBy: actor._id,
      uploadedAt: Date.now(),
    });
  },
});

export const publish = mutation({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    if (!canPublishCourse(actor)) throw new ConvexError('You cannot publish courses.');
    const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    if (modules.length === 0) throw new ConvexError('Add at least one module before publishing.');
    for (const courseModule of modules) {
      const units = await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', courseModule._id)).collect();
      if (units.length === 0) throw new ConvexError(`Module "${courseModule.title}" needs at least one unit.`);
      if (units.some((unit) => !unit.richText && unit.type === 'text')) {
        throw new ConvexError(`Module "${courseModule.title}" has an empty text unit.`);
      }
    }
    await ctx.db.patch(args.courseId, {
      status: 'published',
      publishedBy: actor._id,
      publishedAt: Date.now(),
      updatedBy: actor._id,
      updatedAt: Date.now(),
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'courses.publish',
      targetTable: 'courses',
      targetId: args.courseId,
      summary: 'Published course.',
    });
  },
});

export const myCourses = query({
  args: {},
  handler: async (ctx) => {
    const { studentProfile } = await requireStudent(ctx);
    const enrollments = await ctx.db
      .query('enrollments')
      .withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id))
      .collect();
    return await Promise.all(enrollments.map(async (enrollment) => ({ ...enrollment, course: await ctx.db.get(enrollment.courseId) })));
  },
});

export const getStudentCourse = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    const enrollment = await ctx.db
      .query('enrollments')
      .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', args.courseId))
      .unique();
    if (!enrollment) throw new ConvexError('You are not enrolled in this course.');
    const course = await ctx.db.get(args.courseId);
    const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', args.courseId)).collect();
    const modulesWithUnits = await Promise.all(
      modules.map(async (courseModule) => ({
        ...courseModule,
        units: await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', courseModule._id)).collect(),
      })),
    );
    return { ...course, enrollment, modules: modulesWithUnits };
  },
});

export const markUnitComplete = mutation({
  args: {
    courseId: v.id('courses'),
    moduleId: v.id('modules'),
    unitId: v.id('units'),
    lastReadPosition: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    const enrollment = await ctx.db
      .query('enrollments')
      .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', args.courseId))
      .unique();
    if (!enrollment) throw new ConvexError('You are not enrolled in this course.');

    const now = Date.now();
    const existing = await ctx.db
      .query('unitProgress')
      .withIndex('by_student_unit', (q) => q.eq('studentProfileId', studentProfile._id).eq('unitId', args.unitId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: 'completed',
        lastReadPosition: args.lastReadPosition,
        completedAt: existing.completedAt ?? now,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('unitProgress', {
        studentProfileId: studentProfile._id,
        courseId: args.courseId,
        moduleId: args.moduleId,
        unitId: args.unitId,
        status: 'completed',
        lastReadPosition: args.lastReadPosition,
        completedAt: now,
        updatedAt: now,
      });
    }

    const units = await ctx.db.query('units').withIndex('by_course', (q) => q.eq('courseId', args.courseId)).collect();
    const completed = await ctx.db
      .query('unitProgress')
      .withIndex('by_student_course', (q) => q.eq('studentProfileId', studentProfile._id).eq('courseId', args.courseId))
      .filter((q) => q.eq(q.field('status'), 'completed'))
      .collect();
    const progressPercent = units.length ? Math.round((completed.length / units.length) * 100) : 0;
    await ctx.db.patch(enrollment._id, { progressPercent, updatedAt: now });
    await ctx.db.patch(studentProfile._id, { progressPercent, lastActiveAt: now, updatedAt: now });
    return progressPercent;
  },
});

export const getUnitNote = query({
  args: { courseId: v.id('courses'), unitId: v.id('units') },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    return await ctx.db
      .query('studentNotes')
      .withIndex('by_student_unit', (q) => q.eq('studentProfileId', studentProfile._id).eq('unitId', args.unitId))
      .unique();
  },
});

export const saveUnitNote = mutation({
  args: { courseId: v.id('courses'), unitId: v.id('units'), body: v.string() },
  handler: async (ctx, args) => {
    const { studentProfile } = await requireStudent(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query('studentNotes')
      .withIndex('by_student_unit', (q) => q.eq('studentProfileId', studentProfile._id).eq('unitId', args.unitId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { body: args.body, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert('studentNotes', {
      studentProfileId: studentProfile._id,
      courseId: args.courseId,
      unitId: args.unitId,
      body: args.body,
      createdAt: now,
      updatedAt: now,
    });
  },
});
