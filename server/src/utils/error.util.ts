import { isProduction } from '.';

// Database validation exception
export function isValidationError(err: Error | unknown) {
  return (
    err instanceof Error &&
    (err.name === 'ValidationException' || err.name === 'ValidationError')
  );
}

export function getErrorMessage(err: unknown, defaultMessage?: string) {
  if (!isProduction() && err instanceof Error)
    return `Error{name: ${err.name}, message: ${err.message}}`;

  return `Error{name: Unkown, message: ${
    defaultMessage || 'Something went wrong'
  }}`;
}
