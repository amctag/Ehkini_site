const fallbackFriendImage =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80";

function asArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.friends)) return response.friends;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.friends)) return response.data.friends;
  return [];
}

function pickFriendUser(row) {
  return (
    row?.friend ??
    row?.user ??
    row?.friend_user ??
    row?.profile ??
    row?.receiver ??
    row?.sender ??
    row
  );
}

function pickName(user) {
  const fullName = String(user?.full_name ?? "").trim();
  if (fullName) return fullName;

  const firstLastName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  if (firstLastName) return firstLastName;

  return String(user?.name ?? "User").trim() || "User";
}

function pickImage(user) {
  const image =
    user?.profile_image_url ??
    user?.profile_image ??
    user?.avatar_url ??
    user?.avatar ??
    "";

  if (typeof image === "string" && (image.startsWith("http") || image.startsWith("/"))) {
    return image;
  }

  return fallbackFriendImage;
}

function pickMutualCount(row, user) {
  const count =
    row?.mutual_friends_count ??
    row?.mutual_count ??
    row?.mutuals_count ??
    user?.mutual_friends_count ??
    user?.mutual_count ??
    user?.mutuals_count;

  return Number.isFinite(Number(count)) ? Number(count) : null;
}

export function mapFriendRow(row, index = 0) {
  const user = pickFriendUser(row);
  const mutualCount = pickMutualCount(row, user);
  const connectedAt = row?.created_at ?? row?.friendship_created_at ?? row?.pivot?.created_at ?? "";
  const isOnline = Boolean(user?.is_online ?? user?.online ?? row?.is_online ?? row?.online);
  const id = row?.friendship_id ?? row?.id ?? user?.id ?? `friend-${index}`;

  return {
    id,
    userId: user?.id ?? row?.friend_id ?? row?.user_id,
    name: pickName(user),
    location: user?.location ?? row?.location ?? "",
    status: row?.status ?? user?.status ?? "",
    mutual: row?.mutual ?? row?.mutual_label ?? "",
    mutualCount,
    connected: row?.connected ?? row?.connected_label ?? "",
    connectedAt,
    image: pickImage(user),
    isOnline
  };
}

export function mapFriendsResponse(response) {
  return asArray(response).map(mapFriendRow);
}
