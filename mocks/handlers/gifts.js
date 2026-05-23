import { mockGiftCatalog } from "@/mocks/data/gifts/catalog";

export function handleGifts({ url, method, body }) {
  if (method === "GET" && url === "/gift-categories") {
    return { data: { categories: mockGiftCatalog.categories } };
  }

  if (method === "GET" && (url === "/gifts" || url === "/gifts/catalog")) {
    return { data: mockGiftCatalog.gifts };
  }

  if (method === "POST" && url === "/gifts/send") {
    return {
      data: {
        message: "Gift sent.",
        ...body
      }
    };
  }

  return null;
}
