import { mockDiscoverPeople } from "@/mocks/data/discover/people";
import { mockDiscoverStories } from "@/mocks/data/discover/stories";

export function handleDiscover({ url, method }) {
  if (method !== "GET") return null;

  if (url === "/discover/people") {
    return { data: mockDiscoverPeople };
  }

  if (url === "/discover/stories") {
    return { data: mockDiscoverStories };
  }

  return null;
}
