import { mockBlockedUsers } from "@/mocks/data/settings/users";

export function handleUsers({ url, method }) {
  if ((url === "/users/blocked" || url === "users/blocked") && method === "GET") {
    return { data: mockBlockedUsers };
  }

  if ((url === "/users/block" || url === "users/block") && method === "POST") {
    return {
      data: {
        message: "User blocked."
      }
    };
  }

  if ((url === "/users/unblock" || url === "users/unblock") && method === "POST") {
    return {
      data: {
        message: "User unblocked."
      }
    };
  }

  if ((url === "/users/report" || url === "users/report") && method === "POST") {
    return {
      data: {
        message: "User reported."
      }
    };
  }

  return null;
}
