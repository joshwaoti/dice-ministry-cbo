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
