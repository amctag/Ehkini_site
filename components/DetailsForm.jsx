import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DetailsForm() {
  const t = useTranslations("detailsForm");
  const interests = t.raw("interestItems");

  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <label className="field">
        <span>{t("occupation")} <em>{t("optional")}</em></span>
        <input type="text" name="occupation" placeholder={t("occupationPlaceholder")} autoComplete="organization-title" />
      </label>

      <label className="field">
        <span>{t("education")} <em>{t("optional")}</em></span>
        <input type="text" name="education" placeholder={t("educationPlaceholder")} />
      </label>

      <fieldset className="interest-field">
        <legend>{t("interests")} <em>{t("optional")}</em></legend>
        <div className="interest-grid">
          {interests.map((interest) => (
            <label className="interest-chip" key={interest}>
              <input type="checkbox" name="interests" value={interest.toLowerCase()} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="button-row">
        <Link className="secondary-button" href="/signup/profile">
          {t("back")}
        </Link>
        <Link className="primary-button" href="/">
          {t("continue")}
        </Link>
      </div>
    </form>
  );
}
