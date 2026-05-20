import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import ar from "@/src/messages/ar.json";
import en from "@/src/messages/en.json";

const locales = ["en", "ar"];
const defaultLocale = "en";

function isSupportedLocale(value) {
  return locales.includes(value);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: locale === "ar" ? ar : en
  };
});
