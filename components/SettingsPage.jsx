"use client";

import {
  ChevronRight,
  FileText,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Phone,
  Shield,
  Trash2,
  User,
  UserX,
  X
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";

function SectionHeader({ icon: Icon, title, tone }) {
  return (
    <header className={`settings-card-header ${tone}`}>
      <h2>
        <Icon size={17} />
        {title}
      </h2>
    </header>
  );
}

function resolveSettingsIcon(key) {
  const icons = {
    phone: Phone,
    lock: Lock,
    language: Languages,
    blocked: UserX,
    help: HelpCircle,
    terms: FileText,
    privacy: Shield,
    about: User
  };

  return icons[key] ?? HelpCircle;
}

function AccountModal({ type, onClose }) {
  const t = useTranslations("settings.modal");

  const config = useMemo(() => {
    if (!type) return null;
    if (type !== "phone" && type !== "password") return null;
    return t.raw(type);
  }, [t, type]);

  useEffect(() => {
    function onEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  if (!type || !config) return null;

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{config.title}</h3>
            <p>{config.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={config.closeAria}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          {config.fields.map((field) => (
            <label className="settings-account-field" key={field.label}>
              <span>{field.label}</span>
              <input
                type={field.type}
                defaultValue={field.defaultValue}
                placeholder={field.placeholder}
                readOnly={field.readOnly}
              />
            </label>
          ))}
        </div>

        <footer className="settings-account-modal-footer">
          <button type="button" className="settings-account-cancel" onClick={onClose}>
            {t("cancel")}
          </button>
          <button type="button" className="settings-account-submit" onClick={onClose}>
            {config.actionLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

function LanguageModal({ open, onClose }) {
  const t = useTranslations("settings.languageModal");

  if (!open) return null;

  function switchLocale(locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{t("title")}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("closeAria")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          <div className="settings-actions-v2">
            <button type="button" className="settings-action-button" onClick={() => switchLocale("en")}>
              {t("english")}
            </button>
            <button type="button" className="settings-action-button" onClick={() => switchLocale("ar")}>
              {t("arabic")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlockedUsersModal({ open, onClose }) {
  const t = useTranslations("settings.blockedUsersModal");
  const users = t.raw("users");

  if (!open) return null;

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{t("title")}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          {users.length === 0 ? (
            <p>{t("empty")}</p>
          ) : (
            <div className="settings-list-v2">
              {users.map((user) => (
                <div className="settings-row" key={user.name}>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.reason}</small>
                  </div>
                  <button type="button" className="settings-account-cancel">
                    {t("unblock")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SupportModal({ type, onClose }) {
  const t = useTranslations("settings");

  const config = useMemo(() => {
    if (!type) return null;
    const all = t.raw("supportContent");
    return all?.[type] ?? null;
  }, [t, type]);

  if (!type || !config) return null;

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{config.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label={t("supportModal.closeAria")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          <p>{config.body}</p>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations("settings");

  function readList(key) {
    const value = t.raw(key);
    return Array.isArray(value) ? value : [];
  }

  const accountItems = readList("accountItems");
  const supportItems = readList("supportItems");

  const [activeAccountModal, setActiveAccountModal] = useState(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isBlockedUsersOpen, setIsBlockedUsersOpen] = useState(false);
  const [activeSupportModal, setActiveSupportModal] = useState(null);

  function handleAccountClick(key) {
    if (key === "phone" || key === "password") {
      setActiveAccountModal(key);
      return;
    }

    if (key === "language") {
      setIsLanguageModalOpen(true);
      return;
    }

    if (key === "blocked") {
      setIsBlockedUsersOpen(true);
    }
  }

  return (
    <DashboardShell activePageKey="settings" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="settings-page">
        <div className="settings-grid">
          <article className="settings-card-v2">
            <SectionHeader icon={User} title={t("sections.account")} tone="peach" />
            <div className="settings-list-v2">
              {accountItems.map(({ key, title, description, icon, tone }) => {
                const Icon = resolveSettingsIcon(icon);
                const resolvedSubtitle = key === "language" ? t(`languages.${locale}`) : description;

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={key}
                    type="button"
                    onClick={() => handleAccountClick(key)}
                  >
                    <span className={`settings-badge ${tone}`}>
                      <Icon size={16} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      {resolvedSubtitle ? <small>{resolvedSubtitle}</small> : null}
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={HelpCircle} title={t("sections.support")} tone="mint" />
            <div className="settings-list-v2">
              {supportItems.map(({ key, title, subtitle, icon }) => {
                const Icon = resolveSettingsIcon(icon);

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={key}
                    type="button"
                    onClick={() => setActiveSupportModal(key)}
                  >
                    <Icon size={16} />
                    <div>
                      <strong>{title}</strong>
                      {subtitle ? <small>{subtitle}</small> : null}
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <div className="settings-actions-v2">
          <button type="button" className="settings-action-button">
            <LogOut size={15} />
            {t("actions.logout")}
          </button>
          <button type="button" className="settings-action-button danger">
            <Trash2 size={15} />
            {t("actions.deleteAccount")}
          </button>
        </div>
      </section>

      <AccountModal type={activeAccountModal} onClose={() => setActiveAccountModal(null)} />
      <LanguageModal open={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
      <BlockedUsersModal open={isBlockedUsersOpen} onClose={() => setIsBlockedUsersOpen(false)} />
      <SupportModal type={activeSupportModal} onClose={() => setActiveSupportModal(null)} />
    </DashboardShell>
  );
}
