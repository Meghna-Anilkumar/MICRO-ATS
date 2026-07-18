import { IAppError } from "../interfaces/IAppError";

export function isAppError(
  error: unknown
): error is IAppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}