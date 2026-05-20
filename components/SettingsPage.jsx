"use client";

import {
  Bell,
  ChevronRight,
  Eye,
  FileText,
  Globe,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  Trash2,
  User,
  X
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";

function Toggle() {
  return (
    <label className="settings-toggle">
      <input type="checkbox" defaultChecked />
      <span />
    </label>
  );
}

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
    eye: Eye,
    globe: Globe,
    mail: Mail,
    phone: Phone,
    lock: Lock,
    help: HelpCircle,
    terms: FileText,
    privacy: Shield,
    about: User,
    language: Languages
  };

  return icons[key] ?? HelpCircle;
}

function AccountModal({ type, onClose }) {
  const t = useTranslations("settings.modal");

  const config = useMemo(() => {
    if (!type) return null;
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

export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations("settings");

  function readList(key) {
    const value = t.raw(key);
    return Array.isArray(value) ? value : [];
  }

  const privacyItems = readList("privacyItems");
  const notificationItems = readList("notificationItems");
  const accountItems = readList("accountItems");
  const supportItems = readList("supportItems");
  const [activeAccountModal, setActiveAccountModal] = useState(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <DashboardShell activePageKey="settings" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="settings-page">
        <div className="settings-grid">
          <article className="settings-card-v2">
            <SectionHeader icon={Shield} title={t("sections.privacy")} tone="blue" />
            <div className="settings-list-v2">
              {privacyItems.map(({ title, description, icon }) => {
                const Icon = resolveSettingsIcon(icon);

                return (
                  <div className="settings-row toggle-row" key={title}>
                    <div className="settings-row-main">
                      <Icon size={17} />
                      <div>
                        <strong>{title}</strong>
                        <small>{description}</small>
                      </div>
                    </div>
                    <Toggle />
                  </div>
                );
              })}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={User} title={t("sections.account")} tone="peach" />
            <div className="settings-list-v2">
              {accountItems.map(({ key, title, description, icon, tone }) => {
                const Icon = resolveSettingsIcon(icon);

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={key}
                    type="button"
                    onClick={() => setActiveAccountModal(key)}
                  >
                    <span className={`settings-badge ${tone}`}>
                      <Icon size={16} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <small>{description}</small>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={Bell} title={t("sections.notifications")} tone="peach" />
            <div className="settings-list-v2">
              {notificationItems.map(({ title, description }) => (
                <div className="settings-row toggle-row" key={title}>
                  <div className="settings-row-main">
                    <div>
                      <strong>{title}</strong>
                      <small>{description}</small>
                    </div>
                  </div>
                  <Toggle />
                </div>
              ))}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={HelpCircle} title={t("sections.support")} tone="mint" />
            <div className="settings-list-v2">
              {supportItems.map(({ title, subtitle, icon }) => {
                const Icon = resolveSettingsIcon(icon);
                const resolvedSubtitle = icon === "language" ? t(`languages.${locale}`) : subtitle;

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={title}
                    type="button"
                    onClick={icon === "language" ? () => setIsLanguageModalOpen(true) : undefined}
                  >
                    <Icon size={16} />
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
    </DashboardShell>
  );
}
