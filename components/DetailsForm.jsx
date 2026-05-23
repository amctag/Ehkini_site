"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  useGetInterestsQuery,
  useRegisterMutation,
  useSendRegisterOtpMutation,
  useVerifyRegisterOtpMutation
} from "@/src/features/auth/authApi";
import { updateSignupDraft } from "@/src/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";

const fallbackInterests = [
  { id: 2, name: "Travel" },
  { id: 3, name: "Music" },
  { id: 7, name: "Fitness" },
  { id: 5, name: "Cooking" },
  { id: 4, name: "Reading" },
  { id: 1, name: "Sports" },
  { id: 8, name: "Technology" }
];

function getMutationMessage(error, fallback) {
  if ([502, 503, 504].includes(error?.status)) {
    return fallback;
  }

  const firstValidationError = Object.values(error?.data?.errors ?? {})
    .flat()
    .find(Boolean);

  return firstValidationError ?? error?.data?.message ?? error?.data?.error ?? fallback;
}

function hasAuthToken(payload) {
  return Boolean(payload?.token ?? payload?.access_token ?? payload?.data?.token);
}

function buildRegistrationPayload(draft, verifiedToken) {
  return {
    first_name: draft.first_name,
    last_name: draft.last_name,
    country_code: draft.country_code,
    country_id: Number(draft.country_id ?? 0),
    phone: draft.phone,
    password: draft.password,
    verified_token: verifiedToken,
    date_of_birth: draft.date_of_birth,
    gender: draft.gender,
    location: draft.location ?? "",
    occupation: draft.occupation ?? "",
    education: draft.education ?? "",
    about_me: draft.about_me ?? "",
    fcm_token: "",
    platform: "web",
    interests: draft.interests ?? []
  };
}

function hasCountryId(countryId) {
  return countryId !== null && countryId !== undefined && countryId !== "";
}

export default function DetailsForm() {
  const t = useTranslations("detailsForm");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupDraft = useAppSelector((state) => state.auth.signupDraft);
  const [formError, setFormError] = useState("");
  const [pendingDraft, setPendingDraft] = useState(null);
  const [otpToken, setOtpToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const { data: backendInterests = [] } = useGetInterestsQuery();
  const [sendRegisterOtp, { isLoading: isSendingOtp }] = useSendRegisterOtpMutation();
  const [verifyRegisterOtp, { isLoading: isVerifyingOtp }] = useVerifyRegisterOtpMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const interests = useMemo(
    () => (backendInterests.length > 0 ? backendInterests : fallbackInterests),
    [backendInterests]
  );
  const isSubmitting = isSendingOtp || isVerifyingOtp || isRegistering;

  function hasRequiredSignupDraft(draft) {
    return Boolean(
        draft.first_name &&
        draft.last_name &&
        draft.country_code &&
        hasCountryId(draft.country_id) &&
        draft.phone &&
        draft.password &&
        draft.date_of_birth &&
        draft.gender
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const nextDraft = {
      ...signupDraft,
      occupation: String(formData.get("occupation") ?? "").trim(),
      education: String(formData.get("education") ?? "").trim(),
      interests: formData
        .getAll("interests")
        .map((interest) => Number(interest))
        .filter((interest) => Number.isFinite(interest))
    };

    if (!hasRequiredSignupDraft(nextDraft)) {
      setFormError(t("missingSignupData"));
      return;
    }

    dispatch(updateSignupDraft(nextDraft));

    try {
      const response = await sendRegisterOtp({
        country_code: nextDraft.country_code,
        phone: nextDraft.phone
      }).unwrap();

      if (!response.otp_token) {
        setFormError(t("missingOtpToken"));
        return;
      }

      setPendingDraft(nextDraft);
      setOtpToken(response.otp_token);
      setOtpCode("");
      setIsOtpOpen(true);
    } catch (error) {
      const fallback = [502, 503, 504].includes(error?.status)
        ? t("otpServiceUnavailable")
        : t("otpSendFailed");
      setFormError(getMutationMessage(error, fallback));
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setFormError("");

    if (!pendingDraft) {
      setFormError(t("missingSignupData"));
      return;
    }

    let fallbackError = t("otpVerifyFailed");

    try {
      const verifyResponse = await verifyRegisterOtp({
        country_code: pendingDraft.country_code,
        phone: pendingDraft.phone,
        otp_token: otpToken,
        code: otpCode.trim()
      }).unwrap();

      if (!verifyResponse.verified_token) {
        setFormError(t("missingVerifiedToken"));
        return;
      }

      fallbackError = t("registrationFailed");

      const registerResponse = await register(
        buildRegistrationPayload(pendingDraft, verifyResponse.verified_token)
      ).unwrap();

      if (!hasAuthToken(registerResponse)) {
        setFormError(t("missingAuthToken"));
        return;
      }

      router.push("/discover");
    } catch (error) {
      setFormError(getMutationMessage(error, fallbackError));
    }
  }

  return (
    <>
      <form className="auth-card auth-card-large" onSubmit={handleSubmit}>
        <div className="card-heading">
          <h2>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>

        <label className="field">
          <span>{t("occupation")} <em>{t("optional")}</em></span>
          <input
            type="text"
            name="occupation"
            placeholder={t("occupationPlaceholder")}
            autoComplete="organization-title"
            defaultValue={signupDraft.occupation ?? ""}
          />
        </label>

        <label className="field">
          <span>{t("education")} <em>{t("optional")}</em></span>
          <input
            type="text"
            name="education"
            placeholder={t("educationPlaceholder")}
            defaultValue={signupDraft.education ?? ""}
          />
        </label>

        <fieldset className="interest-field">
          <legend>{t("interests")} <em>{t("optional")}</em></legend>
          <div className="interest-grid">
            {interests.map((interest) => (
              <label className="interest-chip" key={interest.id}>
                <input
                  type="checkbox"
                  name="interests"
                  value={interest.id}
                  defaultChecked={(signupDraft.interests ?? []).includes(interest.id)}
                />
                <span>{interest.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {formError ? <p className="auth-error-text">{formError}</p> : null}

        <div className="button-row">
          <Link className="secondary-button" href="/signup/profile">
            {t("back")}
          </Link>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSendingOtp ? t("sendingOtp") : t("continue")}
          </button>
        </div>
      </form>

      {isOtpOpen ? (
        <div className="auth-otp-overlay" role="presentation">
          <form
            className="auth-otp-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("otp.title")}
            onSubmit={handleVerifyOtp}
          >
            <header>
              <div>
                <h3>{t("otp.title")}</h3>
                <p>{t("otp.subtitle", { phone: pendingDraft?.phone ?? "" })}</p>
              </div>
              <button type="button" onClick={() => setIsOtpOpen(false)} aria-label={t("otp.closeAria")}>
                x
              </button>
            </header>

            <label className="field">
              <span>{t("otp.codeLabel")}</span>
              <input
                type="text"
                inputMode="numeric"
                name="otp"
                placeholder={t("otp.codePlaceholder")}
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                required
              />
            </label>

            {formError ? <p className="auth-error-text">{formError}</p> : null}

            <footer className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsOtpOpen(false)}
                disabled={isSubmitting}
              >
                {t("otp.cancel")}
              </button>
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isVerifyingOtp || isRegistering ? t("otp.verifying") : t("otp.verify")}
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </>
  );
}
