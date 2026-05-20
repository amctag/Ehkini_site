import { Gift, Phone, Plus, Search, Send, Video } from "lucide-react";
import Image from "next/image";
import DashboardShell from "./DashboardShell";

const contacts = [
  {
    name: "Sarah",
    time: "2m ago",
    preview: "Thank you for the gift!",
    unread: "2",
    online: true,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Ahmed",
    time: "1h ago",
    preview: "That's so kind of you!",
    online: true,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Maya",
    time: "3h ago",
    preview: "Would love to connect more",
    unread: "1",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Omar",
    time: "1d ago",
    preview: "See you soon!",
    image:
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=120&q=80"
  }
];

function ContactAvatar({ contact, size = 40 }) {
  return (
    <span className="message-avatar" style={{ "--avatar-size": `${size}px` }}>
      <Image src={contact.image} alt={contact.name} width={size} height={size} />
      {contact.online ? <span className="online-dot" /> : null}
    </span>
  );
}

export default function MessagesPage() {
  const activeContact = contacts[0];

  return (
    <DashboardShell activePage="Messages" title="Messages" subtitle="Connect with your matches">
      <section className="messages-layout">
        <aside className="conversation-list">
          <label className="message-search">
            <Search size={18} />
            <input type="search" placeholder="Search messages..." />
          </label>

          <div className="conversation-items">
            {contacts.map((contact, index) => (
              <button className={index === 0 ? "active" : ""} type="button" key={contact.name}>
                <ContactAvatar contact={contact} size={40} />
                <span className="conversation-copy">
                  <span>
                    <strong>{contact.name}</strong>
                    <small>{contact.time}</small>
                  </span>
                  <em>{contact.preview}</em>
                </span>
                {contact.unread ? <span className="conversation-badge">{contact.unread}</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel">
          <header className="chat-header">
            <div className="chat-person">
              <ContactAvatar contact={activeContact} size={40} />
              <div>
                <h2>{activeContact.name}</h2>
                <p>Online</p>
              </div>
            </div>

            <div className="chat-actions">
              <button type="button" aria-label="Call Sarah">
                <Phone size={17} />
              </button>
              <button type="button" aria-label="Video call Sarah">
                <Video size={17} />
              </button>
              <button className="send-gift-button" type="button">
                <Gift size={17} />
                Send Gift
              </button>
            </div>
          </header>

          <div className="chat-body">
            <div className="message-bubble received">
              <p>Hey! Thanks for connecting 😊</p>
              <span>10:30 AM</span>
            </div>

            <div className="message-bubble sent">
              <p>Hi! Nice to meet you!</p>
              <span>10:32 AM</span>
            </div>

            <div className="message-bubble sent gift-message">
              <p>🌹</p>
              <span>10:33 AM</span>
            </div>

            <div className="message-bubble received">
              <p>Thank you for the gift! 💕</p>
              <span>10:35 AM</span>
            </div>

            <div className="message-bubble received compact">
              <p>That&apos;s so thoughtful!</p>
              <span>10:35 AM</span>
            </div>
          </div>

          <form className="message-composer">
            <input type="text" placeholder="Type a message..." />
            <button className="add-message-button" type="button" aria-label="Add attachment">
              <Plus size={20} />
            </button>
            <button className="send-message-button" type="submit" aria-label="Send message">
              <Send size={21} />
            </button>
          </form>
        </section>
      </section>
    </DashboardShell>
  );
}
