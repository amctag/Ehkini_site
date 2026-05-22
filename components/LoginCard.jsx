"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  useGetCountriesQuery,
  useLoginMutation
} from "@/src/features/auth/authApi";
import CountryCodeSelect from "./CountryCodeSelect";

function getFirstValidationMessage(errors) {
  if (!errors || typeof errors !== "object") return "";

  const firstField = Object.values(errors)[0];
  if (Array.isArray(firstField)) return firstField[0] ?? "";
  if (typeof firstField === "string") return firstField;

  return "";
}

function getLoginErrorMessage(error, t) {
  if (error?.status === 401) {
    return t("invalidPassword");
  }

  if (error?.status === 422) {
    return getFirstValidationMessage(error?.data?.errors) || t("validationFailed");
  }

  return error?.data?.message ?? error?.data?.error ?? t("loginFailed");
}

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

  function clearFormError() {
    if (formError) {
      setFormError("");
    }
  }

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
      setFormError(String(getLoginErrorMessage(error, t)));
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <div className="field-grid">
        <div className="field">
          <span>{t("countryCodeLabel")}</span>
          <CountryCodeSelect
            ariaLabel={t("countryCodeLabel")}
            options={resolvedCountryOptions}
            value={selectedCountryCode}
            onChange={(nextValue) => {
              setCountryCode(nextValue);
              clearFormError();
            }}
            disabled={isLoadingCountries || resolvedCountryOptions.length === 0}
          />
        </div>

        <label className="field">
          <span>{t("phoneLabel")}</span>
          <input
            type="tel"
            name="phone"
            placeholder={t("phonePlaceholder")}
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              clearFormError();
            }}
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
          onChange={(event) => {
            setPassword(event.target.value);
            clearFormError();
          }}
          required
        />
      </label>

      <Link className="reset-link" href="/forgot-password">
        {t("forgotPassword")}
      </Link>

      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? t("loggingInButton") : t("loginButton")}
      </button>

      {formError ? (
        <div className="auth-error-popup" role="alert" aria-live="polite">
          <span className="auth-error-dot" aria-hidden="true" />
          <span className="auth-error-copy">
            <strong>{formError}</strong>
            <small>{t("tryAnotherCredential")}</small>
          </span>
          <button
            className="auth-error-close"
            type="button"
            onClick={() => setFormError("")}
            aria-label={t("dismissError")}
          >
            x
          </button>
        </div>
      ) : null}

      <p className="signup-copy">
        {t("noAccount")} <Link href="/signup">{t("signupLink")}</Link>
      </p>
    </form>
  );
}
