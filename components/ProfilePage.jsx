"use client";

import { Camera, Edit, Gift, Images, MapPin, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";

const stats = [
  { label: "Connections", value: "124", tone: "peach" },
  { label: "Gifts Sent", value: "38", tone: "purple" },
  { label: "Gifts Received", value: "5", tone: "cream" }
];

const gifts = [
  { icon: "\u2764\uFE0F", from: "Ahmed", time: "2 hours ago" },
  { icon: "\uD83C\uDF39", from: "Sarah", time: "5 hours ago" },
  { icon: "\uD83D\uDC8E", from: "Maya", time: "1 day ago" }
];

const photos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=420&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=420&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=420&q=80",
  "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=420&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=420&q=80"
];

const suggestedInterests = [
  "Photography",
  "Sports",
  "Reading",
  "Cooking",
  "Technology",
  "Fashion",
  "Movies",
  "Gaming",
  "Fitness",
  "Dancing",
  "Writing",
  "Nature",
  "Coffee"
];

function EditProfileModal({ open, onClose }) {
  const [bio, setBio] = useState("Tell us about yourself...");
  const [interests, setInterests] = useState(["Travel", "Art", "Music"]);
  const [customInterest, setCustomInterest] = useState("");

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
        aria-label="Edit Profile"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="profile-edit-header">
          <h3>Edit Profile</h3>
          <button type="button" onClick={onClose} aria-label="Close edit profile">
            <X size={17} />
          </button>
        </header>

        <div className="profile-edit-body">
          <div className="profile-edit-avatar-wrap">
            <div className="profile-edit-avatar">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=220&q=85"
                alt="Edit profile avatar"
                width={92}
                height={92}
              />
              <button type="button" aria-label="Upload profile photo" className="profile-edit-photo-btn">
                <Camera size={15} />
              </button>
            </div>
            <p>Click to upload a new photo</p>
          </div>

          <label className="profile-edit-field">
            <span>Name</span>
            <input defaultValue="My Profile" />
          </label>

          <label className="profile-edit-field">
            <span>Age</span>
            <input defaultValue="26" />
          </label>

          <label className="profile-edit-field">
            <span>Location</span>
            <div className="profile-edit-location-wrap">
              <MapPin size={15} />
              <input defaultValue="New York, USA" />
            </div>
          </label>

          <label className="profile-edit-field">
            <span>Bio</span>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} />
            <small>{Math.min(bio.length, 200)}/200 characters</small>
          </label>

          <div className="profile-edit-field">
            <span>Interests (Max 8)</span>
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
                placeholder="Add custom interest..."
              />
              <button type="button" onClick={handleCustomInterest} aria-label="Add custom interest">
                <Plus size={16} />
              </button>
            </div>

            <div className="profile-suggested-row">
              <p>Suggested:</p>
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
            Cancel
          </button>
          <button type="button" className="profile-save-btn" onClick={onClose}>
            Save Changes
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardShell activePage="Profile" title="Profile" subtitle="Your profile and settings">
      <section className="profile-page">
        <article className="profile-summary-card">
          <button className="edit-profile-button" type="button" onClick={() => setIsEditOpen(true)}>
            <Edit size={17} />
            Edit
          </button>

          <div className="profile-summary-head">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=180&q=85"
              alt="My profile"
              width={84}
              height={84}
            />
            <div>
              <h2>My Profile</h2>
              <p>
                <MapPin size={16} />
                New York, USA
              </p>
              <div className="profile-tags">
                <span>Travel</span>
                <span>Art</span>
                <span>Music</span>
              </div>
            </div>
          </div>

          <p className="profile-bio">
            {"Living life one adventure at a time \u2728 Love connecting with kind souls and spreading positivity \uD83D\uDC95"}
          </p>

          <div className="profile-stats">
            {stats.map((stat) => (
              <div className={stat.tone} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="received-gifts-panel">
          <div className="received-gifts-head">
            <h2>
              <Gift size={20} />
              Gifts Received
            </h2>
          </div>

          <div className="received-gifts-list">
            {gifts.map((gift) => (
              <div className="received-gift" key={`${gift.from}-${gift.time}`}>
                <span className="received-gift-icon">{gift.icon}</span>
                <div>
                  <strong>From {gift.from}</strong>
                  <small>{gift.time}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="profile-photos-panel">
          <h2>
            <Images size={20} />
            Photos
          </h2>
          <div className="profile-photos-grid">
            {photos.map((photo, index) => (
              <div className={index === 0 ? "main-photo" : ""} key={`profile-photo-${index}`}>
                <Image
                  src={photo}
                  alt={`Profile photo ${index + 1}`}
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
