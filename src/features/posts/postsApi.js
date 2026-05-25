import { api } from "@/src/services/baseApi";

function buildCreatePostBody(input) {
  const formData = new FormData();
  const caption = String(input?.caption ?? "").trim();
  if (caption) {
    formData.append("caption", caption);
  }

  const mediaFile = input?.file;
  const hasFileCtor = typeof File !== "undefined";
  const hasBlobCtor = typeof Blob !== "undefined";
  const isFile = hasFileCtor && mediaFile instanceof File;
  const isBlob = hasBlobCtor && mediaFile instanceof Blob;

  if (isFile || isBlob) {
    formData.append("image", mediaFile);
  }

  return formData;
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (payload) => ({
        url: "posts",
        method: "POST",
        body: buildCreatePostBody(payload)
      })
    })
  })
});

export const { useCreatePostMutation } = postsApi;
