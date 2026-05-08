/// <reference types="vite/client" />

import { describe, expect, test } from 'vitest';
import { convexTest } from 'convex-test';
import schema from './schema';
import { api, internal } from './_generated/api';
import { Doc, Id } from './_generated/dataModel';

const modules = import.meta.glob('./**/*.ts');

const adminIdentity = {
  subject: 'user_admin_legacy',
  tokenIdentifier: 'https://clerk.test|admin-token',
  email: 'admin@example.com',
  name: 'Admin User',
};

const studentIdentity = {
  subject: 'user_student_legacy',
  tokenIdentifier: 'https://clerk.test|student-token',
  email: 'student@example.com',
  name: 'Student User',
};

async function seedProfile(t: ReturnType<typeof convexTest>, role: 'super_admin' | 'admin' | 'moderator' | 'student') {
  return await t.run(async (ctx) => {
    const now = Date.now();
    const profileId = await ctx.db.insert('profiles', {
      clerkUserId: role === 'student' ? studentIdentity.subject : adminIdentity.subject,
      clerkTokenIdentifier: role === 'student' ? studentIdentity.tokenIdentifier : adminIdentity.tokenIdentifier,
      email: role === 'student' ? studentIdentity.email : adminIdentity.email,
      name: role === 'student' ? 'Student User' : 'Admin User',
      role,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
    let studentProfileId: Id<'studentProfiles'> | undefined;
    if (role === 'student') {
      studentProfileId = await ctx.db.insert('studentProfiles', {
        profileId,
        studentCode: 'STU-TEST',
        enrollmentStatus: 'active',
        progressPercent: 0,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { profileId, studentProfileId };
  });
}

function testBackend() {
  return convexTest({ schema, modules });
}

describe('auth profile lookup', () => {
  test('bootstraps the signed-in first user as super admin', async () => {
    const t = testBackend();
    const firstAdminEmail = 'joshwaotieno643@gmail.com';
    const firstAdminIdentity = {
      subject: 'user_first_super_admin',
      tokenIdentifier: 'https://clerk.diceministry.org|user_first_super_admin',
      email: firstAdminEmail,
      name: 'Joshua Wandhawa',
    };

    const profileId = await t.withIdentity(firstAdminIdentity).mutation(api.profiles.bootstrapSuperAdmin, {
      email: firstAdminEmail,
      name: firstAdminIdentity.name,
    });
    const current = await t.withIdentity(firstAdminIdentity).query(api.profiles.current, {});

    expect(current?._id).toBe(profileId);
    expect(current?.role).toBe('super_admin');
    expect(current?.status).toBe('active');
  });

  test('prefers tokenIdentifier and falls back to legacy Clerk subject', async () => {
    const t = testBackend();
    await seedProfile(t, 'admin');
    const byToken = await t.withIdentity({ ...adminIdentity, subject: 'changed-subject' }).query(api.profiles.current, {});
    expect(byToken?.email).toBe(adminIdentity.email);

    await t.run(async (ctx) => {
      const now = Date.now();
      await ctx.db.insert('profiles', {
        clerkUserId: 'legacy-only',
        email: 'legacy@example.com',
        name: 'Legacy User',
        role: 'admin',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    });
    const legacy = await t.withIdentity({ subject: 'legacy-only', tokenIdentifier: 'https://clerk.test|new-token', email: 'legacy@example.com' }).query(api.profiles.current, {});
    expect(legacy?.email).toBe('legacy@example.com');
  });

  test('applies Clerk student webhook data in the internal DB mutation', async () => {
    const t = testBackend();
    const result = await t.mutation(internal.profiles.applyClerkUserSync, {
      eventType: 'user.created',
      data: {
        id: 'user_webhook_student',
        first_name: 'Webhook',
        last_name: 'Student',
        primary_email_address_id: 'email_primary',
        email_addresses: [{ id: 'email_primary', email_address: 'Webhook.Student@Example.com' }],
        public_metadata: { role: 'student' },
      },
    });

    expect(result.ok).toBe(true);
    const profile = await t.run(async (ctx) => {
      return await ctx.db
        .query('profiles')
        .withIndex('by_clerk_user_id', (q) => q.eq('clerkUserId', 'user_webhook_student'))
        .unique();
    });
    expect(profile?.email).toBe('webhook.student@example.com');
    expect(profile?.role).toBe('student');
    expect(profile?.status).toBe('active');
    const studentProfile = await t.run(async (ctx) => {
      return await ctx.db
        .query('studentProfiles')
        .withIndex('by_profile', (q) => q.eq('profileId', profile!._id))
        .unique();
    });
    expect(studentProfile?.enrollmentStatus).toBe('active');
  });

  test('syncs configured founder email as super admin even when other profiles exist', async () => {
    const t = testBackend();
    await seedProfile(t, 'student');
    const result = await t.mutation(internal.profiles.applyClerkUserSync, {
      eventType: 'signed_in_user.sync',
      clerkTokenIdentifier: 'https://clerk.diceministry.org|user_founder',
      data: {
        id: 'user_founder',
        first_name: 'Joshua',
        last_name: 'Otieno',
        primary_email_address_id: 'email_founder',
        email_addresses: [{ id: 'email_founder', email_address: 'joshwaotieno643@gmail.com' }],
        public_metadata: { role: 'admin' },
      },
    });

    expect(result.ok).toBe(true);
    const profile = await t.run(async (ctx) => {
      return await ctx.db
        .query('profiles')
        .withIndex('by_email', (q) => q.eq('email', 'joshwaotieno643@gmail.com'))
        .unique();
    });
    expect(profile?.role).toBe('super_admin');
    expect(profile?.status).toBe('active');
    const adminProfile = await t.run(async (ctx) => {
      return await ctx.db
        .query('adminProfiles')
        .withIndex('by_profile', (q) => q.eq('profileId', profile!._id))
        .unique();
    });
    expect(adminProfile?.role).toBe('super_admin');
    expect(adminProfile?.status).toBe('active');
  });

  test('upgrades existing configured founder profile to super admin on sync', async () => {
    const t = testBackend();
    const profileId = await t.run(async (ctx) => {
      const now = Date.now();
      return await ctx.db.insert('profiles', {
        clerkUserId: 'user_founder',
        email: 'joshwaotieno643@gmail.com',
        name: 'Joshua',
        role: 'admin',
        status: 'pending_invite',
        createdAt: now,
        updatedAt: now,
      });
    });

    const result = await t.mutation(internal.profiles.applyClerkUserSync, {
      eventType: 'signed_in_user.sync',
      clerkTokenIdentifier: 'https://clerk.diceministry.org|user_founder',
      data: {
        id: 'user_founder',
        first_name: 'Joshua',
        last_name: 'Otieno',
        primary_email_address_id: 'email_founder',
        email_addresses: [{ id: 'email_founder', email_address: 'joshwaotieno643@gmail.com' }],
        public_metadata: { role: 'admin' },
      },
    });

    expect(result.ok).toBe(true);
    const profile = await t.run(async (ctx) => await ctx.db.get(profileId));
    expect(profile?.role).toBe('super_admin');
    expect(profile?.status).toBe('active');
    const adminProfile = await t.run(async (ctx) => {
      return await ctx.db
        .query('adminProfiles')
        .withIndex('by_profile', (q) => q.eq('profileId', profileId))
        .unique();
    });
    expect(adminProfile?.role).toBe('super_admin');
  });
});

describe('announcements', () => {
  test('public banner returns latest sent all-audience announcement only', async () => {
    const t = testBackend();
    await seedProfile(t, 'admin');
    const admin = t.withIdentity(adminIdentity);

    await admin.mutation(api.announcements.create, {
      title: 'Scheduled',
      body: 'Not public yet',
      audience: 'all',
      scheduledAt: Date.now() + 86400000,
    });
    expect(await t.query(api.announcements.listPublicBanner, {})).toBeNull();

    const firstId = await admin.mutation(api.announcements.create, { title: 'First', body: 'Visible', audience: 'all' });
    const secondId = await admin.mutation(api.announcements.create, { title: 'Second', body: 'Latest visible', audience: 'all' });
    await admin.mutation(api.announcements.create, { title: 'Students', body: 'Portal only', audience: 'students' });

    const banner = await t.query(api.announcements.listPublicBanner, {});
    expect(banner?._id).toBe(secondId);
    expect(banner?._id).not.toBe(firstId);
  });

  test('admin can update, send, and delete announcements', async () => {
    const t = testBackend();
    await seedProfile(t, 'admin');
    const admin = t.withIdentity(adminIdentity);
    const id = await admin.mutation(api.announcements.create, {
      title: 'Planned',
      body: 'Scheduled record',
      audience: 'students',
      scheduledAt: Date.now() + 86400000,
    });
    await admin.mutation(api.announcements.update, { announcementId: id, audience: 'admins', status: 'sent' });
    const rows = await admin.query(api.announcements.listAdmin, {});
    expect(rows.find((row: Doc<'announcements'>) => row._id === id)?.status).toBe('sent');
    await admin.mutation(api.announcements.remove, { announcementId: id });
    expect((await admin.query(api.announcements.listAdmin, {})).find((row: Doc<'announcements'>) => row._id === id)).toBeUndefined();
  });
});

describe('rich text and uploads', () => {
  test('sanitizes course unit rich text before saving', async () => {
    const t = testBackend();
    const { profileId } = await seedProfile(t, 'admin');
    const admin = t.withIdentity(adminIdentity);
    const courseId = await admin.mutation(api.courses.create, { title: 'Safe HTML', synopsis: 'Testing sanitizer' });
    const moduleId = await admin.mutation(api.courses.createModule, { courseId, title: 'Module' });
    const unitId = await admin.mutation(api.courses.saveUnit, {
      courseId,
      moduleId,
      title: 'Unit',
      type: 'text',
      order: 0,
      richText: '<h1 onclick="bad()">Hi</h1><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://example.com">ok</a><img src="javascript:alert(1)" onerror="bad()">',
    });
    const saved = await t.run(async (ctx) => await ctx.db.get(unitId)) as Doc<'units'> | null;
    expect(saved?.richText).toContain('<h1>Hi</h1>');
    expect(saved?.richText).not.toContain('script');
    expect(saved?.richText).not.toContain('javascript:');
    expect(saved?.richText).toContain('https://example.com');
    expect(profileId).toBeTruthy();
  });

  test('rejects unsupported and oversized document metadata', async () => {
    const t = testBackend();
    await seedProfile(t, 'admin');
    const admin = t.withIdentity(adminIdentity);
    await expect(admin.mutation(api.documents.createAdminDocument, {
      name: 'Video',
      category: 'General',
      access: 'admin_team',
      contentType: 'video/mp4',
      size: 1000,
    })).rejects.toThrow();
    await expect(admin.mutation(api.documents.createAdminDocument, {
      name: 'Huge',
      category: 'General',
      access: 'admin_team',
      contentType: 'application/pdf',
      size: 30 * 1024 * 1024,
    })).rejects.toThrow();
  });

  test('surfaces course resources and assignment submissions in document folders', async () => {
    const t = testBackend();
    const { profileId: adminProfileId } = await seedProfile(t, 'admin');
    const { studentProfileId } = await seedProfile(t, 'student');
    const admin = t.withIdentity(adminIdentity);
    const student = t.withIdentity(studentIdentity);

    const [courseFileId, unitFileId, submissionFileId, feedbackFileId, replacementFileId] = await t.run(async (ctx) => {
      return await Promise.all([
        ctx.storage.store(new Blob(['course handbook'], { type: 'application/pdf' })),
        ctx.storage.store(new Blob(['unit worksheet'], { type: 'application/pdf' })),
        ctx.storage.store(new Blob(['student work'], { type: 'application/pdf' })),
        ctx.storage.store(new Blob(['teacher feedback'], { type: 'application/pdf' })),
        ctx.storage.store(new Blob(['replacement work'], { type: 'application/pdf' })),
      ]);
    });

    const courseId = await admin.mutation(api.courses.createCourseWithDocuments, {
      title: 'Visible Documents',
      synopsis: 'Course files must be visible.',
      storageIds: [courseFileId],
      fileNames: ['course-handbook.pdf'],
      contentTypes: ['application/pdf'],
      sizes: [1024],
    });
    const moduleId = await admin.mutation(api.courses.createModule, { courseId, title: 'Foundations' });
    const unitId = await admin.mutation(api.courses.saveUnit, {
      courseId,
      moduleId,
      title: 'Opening Lesson',
      type: 'text',
      order: 0,
      richText: '<p>Read the worksheet.</p>',
    });
    await admin.mutation(api.courses.addUnitResource, {
      unitId,
      storageId: unitFileId,
      fileName: 'unit-worksheet.pdf',
      contentType: 'application/pdf',
      size: 2048,
      resourceType: 'inline_pdf',
    });

    const assignmentId = await t.run(async (ctx) => {
      const now = Date.now();
      await ctx.db.insert('enrollments', {
        studentProfileId: studentProfileId!,
        courseId,
        assignedBy: adminProfileId,
        status: 'active',
        progressPercent: 0,
        createdAt: now,
        updatedAt: now,
      });
      return await ctx.db.insert('assignments', {
        unitId,
        courseId,
        title: 'Reflection Upload',
        instructions: 'Upload a reflection.',
        allowedTypes: ['pdf', 'doc', 'docx', 'txt'],
        maxFileSizeMB: 20,
        createdAt: now,
        updatedAt: now,
      });
    });
    await student.mutation(api.assignments.submit, {
      assignmentId,
      storageId: submissionFileId,
      fileName: 'student-reflection.pdf',
      contentType: 'application/pdf',
      size: 4096,
    });

    const studentCourse = await student.query(api.courses.getStudentCourse, { courseId });
    expect(studentCourse?.courseDocuments.map((doc) => doc.fileName)).toContain('course-handbook.pdf');
    expect(studentCourse?.modules[0].units[0].resources.map((doc) => doc.fileName)).toContain('unit-worksheet.pdf');

    const folders = await admin.query(api.documents.listDocumentFolders, {});
    expect(folders.map((folder) => folder.sourcePath)).toContain('Courses/Visible Documents/Course Documents');
    expect(folders.map((folder) => folder.sourcePath)).toContain('Courses/Visible Documents/Foundations/Opening Lesson/Resources');
    expect(folders.map((folder) => folder.sourcePath)).toContain('Student Assignments/Student User/Visible Documents/Reflection Upload');

    const courseDocs = await admin.query(api.documents.listAdminLibrary, { sourcePath: 'Courses/Visible Documents/Course Documents' });
    expect(courseDocs.map((doc) => doc.fileName)).toContain('course-handbook.pdf');
    const submissionDocs = await admin.query(api.documents.listAdminLibrary, { sourcePath: 'Student Assignments/Student User/Visible Documents/Reflection Upload' });
    expect(submissionDocs[0].name).toContain('Student User - Reflection Upload - student-reflection.pdf');

    const feedbackPath = 'Student Assignments/Student User/Visible Documents/Feedback/Reflection Upload';
    await admin.mutation(api.documents.createAdminDocument, {
      name: 'Student User - teacher-feedback.pdf',
      category: 'Student Assignment Feedback',
      access: 'students',
      storageId: feedbackFileId,
      fileName: 'teacher-feedback.pdf',
      contentType: 'application/pdf',
      size: 1024,
      sourcePath: feedbackPath,
    });
    const assignments = await student.query(api.assignments.listForStudent, {});
    expect(assignments[0].feedbackDocuments.map((doc: Doc<'adminDocuments'>) => doc.fileName)).toContain('teacher-feedback.pdf');

    await admin.mutation(api.documents.updateLibraryDocument, {
      sourceTable: 'submissions',
      sourceId: submissionDocs[0].sourceId as Id<'submissions'>,
      name: 'renamed-reflection.pdf',
      notes: 'Reviewed by admin.',
    });
    let updatedSubmissionDocs = await admin.query(api.documents.listAdminLibrary, { sourcePath: 'Student Assignments/Student User/Visible Documents/Reflection Upload' });
    expect(updatedSubmissionDocs[0].fileName).toBe('renamed-reflection.pdf');

    await admin.mutation(api.documents.replaceLibraryDocumentFile, {
      sourceTable: 'submissions',
      sourceId: submissionDocs[0].sourceId as Id<'submissions'>,
      storageId: replacementFileId,
      fileName: 'replacement-reflection.pdf',
      contentType: 'application/pdf',
      size: 2048,
    });
    updatedSubmissionDocs = await admin.query(api.documents.listAdminLibrary, { sourcePath: 'Student Assignments/Student User/Visible Documents/Reflection Upload' });
    expect(updatedSubmissionDocs[0].fileName).toBe('replacement-reflection.pdf');

    await admin.mutation(api.documents.removeLibraryDocument, {
      sourceTable: 'submissions',
      sourceId: submissionDocs[0].sourceId as Id<'submissions'>,
    });
    const removedSubmissionDocs = await admin.query(api.documents.listAdminLibrary, { sourcePath: 'Student Assignments/Student User/Visible Documents/Reflection Upload' });
    expect(removedSubmissionDocs).toHaveLength(0);
  });

  test('creates submittable assignment records when saving assignment units', async () => {
    const t = testBackend();
    await seedProfile(t, 'admin');
    const admin = t.withIdentity(adminIdentity);

    const courseId = await admin.mutation(api.courses.create, {
      title: 'Assignment Unit Course',
      synopsis: 'Assignment units should be submittable.',
    });
    const moduleId = await admin.mutation(api.courses.createModule, { courseId, title: 'Module One' });
    const unitId = await admin.mutation(api.courses.saveUnit, {
      courseId,
      moduleId,
      title: 'Reflection Assignment',
      type: 'assignment',
      order: 0,
      richText: '<p>Upload your reflection.</p>',
      estimatedMinutes: 30,
    });

    let rows = await t.run(async (ctx) => {
      return await ctx.db.query('assignments').withIndex('by_unit', (q) => q.eq('unitId', unitId)).collect();
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('Reflection Assignment');
    expect(rows[0].allowedTypes).toEqual(['pdf', 'doc', 'docx', 'txt']);

    await admin.mutation(api.courses.saveUnit, {
      courseId,
      moduleId,
      unitId,
      title: 'Reflection Lesson',
      type: 'text',
      order: 0,
      richText: '<p>No upload required.</p>',
      estimatedMinutes: 30,
    });
    rows = await t.run(async (ctx) => {
      return await ctx.db.query('assignments').withIndex('by_unit', (q) => q.eq('unitId', unitId)).collect();
    });
    expect(rows).toHaveLength(0);
  });

  test('students see legacy assignment units even when assignment rows are missing', async () => {
    const t = testBackend();
    const { profileId: adminProfileId } = await seedProfile(t, 'admin');
    const { studentProfileId } = await seedProfile(t, 'student');
    const student = t.withIdentity(studentIdentity);

    await t.run(async (ctx) => {
      const now = Date.now();
      const courseId = await ctx.db.insert('courses', {
        title: 'Legacy Assignment Course',
        slug: 'legacy-assignment-course',
        synopsis: 'Course has an assignment unit only.',
        status: 'published',
        createdBy: adminProfileId,
        updatedBy: adminProfileId,
        createdAt: now,
        updatedAt: now,
      });
      const moduleId = await ctx.db.insert('modules', {
        courseId,
        title: 'Legacy Module',
        order: 0,
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.insert('units', {
        courseId,
        moduleId,
        title: 'Legacy Reflection',
        order: 0,
        type: 'assignment',
        richText: '<p>Submit this legacy task.</p>',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.insert('enrollments', {
        studentProfileId: studentProfileId!,
        courseId,
        assignedBy: adminProfileId,
        status: 'active',
        progressPercent: 0,
        createdAt: now,
        updatedAt: now,
      });
    });

    const rows = await student.query(api.assignments.listForStudent, {});
    expect(rows.map((row) => row.title)).toContain('Legacy Reflection');
    expect((rows.find((row) => row.title === 'Legacy Reflection') as any)?.isVirtualAssignment).toBe(true);
  });
});

describe('public submissions', () => {
  test('validates contact and alumni submissions with duplicate guard', async () => {
    const t = testBackend();
    await t.mutation(api.publicSubmissions.submitContact, {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'Ada@Example.com',
      message: 'I would like to connect with the ministry team.',
    });
    await expect(t.mutation(api.publicSubmissions.submitContact, {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      message: 'Sending again too quickly.',
    })).rejects.toThrow();

    await t.mutation(api.publicSubmissions.submitAlumniStory, {
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      cohort: 'Ignite 2024',
      currentUpdate: 'Serving in campus ministry',
      story: 'The program helped me grow spiritually and practically through mentoring and community.',
    });

    await seedProfile(t, 'admin');
    const rows = await t.withIdentity(adminIdentity).query(api.publicSubmissions.listAdmin, { status: 'new' });
    expect(rows).toHaveLength(2);
  });
});
