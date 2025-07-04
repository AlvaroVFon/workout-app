export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export enum StatusMessage {
  OK = 'Success',
  CREATED = 'Created',
  NO_CONTENT = 'No Content',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Access Denied',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}
