export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_NO_CONTENT = 204;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

export const STATUS_TEXT_MAP: Record<number, string> = {
  [HTTP_OK]: "OK",
  [HTTP_CREATED]: "Created",
  [HTTP_NO_CONTENT]: "No Content",
  [HTTP_BAD_REQUEST]: "Bad Request",
  [HTTP_UNAUTHORIZED]: "Unauthorized",
  [HTTP_FORBIDDEN]: "Forbidden",
  [HTTP_NOT_FOUND]: "Not Found",
  [HTTP_INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export const HttpStatus = {
  OK: HTTP_OK,
  CREATED: HTTP_CREATED,
  NO_CONTENT: HTTP_NO_CONTENT,
  BAD_REQUEST: HTTP_BAD_REQUEST,
  UNAUTHORIZED: HTTP_UNAUTHORIZED,
  FORBIDDEN: HTTP_FORBIDDEN,
  NOT_FOUND: HTTP_NOT_FOUND,
  INTERNAL_SERVER_ERROR: HTTP_INTERNAL_SERVER_ERROR,
};

export function getStatusText(status: number): string {
  return STATUS_TEXT_MAP[status] || "";
}
