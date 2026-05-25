function asArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.friends)) return response.friends;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.friends)) return response.data.friends;
  return [];
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return false;
  return ["1", "true", "yes", "y", "on"].includes(normalized);
}

function normalizeFriendshipStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function isFriendStatus(status) {
  return status === "friend" || status === "friends" || status === "accepted" || status === "is_friends";
}

function isSentStatus(status) {
  return (
    status === "pending" ||
    status === "pending_sent" ||
    status === "sent" ||
    status === "request_sent" ||
    status === "awaiting_response" ||
    status === "outgoing_pending" ||
    status === "pending_outgoing"
  );
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

function normalizeImageUrl(value) {
  const image = String(value ?? "").trim();
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }

  if (image.startsWith("//")) {
    return `https:${image}`;
  }

  // Handle values like `amcserver.com/path/image.jpg`.
  if (/^[\w.-]+\.[a-z]{2,}\/.+/i.test(image)) {
    return `https://${image}`;
  }

  // Handle relative paths like `uploads/avatar.jpg`.
  return `/${image.replace(/^\/+/, "")}`;
}

function pickImage(row, user) {
  const imageCandidates = [
    user?.profile_image_url,
    user?.profile_image,
    user?.avatar_url,
    user?.avatar,
    user?.image,
    user?.photo,
    row?.profile_image_url,
    row?.profile_image,
    row?.avatar_url,
    row?.avatar,
    row?.image,
    row?.photo,
    row?.friend_image,
    row?.friend_avatar
  ];

  for (const candidate of imageCandidates) {
    const normalized = normalizeImageUrl(candidate);
    if (normalized) return normalized;
  }

  return null;
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
  const friendshipStatus =
    row?.friendship_status ??
    row?.friendshipStatus ??
    row?.relationship_status ??
    user?.friendship_status ??
    user?.friendshipStatus ??
    user?.relationship_status ??
    row?.status ??
    user?.status ??
    null;
  const normalizedFriendshipStatus = normalizeFriendshipStatus(friendshipStatus);
  const friendshipId =
    row?.friendship_id ??
    row?.friendshipId ??
    row?.friend_request_id ??
    row?.request_id ??
    user?.friendship_id ??
    user?.friendshipId ??
    user?.friend_request_id ??
    user?.request_id ??
    row?.friendship?.id ??
    row?.request?.id ??
    user?.friendship?.id ??
    user?.request?.id ??
    null;
  const isFriend =
    toBoolean(
      row?.is_friend ??
        row?.isFriend ??
        user?.is_friend ??
        user?.isFriend ??
        row?.friends_with_me ??
        user?.friends_with_me
    ) || isFriendStatus(normalizedFriendshipStatus);
  const isRequestSent =
    !isFriend &&
    (toBoolean(
      row?.request_sent ??
        row?.is_request_sent ??
        row?.sent_request ??
        row?.has_pending_request ??
        row?.can_cancel ??
        row?.canCancel ??
        user?.request_sent ??
        user?.is_request_sent ??
        user?.sent_request ??
        user?.has_pending_request ??
        user?.can_cancel ??
        user?.canCancel
    ) ||
      isSentStatus(normalizedFriendshipStatus));
  const canCancel = isRequestSent || toBoolean(row?.can_cancel ?? row?.canCancel ?? user?.can_cancel ?? user?.canCancel);

  return {
    ...user,
    id,
    userId: user?.id ?? row?.friend_id ?? row?.user_id,
    name: pickName(user),
    full_name: user?.full_name ?? pickName(user),
    location: user?.location ?? row?.location ?? "",
    about_me: user?.about_me ?? row?.about_me ?? "",
    age: user?.age ?? row?.age ?? "",
    date_of_birth: user?.date_of_birth ?? row?.date_of_birth ?? "",
    interests: user?.interests ?? row?.interests ?? [],
    status: row?.status ?? user?.status ?? "",
    friendshipStatus,
    friendshipId,
    isFriend,
    isRequestSent,
    canCancel,
    mutual: row?.mutual ?? row?.mutual_label ?? "",
    mutualCount,
    connected: row?.connected ?? row?.connected_label ?? "",
    connectedAt,
    image: pickImage(row, user),
    avatar: pickImage(row, user),
    profile_image_url: user?.profile_image_url ?? row?.profile_image_url ?? null,
    isOnline
  };
}

export function mapFriendsResponse(response) {
  return asArray(response).map(mapFriendRow);
}
