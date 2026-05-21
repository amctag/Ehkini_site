"use client";

import { ChevronLeft, Gift, Phone, Plus, Search, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import DashboardShell from "./DashboardShell";

function ContactAvatar({ contact, size = 40 }) {
  return (
    <span className="message-avatar" style={{ "--avatar-size": `${size}px` }}>
      <Image src={contact.image} alt={contact.name} width={size} height={size} />
      {contact.online ? <span className="online-dot" /> : null}
    </span>
  );
}

export default function MessagesPage() {
  const t = useTranslations("messages");
  const contacts = t.raw("contacts");
  const chatBubbles = t.raw("chatBubbles");
  const [isMobile, setIsMobile] = useState(false);
  const [activeContactIndex, setActiveContactIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 620px)");
    const syncMobile = (event) => {
      setIsMobile(event.matches);
      setActiveContactIndex((current) => (event.matches ? null : (current ?? 0)));
    };

    syncMobile(mediaQuery);
    mediaQuery.addEventListener("change", syncMobile);
    return () => mediaQuery.removeEventListener("change", syncMobile);
  }, []);

  const activeContact = activeContactIndex === null ? null : contacts[activeContactIndex] ?? contacts[0];
  const showConversationList = !isMobile || activeContactIndex === null;
  const showChatPanel = !isMobile || activeContactIndex !== null;

  return (
    <DashboardShell activePageKey="messages" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="messages-layout">
        {showConversationList ? (
          <aside className="conversation-list">
            <label className="message-search">
              <Search size={18} />
              <input type="search" placeholder={t("searchPlaceholder")} />
            </label>

            <div className="conversation-items">
              {contacts.map((contact, index) => (
                <button
                  className={index === activeContactIndex ? "active" : ""}
                  type="button"
                  key={contact.name}
                  onClick={() => setActiveContactIndex(index)}
                >
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
        ) : null}

        {showChatPanel && activeContact ? (
          <section className="chat-panel">
            <header className="chat-header">
              <div className="chat-person">
                {isMobile ? (
                  <button
                    className="chat-back-button"
                    type="button"
                    onClick={() => setActiveContactIndex(null)}
                    aria-label={t("backToListAria")}
                  >
                    <ChevronLeft size={18} />
                    <span>{t("backToList")}</span>
                  </button>
                ) : null}
                <ContactAvatar contact={activeContact} size={40} />
                <div>
                  <h2>{activeContact.name}</h2>
                  <p>{t("online")}</p>
                </div>
              </div>

              <div className="chat-actions">
                <button type="button" aria-label={t("callAria", { name: activeContact.name })}>
                  <Phone size={17} />
                </button>
                <button type="button" aria-label={t("videoAria", { name: activeContact.name })}>
                  <Video size={17} />
                </button>
                <button className="send-gift-button" type="button">
                  <Gift size={17} />
                  {t("sendGift")}
                </button>
              </div>
            </header>

            <div className="chat-body">
              {chatBubbles.map((bubble, index) => (
                <div className={`message-bubble ${bubble.kind}`} key={`${bubble.time}-${index}`}>
                  <p>{bubble.text}</p>
                  <span>{bubble.time}</span>
                </div>
              ))}
            </div>

            <form className="message-composer">
              <input type="text" placeholder={t("composerPlaceholder")} />
              <button className="add-message-button" type="button" aria-label={t("addAttachmentAria")}>
                <Plus size={20} />
              </button>
              <button className="send-message-button" type="submit" aria-label={t("sendMessageAria")}>
                <Send size={21} />
              </button>
            </form>
          </section>
        ) : null}
      </section>
    </DashboardShell>
  );
}
