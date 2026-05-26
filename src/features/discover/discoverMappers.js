function interestLabel(interest) {
  if (typeof interest === "string") return interest;
  return interest?.name ?? "";
}

const defaultStoryImage =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=220&q=85";

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
    const normalized = normalizeImageUrl(value);
    if (normalized) return normalized;
  }
  return "";
}

function pickStoryOwner(story) {
  return story?.user ?? story?.owner ?? story?.author ?? story?.profile ?? {};
}

export function mapStoryToDiscoverCard(story) {
  const owner = pickStoryOwner(story);
  const firstLastName = [owner?.first_name, owner?.last_name].filter(Boolean).join(" ").trim();
  const name =
    String(
      story?.name ??
        story?.full_name ??
        owner?.full_name ??
        firstLastName ??
        owner?.name ??
        "User"
    ).trim() || "User";

  // Prefer story media fields first. Some APIs use `image` for owner/profile photo.
  const storyImage =
    pickImage(
      story?.story_image_url,
      story?.thumbnail_url,
      story?.media_url,
      story?.media?.url,
      story?.media?.image_url,
      story?.media?.image,
      story?.media?.path,
      story?.file_url,
      story?.file?.url,
      story?.url,
      story?.image_url,
      story?.image,
      story?.photo,
      story?.photo_url,
      story?.attachment_url,
      story?.attachment?.url,
      story?.content_url,
      story?.content?.url,
      owner?.story_image_url,
      owner?.story?.url,
      owner?.story?.image_url,
      owner?.story?.image,
      owner?.media_url,
      owner?.media?.url,
      owner?.image_url,
      owner?.profile_image_url,
      owner?.avatar_url,
      owner?.avatar,
      owner?.image
    ) || defaultStoryImage;

  const avatar =
    pickImage(
      owner?.profile_image_url,
      owner?.avatar_url,
      owner?.avatar,
      owner?.image,
      owner?.image_url,
      story?.user_image_url,
      story?.user_avatar_url
    ) || storyImage;

  return {
    id: story?.id ?? story?.story_id ?? owner?.id ?? name,
    userId: owner?.id ?? story?.user_id ?? null,
    createdAt: story?.created_at ?? story?.createdAt ?? null,
    expiresAt: story?.expires_at ?? story?.expiresAt ?? null,
    isMine: Boolean(story?.is_mine ?? story?.isMine),
    viewCount: Number.isFinite(Number(story?.view_count)) ? Number(story.view_count) : 0,
    name,
    image: storyImage,
    avatar
  };
}

/** Map AMC v2 user row to Discover ProfileCard shape */
export function mapUserToDiscoverCard(user) {
  const firstLastName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  const name = firstLastName || String(user.full_name ?? user.name ?? "User").trim() || "User";
  const interestNames = (user.interests ?? []).map(interestLabel).filter(Boolean);
  const tags =
    interestNames.length > 2
      ? [...interestNames.slice(0, 2), `+${interestNames.length - 2}`]
      : interestNames;

  return {
    ...user,
    id: user.id,
    name,
    full_name: user.full_name ?? name,
    age: user.age ?? "",
    distance: user.location ?? "",
    bio: user.about_me ?? "",
    about: user.about_me ?? "",
    tags,
    image: user.profile_image_url || null,
    avatar: user.profile_image_url || null,
    interests: user.interests ?? []
  };
}

export function mapUsersResponse(response) {
  const rows = Array.isArray(response) ? response : (response?.data ?? []);
  return rows.map(mapUserToDiscoverCard);
}

function flattenStoriesRows(rows) {
  const flattened = [];

  rows.forEach((row) => {
    const groupedStories = Array.isArray(row?.stories) ? row.stories : null;
    if (groupedStories?.length) {
      groupedStories.forEach((story) => {
        flattened.push({
          ...story,
          user: story?.user ?? row?.user ?? row?.owner ?? row?.author ?? row?.profile ?? null
        });
      });
      return;
    }

    flattened.push(row);
  });

  return flattened;
}

export function mapStoriesResponse(response) {
  const rows =
    (Array.isArray(response) && response) ||
    (Array.isArray(response?.data) && response.data) ||
    (Array.isArray(response?.stories) && response.stories) ||
    (Array.isArray(response?.response) && response.response) ||
    (Array.isArray(response?.results) && response.results) ||
    (Array.isArray(response?.data?.data) && response.data.data) ||
    (Array.isArray(response?.data?.stories) && response.data.stories) ||
    (Array.isArray(response?.data?.response) && response.data.response) ||
    (Array.isArray(response?.payload?.stories) && response.payload.stories) ||
    [];

  return flattenStoriesRows(rows).map(mapStoryToDiscoverCard);
}
