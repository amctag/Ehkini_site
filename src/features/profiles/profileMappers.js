const defaultCover =
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1800&q=80";
const defaultAvatar =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=220&q=85";

function unwrapProfileResponse(response) {
  return response?.user ?? response?.profile ?? response?.data?.user ?? response?.data ?? response;
}

function interestLabel(interest) {
  if (typeof interest === "string") return interest;
  return interest?.name ?? interest?.title ?? "";
}

function pickName(user, fallbackName) {
  const fullName = String(user?.full_name ?? "").trim();
  if (fullName) return fullName;

  const firstLastName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  if (firstLastName) return firstLastName;

  return String(user?.name ?? fallbackName).trim() || fallbackName;
}

function pickImage(...values) {
  const image = values.find((value) => typeof value === "string" && value.trim());

  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;

  return "";
}

function formatMemberSince(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
}

function mapPhotos(user, avatar) {
  const photos = user?.photos ?? user?.images ?? user?.gallery ?? [];
  const mappedPhotos = Array.isArray(photos)
    ? photos
        .map((photo) =>
          pickImage(
            photo?.url,
            photo?.image_url,
            photo?.photo_url,
            photo?.path,
            typeof photo === "string" ? photo : ""
          )
        )
        .filter(Boolean)
    : [];

  return mappedPhotos.length > 0 ? mappedPhotos : [avatar];
}

export function mapProfileResponse(response, fallbackProfile, fallbackName) {
  const user = unwrapProfileResponse(response);
  const name = pickName(user, fallbackName);
  const avatar =
    pickImage(user?.profile_image_url, user?.image, user?.avatar_url, user?.avatar, user?.profile_image) ||
    fallbackProfile.avatar ||
    defaultAvatar;
  const cover =
    pickImage(user?.cover_image_url, user?.cover_url, user?.cover) ||
    fallbackProfile.cover ||
    defaultCover;
  const interests = (user?.interests ?? []).map(interestLabel).filter(Boolean);

  return {
    ...fallbackProfile,
    id: user?.userId ?? user?.id ?? fallbackProfile.id,
    slug: String(user?.userId ?? user?.id ?? user?.slug ?? fallbackProfile.slug ?? ""),
    name,
    location: user?.location ?? "",
    status: user?.is_online || user?.online ? "online" : user?.status ?? "",
    avatar,
    cover,
    about: user?.about_me ?? user?.about ?? user?.bio ?? fallbackProfile.fallbackAbout,
    age: user?.age ?? "",
    gender: user?.gender ?? "",
    dateOfBirth: user?.date_of_birth ?? "",
    occupation: user?.occupation ?? "",
    education: user?.education ?? "",
    memberSince: formatMemberSince(user?.created_at) || (user?.memberSince ?? ""),
    friendshipStatus: user?.friendship_status ?? user?.friendshipStatus ?? null,
    friendshipId: user?.friendship_id ?? user?.friendshipId ?? null,
    canCancel: Boolean(user?.can_cancel ?? user?.canCancel),
    canRespond: Boolean(user?.can_respond ?? user?.canRespond),
    interests,
    photos: mapPhotos(user, avatar)
  };
}
