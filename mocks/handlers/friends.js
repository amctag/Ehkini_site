import { mockFriendsList } from "@/mocks/data/friends/list";
import { mockFriendSuggestions } from "@/mocks/data/friends/suggestions";

export function handleFriends({ url, method }) {
  if (url === "/friends" && method === "GET") {
    return { data: mockFriendsList };
  }

  if (url === "/friends/suggestions" && method === "GET") {
    return { data: mockFriendSuggestions };
  }

  if (url === "/friends/request" && method === "POST") {
    return {
      data: {
        message: "Friend request sent.",
        friendship_id: 1234
      }
    };
  }

  if (url === "/friends/requests/cancel" && method === "POST") {
    return {
      data: {
        message: "Friend request canceled."
      }
    };
  }

  return null;
}
