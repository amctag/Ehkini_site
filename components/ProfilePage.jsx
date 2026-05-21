"use client";

import { Camera, Edit, Images, MapPin, Plus, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";

function EditProfileModal({ open, onClose }) {
  const t = useTranslations("profile.editModal");
  const [bio, setBio] = useState(t("bioDefault"));
  const [interests, setInterests] = useState(t.raw("initialInterests"));
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
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=220&q=85"
                alt={t("avatarAlt")}
                width={92}
                height={92}
              />
              <button type="button" aria-label={t("uploadAria")} className="profile-edit-photo-btn">
                <Camera size={15} />
              </button>
            </div>
            <p>{t("uploadHint")}</p>
          </div>

          <label className="profile-edit-field">
            <span>{t("name")}</span>
            <input defaultValue={t("nameDefault")} />
          </label>

          <label className="profile-edit-field">
            <span>{t("age")}</span>
            <input defaultValue={t("ageDefault")} />
          </label>

          <label className="profile-edit-field">
            <span>{t("location")}</span>
            <div className="profile-edit-location-wrap">
              <MapPin size={15} />
              <input defaultValue={t("locationDefault")} />
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
  const stats = t.raw("stats");
  const photos = t.raw("photos");
  const tags = t.raw("tags");
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
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=180&q=85"
              alt={t("avatarAlt")}
              width={84}
              height={84}
            />
            <div>
              <h2>{t("myProfile")}</h2>
              <p>
                <MapPin size={16} />
                {t("location")}
              </p>
              <div className="profile-tags">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="profile-bio">{t("bio")}</p>

          <div className="profile-stats">
            {stats.map((stat) => (
              <div className={stat.tone} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="profile-photos-panel">
          <h2>
            <Images size={20} />
            {t("photosHeading")}
          </h2>
          <div className="profile-photos-grid">
            {photos.map((photo, index) => (
              <div className={index === 0 ? "main-photo" : ""} key={`profile-photo-${index}`}>
                <Image
                  src={photo}
                  alt={t("photoAlt", { index: index + 1 })}
                  fill
                  sizes="(max-width: 620px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </article>
      </section>

      <EditProfileModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </DashboardShell>
  );
}
