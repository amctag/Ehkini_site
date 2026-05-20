import Image from "next/image";
import { useTranslations } from "next-intl";

export default function BrandMark() {
  const t = useTranslations("appLogo");

  return (
    <Image
      className="brand-mark"
      src="/logo-ekhini-brand.jpeg"
      alt={t("ariaLabel")}
      width={184}
      height={184}
      priority
    />
  );
}
