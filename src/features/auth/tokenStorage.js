export const AUTH_TOKEN_KEY = "ehkini_auth_token";
const AUTH_TOKEN_COOKIE_PATH = "path=/";
const AUTH_TOKEN_COOKIE_SAME_SITE = "samesite=lax";
const AUTH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function readAuthCookie() {
  if (typeof document === "undefined") return null;

  const rawCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${AUTH_TOKEN_KEY}=`));

  if (!rawCookie) return null;

  const [, rawValue = ""] = rawCookie.split("=");
  const token = decodeURIComponent(rawValue).trim();
  return token || null;
}

function writeAuthCookie(token) {
  if (typeof document === "undefined") return;

  if (token) {
    const encodedToken = encodeURIComponent(String(token));
    document.cookie = `${AUTH_TOKEN_KEY}=${encodedToken}; ${AUTH_TOKEN_COOKIE_PATH}; max-age=${AUTH_TOKEN_COOKIE_MAX_AGE}; ${AUTH_TOKEN_COOKIE_SAME_SITE}`;
    return;
  }

  document.cookie = `${AUTH_TOKEN_KEY}=; ${AUTH_TOKEN_COOKIE_PATH}; max-age=0; ${AUTH_TOKEN_COOKIE_SAME_SITE}`;
}

export function getStoredAuthToken() {
  return readAuthCookie();
}

export function storeAuthToken(token) {
  if (token) {
    writeAuthCookie(String(token));
    return;
  }

  writeAuthCookie(null);
}

export function clearStoredAuthToken() {
  storeAuthToken(null);
}
