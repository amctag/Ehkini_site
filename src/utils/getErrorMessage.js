export function getErrorMessage(error, fallback = "Something went wrong") {
  const candidates = [
    error?.data?.message,
    error?.data?.error,
    error?.error,
    error?.message
  ];

  const validationError = Object.values(error?.data?.errors ?? {})
    .flat()
    .find((value) => typeof value === "string" && value.trim());

  if (validationError) return validationError.trim();

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  return fallback;
}
