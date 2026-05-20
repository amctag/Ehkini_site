import { DollarSign, Edit, Gift, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";
import DashboardShell from "./DashboardShell";

const stats = [
  { label: "Connections", value: "124", tone: "peach" },
  { label: "Gifts Sent", value: "38", tone: "purple" },
  { label: "Gifts Received", value: "5", tone: "cream" }
];

const gifts = [
  { icon: "❤️", from: "Ahmed", time: "2 hours ago", amount: "+$1" },
  { icon: "🌹", from: "Sarah", time: "5 hours ago", amount: "+$2" },
  { icon: "💎", from: "Maya", time: "1 day ago", amount: "+$10" }
];

export default function ProfilePage() {
  return (
    <DashboardShell activePage="Profile" title="Profile" subtitle="Your profile and settings">
      <section className="profile-page">
        <article className="profile-summary-card">
          <button className="edit-profile-button" type="button">
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
            Living life one adventure at a time ✨ Love connecting with kind souls and spreading
            positivity 💕
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

        <article className="wallet-panel">
          <div className="wallet-panel-head">
            <h2>
              <DollarSign size={21} />
              Wallet Balance
            </h2>
            <span>$20</span>
          </div>

          <div className="withdraw-progress">
            <div>
              <span>Progress to $50 withdrawal</span>
              <span>20/$50</span>
            </div>
            <div className="progress-track">
              <span />
            </div>
          </div>

          <div className="wallet-actions">
            <button className="withdraw-button" type="button">
              <TrendingUp size={16} />
              Withdraw Earnings
            </button>
            <button className="points-button" type="button">
              Add Points
            </button>
          </div>
        </article>

        <article className="received-gifts-panel">
          <div className="received-gifts-head">
            <h2>
              <Gift size={20} />
              Gifts Received
            </h2>
            <span>$25 earned</span>
          </div>

          <div className="received-gifts-list">
            {gifts.map((gift) => (
              <div className="received-gift" key={`${gift.from}-${gift.amount}`}>
                <span className="received-gift-icon">{gift.icon}</span>
                <div>
                  <strong>From {gift.from}</strong>
                  <small>{gift.time}</small>
                </div>
                <span>{gift.amount}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
