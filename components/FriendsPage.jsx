"use client";

import { Gift, MessageCircle, MoreVertical, Phone, Search, UserPlus, Users, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useCancelFriendRequestMutation,
  useGetFriendSuggestionsQuery,
  useGetFriendsQuery,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
  useSearchFriendsQuery
} from "@/src/features/friends/friendsApi";
import { useBlockUserMutation, useReportUserMutation } from "@/src/features/users/usersApi";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

function formatConnectedDate(value, t) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return t("connectedOn", {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  });
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

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return false;
  return ["1", "true", "yes", "y", "on"].includes(normalized);
}

function suggestionStateKey(suggestion) {
  return String(suggestion?.receiverId ?? suggestion?.profileId ?? suggestion?.id ?? "").trim();
}

function FriendCard({ friend, pendingAction, onRemoveFriend, onBlockUser, onReportUser, onOpenProfile }) {
  const t = useTranslations("friends");
  const profileHref = `/profile-view/${friend.userId ?? friend.id}`;
  const status = friend.isOnline ? t("friend.online") : friend.status;
  const mutual =
    friend.mutual ||
    (friend.mutualCount === null ? "" : t("mutualCount", { count: friend.mutualCount }));
  const connected = friend.connected || formatConnectedDate(friend.connectedAt, t);
  const hasImage = typeof friend.image === "string" && friend.image.trim().length > 0;
  const initials = String(friend.name ?? "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const friendKey = String(friend.userId ?? friend.user_id ?? friend.id ?? friend.name ?? "");
  const isRemoving = pendingAction?.friendKey === friendKey && pendingAction?.action === "remove";
  const isBlocking = pendingAction?.friendKey === friendKey && pendingAction?.action === "block";
  const isReporting = pendingAction?.friendKey === friendKey && pendingAction?.action === "report";
  const hasPendingAction = Boolean(isRemoving || isBlocking || isReporting);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  function handleCardClick(event) {
    const interactiveTarget = event.target.closest("button, a, input, textarea, select, [role='menuitem']");
    if (interactiveTarget) return;
    onOpenProfile?.();
  }

  return (
    <article className="friend-card friend-card-clickable" onClick={handleCardClick}>
      <div className="friend-card-header">
        <Link
          className="friend-profile-link"
          href={profileHref}
          aria-label={t("friend.viewProfileAria", { name: friend.name })}
        >
          <span className="friend-avatar">
            {hasImage ? (
              <Image src={friend.image} alt={friend.name} width={64} height={64} unoptimized />
            ) : (
              <span className="friend-avatar-fallback" aria-hidden="true">
                {initials}
              </span>
            )}
            {friend.isOnline ? <span className="friend-online-dot" /> : null}
          </span>

          <span className="friend-details">
            <h3>{friend.name}</h3>
            {friend.location ? <p>{friend.location}</p> : null}
            {status ? <small>{status}</small> : null}
          </span>
        </Link>

        <div className="friend-menu-wrap" ref={menuRef}>
          <button
            className="friend-menu"
            type="button"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label={t("friend.moreOptionsAria", { name: friend.name })}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <MoreVertical size={20} />
          </button>
          {isMenuOpen ? (
            <div className="friend-menu-dropdown" role="menu">
              <button
                type="button"
                role="menuitem"
                disabled={hasPendingAction}
                onClick={async () => {
                  setIsMenuOpen(false);
                  await onRemoveFriend(friend);
                }}
              >
                {isRemoving ? t("actions.removing") : t("actions.removeFriend")}
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={hasPendingAction}
                onClick={async () => {
                  setIsMenuOpen(false);
                  await onBlockUser(friend);
                }}
              >
                {isBlocking ? t("actions.blocking") : t("actions.block")}
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={hasPendingAction}
                onClick={async () => {
                  setIsMenuOpen(false);
                  await onReportUser(friend);
                }}
              >
                {isReporting ? t("actions.reporting") : t("actions.report")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {mutual || connected ? (
        <div className="friend-meta">
          <span>{mutual}</span>
          <span>{connected}</span>
        </div>
      ) : null}

      <div className="friend-actions">
        <Link className="message-friend" href="/messages" aria-label={t("friend.messageAria", { name: friend.name })}>
          <MessageCircle size={17} />
          {t("friend.message")}
        </Link>
        <button className="call-friend" type="button" aria-label={t("friend.callAria", { name: friend.name })}>
          <Phone size={17} />
        </button>
        <button className="video-friend" type="button" aria-label={t("friend.videoAria", { name: friend.name })}>
          <Video size={17} />
        </button>
        <button className="gift-friend" type="button" aria-label={t("friend.giftAria", { name: friend.name })}>
          <Gift size={17} />
        </button>
      </div>
    </article>
  );
}

function buildSuggestionCard(suggestion, index, t) {
  const source = suggestion && typeof suggestion === "object" ? suggestion : {};
  const name = String(source.name ?? source.full_name ?? source.username ?? "").trim() || "User";
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";
  const tones = ["coral", "mint", "blue"];
  const tone = source.tone ?? tones[index % tones.length];
  const profileId =
    source.userId ??
    source.user_id ??
    source.receiver_id ??
    source.friend_id ??
    source.id ??
    null;
  const normalizedStatus = normalizeFriendshipStatus(
    source.friendshipStatus ??
      source.friendship_status ??
      source.relationship_status ??
      source.request_status ??
      source.friend_request_status ??
      source.status
  );
  const isFriend =
    toBoolean(source.isFriend ?? source.is_friend ?? source.friends_with_me) || isFriendStatus(normalizedStatus);
  const isRequestSentRaw = toBoolean(
    source.isRequestSent ??
      source.is_request_sent ??
      source.request_sent ??
      source.sent_request ??
      source.has_pending_request ??
      source.canCancel ??
      source.can_cancel
  );
  const isRequestSent = !isFriend && (isRequestSentRaw || isSentStatus(normalizedStatus));

  return {
    id: source.userId ?? source.user_id ?? source.id ?? `suggested-${index}`,
    profileId,
    receiverId: profileId,
    friendshipId: source.friendshipId ?? source.friendship_id ?? null,
    name,
    location: source.location ?? "",
    mutual:
      source.mutual ||
      (Number.isFinite(Number(source.mutualCount))
        ? t("mutualCount", { count: Number(source.mutualCount) })
        : ""),
    initials: source.initials ?? initials,
    tone,
    image: source.image ?? source.avatar ?? source.profile_image_url ?? "",
    isFriend,
    isRequestSent
  };
}

function SuggestedFriendCard({ suggestion, onOpenProfile, onToggleRequest, pendingState, resolvedState }) {
  const t = useTranslations("friends");
  const hasImage = typeof suggestion.image === "string" && suggestion.image.trim().length > 0;
  const isFriend = resolvedState?.isFriend ?? false;
  const isSent = resolvedState?.isSent ?? false;
  const isBusy = pendingState?.suggestionKey === suggestionStateKey(suggestion) && pendingState?.inFlight;

  function handleCardClick(event) {
    const interactiveTarget = event.target.closest("button, a, input, textarea, select");
    if (interactiveTarget) return;
    onOpenProfile?.();
  }

  return (
    <article className="suggested-card suggested-card-clickable" onClick={handleCardClick}>
      <div className={`suggested-avatar ${suggestion.tone}`}>
        {hasImage ? (
          <Image src={suggestion.image} alt={suggestion.name} width={50} height={50} unoptimized />
        ) : (
          suggestion.initials
        )}
      </div>
      <div>
        <h3>{suggestion.name}</h3>
        <p>{suggestion.location}</p>
        <small>{suggestion.mutual}</small>
      </div>
      <button
        type="button"
        className={isSent ? "sent" : ""}
        onClick={(event) => {
          event.stopPropagation();
          onToggleRequest?.(suggestion);
        }}
        disabled={isFriend || isBusy}
      >
        <UserPlus size={16} />
        {isFriend ? t("alreadyFriend") : isSent ? (isBusy ? t("cancelingRequest") : t("requestSent")) : (isBusy ? t("sendingRequest") : t("addFriend"))}
      </button>
    </article>
  );
}

export default function FriendsPage() {
  const t = useTranslations("friends");
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [suggestionOverrides, setSuggestionOverrides] = useState({});
  const [pendingSuggestionAction, setPendingSuggestionAction] = useState(null);
  const [requestPopupMessage, setRequestPopupMessage] = useState("");
  const [removeFriend] = useRemoveFriendMutation();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  const [blockUser] = useBlockUserMutation();
  const [reportUser] = useReportUserMutation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  const isSearching = debouncedSearch.length > 0;
  const {
    data: allFriends = [],
    isError: isFriendsError,
    isLoading: isFriendsLoading
  } = useGetFriendsQuery();
  const {
    data: searchedFriends = [],
    isError: isSearchError,
    isFetching: isSearchFetching
  } = useSearchFriendsQuery(debouncedSearch, {
    skip: !isSearching
  });
  const { data: suggestedFriendsData = [] } = useGetFriendSuggestionsQuery();

  const friends = isSearching ? searchedFriends : allFriends;
  const isLoading = isSearching ? isSearchFetching : isFriendsLoading;
  const isError = isSearching ? isSearchError : isFriendsError;
  const suggestions = Array.isArray(suggestedFriendsData)
    ? suggestedFriendsData.map((suggestion, index) => buildSuggestionCard(suggestion, index, t))
    : [];
  const friendIdSet = useMemo(
    () =>
      new Set(
        allFriends
          .map((friend) => String(friend?.userId ?? friend?.user_id ?? friend?.id ?? "").trim())
          .filter(Boolean)
      ),
    [allFriends]
  );

  function resolveFriendUserId(friend) {
    const raw = friend?.userId ?? friend?.user_id ?? friend?.id ?? null;
    const text = String(raw ?? "").trim();
    if (!text) return null;
    return /^\d+$/.test(text) ? Number(text) : text;
  }

  function resolveFriendKey(friend) {
    return String(friend?.userId ?? friend?.user_id ?? friend?.id ?? friend?.name ?? "");
  }

  function openProfileById(id) {
    const profileId = String(id ?? "").trim();
    if (!profileId) return;
    router.push(`/profile-view/${profileId}`);
  }

  function resolveSuggestionState(suggestion) {
    const key = suggestionStateKey(suggestion);
    const override = suggestionOverrides[key];
    if (override) {
      return {
        isFriend: Boolean(override.isFriend),
        isSent: Boolean(override.isSent),
        friendshipId: override.friendshipId ?? null
      };
    }

    const receiverId = String(suggestion?.receiverId ?? suggestion?.profileId ?? suggestion?.id ?? "").trim();
    const isFriend = Boolean(suggestion?.isFriend) || (receiverId ? friendIdSet.has(receiverId) : false);
    return {
      isFriend,
      isSent: !isFriend && Boolean(suggestion?.isRequestSent),
      friendshipId: suggestion?.friendshipId ?? null
    };
  }

  const visibleSuggestions = suggestions.filter((suggestion) => {
    const state = resolveSuggestionState(suggestion);
    return !state.isSent;
  });

  async function handleToggleSuggestedRequest(suggestion) {
    const suggestionKey = suggestionStateKey(suggestion);
    if (!suggestionKey) return;

    const receiverId = suggestion?.receiverId ?? suggestion?.profileId ?? suggestion?.id ?? null;
    if (receiverId === null || receiverId === undefined || String(receiverId).trim() === "") return;

    const state = resolveSuggestionState(suggestion);
    if (state.isFriend) return;

    setPendingSuggestionAction({ suggestionKey, inFlight: true });
    try {
      if (state.isSent) {
        const payload = state.friendshipId ? { friendship_id: state.friendshipId } : { receiver_id: receiverId };
        await cancelFriendRequest(payload).unwrap();
        setSuggestionOverrides((current) => ({
          ...current,
          [suggestionKey]: { isFriend: false, isSent: false, friendshipId: null }
        }));
      } else {
        const response = await sendFriendRequest({ receiver_id: receiverId }).unwrap();
        const nextFriendshipId = response?.friendship_id ?? response?.data?.friendship_id ?? null;
        setSuggestionOverrides((current) => ({
          ...current,
          [suggestionKey]: { isFriend: false, isSent: true, friendshipId: nextFriendshipId }
        }));
      }
    } catch (error) {
      const message = String(error?.data?.message ?? error?.error ?? "").trim();
      const normalizedMessage = message.toLowerCase();
      const isAlreadySent =
        normalizedMessage.includes("already") && normalizedMessage.includes("sent");
      if (isAlreadySent) {
        setSuggestionOverrides((current) => ({
          ...current,
          [suggestionKey]: {
            isFriend: false,
            isSent: true,
            friendshipId: state.friendshipId ?? null
          }
        }));
        setRequestPopupMessage(t("alreadySentPopup"));
      } else {
        setRequestPopupMessage(message || t("requestActionError"));
      }
    } finally {
      setPendingSuggestionAction((current) => (current?.suggestionKey === suggestionKey ? null : current));
    }
  }

  async function runFriendAction(action, friend, request) {
    const friendKey = resolveFriendKey(friend);
    if (!friendKey) return;

    setPendingAction({ action, friendKey });
    try {
      await request();
    } catch (error) {
      console.error(`Failed to ${action} friend`, error);
    } finally {
      setPendingAction((current) => (current?.friendKey === friendKey && current?.action === action ? null : current));
    }
  }

  async function handleRemoveFriend(friend) {
    const friendId = resolveFriendUserId(friend);
    if (friendId === null) return;
    await runFriendAction("remove", friend, () => removeFriend({ friend_id: friendId }).unwrap());
  }

  async function handleBlockUser(friend) {
    const userId = resolveFriendUserId(friend);
    if (userId === null) return;
    await runFriendAction("block", friend, () => blockUser({ user_id: userId }).unwrap());
  }

  async function handleReportUser(friend) {
    const userId = resolveFriendUserId(friend);
    if (userId === null) return;
    await runFriendAction("report", friend, () =>
      reportUser({ user_id: userId, reason: "Reported from friends page" }).unwrap()
    );
  }

  return (
    <DashboardShell activePageKey="friends" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="friends-page">
        {requestPopupMessage ? (
          <div className="friends-request-popup" role="alertdialog" aria-modal="false">
            <p>{requestPopupMessage}</p>
            <button type="button" onClick={() => setRequestPopupMessage("")}>
              {t("dismissPopup")}
            </button>
          </div>
        ) : null}
        <div className="friends-toolbar">
          <div className="friends-title-row">
            <SectionTitle icon={Users} iconProps={{ size: 24 }} title={t("myFriends")} />
            <span>{t("friendsCount", { count: friends.length })}</span>
          </div>

          <label className="friends-search">
            <Search size={18} />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </label>

          <div className="friends-filters">
            <button type="button">{t("filters.onlineOnly")}</button>
            <button type="button">{t("filters.recent")}</button>
            <button type="button">{t("filters.alphabetical")}</button>
          </div>
        </div>

        {isLoading ? (
          <div className="friends-state">{t("loadingFriends")}</div>
        ) : null}

        {isError ? (
          <div className="friends-state error">{t("friendsLoadError")}</div>
        ) : null}

        {!isLoading && !isError && friends.length === 0 ? (
          <div className="friends-state">{t("emptyFriends")}</div>
        ) : null}

        {!isLoading && !isError && friends.length > 0 ? (
          <div className="friends-grid">
            {friends.map((friend) => (
              <FriendCard
                friend={friend}
                key={friend.id}
                pendingAction={pendingAction}
                onRemoveFriend={handleRemoveFriend}
                onBlockUser={handleBlockUser}
                onReportUser={handleReportUser}
                onOpenProfile={() => openProfileById(friend.userId ?? friend.user_id ?? friend.id)}
              />
            ))}
          </div>
        ) : null}

        {visibleSuggestions.length > 0 ? (
          <>
            <h2 className="suggested-heading">{t("suggestedHeading")}</h2>
            <div className="suggested-grid">
              {visibleSuggestions.map((suggestion) => (
                <SuggestedFriendCard
                  suggestion={suggestion}
                  key={suggestion.id ?? suggestion.name}
                  onOpenProfile={() => openProfileById(suggestion.profileId)}
                  onToggleRequest={handleToggleSuggestedRequest}
                  pendingState={pendingSuggestionAction}
                  resolvedState={resolveSuggestionState(suggestion)}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </DashboardShell>
  );
}
