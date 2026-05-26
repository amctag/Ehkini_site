"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  useForgotPasswordResetMutation,
  useForgotPasswordSendOtpMutation,
  useForgotPasswordVerifyOtpMutation,
  useGetCountriesQuery,
  useLoginMutation
} from "@/src/features/auth/authApi";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
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

  return getErrorMessage(error, t("loginFailed"));
}

function getApiErrorMessage(error, fallbackMessage) {
  if (error?.status === 422) {
    return getFirstValidationMessage(error?.data?.errors) || getErrorMessage(error, fallbackMessage);
  }

  return getErrorMessage(error, fallbackMessage);
}

export default function LoginCard() {
  const t = useTranslations("loginCard");
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+961");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formErrorTone, setFormErrorTone] = useState("warning");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("otp");
  const [forgotCountryCode, setForgotCountryCode] = useState("+961");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotOtpToken, setForgotOtpToken] = useState("");
  const [forgotVerifiedToken, setForgotVerifiedToken] = useState("");
  const [isForgotOtpSent, setIsForgotOtpSent] = useState(false);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [forgotPasswordSendOtp, { isLoading: isSendingForgotOtp }] = useForgotPasswordSendOtpMutation();
  const [forgotPasswordVerifyOtp, { isLoading: isVerifyingForgotOtp }] = useForgotPasswordVerifyOtpMutation();
  const [forgotPasswordReset, { isLoading: isResettingForgotPassword }] = useForgotPasswordResetMutation();
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
  const selectedForgotCountryCode = useMemo(() => {
    if (resolvedCountryOptions.some((country) => country.value === forgotCountryCode)) {
      return forgotCountryCode;
    }

    if (resolvedCountryOptions.some((country) => country.value === "+961")) {
      return "+961";
    }

    return resolvedCountryOptions[0]?.value ?? "";
  }, [resolvedCountryOptions, forgotCountryCode]);
  const isForgotResetStep = forgotStep === "reset";

  useEffect(() => {
    if (!isForgotModalOpen) return undefined;

    function onEscape(event) {
      if (event.key === "Escape") {
        setIsForgotModalOpen(false);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isForgotModalOpen]);

  function clearFormError() {
    if (formError) {
      setFormError("");
      setFormErrorTone("warning");
    }
  }

  function openForgotModal() {
    setIsForgotModalOpen(true);
    setForgotStep("otp");
    setForgotCountryCode(selectedCountryCode || "+961");
    setForgotPhone(phone.trim());
    setForgotOtpCode("");
    setForgotOtpToken("");
    setForgotVerifiedToken("");
    setIsForgotOtpSent(false);
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setForgotError("");
    setForgotStatus("");
  }

  function closeForgotModal() {
    setIsForgotModalOpen(false);
    setForgotError("");
    setForgotStatus("");
  }

  function clearForgotFeedback() {
    if (forgotError) setForgotError("");
    if (forgotStatus) setForgotStatus("");
  }

  async function handleSendForgotOtp() {
    const nextPhone = String(forgotPhone ?? "").trim();
    const nextCountryCode = String(selectedForgotCountryCode ?? "").trim();

    if (!nextCountryCode || !nextPhone) {
      setForgotError(t("forgotModal.requiredPhone"));
      return;
    }

    setForgotError("");
    setForgotStatus("");

    try {
      const response = await forgotPasswordSendOtp({
        country_code: nextCountryCode,
        phone: nextPhone
      }).unwrap();

      const otpToken = String(response?.otp_token ?? "").trim();
      setForgotOtpToken(otpToken);
      setIsForgotOtpSent(true);
      setForgotStatus(String(response?.message ?? t("forgotModal.otpSent")));
    } catch (error) {
      setForgotError(getApiErrorMessage(error, t("forgotModal.sendOtpFailed")));
    }
  }

  async function handleVerifyForgotOtp() {
    const nextPhone = String(forgotPhone ?? "").trim();
    const nextCountryCode = String(selectedForgotCountryCode ?? "").trim();
    const nextCode = String(forgotOtpCode ?? "").trim();

    if (!nextCountryCode || !nextPhone || !nextCode) {
      setForgotError(t("forgotModal.requiredOtp"));
      return;
    }

    setForgotError("");
    setForgotStatus("");

    try {
      const response = await forgotPasswordVerifyOtp({
        country_code: nextCountryCode,
        phone: nextPhone,
        code: nextCode,
        otp: nextCode,
        otp_token: forgotOtpToken || undefined
      }).unwrap();

      const verifiedToken = String(
        response?.verified_token ??
          response?.reset_token ??
          response?.password_reset_token ??
          response?.token ??
          response?.data?.verified_token ??
          response?.data?.reset_token ??
          response?.data?.password_reset_token ??
          response?.data?.token ??
          ""
      ).trim();
      setForgotVerifiedToken(verifiedToken);
      setForgotStep("reset");
    } catch (error) {
      setForgotError(getApiErrorMessage(error, t("forgotModal.verifyOtpFailed")));
    }
  }

  async function handleResetForgotPassword() {
    const nextPhone = String(forgotPhone ?? "").trim();
    const nextCountryCode = String(selectedForgotCountryCode ?? "").trim();
    const nextCode = String(forgotOtpCode ?? "").trim();

    if (!nextCountryCode || !nextPhone || !forgotNewPassword || !forgotConfirmPassword) {
      setForgotError(t("forgotModal.requiredPassword"));
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError(t("forgotModal.passwordMismatch"));
      return;
    }

    setForgotError("");
    setForgotStatus("");

    try {
      await forgotPasswordReset({
        country_code: nextCountryCode,
        phone: nextPhone,
        verified_token: forgotVerifiedToken || undefined,
        reset_token: forgotVerifiedToken || undefined,
        password_reset_token: forgotVerifiedToken || undefined,
        otp_token: forgotOtpToken || undefined,
        code: nextCode || undefined,
        otp: nextCode || undefined,
        password: forgotNewPassword,
        password_confirmation: forgotConfirmPassword,
        new_password: forgotNewPassword,
        new_password_confirmation: forgotConfirmPassword
      }).unwrap();

      closeForgotModal();
    } catch (error) {
      setForgotError(getApiErrorMessage(error, t("forgotModal.resetFailed")));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFormErrorTone("warning");

    if (!phone.trim() || !password.trim()) {
      setFormErrorTone("danger");
      setFormError(t("requiredLoginFields"));
      return;
    }

    const payload = {
      country_code: selectedCountryCode.trim(),
      phone: phone.trim(),
      password
    };

    try {
      await login(payload).unwrap();
      router.replace("/discover");
    } catch (error) {
      setFormErrorTone("warning");
      setFormError(getLoginErrorMessage(error, t));
    }
  }

  return (
    <>
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
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
          />
        </label>

        <button type="button" className="reset-link reset-link-button" onClick={openForgotModal}>
          {t("forgotPassword")}
        </button>

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? t("loggingInButton") : t("loginButton")}
        </button>

        {formError ? (
          <div className={`auth-error-popup ${formErrorTone === "danger" ? "danger" : ""}`} role="alert" aria-live="polite">
            <span className="auth-error-dot" aria-hidden="true" />
            <span className="auth-error-copy">
              <strong>{formError}</strong>
              <small>{formErrorTone === "danger" ? t("requiredLoginFieldsHint") : t("tryAnotherCredential")}</small>
            </span>
            <button
              className="auth-error-close"
              type="button"
              onClick={() => setFormError("")}
              aria-label={t("dismissError")}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}

        <p className="signup-copy">
          {t("noAccount")} <Link href="/signup">{t("signupLink")}</Link>
        </p>
      </form>

      {isForgotModalOpen ? (
        <div className="settings-modal-overlay" role="presentation" onClick={closeForgotModal}>
          <section
            className="settings-account-modal"
            role="dialog"
            aria-modal="true"
            aria-label={isForgotResetStep ? t("forgotModal.resetTitle") : t("forgotModal.title")}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="settings-account-modal-header">
              <div>
                <h3>{isForgotResetStep ? t("forgotModal.resetTitle") : t("forgotModal.title")}</h3>
                <p>{isForgotResetStep ? t("forgotModal.resetSubtitle") : t("forgotModal.subtitle")}</p>
              </div>
              <button type="button" onClick={closeForgotModal} aria-label={t("forgotModal.closeAria")}>
                x
              </button>
            </header>

            <div className="settings-account-modal-body">
              {!isForgotResetStep ? (
                <>
                  <label className="settings-account-field">
                    <span>{t("forgotModal.countryCodeLabel")}</span>
                    <CountryCodeSelect
                      ariaLabel={t("forgotModal.countryCodeLabel")}
                      options={resolvedCountryOptions}
                      value={selectedForgotCountryCode}
                      onChange={(nextValue) => {
                        setForgotCountryCode(nextValue);
                        setIsForgotOtpSent(false);
                        setForgotOtpToken("");
                        setForgotOtpCode("");
                        clearForgotFeedback();
                      }}
                      disabled={isLoadingCountries || resolvedCountryOptions.length === 0}
                    />
                  </label>

                  <label className="settings-account-field">
                    <span>{t("forgotModal.phoneLabel")}</span>
                    <input
                      type="tel"
                      placeholder={t("forgotModal.phonePlaceholder")}
                      value={forgotPhone}
                      onChange={(event) => {
                        setForgotPhone(event.target.value);
                        setIsForgotOtpSent(false);
                        setForgotOtpToken("");
                        setForgotOtpCode("");
                        clearForgotFeedback();
                      }}
                    />
                  </label>

                  {isForgotOtpSent ? (
                    <label className="settings-account-field">
                      <span>{t("forgotModal.otpLabel")}</span>
                      <input
                        type="text"
                        placeholder={t("forgotModal.otpPlaceholder")}
                        value={forgotOtpCode}
                        onChange={(event) => {
                          setForgotOtpCode(event.target.value);
                          clearForgotFeedback();
                        }}
                      />
                    </label>
                  ) : null}
                </>
              ) : (
                <>
                  <label className="settings-account-field">
                    <span>{t("forgotModal.newPasswordLabel")}</span>
                    <input
                      type="password"
                      placeholder={t("forgotModal.newPasswordPlaceholder")}
                      value={forgotNewPassword}
                      onChange={(event) => {
                        setForgotNewPassword(event.target.value);
                        clearForgotFeedback();
                      }}
                    />
                  </label>

                  <label className="settings-account-field">
                    <span>{t("forgotModal.confirmPasswordLabel")}</span>
                    <input
                      type="password"
                      placeholder={t("forgotModal.confirmPasswordPlaceholder")}
                      value={forgotConfirmPassword}
                      onChange={(event) => {
                        setForgotConfirmPassword(event.target.value);
                        clearForgotFeedback();
                      }}
                    />
                  </label>
                </>
              )}

              {forgotStatus ? <p>{forgotStatus}</p> : null}
              {forgotError ? <p className="settings-error-text">{forgotError}</p> : null}
            </div>

            <footer className="settings-account-modal-footer">
              <button type="button" className="settings-account-cancel" onClick={closeForgotModal}>
                {t("forgotModal.cancel")}
              </button>

              {!isForgotResetStep ? (
                <button
                  type="button"
                  className="settings-account-submit"
                  disabled={isSendingForgotOtp || isVerifyingForgotOtp}
                  onClick={isForgotOtpSent ? handleVerifyForgotOtp : handleSendForgotOtp}
                >
                  {isForgotOtpSent
                    ? (isVerifyingForgotOtp ? t("forgotModal.verifyingOtpButton") : t("forgotModal.verifyOtpButton"))
                    : (isSendingForgotOtp ? t("forgotModal.sendingOtpButton") : t("forgotModal.sendOtpButton"))}
                </button>
              ) : (
                <button
                  type="button"
                  className="settings-account-submit"
                  disabled={isResettingForgotPassword}
                  onClick={handleResetForgotPassword}
                >
                  {isResettingForgotPassword ? t("forgotModal.updatingPasswordButton") : t("forgotModal.updatePasswordButton")}
                </button>
              )}
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
