"use client";

import { createStore, type StoreApi } from "zustand";
import { createContext, PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Types
import type { SelectProfile } from "@/types/drizzle.types";

// Queries
import { getProfileQueryOptions } from "@/queries/profile.query";

const toErrorMessage = (err: unknown): string | null => {
  if (!err) return null;
  if (err instanceof Error) return err.message;
  return String(err);
};

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
  const queryClient = useQueryClient();

  const { data, isLoading, error: queryError, refetch } = useQuery(getProfileQueryOptions());

  const storeRef = useRef<UserProfileStore | null>(null);

  const actions = useMemo<UserProfileState["actions"]>(() => {
    return {
      hydrate: async () => {
        storeRef.current?.setState({ loading: true, error: null });
        const result = await refetch();

        if (result.error) {
          storeRef.current?.setState({
            error: toErrorMessage(result.error) ?? "Failed to load profile",
            loading: false,
          });
          return;
        }

        storeRef.current?.setState({
          data: result.data ?? null,
          loading: false,
          error: null,
        });
      },
      clear: () => {
        storeRef.current?.setState({ data: null, loading: false, error: null });
        queryClient.removeQueries({ queryKey: getProfileQueryOptions().queryKey });
      },
    };
  }, [queryClient, refetch]);

  if (!storeRef.current) {
    storeRef.current = createStore<UserProfileState>(() => ({
      loading: isLoading,
      error: toErrorMessage(queryError),
      data: data ?? null,
      actions,
    }));
  }

  const store = storeRef.current;

  useEffect(() => {
    store.setState({
      loading: isLoading,
      error: toErrorMessage(queryError),
      data: data ?? null,
    });
  }, [store, data, isLoading, queryError]);

  return <UserProfileContext.Provider value={store}>{children}</UserProfileContext.Provider>;
};
