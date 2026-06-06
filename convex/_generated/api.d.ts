/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as boardMembers_mutations from "../boardMembers/mutations.js";
import type * as boardMembers_queries from "../boardMembers/queries.js";
import type * as carouselImages_mutations from "../carouselImages/mutations.js";
import type * as carouselImages_queries from "../carouselImages/queries.js";
import type * as emailSubscribers_mutations from "../emailSubscribers/mutations.js";
import type * as emailSubscribers_queries from "../emailSubscribers/queries.js";
import type * as facebookPosts_mutations from "../facebookPosts/mutations.js";
import type * as facebookPosts_queries from "../facebookPosts/queries.js";
import type * as faqs_mutations from "../faqs/mutations.js";
import type * as faqs_queries from "../faqs/queries.js";
import type * as resources_mutations from "../resources/mutations.js";
import type * as resources_queries from "../resources/queries.js";
import type * as stories_mutations from "../stories/mutations.js";
import type * as stories_queries from "../stories/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "boardMembers/mutations": typeof boardMembers_mutations;
  "boardMembers/queries": typeof boardMembers_queries;
  "carouselImages/mutations": typeof carouselImages_mutations;
  "carouselImages/queries": typeof carouselImages_queries;
  "emailSubscribers/mutations": typeof emailSubscribers_mutations;
  "emailSubscribers/queries": typeof emailSubscribers_queries;
  "facebookPosts/mutations": typeof facebookPosts_mutations;
  "facebookPosts/queries": typeof facebookPosts_queries;
  "faqs/mutations": typeof faqs_mutations;
  "faqs/queries": typeof faqs_queries;
  "resources/mutations": typeof resources_mutations;
  "resources/queries": typeof resources_queries;
  "stories/mutations": typeof stories_mutations;
  "stories/queries": typeof stories_queries;
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
