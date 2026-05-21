"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  useGetCountriesQuery,
  useLoginMutation
} from "@/src/features/auth/authApi";

export default function LoginCard() {
  const t = useTranslations("loginCard");
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+961");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { data: countryOptions = [], isLoading: isLoadingCountries } =
    useGetCountriesQuery();

  const resolvedCountryOptions = useMemo(() => {
    if (countryOptions.length > 0) return countryOptions;

    return [
      {
        value: "+961",
        label: "+961"
      }
    ];
  }, [countryOptions]);
  const selectedCountryCode = useMemo(() => {
    if (resolvedCountryOptions.some((country) => country.value === countryCode)) {
      return countryCode;
    }

    if (resolvedCountryOptions.some((country) => country.value === "+961")) {
      return "+961";
    }

    return resolvedCountryOptions[0]?.value ?? "";
  }, [resolvedCountryOptions, countryCode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const payload = {
      country_code: selectedCountryCode.trim(),
      phone: phone.trim(),
      password
    };

    try {
      await login(payload).unwrap();
      router.push("/discover");
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.error ??
        t("loginFailed");
      setFormError(String(message));
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>{t("countryCodeLabel")}</span>
          <select
            name="country_code"
            value={selectedCountryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            disabled={isLoadingCountries || resolvedCountryOptions.length === 0}
          >
            {resolvedCountryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t("phoneLabel")}</span>
          <input
            type="tel"
            name="phone"
            placeholder={t("phonePlaceholder")}
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>{t("passwordLabel")}</span>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <Link className="reset-link" href="/forgot-password">
        {t("forgotPassword")}
      </Link>

      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? t("loggingInButton") : t("loginButton")}
      </button>

      {formError ? <p className="auth-error-text">{formError}</p> : null}

      <p className="signup-copy">
        {t("noAccount")} <Link href="/signup">{t("signupLink")}</Link>
      </p>
    </form>
  );
}
