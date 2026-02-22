// Public routes that do not require authentication
export const PUBLIC_ROUTES = {
  HOME: "/",
} as const;

// Authentication-related routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
} as const;

// API routes
export const API_ROUTES = {
  USERS_ME: "/api/users/me",
  SEND_EMAIL: "/api/send",
  HEALTH: "/api/health",
} as const;

/**
 * Route patterns for middleware matching
 * Automatically generated from PROTECTED_ROUTES with wildcard suffixes
 * This ensures patterns stay in sync with route definitions
 */
export const PROTECTED_ROUTE_PATTERNS: string[] = Object.values(PROTECTED_ROUTES).map(
  (route) => `${route}/*`
);

// Default redirect when accessing protected route without authentication
export const DEFAULT_AUTH_REDIRECT = PROTECTED_ROUTES.DASHBOARD;

// Default redirect when accessing protected route without authentication
export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN;
