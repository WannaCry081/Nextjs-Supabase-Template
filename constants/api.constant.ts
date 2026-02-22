// Default API request timeout (30 seconds)
export const API_TIMEOUT = 30000;

// Default API headers
export const API_HEADERS = {
  "Content-Type": "application/json",
} as const;

// API retry configuration
export const API_RETRY = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
} as const;

// TanStack Query configuration
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  retry: 1,
  refetchOnWindowFocus: false,
} as const;
