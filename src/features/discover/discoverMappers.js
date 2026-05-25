function interestLabel(interest) {
  if (typeof interest === "string") return interest;
  return interest?.name ?? "";
}

const defaultStoryImage =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=220&q=85";

function pickImage(...values) {
  const image = values.find((value) => typeof value === "string" && value.trim());
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return "";
}

function pickStoryOwner(story) {
  return story?.user ?? story?.owner ?? story?.author ?? {};
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

  const image =
    pickImage(
      story?.image,
      story?.image_url,
      story?.story_image_url,
      story?.thumbnail_url,
      story?.media_url,
      story?.media?.url,
      owner?.profile_image_url,
      owner?.avatar_url,
      owner?.avatar,
      owner?.image
    ) || defaultStoryImage;

  return {
    id: story?.id ?? story?.story_id ?? owner?.id ?? name,
    name,
    image
  };
}

/** Map AMC v2 user row to Discover ProfileCard shape */
export function mapUserToDiscoverCard(user) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "User";
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

export function mapStoriesResponse(response) {
  const rows = Array.isArray(response) ? response : (response?.data ?? response?.stories ?? []);
  return rows.map(mapStoryToDiscoverCard);
}
