import { api } from "@/src/services/baseApi";

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

export const storiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStory: builder.mutation({
      query: (payload) => ({
        url: "stories",
        method: "POST",
        body: buildCreateStoryBody(payload)
      }),
      invalidatesTags: ["Discover"]
    })
  })
});

export const { useCreateStoryMutation } = storiesApi;
