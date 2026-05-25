"use client";

import { Camera, Edit, Gift, Images, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useGetCountriesQuery, useGetInterestsQuery } from "@/src/features/auth/authApi";
import { selectCurrentUser } from "@/src/features/auth/authSlice";
import { useUpdateProfileMutation } from "@/src/features/profiles/profilesApi";
import { useGetWalletGiftTransactionsQuery } from "@/src/features/wallet/walletApi";
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

function splitNameParts(name = "") {
  const safeName = String(name ?? "").trim();
  if (!safeName) return { firstName: "", lastName: "" };
  const pieces = safeName.split(/\s+/).filter(Boolean);
  return {
    firstName: pieces[0] ?? "",
    lastName: pieces.slice(1).join(" ")
  };
}

function toInteger(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const numberValue = Number(text);
  if (!Number.isFinite(numberValue)) return null;
  return Math.trunc(numberValue);
}

const giftIconByKeyword = [
  { pattern: /(heart|love|romance)/, icon: "\u2764\uFE0F" },
  { pattern: /(rose|flower|bouquet)/, icon: "\uD83C\uDF39" },
  { pattern: /(chocolate|candy|sweet)/, icon: "\uD83C\uDF6B" },
  { pattern: /(ring)/, icon: "\uD83D\uDC8D" },
  { pattern: /(diamond|gem|jewel)/, icon: "\uD83D\uDC8E" },
  { pattern: /(crown|king|queen|royal)/, icon: "\uD83D\uDC51" },
  { pattern: /(champagne|wine|toast|drink)/, icon: "\uD83C\uDF7E" },
  { pattern: /(star)/, icon: "\u2B50" },
  { pattern: /(teddy|bear|toy)/, icon: "\uD83E\uDDF8" },
  { pattern: /(cake|birthday)/, icon: "\uD83C\uDF82" },
  { pattern: /(gift|box|present|surprise)/, icon: "\uD83C\uDF81" }
];

function resolveGiftIcon(value, fallbackText = "") {
  const iconText = String(value ?? "").trim();
  const iconIsImage = iconText.startsWith("http") || iconText.startsWith("/");
  if (iconIsImage) return iconText;

  const isGenericGiftIcon =
    iconText.length === 0 ||
    iconText === "\uD83C\uDF81" ||
    iconText === "ðŸŽ";
  if (!isGenericGiftIcon) return iconText;

  const normalizedText = String(fallbackText ?? "").toLowerCase();
  const keywordMatch = giftIconByKeyword.find(({ pattern }) => pattern.test(normalizedText));
  return keywordMatch?.icon ?? "\uD83C\uDF81";
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
  const giftName =
    (typeof gift.gift_name === "string" && gift.gift_name.trim()) ||
    (typeof gift.name === "string" && gift.name.trim()) ||
    (typeof gift.title === "string" && gift.title.trim()) ||
    "Gift";
  const icon = resolveGiftIcon(
    gift.icon ?? gift.gift_icon ?? gift.emoji,
    `${giftName} ${gift.title ?? ""} ${gift.name ?? ""}`
  );
  const rawTime =
    (typeof gift.time === "string" && gift.time.trim()) ||
    (typeof gift.created_at === "string" && gift.created_at.trim()) ||
    "";

  return {
    icon,
    from: senderName || "",
    sender: senderName || "",
    receiver: "",
    giftName,
    direction: "received",
    time: rawTime || ""
  };
}

function formatGiftTransactionDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function mapWalletGiftTransactionToGiftItem(transaction) {
  return {
    icon: String(transaction?.icon ?? "\uD83C\uDF81").trim() || "\uD83C\uDF81",
    from: String(transaction?.from ?? "").trim(),
    sender: String(transaction?.sender ?? transaction?.from ?? "").trim(),
    receiver: String(transaction?.receiver ?? "").trim(),
    time: formatGiftTransactionDate(transaction?.createdAt),
    giftName: String(transaction?.giftName ?? "Gift").trim() || "Gift",
    amount: String(transaction?.amount ?? "").trim(),
    direction: String(transaction?.direction ?? "received").trim().toLowerCase()
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

function EditProfileModal({ open, onClose, profile, user }) {
  const t = useTranslations("profile.editModal");
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: interestCatalog = [] } = useGetInterestsQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const safeUser = user ?? {};
  const resolvedName = fullNameFromParts(safeUser, profile.name);
  const nameParts = splitNameParts(resolvedName);
  const [firstName, setFirstName] = useState(
    () => String(safeUser?.first_name ?? nameParts.firstName ?? "").trim()
  );
  const [lastName, setLastName] = useState(
    () => String(safeUser?.last_name ?? nameParts.lastName ?? "").trim()
  );
  const [gender, setGender] = useState(
    () => String(safeUser?.gender ?? profile.gender ?? "").trim()
  );
  const [countryId, setCountryId] = useState(() => {
    const initialCountryId = toInteger(safeUser?.country_id ?? safeUser?.countryId);
    return initialCountryId === null ? "" : String(initialCountryId);
  });
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);
  const [hasInterestsSelection, setHasInterestsSelection] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(profile.avatar || "");
  const [saveError, setSaveError] = useState("");

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

  const defaultCountryId = toInteger(safeUser?.country_id ?? safeUser?.countryId) ?? toInteger(countries[0]?.id);
  const activeCountryId = countryId || (defaultCountryId === null ? "" : String(defaultCountryId));
  const profileInterestNames = new Set(
    (profile.interests ?? []).map((interest) => String(interest).trim().toLowerCase()).filter(Boolean)
  );
  const defaultSelectedInterestIds = interestCatalog
    .filter((interest) => profileInterestNames.has(String(interest?.name ?? "").trim().toLowerCase()))
    .map((interest) => Number(interest.id))
    .filter(Number.isFinite);
  const activeSelectedInterestIds = hasInterestsSelection ? selectedInterestIds : defaultSelectedInterestIds;

  if (!open) return null;

  function toggleInterest(interestId) {
    setHasInterestsSelection(true);
    setSelectedInterestIds((current) => {
      const base = hasInterestsSelection ? current : defaultSelectedInterestIds;
      return base.includes(interestId)
        ? base.filter((id) => id !== interestId)
        : [...base, interestId];
    });
  }

  async function handleSave() {
    setSaveError("");

    if (!firstName.trim() || !lastName.trim() || !gender.trim() || !activeCountryId) {
      setSaveError("Please fill first name, last name, gender and country.");
      return;
    }

    try {
      await updateProfile({
        firstName,
        lastName,
        gender,
        countryId: Number(activeCountryId),
        interests: activeSelectedInterestIds,
        profileImage: profileImageFile
      }).unwrap();
      onClose();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.error ??
        "Could not update profile. Please try again.";
      setSaveError(String(message));
    }
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
              {profileImagePreview ? (
                <Image src={profileImagePreview} alt={t("avatarAlt")} width={92} height={92} unoptimized />
              ) : (
                <ProfileAvatar profile={profile} alt={t("avatarAlt")} size={92} />
              )}
              <label className="profile-edit-photo-btn" aria-label={t("uploadAria")}>
                <Camera size={15} />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setProfileImageFile(file);
                    setProfileImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            <p>{t("uploadHint")}</p>
          </div>

          <label className="profile-edit-field">
            <span>First Name</span>
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>

          <label className="profile-edit-field">
            <span>Last Name</span>
            <input value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </label>

          <label className="profile-edit-field">
            <span>Gender</span>
            <input value={gender} onChange={(event) => setGender(event.target.value)} />
          </label>

          <label className="profile-edit-field">
            <span>Country</span>
            <div className="profile-edit-location-wrap profile-edit-country-wrap">
              <MapPin size={15} />
              <select value={activeCountryId} onChange={(event) => setCountryId(event.target.value)}>
                <option value="">Select country</option>
                {countries.map((country, index) => {
                  const optionValue = country.id ?? country.country_id ?? "";
                  if (optionValue === "") return null;

                  return (
                    <option key={`${optionValue}-${index}`} value={optionValue}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </label>

          <div className="profile-edit-field">
            <span>{t("interests")}</span>
            <div className="profile-interest-chips">
              {interestCatalog.map((interest) => {
                const interestId = Number(interest.id);
                const isSelected = activeSelectedInterestIds.includes(interestId);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    className="profile-interest-chip"
                    onClick={() => toggleInterest(interestId)}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? "[x] " : ""}
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>
          {saveError ? <p className="profile-section-empty" role="alert">{saveError}</p> : null}
        </div>

        <footer className="profile-edit-footer">
          <button type="button" className="profile-cancel-btn" onClick={onClose} disabled={isSaving}>
            {t("cancel")}
          </button>
          <button type="button" className="profile-save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? `${t("save")}...` : t("save")}
          </button>
        </footer>
      </section>
    </div>
  );
}

function GiftTransactionsModal({ open, onClose, transactions }) {
  const t = useTranslations("profile");

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

  return (
    <div className="profile-edit-overlay" role="presentation" onClick={onClose}>
      <section
        className="profile-gifts-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("giftTransactionsTitle")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="profile-edit-header">
          <h3>{t("giftTransactionsTitle")}</h3>
          <button type="button" onClick={onClose} aria-label={t("giftTransactionsCloseAria")}>
            <X size={17} />
          </button>
        </header>

        <div className="profile-gifts-modal-body">
          {transactions.length > 0 ? (
            <div className="profile-received-gifts-list">
              {transactions.map((gift, index) => (
                <div className="profile-received-gift" key={`profile-gift-transaction-${gift.giftName}-${gift.from}-${index}`}>
                  <span className="profile-received-gift-icon" aria-hidden="true">
                    {gift.icon}
                  </span>
                  <div>
                    <strong className={`profile-gift-direction ${gift.direction === "sent" ? "sent" : "received"}`}>
                      {gift.direction === "sent" ? t("transactionDirectionSent") : t("transactionDirectionReceived")}
                    </strong>
                    <strong>
                      {gift.sender
                        ? `${t("fromPrefix", { name: gift.sender })}${gift.giftName ? ` - ${gift.giftName}` : ""}`
                        : gift.giftName || t("emptyField")}
                    </strong>
                    <small>{t("transactionSenderLabel", { name: gift.sender || t("emptyField") })}</small>
                    <small>{t("transactionReceiverLabel", { name: gift.receiver || t("emptyField") })}</small>
                    {gift.time ? <small>{gift.time}</small> : null}
                  </div>
                  {gift.amount ? <span className="profile-gift-amount">{gift.amount}</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-section-empty">{t("giftTransactionsEmpty")}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserData = unwrapCurrentUser(currentUser);
  const profile = buildProfile(currentUser, t);
  const {
    data: walletGiftTransactions = [],
    isFetching: isGiftTransactionsLoading,
    isError: isGiftTransactionsError
  } = useGetWalletGiftTransactionsQuery();
  const photos = profile.photos;
  const mappedWalletGiftTransactions = walletGiftTransactions.map(mapWalletGiftTransactionToGiftItem);
  const hasWalletGiftTransactions = mappedWalletGiftTransactions.length > 0;
  const allGiftTransactions = hasWalletGiftTransactions ? mappedWalletGiftTransactions : profile.receivedGifts;
  const receivedWalletGifts = mappedWalletGiftTransactions.filter((transaction) => transaction.direction !== "sent");
  const receivedGifts = hasWalletGiftTransactions
    ? receivedWalletGifts
    : profile.receivedGifts;
  const tags = profile.interests;
  const receivedGiftsCount = receivedGifts.length;
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
    },
    {
      label: t("statsLabels.giftsReceived"),
      value: String(receivedGiftsCount),
      tone: "purple"
    }
  ];
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGiftTransactionsOpen, setIsGiftTransactionsOpen] = useState(false);

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

        <article
          className={`profile-received-gifts-panel ${receivedGifts.length === 0 ? "compact-empty" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setIsGiftTransactionsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsGiftTransactionsOpen(true);
            }
          }}
          aria-label={t("openGiftTransactionsAria")}
        >
          <div className="profile-gifts-heading-row">
            <h2>
              <Gift size={20} />
              {t("giftsReceivedHeading")}
            </h2>
            <span className="profile-gifts-count">{receivedGiftsCount}</span>
          </div>
          {isGiftTransactionsLoading && mappedWalletGiftTransactions.length === 0 ? (
            <p className="profile-section-empty">{t("giftTransactionsLoading")}</p>
          ) : null}
          {isGiftTransactionsError && mappedWalletGiftTransactions.length === 0 ? (
            <p className="profile-section-empty">{t("giftTransactionsLoadError")}</p>
          ) : null}
          {receivedGifts.length > 0 ? (
            <div className="profile-received-gifts-list">
              {receivedGifts.map((gift, index) => (
                <div className="profile-received-gift" key={`profile-received-gift-${index}`}>
                  <span className="profile-received-gift-icon" aria-hidden="true">
                    {gift.icon}
                  </span>
                  <div>
                    <strong>
                      {gift.from
                        ? `${t("fromPrefix", { name: gift.from })}${gift.giftName ? ` - ${gift.giftName}` : ""}`
                        : gift.giftName || t("emptyField")}
                    </strong>
                    {gift.time ? <small>{gift.time}</small> : null}
                  </div>
                  {gift.amount ? <span className="profile-gift-amount">{gift.amount}</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-section-empty">{t("emptyReceivedGifts")}</p>
          )}
        </article>
      </section>

      {isEditOpen ? (
        <EditProfileModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
          user={currentUserData}
        />
      ) : null}
      {isGiftTransactionsOpen ? (
        <GiftTransactionsModal
          open={isGiftTransactionsOpen}
          onClose={() => setIsGiftTransactionsOpen(false)}
          transactions={allGiftTransactions}
        />
      ) : null}
    </DashboardShell>
  );
}

