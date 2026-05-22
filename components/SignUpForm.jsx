"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  useCheckPhoneMutation,
  useGetCountriesQuery
} from "@/src/features/auth/authApi";
import { updateSignupDraft } from "@/src/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import CountryCodeSelect from "./CountryCodeSelect";

function getMutationMessage(error, fallback) {
  const firstValidationError = Object.values(error?.data?.errors ?? {})
    .flat()
    .find(Boolean);

  return firstValidationError ?? error?.data?.message ?? error?.data?.error ?? fallback;
}

function formatCountryCodeForPhoneCheck(countryCode) {
  return String(countryCode ?? "").replace(/^\+/, "");
}

function getPhoneCheckError(phoneCheck, t) {
  if (phoneCheck?.exists === true) {
    return {
      action: "signin",
      message: phoneCheck.message ?? t("phoneExists")
    };
  }

  if (phoneCheck?.age_ok === false) {
    return {
      action: null,
      message: phoneCheck.message ?? t("ageNotAllowed")
    };
  }

  if (phoneCheck?.exists === false && phoneCheck?.age_ok === true) {
    return null;
  }

  return {
    action: null,
    message: t("phoneCheckUnexpected")
  };
}

export default function SignUpForm() {
  const t = useTranslations("signupForm");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.auth.signupDraft);
  const [countryCode, setCountryCode] = useState(draft.country_code ?? "+961");
  const [formError, setFormError] = useState("");
  const [formAction, setFormAction] = useState(null);
  const { data: countryOptions = [], isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const [checkPhone, { isLoading: isCheckingPhone }] = useCheckPhoneMutation();

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

  const selectedCountry = useMemo(
    () => resolvedCountryOptions.find((country) => country.value === selectedCountryCode),
    [resolvedCountryOptions, selectedCountryCode]
  );
  const isCountryReady =
    selectedCountry?.id !== null && selectedCountry?.id !== undefined;

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFormAction(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const phone = String(formData.get("phone") ?? "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") ?? "");

    if (password !== confirmPassword) {
      setFormError(t("passwordMismatch"));
      return;
    }

    if (!formData.get("terms")) {
      setFormError(t("termsRequired"));
      return;
    }

    if (!isCountryReady) {
      setFormError(t("countryRequired"));
      return;
    }

    try {
      const phoneCheck = await checkPhone({
        country_code: formatCountryCodeForPhoneCheck(selectedCountryCode),
        phone,
        date_of_birth: dateOfBirth
      }).unwrap();
      const phoneCheckError = getPhoneCheckError(phoneCheck, t);

      if (phoneCheckError) {
        setFormError(phoneCheckError.message);
        setFormAction(phoneCheckError.action);
        return;
      }
    } catch (error) {
      setFormError(getMutationMessage(error, t("phoneCheckFailed")));
      return;
    }

    dispatch(
      updateSignupDraft({
        first_name: String(formData.get("firstName") ?? "").trim(),
        last_name: String(formData.get("lastName") ?? "").trim(),
        date_of_birth: dateOfBirth,
        gender: String(formData.get("gender") ?? ""),
        country_code: selectedCountryCode,
        country_id: selectedCountry?.id ?? null,
        phone,
        password
      })
    );

    router.push("/signup/profile");
  }

  return (
    <form className="auth-card auth-card-large" onSubmit={handleSubmit}>
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>{t("firstName")}</span>
          <input
            type="text"
            name="firstName"
            placeholder={t("firstNamePlaceholder")}
            autoComplete="given-name"
            defaultValue={draft.first_name ?? ""}
            required
          />
        </label>

        <label className="field">
          <span>{t("lastName")}</span>
          <input
            type="text"
            name="lastName"
            placeholder={t("lastNamePlaceholder")}
            autoComplete="family-name"
            defaultValue={draft.last_name ?? ""}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>{t("dateOfBirth")}</span>
        <input
          type="date"
          name="dateOfBirth"
          autoComplete="bday"
          defaultValue={draft.date_of_birth ?? ""}
          required
        />
      </label>

      <label className="field">
        <span>{t("gender")}</span>
        <select name="gender" defaultValue={draft.gender ?? ""} required>
          <option value="" disabled>
            {t("selectGender")}
          </option>
          <option value="female">{t("genders.female")}</option>
          <option value="male">{t("genders.male")}</option>
      
        </select>
      </label>

      <div className="field-grid">
        <div className="field">
          <span>{t("countryCode")}</span>
          <CountryCodeSelect
            ariaLabel={t("countryCode")}
            options={resolvedCountryOptions}
            value={selectedCountryCode}
            onChange={setCountryCode}
            disabled={isLoadingCountries || resolvedCountryOptions.length === 0}
          />
        </div>

        <label className="field">
          <span>{t("phone")}</span>
          <input
            type="tel"
            name="phone"
            placeholder={t("phonePlaceholder")}
            autoComplete="tel"
            defaultValue={draft.phone ?? ""}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>{t("password")}</span>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
          defaultValue={draft.password ?? ""}
          required
        />
      </label>

      <label className="field">
        <span>{t("confirmPassword")}</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
          defaultValue={draft.password ?? ""}
          required
        />
      </label>

      <label className="check-field">
        <input type="checkbox" name="terms" required />
        <span>{t("terms")}</span>
      </label>

      {formError ? (
        <div className="auth-form-feedback" role="alert">
          <p>{formError}</p>
          {formAction === "signin" ? (
            <Link href="/login">{t("signinInstead")}</Link>
          ) : null}
        </div>
      ) : null}

      <div className="button-row">
        <Link className="secondary-button" href="/login">
          {t("back")}
        </Link>
        <button
          className="primary-button"
          type="submit"
          disabled={!isCountryReady || isCheckingPhone}
        >
          {isCheckingPhone ? t("checkingPhone") : t("continue")}
        </button>
      </div>

      <p className="signup-copy">
        {t("hasAccount")} <Link href="/login">{t("signinLink")}</Link>
      </p>
    </form>
  );
}
