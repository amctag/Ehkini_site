import { Gift, MessageCircle, MoreVertical, Phone, Search, UserPlus, Users, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

function FriendCard({ friend }) {
  const t = useTranslations("friends");

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

        <button className="friend-menu" type="button" aria-label={t("friend.moreOptionsAria", { name: friend.name })}>
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="friend-meta">
        <span>{friend.mutual}</span>
        <span>{friend.connected}</span>
      </div>

      <div className="friend-actions">
        <Link className="message-friend" href="/messages" aria-label={t("friend.messageAria", { name: friend.name })}>
          <MessageCircle size={17} />
          {t("friend.message")}
        </Link>
        <button className="call-friend" type="button" aria-label={t("friend.callAria", { name: friend.name })}>
          <Phone size={17} />
        </button>
        <button className="video-friend" type="button" aria-label={t("friend.videoAria", { name: friend.name })}>
          <Video size={17} />
        </button>
        <button className="gift-friend" type="button" aria-label={t("friend.giftAria", { name: friend.name })}>
          <Gift size={17} />
        </button>
      </div>
    </article>
  );
}

function SuggestedFriendCard({ suggestion }) {
  const t = useTranslations("friends");

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
        {t("addFriend")}
      </button>
    </article>
  );
}

export default function FriendsPage() {
  const t = useTranslations("friends");
  const friends = t.raw("friendsList");
  const suggestions = t.raw("suggestions");

  return (
    <DashboardShell activePageKey="friends" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="friends-page">
        <div className="friends-toolbar">
          <div className="friends-title-row">
            <SectionTitle icon={Users} iconProps={{ size: 24 }} title={t("myFriends")} />
            <span>{t("friendsCount")}</span>
          </div>

          <label className="friends-search">
            <Search size={18} />
            <input type="search" placeholder={t("searchPlaceholder")} />
          </label>

          <div className="friends-filters">
            <button type="button">{t("filters.onlineOnly")}</button>
            <button type="button">{t("filters.recent")}</button>
            <button type="button">{t("filters.alphabetical")}</button>
          </div>
        </div>

        <div className="friends-grid">
          {friends.map((friend) => (
            <FriendCard friend={friend} key={friend.id} />
          ))}
        </div>

        <h2 className="suggested-heading">{t("suggestedHeading")}</h2>
        <div className="suggested-grid">
          {suggestions.map((suggestion) => (
            <SuggestedFriendCard suggestion={suggestion} key={suggestion.name} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
