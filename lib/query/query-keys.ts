/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query cache
 *
 * Benefits:
 * - Type-safe query key generation
 * - Consistent cache key structure
 * - Easy invalidation patterns
 * - Hierarchical key organization
 *
 * @example
 * // In a query file
 * import { queryKeys } from "@/lib/query/query-keys";
 *
 * queryOptions({
 *   queryKey: queryKeys.profile.me(),
 *   queryFn: () => profileService.me(),
 * });
 */
export const queryKeys = {
  /**
   * Profile query keys
   */
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
} as const;
