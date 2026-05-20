import { useTranslations } from "next-intl";
import BrandMark from "./BrandMark";

export default function AuthShell({ children, label }) {
  const t = useTranslations("authShell");
  const ariaLabel = label || t("defaultLabel");

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label={ariaLabel}>
        <div className="brand">
          <BrandMark />
          <h1>{t("brandTitle")}</h1>
          <p>{t("brandSubtitle")}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
