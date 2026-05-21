"use client";

import { Bell, Check, Gift, Heart, Inbox, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function NotificationsPopup({ open, onClose }) {
  const t = useTranslations("dashboard.popup");
  const notifications = t.raw("items");

  if (!open) return null;

  function resolveIcon(name) {
    return name === "heart" ? Heart : Gift;
  }

  return (
    <div className="notifications-overlay" onClick={onClose} role="presentation">
      <section
        className="notifications-popup"
        role="dialog"
        aria-modal="true"
        aria-label={t("ariaLabel")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="notifications-header">
          <div className="notifications-title">
            {t("title")} <span>{t("count")}</span>
          </div>
          <button type="button" onClick={onClose} aria-label={t("closeAria")}>
            <X size={17} />
          </button>
        </header>

        <div className="notifications-toolbar">
          <div className="notification-tabs">
            <button type="button" className="active">
              {t("tabs.all")}
            </button>
            <button type="button">{t("tabs.unread")}</button>
          </div>
          <button type="button" className="mark-read-button">
            <Check size={14} />
            {t("markRead")}
          </button>
        </div>

        <div className="notifications-list">
          {notifications.map((item) => {
            const Icon = resolveIcon(item.icon);

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
                  <button type="button" aria-label={t("dismissAria")}>
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

function Topbar({ title, subtitle, notificationCount, onOpenMobileSidebar }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const t = useTranslations("dashboard");

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
        <button className="mobile-menu" type="button" aria-label={t("mobileMenuAria")} onClick={onOpenMobileSidebar}>
          <Menu size={22} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="topbar-actions">
          <Link href="/messages" className="topbar-inbox-button" aria-label={t("inboxAria")}>
            <Inbox size={20} />
            <span className="topbar-inbox-label">{t("inbox")}</span>
          </Link>
          <button
            type="button"
            aria-label={t("notificationsAria")}
            className="notification-button"
            onClick={() => setIsNotificationsOpen((value) => !value)}
          >
            <Bell size={25} />
            <span>{notificationCount}</span>
          </button>
          <Link href="/profile" aria-label={t("profileAria")}>
            <Image
              width={40}
              height={40}
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80"
              alt={t("profileImageAlt")}
            />
          </Link>
        </div>
      </header>
      <NotificationsPopup open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}

export default function DashboardShell({ activePageKey, title, subtitle, children }) {
  const t = useTranslations("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <main className="discover-app">
      {isMobileSidebarOpen ? (
        <button
          type="button"
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label={t("mobileMenuAria")}
        />
      ) : null}
      <Sidebar
        activePageKey={activePageKey}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="discover-main">
        <Topbar
          title={title}
          subtitle={subtitle}
          notificationCount={t("notificationCount")}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <div className="discover-content">{children}</div>
      </div>
    </main>
  );
}
