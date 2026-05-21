import { mockBlockedUsers } from "@/mocks/data/settings/users";

export function handleSettings({ url, method }) {
  if (method === "GET" && url === "/settings/blocked-users") {
    return { data: mockBlockedUsers };
  }

  return null;
}
