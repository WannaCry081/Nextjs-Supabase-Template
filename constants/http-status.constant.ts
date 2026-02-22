/** HTTP status code constants */
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_NO_CONTENT = 204;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_UNPROCESSABLE_ENTITY = 422;
export const HTTP_TOO_MANY_REQUESTS = 429;
export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const HTTP_BAD_GATEWAY = 502;
export const HTTP_SERVICE_UNAVAILABLE = 503;

/** Maps status codes to status text */
export const STATUS_TEXT_MAP: Record<number, string> = {
  [HTTP_OK]: "OK",
  [HTTP_CREATED]: "Created",
  [HTTP_NO_CONTENT]: "No Content",
  [HTTP_BAD_REQUEST]: "Bad Request",
  [HTTP_UNAUTHORIZED]: "Unauthorized",
  [HTTP_FORBIDDEN]: "Forbidden",
  [HTTP_NOT_FOUND]: "Not Found",
  [HTTP_UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
  [HTTP_TOO_MANY_REQUESTS]: "Too Many Requests",
  [HTTP_INTERNAL_SERVER_ERROR]: "Internal Server Error",
  [HTTP_BAD_GATEWAY]: "Bad Gateway",
  [HTTP_SERVICE_UNAVAILABLE]: "Service Unavailable",
};

/** @returns Status text for given status code */
export function getStatusText(status: number): string {
  return STATUS_TEXT_MAP[status] || "Unknown Status";
}

/** Grouped status codes for easy access */
export const HttpStatus = {
  OK: HTTP_OK,
  CREATED: HTTP_CREATED,
  NO_CONTENT: HTTP_NO_CONTENT,
  BAD_REQUEST: HTTP_BAD_REQUEST,
  UNAUTHORIZED: HTTP_UNAUTHORIZED,
  FORBIDDEN: HTTP_FORBIDDEN,
  NOT_FOUND: HTTP_NOT_FOUND,
  UNPROCESSABLE_ENTITY: HTTP_UNPROCESSABLE_ENTITY,
  TOO_MANY_REQUESTS: HTTP_TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: HTTP_INTERNAL_SERVER_ERROR,
  BAD_GATEWAY: HTTP_BAD_GATEWAY,
  SERVICE_UNAVAILABLE: HTTP_SERVICE_UNAVAILABLE,
} as const;
