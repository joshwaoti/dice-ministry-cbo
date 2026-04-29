// @ts-nocheck
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin, writeAudit } from './model';

const DEFAULT_SETTINGS = {
  notifications: {
    applicationSubmitted: true,
    assignmentReview: true,
    studentAtRisk: true,
    documentUploadAlert: true,
  },
  operations: {
    defaultAssignmentFileLimitMB: 10,
    reminderHoursBeforeDeadline: 24,
    courseAutosaveSeconds: 2,
  },
};

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query('portalSettings').collect();
    return rows.reduce((settings, row) => ({ ...settings, [row.key]: row.value }), DEFAULT_SETTINGS as any);
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const now = Date.now();
    const existing = await ctx.db.query('portalSettings').withIndex('by_key', (q) => q.eq('key', args.key)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedBy: actor._id, updatedAt: now });
    } else {
      await ctx.db.insert('portalSettings', { key: args.key, value: args.value, updatedBy: actor._id, updatedAt: now });
    }
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'settings.upsert',
      targetTable: 'portalSettings',
      targetId: args.key,
      summary: `Updated portal setting ${args.key}.`,
    });
  },
});
