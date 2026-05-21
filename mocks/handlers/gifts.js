import { mockGiftCatalog } from "@/mocks/data/gifts/catalog";

export function handleGifts({ url, method }) {
  if (method === "GET" && url === "/gifts/catalog") {
    return { data: mockGiftCatalog };
  }

  return null;
}
