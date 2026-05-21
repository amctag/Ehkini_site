/**
 * Auth feature shared shapes (JSDoc typedefs for JS projects).
 */

/** @typedef {{id?: string|number, first_name?: string, last_name?: string, email?: string}} AuthUser */

/** @typedef {{
 *   user: AuthUser | null,
 *   isAuthenticated: boolean,
 *   status: "idle" | "loading" | "succeeded" | "failed",
 *   error: string | null
 * }} AuthState */
