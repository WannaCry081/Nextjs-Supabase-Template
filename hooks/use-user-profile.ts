import { useContext } from "react";

import { UserProfileContext } from "@/components/providers/user-profile-provider";

export const useUser = () => {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("`useUser` must be used within a UserProfileProvider");
  }

  return context;
};
