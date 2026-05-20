import {
  Camera,
  Gift,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import AppLogo from "./AppLogo";

const navItems = [
  { label: "Discover", href: "/discover", icon: Home },
  { label: "Gift Market", href: "/gifts", icon: Gift },
  { label: "Stories", href: "/stories", icon: Camera },
  { label: "Messages", href: "/messages", icon: MessageCircle, badge: "3" },
  { label: "Friends", href: "/friends", icon: Users },
  { label: "Profile", href: "/profile", icon: User }
];

export default function Sidebar({ activePage }) {
  return (
    <aside className="discover-sidebar">
      <div className="sidebar-logo">
        <AppLogo />
      </div>

      <div className="sidebar-search" role="search">
        <Search size={17} />
        <input type="search" placeholder="Search" aria-label="Search sidebar" />
      </div>

      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map(({ label, href, icon: Icon, badge }) => (
          <Link className={label === activePage ? "active" : ""} href={href} key={label}>
            <span className="nav-icon">
              <Icon size={19} strokeWidth={1.9} />
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link className={activePage === "Settings" ? "active" : ""} href="/settings">
          <Settings size={17} />
          Settings
        </Link>
        <Link className="logout-link" href="/">
          <LogOut size={17} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
