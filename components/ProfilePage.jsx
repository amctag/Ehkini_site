"use client";

import { Camera, Edit, Gift, Images, MapPin, Plus, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { selectCurrentUser } from "@/src/features/auth/authSlice";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import DashboardShell from "./DashboardShell";

function unwrapCurrentUser(payload) {
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? payload ?? {};
}

function interestLabel(interest) {
  if (typeof interest === "string") return interest;
  return interest?.name ?? interest?.title ?? "";
}

function fullNameOf(user, fallback) {
  const fullName = String(user?.full_name ?? "").trim();
  if (fullName) return fullName;

  const firstLastName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  if (firstLastName) return firstLastName;

  return String(user?.name ?? fallback).trim() || fallback;
}

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
}

function validImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  return value.startsWith("http") || value.startsWith("/") ? value : "";
}

function formatMemberSince(value, fallback) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
}

function mapPhotoUrl(photo) {
  if (typeof photo === "string") return validImageUrl(photo);
  return validImageUrl(photo?.url ?? photo?.image_url ?? photo?.photo_url ?? photo?.path);
}

function fullNameFromParts(value, fallback = "") {
  if (!value || typeof value !== "object") return fallback;
  const fullName = String(value.full_name ?? "").trim();
  if (fullName) return fullName;
  const firstLastName = [value.first_name, value.last_name].filter(Boolean).join(" ").trim();
  if (firstLastName) return firstLastName;
  return String(value.name ?? fallback).trim() || fallback;
}

function mapGiftItem(gift) {
  if (!gift || typeof gift !== "object") return null;

  const sender =
    gift.sender ??
    gift.from_user ??
    gift.from ??
    gift.user ??
    null;
  const senderName =
    (typeof gift.from === "string" && gift.from.trim()) ||
    (typeof gift.sender_name === "string" && gift.sender_name.trim()) ||
    (typeof gift.from_name === "string" && gift.from_name.trim()) ||
    fullNameFromParts(sender, "");
  const icon =
    (typeof gift.icon === "string" && gift.icon.trim()) ||
    (typeof gift.gift_icon === "string" && gift.gift_icon.trim()) ||
    (typeof gift.emoji === "string" && gift.emoji.trim()) ||
    "🎁";
  const rawTime =
    (typeof gift.time === "string" && gift.time.trim()) ||
    (typeof gift.created_at === "string" && gift.created_at.trim()) ||
    "";

  return {
    icon,
    from: senderName || "",
    time: rawTime || ""
  };
}

function buildProfile(userPayload, t) {
  const user = unwrapCurrentUser(userPayload);
  const name = fullNameOf(user, t("fallbackName"));
  const avatar = validImageUrl(user.profile_image_url ?? user.avatar_url ?? user.avatar ?? user.profile_image);
  const interests = (user.interests ?? []).map(interestLabel).filter(Boolean);
  const photos = (user.photos ?? user.images ?? user.gallery ?? [])
    .map(mapPhotoUrl)
    .filter(Boolean);

  if (avatar && photos.length === 0) {
    photos.push(avatar);
  }
  const rawReceivedGifts =
    user.received_gifts ??
    user.gifts_received ??
    user.receivedGifts ??
    [];
  const receivedGifts = Array.isArray(rawReceivedGifts)
    ? rawReceivedGifts.map(mapGiftItem).filter(Boolean)
    : [];

  return {
    id: user.id ?? "",
    name,
    initials: initialsOf(name),
    avatar,
    location: user.location ?? "",
    bio: user.about_me ?? user.about ?? user.bio ?? "",
    age: user.age ?? "",
    gender: user.gender ?? "",
    memberSince: formatMemberSince(user.created_at, ""),
    interests,
    photos,
    receivedGifts
  };
}

function ProfileAvatar({ profile, alt, size = 84 }) {
  if (profile.avatar) {
    return (
      <Image
        src={profile.avatar}
        alt={alt}
        width={size}
        height={size}
        unoptimized
      />
    );
  }

  return (
    <span
      className="profile-summary-avatar-fallback"
      aria-label={alt}
      style={{ width: size, height: size }}
    >
      {profile.initials}
    </span>
  );
}

function EditProfileModal({ open, onClose, profile }) {
  const t = useTranslations("profile.editModal");
  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState(profile.interests);
  const [customInterest, setCustomInterest] = useState("");
  const suggestedInterests = t.raw("suggestedInterests");

  useEffect(() => {
    if (!open) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  function addInterest(value) {
    const next = value.trim();
    if (!next || interests.includes(next) || interests.length >= 8) return;
    setInterests((current) => [...current, next]);
  }

  function removeInterest(value) {
    setInterests((current) => current.filter((item) => item !== value));
  }

  function handleCustomInterest() {
    addInterest(customInterest);
    setCustomInterest("");
  }

  return (
    <div className="profile-edit-overlay" role="presentation" onClick={onClose}>
      <section
        className="profile-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="profile-edit-header">
          <h3>{t("title")}</h3>
          <button type="button" onClick={onClose} aria-label={t("closeAria")}>
            <X size={17} />
          </button>
        </header>

        <div className="profile-edit-body">
          <div className="profile-edit-avatar-wrap">
            <div className="profile-edit-avatar">
              <ProfileAvatar profile={profile} alt={t("avatarAlt")} size={92} />
              <button type="button" aria-label={t("uploadAria")} className="profile-edit-photo-btn">
                <Camera size={15} />
              </button>
            </div>
            <p>{t("uploadHint")}</p>
          </div>

          <label className="profile-edit-field">
            <span>{t("name")}</span>
            <input defaultValue={profile.name} />
          </label>

          <label className="profile-edit-field">
            <span>{t("age")}</span>
            <input defaultValue={profile.age} />
          </label>

          <label className="profile-edit-field">
            <span>{t("location")}</span>
            <div className="profile-edit-location-wrap">
              <MapPin size={15} />
              <input defaultValue={profile.location} />
            </div>
          </label>

          <label className="profile-edit-field">
            <span>{t("bio")}</span>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} />
            <small>{t("bioCount", { count: Math.min(bio.length, 200) })}</small>
          </label>

          <div className="profile-edit-field">
            <span>{t("interests")}</span>
            <div className="profile-interest-chips">
              {interests.map((interest) => (
                <button type="button" key={interest} className="profile-interest-chip" onClick={() => removeInterest(interest)}>
                  {interest}
                  <X size={11} />
                </button>
              ))}
            </div>

            <div className="profile-interest-input-wrap">
              <input
                value={customInterest}
                onChange={(event) => setCustomInterest(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCustomInterest();
                  }
                }}
                placeholder={t("addCustomPlaceholder")}
              />
              <button type="button" onClick={handleCustomInterest} aria-label={t("addCustomAria")}>
                <Plus size={16} />
              </button>
            </div>

            <div className="profile-suggested-row">
              <p>{t("suggested")}</p>
              <div className="profile-suggested-grid">
                {suggestedInterests.map((interest) => (
                  <button type="button" key={interest} onClick={() => addInterest(interest)}>
                    + {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="profile-edit-footer">
          <button type="button" className="profile-cancel-btn" onClick={onClose}>
            {t("cancel")}
          </button>
          <button type="button" className="profile-save-btn" onClick={onClose}>
            {t("save")}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const currentUser = useAppSelector(selectCurrentUser);
  const profile = buildProfile(currentUser, t);
  const photos = profile.photos;
  const receivedGifts = profile.receivedGifts;
  const tags = profile.interests;
  const stats = [
    {
      label: t("statsLabels.age"),
      value: profile.age || t("emptyField"),
      tone: "peach"
    },
    {
      label: t("statsLabels.gender"),
      value: profile.gender || t("emptyField"),
      tone: "purple"
    },
    {
      label: t("statsLabels.memberSince"),
      value: profile.memberSince || t("emptyField"),
      tone: "cream"
    }
  ];
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardShell activePageKey="profile" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="profile-page">
        <article className="profile-summary-card">
          <button className="edit-profile-button" type="button" onClick={() => setIsEditOpen(true)}>
            <Edit size={17} />
            {t("edit")}
          </button>

          <div className="profile-summary-head">
            <ProfileAvatar profile={profile} alt={t("avatarAlt")} />
            <div>
              <h2>{profile.name}</h2>
              {profile.location ? (
                <p>
                  <MapPin size={16} />
                  {profile.location}
                </p>
              ) : null}
              {tags.length > 0 ? (
                <div className="profile-tags">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <p className="profile-bio">{profile.bio || t("emptyBio")}</p>

          <div className="profile-stats">
            {stats.map((stat) => (
              <div className={stat.tone} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className={`profile-photos-panel ${photos.length === 0 ? "compact-empty" : ""}`}>
          <h2>
            <Images size={20} />
            {t("photosHeading")}
          </h2>
          {photos.length > 0 ? (
            <div className="profile-photos-grid">
              {photos.map((photo, index) => (
                <div className={index === 0 ? "main-photo" : ""} key={`profile-photo-${index}`}>
                  <Image
                    src={photo}
                    alt={t("photoAlt", { index: index + 1 })}
                    fill
                    unoptimized
                    sizes="(max-width: 620px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-section-empty">{t("emptyPhotos")}</p>
          )}
        </article>

        <article className={`profile-received-gifts-panel ${receivedGifts.length === 0 ? "compact-empty" : ""}`}>
          <h2>
            <Gift size={20} />
            {t("giftsReceivedHeading")}
          </h2>
          {receivedGifts.length > 0 ? (
            <div className="profile-received-gifts-list">
              {receivedGifts.map((gift, index) => (
                <div className="profile-received-gift" key={`profile-received-gift-${index}`}>
                  <span className="profile-received-gift-icon" aria-hidden="true">
                    {gift.icon}
                  </span>
                  <div>
                    <strong>{gift.from ? t("fromPrefix", { name: gift.from }) : t("emptyField")}</strong>
                    {gift.time ? <small>{gift.time}</small> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-section-empty">{t("emptyReceivedGifts")}</p>
          )}
        </article>
      </section>

      {isEditOpen ? (
        <EditProfileModal open={isEditOpen} onClose={() => setIsEditOpen(false)} profile={profile} />
      ) : null}
    </DashboardShell>
  );
}
