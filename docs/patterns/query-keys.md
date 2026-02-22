# Query Keys & Caching

Structure TanStack React Query cache keys hierarchically for smart invalidation and consistent data management.

## The Problem

Without proper cache key structure, mutations don't invalidate the right data:

```typescript
// ❌ Flat cache keys - no hierarchy
const queryKey = ["profile"];
const queryKey2 = ["profiles", userId];

// Hard to invalidate related queries
queryClient.invalidateQueries({ queryKey: ["profile"] });
// Did this invalidate everything? Sometimes, sometimes not.
```

**Solution:** Use hierarchical cache key factories.

## How It Works

Query keys follow a hierarchical factory pattern for type-safe cache management:

```typescript
// lib/query/query-keys.ts

/** Centralized TanStack Query cache keys */
export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
} as const;
```

This structure enables:

- Type-safe key generation
- Hierarchical cache invalidation
- Consistent naming across the app

## Query Options Factory

Define query behavior alongside cache keys:

```typescript
// queries/profile.query.ts
import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/query-keys";
import { profileService } from "@/services/profile.service";

export const getProfileQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileService.me(),
  });
```

## Usage in Components

### With useQuery Hook

```typescript
// components/sidebar/user-profile.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileQueryOptions } from "@/queries/profile.query";

export function UserProfile() {
  const { data: profile, isLoading, error } = useQuery(getProfileQueryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <p>{profile?.email}</p>
    </div>
  );
}
```

### With Context Provider

```typescript
// components/providers/user-profile-provider.tsx
"use client";

import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileQueryOptions } from "@/queries/profile.query";

export const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
  const { data: profile } = useQuery(getProfileQueryOptions());

  return (
    <UserProfileContext.Provider value={{ profile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
```

## Cache Invalidation

Invalidate cache after mutations using the same key patterns:

```typescript
// In a mutation handler
const queryClient = useQueryClient();

const { mutate: updateProfile } = useMutation({
  mutationFn: async (data) => {
    const response = await fetch("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.json();
  },
  onSuccess: () => {
    // Invalidate profile cache to refetch on next access
    queryClient.invalidateQueries({
      queryKey: queryKeys.profile.all,
    });
  },
});
```

## Extending Query Keys

When adding new data types, extend the factory:

```typescript
// lib/query/query-keys.ts
export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: () => [...queryKeys.posts.all, "list"] as const,
    detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
  },
} as const;
```

Then create corresponding query options:

```typescript
// queries/posts.query.ts
export const getPostsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.posts.list(),
    queryFn: () => postsService.list(),
  });

export const getPostDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postsService.detail(id),
  });
```

## Hierarchy Example

For a post with comments:

```typescript
export const queryKeys = {
  posts: {
    all: [\"posts\"] as const,
    list: () => [...queryKeys.posts.all, \"list\"] as const,
    detail: (id: string) => [...queryKeys.posts.all, \"detail\", id] as const,
    comments: {
      all: (postId: string) => [...queryKeys.posts.detail(postId), \"comments\"] as const,
      list: (postId: string) => [...queryKeys.posts.comments.all(postId), \"list\"] as const,
    },
  },
} as const;
```

Cache invalidation at different levels:

```typescript
// Invalidate all posts
queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });

// Invalidate specific post
queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });

// Invalidate post comments only
queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments.all(postId) });
```

## Benefits

- **Type Safety**: TypeScript ensures valid key paths
- **Consistency**: Same keys used everywhere for cache operations
- **Granular Control**: Invalidate at any hierarchy level
- **Maintainability**: Single place to define cache structure
- **Scalability**: Easy to add new query types
- **DRY Principle**: Keys generated once, used everywhere

## Related

- [API Response & Error Handling](/patterns/api-response) - Data fetching
- [Auth Guard Pattern](/patterns/auth-guard) - Protected data access
