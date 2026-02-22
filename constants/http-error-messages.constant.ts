/** Authentication error messages */
export const AUTH_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  LOGIN_FAILED: "Login failed",
  LOGIN_FAILED_DESC: "Please check your credentials and try again.",
  REGISTER_FAILED: "Registration failed",
  REGISTER_FAILED_DESC: "Please check your information and try again.",
  OAUTH_FAILED: (provider: string) => `${provider} login failed`,
  OAUTH_FAILED_DESC: "An error occurred during OAuth login. Please try again.",
} as const;

/** Authentication success messages */
export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGIN_SUCCESS_DESC: "Redirecting to dashboard...",
  REGISTER_SUCCESS: "Registration successful",
  REGISTER_SUCCESS_DESC: "Please check your email to verify your account.",
} as const;

/** API error messages */
export const API_ERRORS = {
  GENERIC: "Something went wrong",
  GENERIC_DESC: "There was an issue processing your request. Please try again later.",
  MISSING_FIELDS: "Missing required fields",
} as const;

/** Email and service error messages */
export const EMAIL_ERRORS = {
  NOT_CONFIGURED: "Email service is not configured",
  SEND_FAILED: "Failed to send email",
} as const;

/** Grouped error messages for easy access */
export const HttpErrorMessages = {
  auth: AUTH_ERRORS,
  authSuccess: AUTH_SUCCESS,
  api: API_ERRORS,
  email: EMAIL_ERRORS,
} as const;
