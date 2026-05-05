import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const profileRole = v.union(
  v.literal('student'),
  v.literal('super_admin'),
  v.literal('admin'),
  v.literal('moderator'),
);

const profileStatus = v.union(
  v.literal('active'),
  v.literal('pending_invite'),
  v.literal('suspended'),
  v.literal('rejected'),
);

const applicationStatus = v.union(
  v.literal('new'),
  v.literal('under_review'),
  v.literal('accepted'),
  v.literal('rejected'),
  v.literal('waitlisted'),
);

const documentMimeType = v.union(
  v.literal('application/pdf'),
  v.literal('application/msword'),
  v.literal('application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
  v.literal('text/plain'),
  v.literal('image/jpeg'),
  v.literal('image/png'),
  v.literal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
  v.literal('application/vnd.openxmlformats-officedocument.presentationml.presentation'),
);

export default defineSchema({
  profiles: defineTable({
    clerkUserId: v.optional(v.string()),
    email: v.string(),
    name: v.string(),
    role: profileRole,
    status: profileStatus,
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id('_storage')),
    firstLoginAt: v.optional(v.number()),
    lastActiveAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerk_user_id', ['clerkUserId'])
    .index('by_email', ['email'])
    .index('by_role', ['role'])
    .index('by_status', ['status']),

  adminProfiles: defineTable({
    profileId: v.id('profiles'),
    role: v.union(v.literal('super_admin'), v.literal('admin'), v.literal('moderator')),
    title: v.optional(v.string()),
    scope: v.optional(v.string()),
    status: profileStatus,
    createdBy: v.optional(v.id('profiles')),
    approvedBy: v.optional(v.id('profiles')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_profile', ['profileId'])
    .index('by_role', ['role'])
    .index('by_status', ['status']),

  studentProfiles: defineTable({
    profileId: v.id('profiles'),
    applicationId: v.optional(v.id('applications')),
    studentCode: v.string(),
    programTrack: v.optional(v.string()),
    cohortId: v.optional(v.id('cohorts')),
    enrollmentStatus: v.union(
      v.literal('pending_invite'),
      v.literal('active'),
      v.literal('completed'),
      v.literal('withdrawn'),
      v.literal('suspended'),
    ),
    mentorProfileId: v.optional(v.id('profiles')),
    progressPercent: v.number(),
    lastActiveAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_profile', ['profileId'])
    .index('by_application', ['applicationId'])
    .index('by_cohort', ['cohortId'])
    .index('by_status', ['enrollmentStatus']),

  applications: defineTable({
    fullName: v.string(),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    residentialArea: v.optional(v.string()),
    highSchool: v.optional(v.string()),
    completionYear: v.optional(v.string()),
    kcseGrade: v.optional(v.string()),
    motivation: v.optional(v.string()),
    hopes: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    status: applicationStatus,
    internalNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.id('profiles')),
    reviewedAt: v.optional(v.number()),
    submittedAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_status', ['status'])
    .index('by_submitted_at', ['submittedAt']),

  applicationDocuments: defineTable({
    applicationId: v.id('applications'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: documentMimeType,
    size: v.number(),
    category: v.string(),
    uploadedAt: v.number(),
  }).index('by_application', ['applicationId']),

  studentDocuments: defineTable({
    studentProfileId: v.id('studentProfiles'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: documentMimeType,
    size: v.number(),
    category: v.string(),
    uploadedAt: v.number(),
  }).index('by_student', ['studentProfileId']),

  studentFlags: defineTable({
    studentProfileId: v.id('studentProfiles'),
    createdBy: v.id('profiles'),
    severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    reason: v.string(),
    status: v.union(v.literal('open'), v.literal('resolved')),
    resolvedBy: v.optional(v.id('profiles')),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student', ['studentProfileId'])
    .index('by_status', ['status']),

  adminDocuments: defineTable({
    name: v.string(),
    category: v.string(),
    ownerProfileId: v.optional(v.id('profiles')),
    access: v.union(v.literal('admin_only'), v.literal('instructors'), v.literal('admin_team'), v.literal('students')),
    storageId: v.optional(v.id('_storage')),
    fileName: v.optional(v.string()),
    contentType: v.optional(documentMimeType),
    size: v.optional(v.number()),
    createdBy: v.id('profiles'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_access', ['access'])
    .index('by_created', ['createdAt']),

  studentInvitationJobs: defineTable({
    applicationId: v.id('applications'),
    studentProfileId: v.id('studentProfiles'),
    email: v.string(),
    status: v.union(
      v.literal('queued'),
      v.literal('sending'),
      v.literal('sent'),
      v.literal('failed'),
      v.literal('accepted'),
      v.literal('expired'),
    ),
    clerkInvitationId: v.optional(v.string()),
    attemptCount: v.number(),
    lastError: v.optional(v.string()),
    nextAttemptAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status_next_attempt', ['status', 'nextAttemptAt'])
    .index('by_application', ['applicationId'])
    .index('by_student_profile', ['studentProfileId'])
    .index('by_email', ['email']),

  cohorts: defineTable({
    name: v.string(),
    year: v.number(),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    status: v.union(v.literal('draft'), v.literal('active'), v.literal('completed'), v.literal('archived')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_status', ['status']),

  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    synopsis: v.string(),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    coverStorageId: v.optional(v.id('_storage')),
    createdBy: v.optional(v.id('profiles')),
    updatedBy: v.optional(v.id('profiles')),
    publishedBy: v.optional(v.id('profiles')),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_status', ['status']),

  modules: defineTable({
    courseId: v.id('courses'),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_course_order', ['courseId', 'order']),

  units: defineTable({
    courseId: v.id('courses'),
    moduleId: v.id('modules'),
    title: v.string(),
    order: v.number(),
    type: v.union(v.literal('text'), v.literal('assignment')),
    richText: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    status: v.union(v.literal('draft'), v.literal('published')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_module_order', ['moduleId', 'order'])
    .index('by_course', ['courseId']),

  unitResources: defineTable({
    unitId: v.id('units'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: documentMimeType,
    size: v.number(),
    resourceType: v.union(v.literal('inline_pdf'), v.literal('download'), v.literal('image')),
    uploadedBy: v.id('profiles'),
    uploadedAt: v.number(),
  }).index('by_unit', ['unitId']),

  enrollments: defineTable({
    studentProfileId: v.id('studentProfiles'),
    courseId: v.id('courses'),
    cohortId: v.optional(v.id('cohorts')),
    assignedBy: v.id('profiles'),
    status: v.union(v.literal('active'), v.literal('completed'), v.literal('withdrawn')),
    progressPercent: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student', ['studentProfileId'])
    .index('by_course', ['courseId'])
    .index('by_student_course', ['studentProfileId', 'courseId']),

  unitProgress: defineTable({
    studentProfileId: v.id('studentProfiles'),
    courseId: v.id('courses'),
    moduleId: v.id('modules'),
    unitId: v.id('units'),
    status: v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('completed')),
    lastReadPosition: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_student_unit', ['studentProfileId', 'unitId'])
    .index('by_student_course', ['studentProfileId', 'courseId']),

  studentNotes: defineTable({
    studentProfileId: v.id('studentProfiles'),
    courseId: v.id('courses'),
    unitId: v.id('units'),
    body: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student_unit', ['studentProfileId', 'unitId'])
    .index('by_student_course', ['studentProfileId', 'courseId']),

  assignments: defineTable({
    unitId: v.id('units'),
    courseId: v.id('courses'),
    title: v.string(),
    instructions: v.string(),
    dueAt: v.optional(v.number()),
    allowedTypes: v.array(v.union(v.literal('pdf'), v.literal('doc'), v.literal('docx'), v.literal('txt'))),
    maxFileSizeMB: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_unit', ['unitId'])
    .index('by_course', ['courseId']),

  submissions: defineTable({
    assignmentId: v.id('assignments'),
    studentProfileId: v.id('studentProfiles'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: documentMimeType,
    size: v.number(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal('submitted'),
      v.literal('pending_review'),
      v.literal('pass'),
      v.literal('needs_revision'),
    ),
    grade: v.optional(v.string()),
    reviewedBy: v.optional(v.id('profiles')),
    reviewedAt: v.optional(v.number()),
    submittedAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_assignment', ['assignmentId'])
    .index('by_student', ['studentProfileId'])
    .index('by_status', ['status']),

  submissionComments: defineTable({
    submissionId: v.id('submissions'),
    authorProfileId: v.id('profiles'),
    body: v.string(),
    notifyStudent: v.boolean(),
    editedUntil: v.number(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_submission', ['submissionId']),

  conversations: defineTable({
    studentProfileId: v.id('studentProfiles'),
    adminProfileId: v.optional(v.id('profiles')),
    subject: v.string(),
    status: v.optional(v.union(v.literal('open'), v.literal('resolved'))),
    lastMessageAt: v.optional(v.number()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student', ['studentProfileId'])
    .index('by_admin', ['adminProfileId'])
    .index('by_last_message', ['lastMessageAt']),

  messages: defineTable({
    conversationId: v.id('conversations'),
    senderProfileId: v.id('profiles'),
    body: v.string(),
    readAt: v.optional(v.number()),
    editedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_conversation', ['conversationId'])
    .index('by_sender', ['senderProfileId']),

  messageAttachments: defineTable({
    messageId: v.id('messages'),
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: documentMimeType,
    size: v.number(),
    uploadedAt: v.number(),
  }).index('by_message', ['messageId']),

  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    audience: v.union(v.literal('all'), v.literal('students'), v.literal('admins'), v.literal('cohort')),
    cohortId: v.optional(v.id('cohorts')),
    status: v.union(v.literal('draft'), v.literal('scheduled'), v.literal('sent')),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    createdBy: v.id('profiles'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_audience', ['audience'])
    .index('by_status', ['status']),

  portalSettings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedBy: v.id('profiles'),
    updatedAt: v.number(),
  }).index('by_key', ['key']),

  notifications: defineTable({
    profileId: v.id('profiles'),
    type: v.union(
      v.literal('application'),
      v.literal('submission'),
      v.literal('message'),
      v.literal('announcement'),
      v.literal('system'),
    ),
    title: v.string(),
    body: v.string(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_profile', ['profileId'])
    .index('by_profile_read', ['profileId', 'readAt']),

  auditLogs: defineTable({
    actorProfileId: v.optional(v.id('profiles')),
    action: v.string(),
    targetTable: v.string(),
    targetId: v.optional(v.string()),
    summary: v.string(),
    createdAt: v.number(),
  })
    .index('by_actor', ['actorProfileId'])
    .index('by_target', ['targetTable', 'targetId'])
    .index('by_creation', ['createdAt']),
});
