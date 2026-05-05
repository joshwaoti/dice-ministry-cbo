// @ts-nocheck
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin, writeAudit } from './model';

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query('cohorts').order('desc').collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    year: v.number(),
    status: v.optional(v.union(v.literal('draft'), v.literal('active'), v.literal('completed'), v.literal('archived'))),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx, ['super_admin', 'admin']);
    const now = Date.now();
    const cohortId = await ctx.db.insert('cohorts', {
      name: args.name.trim(),
      year: args.year,
      status: args.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actorProfileId: actor._id,
      action: 'cohorts.create',
      targetTable: 'cohorts',
      targetId: cohortId,
      summary: `Created cohort ${args.name}.`,
    });
    return cohortId;
  },
});
