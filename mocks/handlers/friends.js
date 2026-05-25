import { mockFriendsList } from "@/mocks/data/friends/list";
import { mockFriendSuggestions } from "@/mocks/data/friends/suggestions";

export function handleFriends({ url, method }) {
  if ((url === "/friends" || url === "friends") && method === "GET") {
    return { data: mockFriendsList };
  }

  if (
    (url === "/friends/suggested" ||
      url === "friends/suggested" ||
      url === "/friends/suggestions" ||
      url === "friends/suggestions") &&
    method === "GET"
  ) {
    return { data: mockFriendSuggestions };
  }

  if ((url === "/friends/search" || url === "friends/search") && method === "GET") {
    return { data: mockFriendsList };
  }

  if ((url === "/friends/request" || url === "friends/request") && method === "POST") {
    return {
      data: {
        message: "Friend request sent.",
        friendship_id: 1234
      }
    };
  }

  if ((url === "/friends/requests/cancel" || url === "friends/requests/cancel") && method === "POST") {
    return {
      data: {
        message: "Friend request canceled."
      }
    };
  }

  if ((url === "/friends/remove" || url === "friends/remove") && method === "POST") {
    return {
      data: {
        message: "Friend removed."
      }
    };
  }

  return null;
}
