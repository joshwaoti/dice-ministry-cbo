// @ts-nocheck
import { query } from './_generated/server';
import { requireAdmin, requireStudent } from './model';

export const adminDashboard = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [students, courses, submissions, applications, conversations, announcements, enrollments] = await Promise.all([
      ctx.db.query('studentProfiles').collect(),
      ctx.db.query('courses').collect(),
      ctx.db.query('submissions').collect(),
      ctx.db.query('applications').collect(),
      ctx.db.query('conversations').collect(),
      ctx.db.query('announcements').collect(),
      ctx.db.query('enrollments').collect(),
    ]);
    const pendingSubmissions = submissions.filter((submission) => submission.status === 'pending_review').length;
    const activeCourses = courses.filter((course) => course.status === 'published').length;
    const draftCourses = courses.filter((course) => course.status === 'draft').length;
    const newApplications = applications.filter((application) => application.status === 'new').length;
    const avgCompletion = students.length
      ? Math.round(students.reduce((sum, student) => sum + (student.progressPercent ?? 0), 0) / students.length)
      : 0;

    const enrollmentData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' });
      const count = enrollments.filter((e) => {
        const created = e.createdAt;
        const monthCreated = new Date(created).toLocaleString('default', { month: 'short' });
        return monthCreated === month;
      }).length;
      return { name: month, count };
    });

    const recentActivity = [
      ...submissions.slice(0, 5).map((s) => ({ type: 'submission', submission: s, time: s.submittedAt })),
      ...enrollments.slice(0, 5).map((e) => ({ type: 'enrollment', enrollment: e, time: e.createdAt })),
    ]
      .sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
      .slice(0, 10);

    return {
      metrics: {
        students: students.length,
        activeCourses,
        draftCourses,
        pendingSubmissions,
        activeThisWeek: students.filter((student) => student.lastActiveAt && student.lastActiveAt > Date.now() - 7 * 86400000).length,
        unreadMessages: conversations.filter((c) => c.lastMessageAt && c.lastMessageAt > Date.now() - 7 * 86400000).length,
        applications: applications.length,
        newApplications,
        avgCompletion,
        announcements: announcements.length,
      },
      enrollmentData,
      completionData: courses.map((course) => ({ course: course.title, percent: avgCompletion })),
      recentActivity: recentActivity.map((activity: any) => {
        if (activity.type === 'submission') {
          return { type: 'submission', time: activity.time };
        }
        return { type: 'enrollment', time: activity.time };
      }),
    };
  },
});

export const studentDashboard = query({
  args: {},
  handler: async (ctx) => {
    const { profile, studentProfile } = await requireStudent(ctx);
    const enrollments = await ctx.db
      .query('enrollments')
      .withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id))
      .collect();
    const courses = await Promise.all(enrollments.map(async (enrollment) => ({ ...enrollment, course: await ctx.db.get(enrollment.courseId) })));
    const submissions = await ctx.db.query('submissions').withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id)).collect();
    const conversations = await ctx.db.query('conversations').withIndex('by_student', (q) => q.eq('studentProfileId', studentProfile._id)).collect();
    return {
      profile,
      studentProfile,
      courses,
      submissions,
      conversations,
      featured: courses[0] ?? null,
      progress: studentProfile.progressPercent ?? 0,
    };
  },
});
