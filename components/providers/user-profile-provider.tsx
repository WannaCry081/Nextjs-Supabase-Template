"use client";

import { createContext, PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";

import type { SelectProfile } from "@/types/drizzle.types";

import { getUserQueryOptions } from "@/queries/user.query";

type UserProfileContextType = {
  profile: SelectProfile | null;
  isLoading: boolean;
  error: Error | null;
};

export const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const UserProfileProvider = ({ children }: PropsWithChildren) => {
  const { data, isLoading, error } = useQuery(getUserQueryOptions());

  return (
    <UserProfileContext.Provider value={{ profile: data ?? null, isLoading, error }}>
      {children}
    </UserProfileContext.Provider>
  );
};
