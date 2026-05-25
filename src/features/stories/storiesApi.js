import { api } from "@/src/services/baseApi";

function normalizeImageUrl(value) {
  const image = String(value ?? "").trim();
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }

  if (image.startsWith("//")) {
    return `https:${image}`;
  }

  if (/^[\w.-]+\.[a-z]{2,}\/.+/i.test(image)) {
    return `https://${image}`;
  }

  return `/${image.replace(/^\/+/, "")}`;
}

function pickImage(...values) {
  for (const value of values) {
    const image = normalizeImageUrl(value);
    if (image) return image;
  }
  return "";
}

function buildCreateStoryBody(input) {
  const formData = new FormData();
  const mediaFile = input?.file;
  const rawType = String(input?.type ?? "").trim().toLowerCase();
  const hasFileCtor = typeof File !== "undefined";
  const hasBlobCtor = typeof Blob !== "undefined";
  const isFile = hasFileCtor && mediaFile instanceof File;
  const isBlob = hasBlobCtor && mediaFile instanceof Blob;

  if (isFile || isBlob) {
    formData.append("media", mediaFile);
  }

  let resolvedType = rawType;
  if (!resolvedType && isFile && typeof mediaFile.type === "string") {
    if (mediaFile.type.startsWith("video/")) resolvedType = "video";
    else if (mediaFile.type.startsWith("image/")) resolvedType = "image";
  }
  if (!resolvedType) resolvedType = "image";
  formData.append("type", resolvedType);

  return formData;
}

function mapStoryViewersResponse(response) {
  const rows =
    (Array.isArray(response) && response) ||
    (Array.isArray(response?.data) && response.data) ||
    (Array.isArray(response?.views) && response.views) ||
    (Array.isArray(response?.data?.views) && response.data.views) ||
    (Array.isArray(response?.response) && response.response) ||
    [];

  return rows.map((row, index) => {
    const user = row?.user ?? row?.viewer ?? row?.viewer_user ?? row?.profile ?? row;
    const firstLastName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
    const name = String(user?.full_name ?? firstLastName ?? user?.name ?? "").trim() || `User #${index + 1}`;

    return {
      id: row?.id ?? user?.id ?? `viewer-${index}`,
      name,
      avatar: pickImage(
        user?.profile_image_url,
        user?.profile_image,
        user?.avatar_url,
        user?.avatar,
        user?.image,
        row?.profile_image_url,
        row?.profile_image
      ),
      viewedAt: row?.viewed_at ?? row?.created_at ?? row?.updated_at ?? null
    };
  });
}

export const storiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStory: builder.mutation({
      query: (payload) => ({
        url: "stories",
        method: "POST",
        body: buildCreateStoryBody(payload)
      }),
      invalidatesTags: ["Discover"]
    }),
    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `stories/${storyId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Discover"]
    }),
    getStoryViews: builder.query({
      query: (storyId) => `stories/${storyId}/views`,
      transformResponse: mapStoryViewersResponse,
      providesTags: ["Discover"]
    })
  })
});

export const { useCreateStoryMutation, useDeleteStoryMutation, useGetStoryViewsQuery } = storiesApi;
