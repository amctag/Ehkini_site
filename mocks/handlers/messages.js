import { mockContacts } from "@/mocks/data/messages/contacts";
import { mockThreadsByContactId } from "@/mocks/data/messages/threads";

export function handleMessages({ url, method }) {
  if (method !== "GET") return null;

  if (url === "/messages/contacts") {
    return { data: mockContacts };
  }

  const threadMatch = url.match(/^\/messages\/threads\/([^/]+)$/);
  if (threadMatch) {
    const contactId = threadMatch[1];
    const thread = mockThreadsByContactId[contactId];
    if (!thread) {
      return {
        error: { status: 404, data: { message: "Thread not found" } }
      };
    }
    return { data: thread };
  }

  return null;
}
