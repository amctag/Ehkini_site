import { useTranslations } from "next-intl";
import BrandMark from "./BrandMark";

export default function AppLogo() {
  const t = useTranslations("appLogo");

  return (
    <div className="app-logo" aria-label={t("ariaLabel")}>
      <BrandMark />
      <span className="app-logo-label ">{t("name")}</span>
    </div>
  );
}
