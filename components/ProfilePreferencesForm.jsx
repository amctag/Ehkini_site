import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProfilePreferencesForm() {
  const t = useTranslations("profilePreferencesForm");

  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <label className="field">
        <span>{t("profilePhoto")} <em>{t("optional")}</em></span>
        <input type="file" name="profilePhoto" accept="image/*" />
      </label>

      <label className="field">
        <span>{t("location")} <em>{t("optional")}</em></span>
        <input type="text" name="location" placeholder={t("locationPlaceholder")} autoComplete="address-level2" />
      </label>

      <label className="field">
        <span>{t("bio")} <em>{t("optional")}</em></span>
        <textarea name="bio" placeholder={t("bioPlaceholder")} rows="4" />
      </label>

      <div className="button-row">
        <Link className="secondary-button" href="/signup">
          {t("back")}
        </Link>
        <Link className="primary-button" href="/signup/details">
          {t("continue")}
        </Link>
      </div>
    </form>
  );
}
