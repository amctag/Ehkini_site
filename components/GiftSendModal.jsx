import { ChevronDown, X } from "lucide-react";

const recipients = ["Sarah Ahmad", "Fatima Hassan", "Amira Khan", "Layla Mohammed"];

export default function GiftSendModal({ open, gift, onClose }) {
  if (!open || !gift) return null;

  return (
    <div className="gift-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="gift-send-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Send ${gift.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="gift-send-modal-header">
          <div>
            <h3>Send {gift.name}</h3>
            <p>Choose a recipient and add a personal message</p>
          </div>
          <button type="button" aria-label="Close send gift modal" onClick={onClose}>
            <X size={17} />
          </button>
        </header>

        <div className="gift-send-modal-content">
          <div className="gift-send-preview">
            <span>{gift.icon}</span>
            <p>{gift.description}</p>
          </div>

          <label className="gift-send-field">
            <span>Send to:</span>
            <div className="gift-select-wrap">
              <select defaultValue="">
                <option value="" disabled>
                  Select recipient
                </option>
                {recipients.map((recipient) => (
                  <option value={recipient} key={recipient}>
                    {recipient}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="gift-send-field">
            <span>Message (optional):</span>
            <textarea placeholder="Add a personal message..." rows={4} />
          </label>
        </div>

        <footer className="gift-send-modal-footer">
          <button type="button" onClick={onClose}>
            Send Gift
          </button>
        </footer>
      </section>
    </div>
  );
}
