// @ts-nocheck
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { assertDocumentContentType, requireAdmin, requireProfile, requireStudent } from './model';

export const listAdminLibrary = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query('adminDocuments').order('desc').collect();
    return await Promise.all(docs.map(async (doc) => ({ ...doc, owner: doc.ownerProfileId ? await ctx.db.get(doc.ownerProfileId) : null })));
  },
});

export const createAdminDocument = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    access: v.union(v.literal('admin_only'), v.literal('instructors'), v.literal('admin_team'), v.literal('students')),
    storageId: v.optional(v.id('_storage')),
    fileName: v.optional(v.string()),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (args.contentType) assertDocumentContentType(args.contentType);
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
