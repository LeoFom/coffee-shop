import { toast } from "sonner";

type NotifyOptions = {
  successMessage?: string;
};

export function handleRequestNotification(
  response: Response,
  result: any,
  options?: NotifyOptions
) {
  // SUCCESS
  if (response.ok) {
    toast.success(
      options?.successMessage || result?.message || "Success"
    );

    return;
  }

  // VALIDATION ERRORS
  if (response.status === 400) {
    const fieldErrors = result?.fields;

    if (fieldErrors) {
      const firstFieldError = Object.values(fieldErrors)[0];

      if (Array.isArray(firstFieldError)) {
        toast.warning(
          `${firstFieldError[0]}\n
          `
        );

        return;
      }
    }

    toast.warning(
      result?.message || "Validation failed"
    );

    return;
  }

  // UNAUTHORIZED
  if (response.status === 401) {
    toast.error(
      result?.message || "Unauthorized"
    );

    return;
  }

  // FORBIDDEN
  if (response.status === 403) {
    toast.error(
      result?.message || "Access denied"
    );

    return;
  }

  // NOT FOUND
  if (response.status === 404) {
    toast.warning(
      result?.message || "Resource not found"
    );

    return;
  }

  // SERVER ERROR
  if (response.status >= 500) {
    toast.error(
      result?.message || "Server error"
    );

    return;
  }

  // FALLBACK
  toast.info(
    result?.message || "Request completed"
  );
}
