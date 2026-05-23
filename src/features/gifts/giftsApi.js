import { api } from "@/src/services/baseApi";

function asArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.gifts)) return response.gifts;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.gifts)) return response.data.gifts;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  return [];
}

function asCategoryArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.categories)) return response.categories;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.categories)) return response.data.categories;
  return [];
}

function toCategory(value) {
  if (value && typeof value === "object") {
    return toCategory(value?.slug ?? value?.name ?? value?.id);
  }
  const text = String(value ?? "").trim();
  if (!text) return "all";
  return text.toLowerCase().replace(/\s+/g, "_");
}

function normalizeGiftRow(row, index) {
  const id = row?.gift_id ?? row?.id ?? `gift-${index}`;
  const name = String(row?.name ?? row?.title ?? `Gift ${index + 1}`).trim();
  const description = String(row?.description ?? row?.subtitle ?? "").trim();
  const icon = String(row?.icon ?? row?.emoji ?? row?.gift_icon ?? "🎁").trim() || "🎁";
  const category = toCategory(row?.category ?? row?.type ?? row?.group);

  return {
    ...row,
    id,
    gift_id: id,
    name,
    description,
    icon,
    category
  };
}

function mapGiftCatalog(response) {
  return asArray(response).map(normalizeGiftRow);
}

function mapGiftCategories(response) {
  return asCategoryArray(response).map((row, index) => {
    const id = row?.id ?? `category-${index}`;
    const slug = toCategory(row?.slug ?? row?.name ?? row?.id);
    const name = String(row?.name ?? row?.title ?? slug).trim() || slug;

    return {
      ...row,
      id,
      slug,
      name
    };
  });
}

function pickId(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return /^\d+$/.test(text) ? Number(text) : text;
}

function buildSendGiftBody(input) {
  const giftId =
    pickId(
      input?.gift?.gift_id ??
      input?.gift?.id ??
      input?.gift_id ??
      input?.id
    );
  const userId =
    pickId(
      input?.recipient?.user_id ??
      input?.recipient?.id ??
      input?.user_id ??
      input?.recipient_id ??
      input?.receiver_id
    );
  const message = String(input?.message ?? "").trim();

  const body = {};
  if (giftId !== null) body.gift_id = giftId;
  if (userId !== null) body.user_id = userId;
  if (message) body.message = message;

  return body;
}

export const giftsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGiftCategories: builder.query({
      query: () => "gift-categories",
      transformResponse: mapGiftCategories,
      providesTags: ["Gifts"]
    }),
    getGifts: builder.query({
      query: () => "gifts",
      transformResponse: mapGiftCatalog,
      providesTags: ["Gifts"]
    }),
    sendGift: builder.mutation({
      query: (payload) => ({
        url: "gifts/send",
        method: "POST",
        body: buildSendGiftBody(payload)
      }),
      invalidatesTags: ["Gifts"]
    })
  })
});

export const {
  useGetGiftCategoriesQuery,
  useGetGiftsQuery,
  useSendGiftMutation
} = giftsApi;
