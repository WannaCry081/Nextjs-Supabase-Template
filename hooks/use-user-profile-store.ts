import { useContext } from "react";
import { useStore } from "zustand";

// Components
import {
  UserProfileContext,
  type UserProfileStore,
} from "@/components/providers/user-profile-provider";

export const useUserProfileStore = <T>(
  selector: (state: ReturnType<UserProfileStore["getState"]>) => T
) => {
  const store = useContext(UserProfileContext);

  if (!store) {
    throw new Error("`useUserProfileStore` must be used within a UserProfileProvider");
  }

  return useStore(store, selector);
};
