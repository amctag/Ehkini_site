import { mockCurrentUser } from "@/mocks/data/auth/user";

const DEMO_PASSWORD = "demo";

export function handleAuth({ url, method, body }) {
  if (url === "/auth/me" && method === "GET") {
    return { data: mockCurrentUser };
  }

  if (url === "/auth/login" && method === "POST") {
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

  if (url === "/auth/register" && method === "POST") {
    return { data: { ok: true, userId: "user-new" } };
  }

  if (url === "/auth/logout" && method === "POST") {
    return { data: { ok: true } };
  }

  return null;
}
