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

function rowsFromPostsResponse(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.posts)) return response.posts;
  if (Array.isArray(response?.result)) return response.result;
  return [];
}

function mapPostResponseRow(row, index) {
  const imageField = row?.image ?? row?.media ?? row?.photo ?? row?.attachment ?? null;
  const image =
    (typeof imageField === "string" && imageField.trim()) ||
    (typeof imageField?.url === "string" && imageField.url.trim()) ||
    (typeof imageField?.path === "string" && imageField.path.trim()) ||
    (typeof row?.image_url === "string" && row.image_url.trim()) ||
    (typeof row?.post_image === "string" && row.post_image.trim()) ||
    (typeof row?.post_image_url === "string" && row.post_image_url.trim()) ||
    (typeof row?.media_url === "string" && row.media_url.trim()) ||
    (typeof row?.photo_url === "string" && row.photo_url.trim()) ||
    "";

  const caption =
    (typeof row?.caption === "string" && row.caption.trim()) ||
    (typeof row?.content === "string" && row.content.trim()) ||
    (typeof row?.description === "string" && row.description.trim()) ||
    (typeof row?.body === "string" && row.body.trim()) ||
    (typeof row?.text === "string" && row.text.trim()) ||
    "";

  return {
    id: String(row?.id ?? row?.post_id ?? row?.postId ?? `post-${index + 1}`),
    caption,
    image,
    createdAt: row?.created_at ?? row?.createdAt ?? row?.date ?? row?.time ?? ""
  };
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserPosts: builder.query({
      query: (userId) => `users/${String(userId ?? "").trim()}/posts`,
      transformResponse: (response) => rowsFromPostsResponse(response).map(mapPostResponseRow),
      providesTags: (result, _error, userId) => [
        { type: "Posts", id: `USER-${String(userId ?? "").trim()}` },
        ...(result ?? []).map((post) => ({ type: "Posts", id: post.id }))
      ]
    }),
    createPost: builder.mutation({
      query: (payload) => ({
        url: "posts",
        method: "POST",
        body: buildCreatePostBody(payload)
      }),
      invalidatesTags: ["Posts"]
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${String(postId ?? "").trim()}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, postId) => [{ type: "Posts", id: String(postId ?? "").trim() }]
    })
  })
});

export const { useCreatePostMutation, useDeletePostMutation, useGetUserPostsQuery } = postsApi;
