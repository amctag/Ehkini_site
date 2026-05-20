import { Gift, MessageCircle, MoreVertical, Phone, Search, UserPlus, Users, Video } from "lucide-react";
import Image from "next/image";
import DashboardShell from "./DashboardShell";

const friendImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=180&q=80";

const friends = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: "Sarah Ahmad",
  location: "Dubai, UAE",
  status: "Active now",
  mutual: "12 mutual friends",
  connected: "Connected 2 months ago",
  image: friendImage
}));

const suggestions = [
  { name: "Suggested User 1", location: "Location", mutual: "6 mutual friends", initials: "S1", tone: "coral" },
  { name: "Suggested User 2", location: "Location", mutual: "7 mutual friends", initials: "S2", tone: "mint" },
  { name: "Suggested User 3", location: "Location", mutual: "8 mutual friends", initials: "S3", tone: "blue" }
];

function FriendCard({ friend }) {
  return (
    <article className="friend-card">
      <div className="friend-card-header">
        <span className="friend-avatar">
          <Image src={friend.image} alt={friend.name} width={64} height={64} />
          <span />
        </span>

        <div className="friend-details">
          <h3>{friend.name}</h3>
          <p>{friend.location}</p>
          <small>{friend.status}</small>
        </div>

        <button className="friend-menu" type="button" aria-label={`More options for ${friend.name}`}>
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="friend-meta">
        <span>{friend.mutual}</span>
        <span>{friend.connected}</span>
      </div>

      <div className="friend-actions">
        <button className="message-friend" type="button">
          <MessageCircle size={17} />
          Message
        </button>
        <button className="call-friend" type="button" aria-label={`Call ${friend.name}`}>
          <Phone size={17} />
        </button>
        <button className="video-friend" type="button" aria-label={`Video call ${friend.name}`}>
          <Video size={17} />
        </button>
        <button className="gift-friend" type="button" aria-label={`Send gift to ${friend.name}`}>
          <Gift size={17} />
        </button>
      </div>
    </article>
  );
}

function SuggestedFriendCard({ suggestion }) {
  return (
    <article className="suggested-card">
      <div className={`suggested-avatar ${suggestion.tone}`}>{suggestion.initials}</div>
      <div>
        <h3>{suggestion.name}</h3>
        <p>{suggestion.location}</p>
        <small>{suggestion.mutual}</small>
      </div>
      <button type="button">
        <UserPlus size={16} />
        Add Friend
      </button>
    </article>
  );
}

export default function FriendsPage() {
  return (
    <DashboardShell activePage="Friends" title="Friends" subtitle="Manage your connections">
      <section className="friends-page">
        <div className="friends-toolbar">
          <div className="friends-title-row">
            <h2>
              <Users size={24} />
              My Friends
            </h2>
            <span>6 Friends</span>
          </div>

          <label className="friends-search">
            <Search size={18} />
            <input type="search" placeholder="Search friends..." />
          </label>

          <div className="friends-filters">
            <button type="button">Online Only</button>
            <button type="button">Recent</button>
            <button type="button">A-Z</button>
          </div>
        </div>

        <div className="friends-grid">
          {friends.map((friend) => (
            <FriendCard friend={friend} key={friend.id} />
          ))}
        </div>

        <h2 className="suggested-heading">Suggested Friends</h2>
        <div className="suggested-grid">
          {suggestions.map((suggestion) => (
            <SuggestedFriendCard suggestion={suggestion} key={suggestion.name} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
