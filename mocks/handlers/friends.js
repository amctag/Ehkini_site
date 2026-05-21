import { mockFriendsList } from "@/mocks/data/friends/list";
import { mockFriendSuggestions } from "@/mocks/data/friends/suggestions";

export function handleFriends({ url, method }) {
  if (method !== "GET") return null;

  if (url === "/friends") {
    return { data: mockFriendsList };
  }

  if (url === "/friends/suggestions") {
    return { data: mockFriendSuggestions };
  }

  return null;
}
