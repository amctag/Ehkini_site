import { api } from "@/src/services/baseApi";

function buildCreateStoryBody(input) {
  const formData = new FormData();
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
