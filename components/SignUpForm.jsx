import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SignUpForm() {
  const t = useTranslations("signupForm");

  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>{t("firstName")}</span>
          <input type="text" name="firstName" placeholder={t("firstNamePlaceholder")} autoComplete="given-name" />
        </label>

        <label className="field">
          <span>{t("lastName")}</span>
          <input type="text" name="lastName" placeholder={t("lastNamePlaceholder")} autoComplete="family-name" />
        </label>
      </div>

      <label className="field">
        <span>{t("dateOfBirth")}</span>
        <input type="date" name="dateOfBirth" autoComplete="bday" />
      </label>

      <label className="field">
        <span>{t("gender")}</span>
        <select name="gender" defaultValue="">
          <option value="" disabled>
            {t("selectGender")}
          </option>
          <option value="female">{t("genders.female")}</option>
          <option value="male">{t("genders.male")}</option>
          <option value="non-binary">{t("genders.nonBinary")}</option>
          <option value="prefer-not-to-say">{t("genders.preferNotToSay")}</option>
        </select>
      </label>

      <label className="field">
        <span>{t("phone")}</span>
        <input type="tel" name="phone" placeholder={t("phonePlaceholder")} autoComplete="tel" />
      </label>

      <label className="field">
        <span>{t("password")}</span>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
        />
      </label>

      <label className="field">
        <span>{t("confirmPassword")}</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
        />
      </label>

      <label className="check-field">
        <input type="checkbox" name="terms" />
        <span>{t("terms")}</span>
      </label>

      <div className="button-row">
        <Link className="secondary-button" href="/">
          {t("back")}
        </Link>
        <Link className="primary-button" href="/signup/profile">
          {t("continue")}
        </Link>
      </div>

      <p className="signup-copy">
        {t("hasAccount")} <Link href="/">{t("signinLink")}</Link>
      </p>
    </form>
  );
}
