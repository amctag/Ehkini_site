import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GiftSendModal({ open, gift, onClose }) {
  const t = useTranslations("giftSendModal");
  const recipients = t.raw("recipients");

  if (!open || !gift) return null;

  return (
    <div className="gift-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="gift-send-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogAria", { giftName: gift.name })}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="gift-send-modal-header">
          <div>
            <h3>{t("title", { giftName: gift.name })}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" aria-label={t("closeAria")} onClick={onClose}>
            <X size={17} />
          </button>
        </header>

        <div className="gift-send-modal-content">
          <div className="gift-send-preview">
            <span>{gift.icon}</span>
            <p>{gift.description}</p>
          </div>

          <label className="gift-send-field">
            <span>{t("sendTo")}</span>
            <div className="gift-select-wrap">
              <select defaultValue="">
                <option value="" disabled>
                  {t("recipientPlaceholder")}
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
            <span>{t("messageLabel")}</span>
            <textarea placeholder={t("messagePlaceholder")} rows={4} />
          </label>
        </div>

        <footer className="gift-send-modal-footer">
          <button type="button" onClick={onClose}>
            {t("submit")}
          </button>
        </footer>
      </section>
    </div>
  );
}
