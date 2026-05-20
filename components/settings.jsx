import {
  Bell,
  Globe,
  Eye,
  Lock,
  Mail,
  Phone,
  Shield,
  LogOut,
  Trash2
} from "lucide-react";

import DashboardShell from "./DashboardShell";

const privacySettings = [
  {
    icon: <Eye size={18} />,
    title: "Profile Visibility",
    desc: "Show profile to others",
    active: true
  },
  {
    icon: <Globe size={18} />,
    title: "Online Status",
    desc: "Show when you're active",
    active: true
  },
  {
    icon: <Mail size={18} />,
    title: "Read Receipts",
    desc: "Let others know you've read their messages",
    active: true
  }
];

const notificationSettings = [
  {
    icon: <Bell size={18} />,
    title: "Push Notifications",
    desc: "Receive push notifications",
    active: true
  },
  {
    icon: <Mail size={18} />,
    title: "Email Notifications",
    desc: "Receive email updates",
    active: true
  },
  {
    icon: <Bell size={18} />,
    title: "New Messages",
    desc: "Notify on new messages",
    active: true
  }
];

export default function SettingsPage() {
  return (
    <DashboardShell
      activePage="Settings"
      title="Settings"
      subtitle="Settings & Privacy"
    >
      <section className="settings-page">

        {/* LEFT SIDE */}
        <div className="settings-left">

          {/* PRIVACY */}
          <article className="settings-card">
            <h2>
              <Shield size={18} />
              Privacy & Security
            </h2>

            <div className="settings-list">
              {privacySettings.map((item) => (
                <div className="settings-item" key={item.title}>
                  <div className="settings-item-left">
                    <span className="icon">{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.desc}</small>
                    </div>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked={item.active} />
                    <span className="slider" />
                  </label>
                </div>
              ))}
            </div>
          </article>

          {/* NOTIFICATIONS */}
          <article className="settings-card">
            <h2>
              <Bell size={18} />
              Notifications
            </h2>

            <div className="settings-list">
              {notificationSettings.map((item) => (
                <div className="settings-item" key={item.title}>
                  <div className="settings-item-left">
                    <span className="icon">{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.desc}</small>
                    </div>
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked={item.active} />
                    <span className="slider" />
                  </label>
                </div>
              ))}
            </div>
          </article>

        </div>

        {/* RIGHT SIDE */}
        <div className="settings-right">

          {/* ACCOUNT */}
          <article className="settings-card">
            <h2>Account</h2>

            <div className="settings-link">
              <Mail size={18} />
              <div>
                <strong>Email Address</strong>
                <small>user@example.com</small>
              </div>
            </div>

            <div className="settings-link">
              <Phone size={18} />
              <div>
                <strong>Phone Number</strong>
                <small>+1 (555) 123-4567</small>
              </div>
            </div>

            <div className="settings-link">
              <Lock size={18} />
              <div>
                <strong>Change Password</strong>
                <small>Update your password</small>
              </div>
            </div>
          </article>

          {/* SUPPORT */}
          <article className="settings-card">
            <h2>Support & Legal</h2>

            <button className="settings-link-btn">Help Center</button>
            <button className="settings-link-btn">Terms of Service</button>
            <button className="settings-link-btn">Privacy Policy</button>
            <button className="settings-link-btn">About Ehkini</button>
            <button className="settings-link-btn">Language</button>
          </article>

          {/* ACTIONS */}
          <article className="settings-actions">
            <button className="logout-btn">
              <LogOut size={18} />
              Log Out
            </button>

            <button className="delete-btn">
              <Trash2 size={18} />
              Delete Account
            </button>
          </article>

        </div>

      </section>
    </DashboardShell>
  );
}