"use client";

import { createStore, type StoreApi } from "zustand";
import { createContext, useState, PropsWithChildren, useEffect } from "react";

// Types
import type { SelectProfile } from "@/types/drizzle.types";

type UserProfileState = {
  loading: boolean;
  error: string | null;
  data: SelectProfile | null;
  actions: {
    hydrate: () => Promise<void>;
    clear: () => void;
  };
};

export type UserProfileStore = StoreApi<UserProfileState>;

export const UserProfileContext = createContext<UserProfileStore | null>(null);

export const UserProfileProvider = ({ children }: PropsWithChildren) => {
  const [store] = useState(() =>
    createStore<UserProfileState>((set) => ({
      loading: true,
      error: null,
      data: null,
      actions: {
        hydrate: async () => {
          set({ loading: true, error: null });
          try {
            const response = await fetch("/api/users/me");

            if (response.status === 401) {
              set({ data: null, loading: false });
              return;
            }

            if (!response.ok) {
              throw new Error(await response.text());
            }

            const data = await response.json();

            set({ data: data.data ?? null, loading: false });
          } catch (error: unknown) {
            set({
              error: error instanceof Error ? error.message : "Failed to load profile",
              loading: false,
            });
          }
        },
        clear: () => {
          set({ data: null, loading: false, error: null });
        },
      },
    }))
  );

  useEffect(() => {
    store.getState().actions.hydrate();
  }, [store]);

  return <UserProfileContext.Provider value={store}>{children}</UserProfileContext.Provider>;
};
