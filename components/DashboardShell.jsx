"use client";

import { Bell, Check, Gift, Heart, Inbox, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const notifications = [
  {
    id: 1,
    icon: Gift,
    accent: "orange",
    title: "Sarah Ahmad sent you a Red Rose",
    subtitle: "2 min ago",
    badge: "New"
  },
  {
    id: 2,
    icon: Heart,
    accent: "pink",
    title: "Fatima Hassan liked your profile",
    subtitle: "15 min ago",
    badge: "New"
  },
  {
    id: 3,
    icon: Gift,
    accent: "purple",
    title: "Amira Khan viewed your story",
    subtitle: "1 hour ago",
    badge: "New"
  },
  {
    id: 4,
    icon: Heart,
    accent: "green",
    title: "Layla Mohammed matched with you! Start chatting now",
    subtitle: "3 hours ago",
    actions: ["Send Message", "View Profile"]
  },
  {
    id: 5,
    icon: Gift,
    accent: "orange",
    title: "Zara Ali sent you a Diamond Ring",
    subtitle: "5 hours ago"
  }
];

function NotificationsPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="notifications-overlay" onClick={onClose} role="presentation">
      <section
        className="notifications-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="notifications-header">
          <div className="notifications-title">
            Notifications <span>3</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close notifications">
            <X size={17} />
          </button>
        </header>

        <div className="notifications-toolbar">
          <div className="notification-tabs">
            <button type="button" className="active">
              All
            </button>
            <button type="button">Unread (3)</button>
          </div>
          <button type="button" className="mark-read-button">
            <Check size={14} />
            Mark all read
          </button>
        </div>

        <div className="notifications-list">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <article className="notification-item" key={item.id}>
                <div className={`notification-icon ${item.accent}`}>
                  <Icon size={15} />
                </div>

                <div className="notification-copy">
                  <p>{item.title}</p>
                  <div className="notification-meta">
                    <small>{item.subtitle}</small>
                    {item.badge ? <span className="notification-new">{item.badge}</span> : null}
                  </div>

                  {item.actions ? (
                    <div className="notification-actions">
                      <button type="button" className="send">
                        {item.actions[0]}
                      </button>
                      <button type="button" className="view">
                        {item.actions[1]}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="notification-side">
                  <button type="button" aria-label="Dismiss notification">
                    <X size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Topbar({ title, subtitle }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!isNotificationsOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isNotificationsOpen]);

  return (
    <>
      <header className="discover-topbar">
        <button className="mobile-menu" type="button" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="topbar-actions">
          <Link href="/messages" className="topbar-inbox-button" aria-label="Inbox">
            <Inbox size={20} />
            Inbox
          </Link>
          <button
            type="button"
            aria-label="Notifications"
            className="notification-button"
            onClick={() => setIsNotificationsOpen((value) => !value)}
          >
            <Bell size={25} />
            <span>5</span>
          </button>
          <Link href="/profile" aria-label="Go to profile">
            <Image
              width={40}
              height={40}
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80"
              alt="Your profile"
            />
          </Link>
        </div>
      </header>
      <NotificationsPopup open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}

export default function DashboardShell({ activePage, title, subtitle, children }) {
  return (
    <main className="discover-app">
      <Sidebar activePage={activePage} />
      <div className="discover-main">
        <Topbar title={title} subtitle={subtitle} />
        <div className="discover-content">{children}</div>
      </div>
    </main>
  );
}
