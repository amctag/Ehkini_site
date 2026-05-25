import { parseRequestArgs, pathOnly } from "./utils";
import { handleAuth } from "./auth";
import { handleDiscover } from "./discover";
import { handleMessages } from "./messages";
import { handleProfiles } from "./profiles";
import { handleFriends } from "./friends";
import { handleGifts } from "./gifts";
import { handleWallet } from "./wallet";
import { handleSettings } from "./settings";
import { handleUsers } from "./users";
import { handlePosts } from "./posts";

const MOCK_DELAY_MS = 200;

const handlers = [
  handleAuth,
  handleDiscover,
  handleMessages,
  handleProfiles,
  handleFriends,
  handleGifts,
  handleWallet,
  handleSettings,
  handleUsers,
  handlePosts
];

/**
 * Resolves an RTK Query request against local mock data.
 * @param {string | { url: string, method?: string, body?: unknown }} args
 */
export async function getMockResponse(args) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const { url, method, body } = parseRequestArgs(args);
  const path = pathOnly(url);
  const request = { url: path, method, body };

  for (const handler of handlers) {
    const result = handler(request);
    if (result) return result;
  }

  return {
    error: {
      status: 404,
      data: { message: `No mock handler for ${method} ${path}` }
    }
  };
}
