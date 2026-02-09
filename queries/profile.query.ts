import { queryOptions } from "@tanstack/react-query";

// Services
import { profileService } from "@/services/profile.service";

const PROFILE = "profile";

const profileQueryKey = {
  all: [PROFILE],
  me: () => [...profileQueryKey.all, "me"],
};

export const getProfileQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKey.me(),
    queryFn: () => profileService.me(),
  });
