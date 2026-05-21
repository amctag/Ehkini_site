import {
  Camera,
  Gift,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  User,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AppLogo from "./AppLogo";

const navItems = [
  { key: "discover", href: "/discover", icon: Home },
  { key: "giftMarket", href: "/gifts", icon: Gift },
  { key: "stories", href: "/stories", icon: Camera },
  { key: "messages", href: "/messages", icon: MessageCircle, badge: "3" },
  { key: "friends", href: "/friends", icon: Users },
  { key: "profile", href: "/profile", icon: User }
];

export default function Sidebar({ activePageKey, isMobileOpen = false, onCloseMobile }) {
  const t = useTranslations("sidebar");

  return (
    <aside className={`discover-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-logo">
        <AppLogo />
        <button type="button" className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-search" role="search">
        <Search size={17} />
        <input type="search" placeholder={t("searchPlaceholder")} aria-label={t("searchAriaLabel")} />
      </div>

      <nav className="side-nav" aria-label={t("navAriaLabel")}>
        {navItems.map(({ key, href, icon: Icon, badge }) => {
          const label = t(`items.${key}`);

          return (
            <Link className={key === activePageKey ? "active" : ""} href={href} key={key} onClick={onCloseMobile}>
              <span className="nav-icon">
                <Icon size={19} strokeWidth={1.9} />
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link className={activePageKey === "settings" ? "active" : ""} href="/settings" onClick={onCloseMobile}>
          <Settings size={17} />
          {t("settings")}
        </Link>
        <Link className="logout-link" href="/" onClick={onCloseMobile}>
          <LogOut size={17} />
          {t("logout")}
        </Link>
      </div>
    </aside>
  );
}
