import { queryOptions } from "@tanstack/react-query";

import { profileService } from "@/services/profile.service";
import { queryKeys } from "@/lib/query/query-keys";

/**
 * Profile query options
 * Fetches the current user's profile
 */
export const getProfileQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileService.me(),
  });
