import { isProduction } from '.';

// Database validation exception
export function isValidationError(err: Error | unknown) {
  return (
    err instanceof Error &&
    (err.name === 'ValidationException' || err.name === 'ValidationError')
  );
}

export function getErrorMessage(err: unknown, defaultMessage?: string) {
  if (err instanceof Error) {
    if (isProduction())
      return `Error{name: ${err.name}, message: ${
        defaultMessage ?? 'Something went wrong'
      }}`;
    return `Error{name: ${err.name}, message: ${err.message}, stack: ${err.stack}}`;
  }

  return `Error{name: Unkown, message: ${
    defaultMessage || 'Something went wrong'
  }}`;
}
