/** Public routes */
export const PUBLIC_ROUTES = {
  HOME: "/",
} as const;

/** Authentication routes */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

/** Protected routes requiring authentication */
export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
} as const;

/** API endpoints */
export const API_ROUTES = {
  USERS_ME: "/api/users/me",
  SEND_EMAIL: "/api/send",
  HEALTH: "/api/health",
} as const;

/** Middleware route patterns with wildcards (auto-generated from PROTECTED_ROUTES) */
export const PROTECTED_ROUTE_PATTERNS: string[] = Object.values(PROTECTED_ROUTES).map(
  (route) => `${route}/*`
);

/** Default authenticated user redirect */
export const DEFAULT_AUTH_REDIRECT = PROTECTED_ROUTES.DASHBOARD;

/** Default unauthenticated user redirect */
export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN;
