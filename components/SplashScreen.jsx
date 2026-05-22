"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import BrandMarkW from "./BrandMarkW";

const SPLASH_DURATION_MS = 1200;

export default function SplashScreen() {
  const t = useTranslations("authShell");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="auth-page">
      <section className="auth-shell splash-shell" aria-label={t("defaultLabel")}>
        <div className="brand">
          <BrandMarkW />
          <h1>{t("brandTitle")}</h1>
          <p>{t("brandSubtitle")}</p>
        </div>
        <span className="splash-spinner" aria-hidden="true" />
        <p className="splash-powered">Powered by amctag</p>
      </section>
    </main>
  );
}
