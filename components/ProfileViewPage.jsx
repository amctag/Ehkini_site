"use client";

import {
  BriefcaseBusiness,
  Calendar,
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
import DashboardShell from "./DashboardShell";

function buildFallbackProfile(slug, defaults, fallbackName) {
  const safeSlug = typeof slug === "string" && slug.trim() ? slug : "profile";

  const displayName = safeSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    ...defaults,
    name: displayName || fallbackName,
    about: defaults.fallbackAbout,
    interests: defaults.fallbackInterests
  };
}

export default function ProfileViewPage({ slug }) {
  const t = useTranslations("profileView");
  const profiles = t.raw("profiles");
  const fallbackName = t("fallbackName");
  const fallbackAbout = t("fallbackAbout");
  const fallbackInterests = t.raw("fallbackInterests");

  const safeSlug = typeof slug === "string" ? slug.toLowerCase() : "";
  const defaultProfile = {
    ...profiles.sarah,
    fallbackAbout,
    fallbackInterests
  };
  const profile = profiles[safeSlug] ?? buildFallbackProfile(safeSlug, defaultProfile, fallbackName);

  return (
    <DashboardShell activePageKey="discover" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="profile-view-page">
        <div className="profile-view-cover">
          <Image src={profile.cover} alt={t("coverAlt", { name: profile.name })} fill sizes="100vw" />
        </div>

        <div className="profile-view-head">
          <div className="profile-view-avatar">
            <Image src={profile.avatar} alt={profile.name} width={100} height={100} />
            <span className={profile.status === "online" ? "online" : ""} />
          </div>

          <h2>{profile.name}</h2>
          <p>{profile.location}</p>
        </div>

        <div className="profile-view-actions">
          <button type="button" className="add-friend">
            <UserPlus size={16} />
            {t("addFriend")}
          </button>
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
                  <BriefcaseBusiness size={16} />
                  <span>
                    <strong>{t("detailLabels.occupation")}</strong>
                    <small>{profile.occupation}</small>
                  </span>
                </div>
                <div>
                  <GraduationCap size={16} />
                  <span>
                    <strong>{t("detailLabels.education")}</strong>
                    <small>{profile.education}</small>
                  </span>
                </div>
                <div>
                  <Calendar size={16} />
                  <span>
                    <strong>{t("detailLabels.memberSince")}</strong>
                    <small>{profile.memberSince}</small>
                  </span>
                </div>
              </div>
            </article>

            <article className="profile-view-card">
              <h3>{t("sections.interests")}</h3>
              <div className="profile-view-interests">
                {profile.interests.map((interest) => (
                  <span key={`${profile.name}-${interest}`}>{interest}</span>
                ))}
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
