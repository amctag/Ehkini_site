import { mockCurrentUser } from "@/mocks/data/auth/user";
import { mockCountries } from "@/mocks/data/auth/countries";

const DEMO_PASSWORD = "demo";

export function handleAuth({ url, method, body }) {
  if ((url === "/me" || url === "/auth/me") && method === "GET") {
    return { data: mockCurrentUser };
  }

  if ((url === "/countries" || url === "/auth/countries") && method === "GET") {
    return { data: mockCountries };
  }

  if ((url === "/login" || url === "/auth/login") && method === "POST") {
    const password = body?.password;
    if (password === DEMO_PASSWORD) {
      return { data: { ok: true } };
    }
    return {
      error: {
        status: 401,
        data: { message: "Invalid credentials" }
      }
    };
  }

  if ((url === "/register" || url === "/auth/register") && method === "POST") {
    return { data: { ok: true, userId: "user-new" } };
  }

  if ((url === "/logout" || url === "/auth/logout") && method === "POST") {
    return { data: { ok: true } };
  }

  return null;
}
