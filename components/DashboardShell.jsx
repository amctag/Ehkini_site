import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import Sidebar from "./Sidebar";

function Topbar({ title, subtitle }) {
  return (
    <header className="discover-topbar">
      <button className="mobile-menu" type="button" aria-label="Open menu">
        <Menu size={22} />
      </button>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <button type="button" aria-label="Search">
          <Search size={28} />
        </button>
        <button type="button" aria-label="Notifications" className="notification-button">
          <Bell size={25} />
          <span>5</span>
        </button>
        <Image
          width={40}
          height={40}
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80"
          alt="Your profile"
        />
      </div>
    </header>
  );
}

export default function DashboardShell({ activePage, title, subtitle, children }) {
  return (
    <main className="discover-app">
      <Sidebar activePage={activePage} />
      <div className="discover-main">
        <Topbar title={title} subtitle={subtitle} />
        <div className="discover-content">{children}</div>
      </div>
    </main>
  );
}
