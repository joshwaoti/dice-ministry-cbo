/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminUsers from "../adminUsers.js";
import type * as announcements from "../announcements.js";
import type * as applications from "../applications.js";
import type * as assignments from "../assignments.js";
import type * as cohorts from "../cohorts.js";
import type * as courses from "../courses.js";
import type * as crons from "../crons.js";
import type * as documents from "../documents.js";
import type * as invitations from "../invitations.js";
import type * as messages from "../messages.js";
import type * as model from "../model.js";
import type * as portal from "../portal.js";
import type * as profiles from "../profiles.js";
import type * as settings from "../settings.js";
import type * as students from "../students.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminUsers: typeof adminUsers;
  announcements: typeof announcements;
  applications: typeof applications;
  assignments: typeof assignments;
  cohorts: typeof cohorts;
  courses: typeof courses;
  crons: typeof crons;
  documents: typeof documents;
  invitations: typeof invitations;
  messages: typeof messages;
  model: typeof model;
  portal: typeof portal;
  profiles: typeof profiles;
  settings: typeof settings;
  students: typeof students;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
