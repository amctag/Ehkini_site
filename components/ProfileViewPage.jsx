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
import DashboardShell from "./DashboardShell";

const profiles = {
  sarah: {
    name: "Sarah Ahmad",
    location: "Dubai, UAE",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=220&q=85",
    cover:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1800&q=80",
    about:
      "Travel enthusiast \uD83C\uDF0D | Coffee lover \u2615 | Looking for someone who shares my passion for adventure and meaningful conversations.",
    occupation: "Marketing Manager",
    education: "Masters in Business",
    memberSince: "January 2024",
    interests: ["Travel", "Photography", "Reading", "Cooking", "Yoga", "Art"],
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=360&q=80"
    ]
  }
};

function buildFallbackProfile(slug) {
  const safeSlug = typeof slug === "string" && slug.trim() ? slug : "profile";

  const displayName = safeSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    ...profiles.sarah,
    name: displayName || "Profile",
    about:
      "Open to new friendships, shared hobbies, and meaningful conversations with kind people.",
    interests: ["Travel", "Music", "Art", "Reading", "Fitness", "Nature"]
  };
}

export default function ProfileViewPage({ slug }) {
  const safeSlug = typeof slug === "string" ? slug.toLowerCase() : "";
  const profile = profiles[safeSlug] ?? buildFallbackProfile(safeSlug);

  return (
    <DashboardShell activePage="Discover" title="Discover" subtitle="Find your perfect match">
      <section className="profile-view-page">
        <div className="profile-view-cover">
          <Image src={profile.cover} alt={`${profile.name} cover`} fill sizes="100vw" />
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
            Add Friend
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
          <Link href="/messages" className="message" aria-label={`Message ${profile.name}`}>
            <MessageCircle size={16} />
            Message
          </Link>
        </div>

        <div className="profile-view-grid">
          <div className="profile-view-left">
            <article className="profile-view-card">
              <h3>About</h3>
              <p>{profile.about}</p>
            </article>

            <article className="profile-view-card">
              <h3>Details</h3>
              <div className="profile-view-detail-list">
                <div>
                  <BriefcaseBusiness size={16} />
                  <span>
                    <strong>Occupation</strong>
                    <small>{profile.occupation}</small>
                  </span>
                </div>
                <div>
                  <GraduationCap size={16} />
                  <span>
                    <strong>Education</strong>
                    <small>{profile.education}</small>
                  </span>
                </div>
                <div>
                  <Calendar size={16} />
                  <span>
                    <strong>Member Since</strong>
                    <small>{profile.memberSince}</small>
                  </span>
                </div>
              </div>
            </article>

            <article className="profile-view-card">
              <h3>Interests</h3>
              <div className="profile-view-interests">
                {profile.interests.map((interest) => (
                  <span key={`${profile.name}-${interest}`}>{interest}</span>
                ))}
              </div>
            </article>
          </div>

          <article className="profile-view-card photos">
            <h3>Photos</h3>
            <div className="profile-view-photos">
              {profile.photos.map((photo, index) => (
                <div className={index === 0 ? "main-photo" : ""} key={`${profile.name}-photo-${index}`}>
                  <Image
                    src={photo}
                    alt={`${profile.name} photo ${index + 1}`}
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
