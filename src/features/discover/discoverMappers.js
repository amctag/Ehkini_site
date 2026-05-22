function interestLabel(interest) {
  if (typeof interest === "string") return interest;
  return interest?.name ?? "";
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
