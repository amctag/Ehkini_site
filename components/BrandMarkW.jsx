import Image from "next/image";
import { useTranslations } from "next-intl";

export default function BrandMark() {
  const t = useTranslations("appLogo");

  return (
    <Image
      className="brand-mark"
      src="/logo_ehkini.jpg-removebg-preview.png"
      alt={t("ariaLabel")}
      width={320}
      height={320}
      priority
    />
  );
}
