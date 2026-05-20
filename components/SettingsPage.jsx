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
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";

const privacyItems = [
  {
    title: "Profile Visibility",
    description: "Show profile to others",
    icon: Eye
  },
  {
    title: "Online Status",
    description: "Show when you're active",
    icon: Globe
  },
  {
    title: "Read Receipts",
    description: "Let others know you've read their messages",
    icon: Mail
  }
];

const notificationItems = [
  {
    title: "Push Notifications",
    description: "Receive push notifications"
  },
  {
    title: "Email Notifications",
    description: "Receive email updates"
  },
  {
    title: "New Messages",
    description: "Notify on new messages"
  },
  {
    title: "Gifts Received",
    description: "Notify when you receive gifts"
  }
];

const accountItems = [
  {
    key: "email",
    title: "Email Address",
    description: "user@example.com",
    icon: Mail,
    tone: "blue"
  },
  {
    key: "phone",
    title: "Phone Number",
    description: "+1 (555) 123-4567",
    icon: Phone,
    tone: "green"
  },
  {
    key: "password",
    title: "Change Password",
    description: "Update your password",
    icon: Lock,
    tone: "purple"
  }
];

const supportItems = [
  { title: "Help Center", icon: HelpCircle },
  { title: "Terms of Service", icon: FileText },
  { title: "Privacy Policy", icon: Shield },
  { title: "About Taaruf", icon: User },
  { title: "Language", subtitle: "English", icon: Languages }
];

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

function AccountModal({ type, onClose }) {
  const config = useMemo(() => {
    if (type === "email") {
      return {
        title: "Change Email Address",
        subtitle: "We'll send a verification link to your new email",
        actionLabel: "Send Verification",
        fields: [
          {
            label: "Current Email",
            type: "email",
            defaultValue: "user@example.com",
            readOnly: true
          },
          {
            label: "New Email",
            type: "email",
            placeholder: "Enter new email address"
          },
          {
            label: "Password",
            type: "password",
            placeholder: "Confirm your password"
          }
        ]
      };
    }

    if (type === "phone") {
      return {
        title: "Change Phone Number",
        subtitle: "We'll send a verification code to your new number",
        actionLabel: "Send Code",
        fields: [
          {
            label: "Current Phone",
            type: "text",
            defaultValue: "+1 (555) 123-4567",
            readOnly: true
          },
          {
            label: "New Phone Number",
            type: "tel",
            placeholder: "Enter new phone number"
          }
        ]
      };
    }

    return {
      title: "Change Password",
      subtitle: "Enter your current password and choose a new one",
      actionLabel: "Update Password",
      fields: [
        {
          label: "Current Password",
          type: "password",
          placeholder: "Enter current password"
        },
        {
          label: "New Password",
          type: "password",
          placeholder: "Enter new password"
        },
        {
          label: "Confirm New Password",
          type: "password",
          placeholder: "Confirm new password"
        }
      ]
    };
  }, [type]);

  useEffect(() => {
    function onEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  if (!type) return null;

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
          <button type="button" onClick={onClose} aria-label={`Close ${config.title}`}>
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
            Cancel
          </button>
          <button type="button" className="settings-account-submit" onClick={onClose}>
            {config.actionLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  const [activeAccountModal, setActiveAccountModal] = useState(null);

  return (
    <DashboardShell activePage="Settings" title="Settings" subtitle="Settings & Privacy">
      <section className="settings-page">
        <div className="settings-grid">
          <article className="settings-card-v2">
            <SectionHeader icon={Shield} title="Privacy & Security" tone="blue" />
            <div className="settings-list-v2">
              {privacyItems.map(({ title, description, icon: Icon }) => (
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
              ))}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={User} title="Account" tone="peach" />
            <div className="settings-list-v2">
              {accountItems.map(({ key, title, description, icon: Icon, tone }) => (
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
              ))}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={Bell} title="Notifications" tone="peach" />
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
            <SectionHeader icon={HelpCircle} title="Support & Legal" tone="mint" />
            <div className="settings-list-v2">
              {supportItems.map(({ title, subtitle, icon: Icon }) => (
                <button className="settings-row settings-link-row" key={title} type="button">
                  <Icon size={16} />
                  <div>
                    <strong>{title}</strong>
                    {subtitle ? <small>{subtitle}</small> : null}
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="settings-actions-v2">
          <button type="button" className="settings-action-button">
            <LogOut size={15} />
            Log Out
          </button>
          <button type="button" className="settings-action-button danger">
            <Trash2 size={15} />
            Delete Account
          </button>
        </div>
      </section>
      <AccountModal type={activeAccountModal} onClose={() => setActiveAccountModal(null)} />
    </DashboardShell>
  );
}
