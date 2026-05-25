"use client";

import {
  BriefcaseBusiness,
  Calendar,
  Cake,
  Check,
  Gift,
  GraduationCap,
  MessageCircle,
  Phone,
  UserPlus,
  Video
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { mockProfilesBySlug } from "@/mocks/data/profiles/by-slug";
import {
  useGetFriendsQuery,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation
} from "@/src/features/friends/friendsApi";
import { useGetProfileBySlugQuery } from "@/src/features/profiles/profilesApi";
import { mapProfileResponse } from "@/src/features/profiles/profileMappers";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import DashboardShell from "./DashboardShell";

function buildFallbackProfile(slug, defaults, fallbackName) {
  const safeSlug = typeof slug === "string" && slug.trim() ? slug : "profile";
  const shouldUseSlugAsName = !/^\d+$/.test(safeSlug);

  const displayName = shouldUseSlugAsName
    ? safeSlug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : fallbackName;

  return {
    ...defaults,
    name: displayName || fallbackName,
    about: defaults.fallbackAbout,
    interests: defaults.fallbackInterests
  };
}

function rowsFromQueryData(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.data)) return data.data.data;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.friends)) return data.friends;
  if (typeof data === "object" && data.id !== undefined) return [data];
  if (typeof data.user === "object") return [data.user];
  if (typeof data.profile === "object") return [data.profile];
  return [];
}

function profileIdOf(row) {
  return String(row?.userId ?? row?.user_id ?? row?.friend_id ?? row?.id ?? "");
}

function normalizeId(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function receiverIdOf(profile, slug) {
  const rawId = profile?.id ?? profile?.userId ?? profile?.user_id ?? slug;
  const idText = normalizeId(rawId);
  if (!idText) return null;
  return /^\d+$/.test(idText) ? Number(idText) : idText;
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
    status === "awaiting_response"
  );
}

function profileRichnessScore(row) {
  let score = 0;
  if (row?.location) score += 2;
  if (row?.about_me || row?.about || row?.bio) score += 3;
  if (row?.age) score += 1;
  if (row?.date_of_birth) score += 1;
  if (row?.created_at || row?.connectedAt) score += 1;
  if (row?.occupation) score += 1;
  if (row?.education) score += 1;
  if (Array.isArray(row?.interests)) score += row.interests.length;
  if (Array.isArray(row?.photos) || Array.isArray(row?.images) || Array.isArray(row?.gallery)) {
    score += 2;
  }
  return score;
}

function selectCachedProfileRow(state, profileId) {
  if (!profileId) return null;

  return Object.values(state.api?.queries ?? {})
    .flatMap((query) => rowsFromQueryData(query?.data))
    .filter((row) => profileIdOf(row) === profileId)
    .sort((left, right) => profileRichnessScore(right) - profileRichnessScore(left))[0] ?? null;
}

export default function ProfileViewPage({ slug }) {
  const t = useTranslations("profileView");
  const fallbackName = t("fallbackName");
  const fallbackAbout = t("fallbackAbout");
  const fallbackInterests = t.raw("fallbackInterests");

  const safeSlug = typeof slug === "string" ? slug.toLowerCase() : "";
  const defaultProfile = {
    ...mockProfilesBySlug.sarah,
    fallbackAbout,
    fallbackInterests
  };
  const cachedProfileRow = useAppSelector((state) => selectCachedProfileRow(state, safeSlug));
  const cachedProfile = cachedProfileRow
    ? mapProfileResponse(cachedProfileRow, defaultProfile, fallbackName)
    : null;
  const { data: fetchedProfile } = useGetProfileBySlugQuery(
    {
      slug: safeSlug,
      fallbackProfile: defaultProfile,
      fallbackName
    },
    {
      skip: !safeSlug
    }
  );
  const profile =
    cachedProfile ??
    fetchedProfile ??
    buildFallbackProfile(safeSlug, defaultProfile, fallbackName);
  const { data: friends = [] } = useGetFriendsQuery();
  const receiverId = receiverIdOf(profile, safeSlug);
  const [sendFriendRequest, { isLoading: isSendingFriendRequest }] = useSendFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCancelingFriendRequest }] = useCancelFriendRequestMutation();
  const [friendshipOverride, setFriendshipOverride] = useState(null);
  const [friendRequestMessage, setFriendRequestMessage] = useState("");
  const receiverKey = String(receiverId ?? "");
  const receiverIdKey = normalizeId(receiverId);
  const isFriendFromFriendsList = Boolean(
    receiverIdKey &&
      friends.some((friend) => {
        const friendUserId = normalizeId(friend?.userId ?? friend?.user_id);
        const friendId = normalizeId(friend?.id);
        return receiverIdKey === friendUserId || receiverIdKey === friendId;
      })
  );
  const profileStatus = normalizeFriendshipStatus(profile?.friendshipStatus ?? profile?.friendship_status);
  const isFriendFromProfile = Boolean(profile?.isFriend) || isFriendFromFriendsList || isFriendStatus(profileStatus);
  const isSentFromProfile =
    !isFriendFromProfile &&
    (Boolean(profile?.isRequestSent) || isSentStatus(profileStatus) || Boolean(profile?.canCancel));
  const friendshipIdFromProfile = profile?.friendshipId ?? profile?.friendship_id ?? null;
  const canCancelFromProfile = isSentFromProfile || Boolean(friendshipIdFromProfile);
  const hasOverride = friendshipOverride?.receiverKey === receiverKey;
  const isFriend = hasOverride ? Boolean(friendshipOverride?.isFriend) : isFriendFromProfile;
  const isSent = hasOverride ? Boolean(friendshipOverride?.isSent) : isSentFromProfile;
  const canCancel = hasOverride ? Boolean(friendshipOverride?.canCancel) : canCancelFromProfile;
  const friendshipId = hasOverride ? friendshipOverride?.friendshipId : friendshipIdFromProfile;

  return (
    <DashboardShell activePageKey="discover" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="profile-view-page">
        <div className="profile-view-cover">
          <Image src={profile.cover} alt={t("coverAlt", { name: profile.name })} fill sizes="100vw" unoptimized />
        </div>

        <div className="profile-view-head">
          <div className="profile-view-avatar">
            <Image src={profile.avatar} alt={profile.name} width={100} height={100} unoptimized />
            <span className={profile.status === "online" ? "online" : ""} />
          </div>

          <h2>{profile.name}</h2>
          {profile.location ? <p>{profile.location}</p> : null}
        </div>

        <div className="profile-view-actions">
          {isFriend ? (
            <button type="button" className="friendship-state friend" disabled aria-label={t("alreadyFriend")}>
              <Check size={15} />
              {t("alreadyFriend")}
            </button>
          ) : null}
          {!isFriend && isSent ? (
            <button
              type="button"
              className="friendship-state sent"
              disabled={!canCancel || isCancelingFriendRequest}
              aria-label={t("cancelRequest")}
              onClick={async () => {
                if (!receiverId) return;
                const payload = friendshipId ? { friendship_id: friendshipId } : { receiver_id: receiverId };
                try {
                  await cancelFriendRequest(payload).unwrap();
                  setFriendshipOverride({
                    receiverKey,
                    isFriend: false,
                    isSent: false,
                    canCancel: false,
                    friendshipId: null
                  });
                  setFriendRequestMessage(t("requestCanceledMessage"));
                } catch (error) {
                  console.error("Failed to cancel friend request", error);
                }
              }}
            >
              {isCancelingFriendRequest ? `${t("cancelRequest")}...` : t("cancelRequest")}
            </button>
          ) : null}
          {!isFriend && !isSent ? (
            <button
              type="button"
              className="add-friend"
              disabled={!receiverId || isSendingFriendRequest}
              onClick={async () => {
                if (!receiverId) return;
                try {
                  const response = await sendFriendRequest({ receiver_id: receiverId }).unwrap();
                  const nextFriendshipId = response?.friendship_id ?? response?.data?.friendship_id ?? null;
                  setFriendshipOverride({
                    receiverKey,
                    isFriend: false,
                    isSent: true,
                    canCancel: true,
                    friendshipId: nextFriendshipId
                  });
                  setFriendRequestMessage(
                    String(response?.message ?? "").trim() || t("requestSentMessage")
                  );
                } catch (error) {
                  console.error("Failed to send friend request", error);
                }
              }}
            >
              <UserPlus size={16} />
              {isSendingFriendRequest ? `${t("addFriend")}...` : t("addFriend")}
            </button>
          ) : null}
          <button type="button" className="icon phone">
            <Phone size={16} />
          </button>
          <button type="button" className="icon video">
            <Video size={16} />
          </button>
          <button type="button" className="icon gift">
            <Gift size={16} />
          </button>
          <Link href="/messages" className="message" aria-label={t("messageAria", { name: profile.name })}>
            <MessageCircle size={16} />
            {t("message")}
          </Link>
          {friendRequestMessage ? <p className="profile-view-request-feedback">{friendRequestMessage}</p> : null}
        </div>

        <div className="profile-view-grid">
          <div className="profile-view-left">
            <article className="profile-view-card">
              <h3>{t("sections.about")}</h3>
              <p>{profile.about}</p>
            </article>

            <article className="profile-view-card">
              <h3>{t("sections.details")}</h3>
              <div className="profile-view-detail-list">
                <div>
                  <Cake size={16} />
                  <span>
                    <strong>{t("detailLabels.age")}</strong>
                    <small>{profile.age || t("emptyField")}</small>
                  </span>
                </div>
                <div>
                  <UserPlus size={16} />
                  <span>
                    <strong>{t("detailLabels.gender")}</strong>
                    <small>{profile.gender || t("emptyField")}</small>
                  </span>
                </div>
                <div>
                  <BriefcaseBusiness size={16} />
                  <span>
                    <strong>{t("detailLabels.occupation")}</strong>
                    <small>{profile.occupation || t("emptyField")}</small>
                  </span>
                </div>
                <div>
                  <GraduationCap size={16} />
                  <span>
                    <strong>{t("detailLabels.education")}</strong>
                    <small>{profile.education || t("emptyField")}</small>
                  </span>
                </div>
                <div>
                  <Calendar size={16} />
                  <span>
                    <strong>{t("detailLabels.memberSince")}</strong>
                    <small>{profile.memberSince || t("emptyField")}</small>
                  </span>
                </div>
              </div>
            </article>

            <article className="profile-view-card">
              <h3>{t("sections.interests")}</h3>
              <div className="profile-view-interests">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span key={`${profile.name}-${interest}`}>{interest}</span>
                  ))
                ) : (
                  <small>{t("emptyField")}</small>
                )}
              </div>
            </article>
          </div>

          <article className="profile-view-card photos">
            <h3>{t("sections.photos")}</h3>
            <div className="profile-view-photos">
              {profile.photos.map((photo, index) => (
                <div className={index === 0 ? "main-photo" : ""} key={`${profile.name}-photo-${index}`}>
                  <Image
                    src={photo}
                    alt={t("photoAlt", { name: profile.name, index: index + 1 })}
                    fill
                    unoptimized
                    sizes="(max-width: 860px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
