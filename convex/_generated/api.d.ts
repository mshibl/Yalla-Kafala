/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as boardMembers_mutations from "../boardMembers/mutations.js";
import type * as boardMembers_queries from "../boardMembers/queries.js";
import type * as resources_mutations from "../resources/mutations.js";
import type * as resources_queries from "../resources/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "boardMembers/mutations": typeof boardMembers_mutations;
  "boardMembers/queries": typeof boardMembers_queries;
  "resources/mutations": typeof resources_mutations;
  "resources/queries": typeof resources_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
