import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginCard() {
  const t = useTranslations("loginCard");

  return (
    <form className="auth-card" action="/discover">
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <label className="field">
        <span>{t("identifierLabel")}</span>
        <input
          type="text"
          name="identifier"
          placeholder={t("identifierPlaceholder")}
          autoComplete="username"
        />
      </label>

      <label className="field">
        <span>{t("passwordLabel")}</span>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
        />
      </label>

      <Link className="reset-link" href="/forgot-password">
        {t("forgotPassword")}
      </Link>

      <button type="submit">{t("loginButton")}</button>

      <p className="signup-copy">
        {t("noAccount")} <Link href="/signup">{t("signupLink")}</Link>
      </p>
    </form>
  );
}
