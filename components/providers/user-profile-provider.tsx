"use client";

import { createStore, type StoreApi } from "zustand";
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
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

  const [store] = useState<UserProfileStore>(() =>
    createStore<UserProfileState>(() => ({
      loading: false,
      error: null,
      data: null,
      actions: {
        hydrate: async () => undefined,
        clear: () => undefined,
      },
    }))
  );

  const actions = useMemo<UserProfileState["actions"]>(() => {
    return {
      hydrate: async () => {
        store.setState({ loading: true, error: null });
        const result = await refetch();

        if (result.error) {
          store.setState({
            error: toErrorMessage(result.error) ?? "Failed to load profile",
            loading: false,
          });
          return;
        }

        store.setState({
          data: result.data ?? null,
          loading: false,
          error: null,
        });
      },
      clear: () => {
        store.setState({ data: null, loading: false, error: null });
        queryClient.removeQueries({ queryKey: getProfileQueryOptions().queryKey });
      },
    };
  }, [queryClient, refetch, store]);

  useEffect(() => {
    store.setState({ actions });
  }, [store, actions]);

  useEffect(() => {
    store.setState({
      loading: isLoading,
      error: toErrorMessage(queryError),
      data: data ?? null,
    });
  }, [store, data, isLoading, queryError]);

  return <UserProfileContext.Provider value={store}>{children}</UserProfileContext.Provider>;
};
