"use client";

import {
  ChevronRight,
  FileText,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Phone,
  Shield,
  Trash2,
  User,
  UserX,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useGetCountriesQuery, useLogoutMutation } from "@/src/features/auth/authApi";
import {
  useConfirmPasswordOtpMutation,
  useConfirmPhoneNewMutation,
  useGetBlockedUsersQuery,
  useSendPasswordOtpMutation,
  useSendPhoneOtpNewMutation,
  useUnblockUserMutation
} from "@/src/features/settings/settingsApi";
import { clearAuth, selectCurrentUser } from "@/src/features/auth/authSlice";
import { clearStoredAuthToken } from "@/src/features/auth/tokenStorage";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import CountryCodeSelect from "./CountryCodeSelect";
import DashboardShell from "./DashboardShell";

function SectionHeader({ icon: Icon, title, tone }) {
  return (
    <header className={`settings-card-header ${tone}`}>
      <h2>
        <Icon size={17} />
        {title}
      </h2>
    </header>
  );
}

function resolveSettingsIcon(key) {
  const icons = {
    phone: Phone,
    lock: Lock,
    language: Languages,
    blocked: UserX,
    help: HelpCircle,
    terms: FileText,
    privacy: Shield,
    about: User
  };

  return icons[key] ?? HelpCircle;
}

function unwrapCurrentUser(payload) {
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? payload ?? {};
}

function formatPhoneForSettings(user) {
  const rawPhone = String(user?.phone ?? user?.phone_number ?? user?.mobile ?? "").trim();
  if (!rawPhone) return "";
  const countryCode = String(user?.country_code ?? user?.dial_code ?? "").trim();
  return countryCode ? `${countryCode} ${rawPhone}` : rawPhone;
}

function resolveCountryCodeForSettings(user) {
  return String(user?.country_code ?? user?.dial_code ?? "").trim();
}

function AccountModal({ type, onClose, currentPhone, currentCountryCode, onPasswordChanged }) {
  const t = useTranslations("settings.modal");
  const { data: countryOptions = [], isLoading: isLoadingCountries } = useGetCountriesQuery();
  const [sendPhoneOtpNew, { isLoading: isSendingPhoneOtp }] = useSendPhoneOtpNewMutation();
  const [confirmPhoneNew, { isLoading: isConfirmingPhoneOtp }] = useConfirmPhoneNewMutation();
  const [sendPasswordOtp, { isLoading: isSendingPasswordOtp }] = useSendPasswordOtpMutation();
  const [confirmPasswordOtp, { isLoading: isConfirmingPasswordOtp }] = useConfirmPasswordOtpMutation();
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => String(currentCountryCode ?? "").trim() || "+961");
  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordOtpCode, setPasswordOtpCode] = useState("");
  const [passwordOtpToken, setPasswordOtpToken] = useState("");
  const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const config = useMemo(() => {
    if (!type) return null;
    if (type !== "phone" && type !== "password") return null;
    return t.raw(type);
  }, [t, type]);

  useEffect(() => {
    function onEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const resolvedCountryOptions = useMemo(() => {
    if (countryOptions.length > 0) return countryOptions;
    return [{ value: "+961", label: "+961" }];
  }, [countryOptions]);

  const activeCountryCode = useMemo(() => {
    const preferredCode = String(selectedCountryCode ?? "").trim();
    if (resolvedCountryOptions.some((country) => country.value === preferredCode)) {
      return preferredCode;
    }

    const currentCode = String(currentCountryCode ?? "").trim();
    if (resolvedCountryOptions.some((country) => country.value === currentCode)) {
      return currentCode;
    }

    if (resolvedCountryOptions.some((country) => country.value === "+961")) {
      return "+961";
    }

    return resolvedCountryOptions[0]?.value ?? "";
  }, [currentCountryCode, resolvedCountryOptions, selectedCountryCode]);

  if (!type || !config) return null;

  async function handleSendPhoneOtp() {
    const phone = String(newPhone ?? "").trim();
    const countryCode = String(activeCountryCode ?? "").trim();
    if (!phone) {
      setPhoneError("Please enter a phone number.");
      return;
    }
    if (!countryCode) {
      setPhoneError("Please select a country code.");
      return;
    }

    setPhoneError("");
    setPhoneStatus("");
    try {
      const response = await sendPhoneOtpNew({
        phone,
        country_code: countryCode
      }).unwrap();
      setIsOtpSent(true);
      setPhoneStatus(String(response?.message ?? "OTP sent to your new phone number."));
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.error ??
        "Could not send OTP. Please try again.";
      setPhoneError(String(message));
    }
  }

  async function handleConfirmPhoneOtp() {
    const phone = String(newPhone ?? "").trim();
    const otp = String(otpCode ?? "").trim();
    const countryCode = String(activeCountryCode ?? "").trim();
    if (!phone || !otp) {
      setPhoneError("Please enter phone number and OTP code.");
      return;
    }
    if (!countryCode) {
      setPhoneError("Please select a country code.");
      return;
    }

    setPhoneError("");
    setPhoneStatus("");
    try {
      const response = await confirmPhoneNew({
        phone,
        otp,
        country_code: countryCode
      }).unwrap();
      setPhoneStatus(String(response?.message ?? "Phone number updated."));
      onClose();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.error ??
        "Could not confirm OTP. Please try again.";
      setPhoneError(String(message));
    }
  }

  async function handleSendPasswordOtp() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordError("");
    setPasswordStatus("");
    try {
      const response = await sendPasswordOtp({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      }).unwrap();

      const otpToken =
        String(
          response?.otp_token ??
            response?.token ??
            response?.data?.otp_token ??
            response?.data?.token ??
            ""
        ).trim();
      if (!otpToken) {
        setPasswordError("Could not start password update. Please request OTP again.");
        return;
      }

      setPasswordOtpToken(otpToken);
      setPasswordOtpCode("");
      setIsPasswordOtpSent(true);
      setPasswordStatus(String(response?.message ?? "OTP sent for password change."));
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.error ??
        "Could not send password OTP. Please try again.";
      setPasswordError(String(message));
    }
  }

  async function handleConfirmPasswordOtp() {
    if (!passwordOtpCode.trim()) {
      setPasswordError("Please enter OTP code.");
      return;
    }
    if (!passwordOtpToken) {
      setPasswordError("OTP session expired. Please request a new OTP.");
      return;
    }

    setPasswordError("");
    setPasswordStatus("");
    try {
      const response = await confirmPasswordOtp({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
        code: passwordOtpCode.trim(),
        otp: passwordOtpCode.trim(),
        otp_token: passwordOtpToken.trim()
      }).unwrap();
      const successMessage = String(response?.message ?? "").trim();
      onPasswordChanged?.(successMessage);
      onClose();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.error ??
        "Could not confirm password OTP. Please try again.";
      setPasswordError(String(message));
    }
  }

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{config.title}</h3>
            <p>{config.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={config.closeAria}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          {type === "phone" ? (
            <>
              <label className="settings-account-field">
                <span>{config.fields?.[0]?.label ?? "Current Phone"}</span>
                <input type="text" value={currentPhone || config.fields?.[0]?.defaultValue || ""} readOnly />
              </label>
              <label className="settings-account-field">
                <span>{t("phone.countryCodeLabel")}</span>
                <CountryCodeSelect
                  ariaLabel={t("phone.countryCodeLabel")}
                  options={resolvedCountryOptions}
                  value={activeCountryCode}
                  onChange={(nextValue) => {
                    setSelectedCountryCode(nextValue);
                    if (phoneError) setPhoneError("");
                  }}
                  disabled={isLoadingCountries || resolvedCountryOptions.length === 0}
                />
              </label>
              <label className="settings-account-field">
                <span>{config.fields?.[1]?.label ?? "New Phone Number"}</span>
                <input
                  type="tel"
                  placeholder={config.fields?.[1]?.placeholder ?? "Enter new phone number"}
                  value={newPhone}
                  onChange={(event) => setNewPhone(event.target.value)}
                />
              </label>
              {isOtpSent ? (
                <label className="settings-account-field">
                  <span>{t("phone.otpLabel")}</span>
                  <input
                    type="text"
                    placeholder={t("phone.otpPlaceholder")}
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                  />
                </label>
              ) : null}
              {phoneStatus ? <p>{phoneStatus}</p> : null}
              {phoneError ? <p className="settings-error-text">{phoneError}</p> : null}
            </>
          ) : type === "password" ? (
            <>
              <label className="settings-account-field">
                <span>{config.fields?.[0]?.label ?? "Current Password"}</span>
                <input
                  type="password"
                  placeholder={config.fields?.[0]?.placeholder ?? "Enter current password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
              <label className="settings-account-field">
                <span>{config.fields?.[1]?.label ?? "New Password"}</span>
                <input
                  type="password"
                  placeholder={config.fields?.[1]?.placeholder ?? "Enter new password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label className="settings-account-field">
                <span>{config.fields?.[2]?.label ?? "Confirm New Password"}</span>
                <input
                  type="password"
                  placeholder={config.fields?.[2]?.placeholder ?? "Confirm new password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
              {isPasswordOtpSent ? (
                <label className="settings-account-field">
                  <span>{t("password.otpLabel")}</span>
                  <input
                    type="text"
                    placeholder={t("password.otpPlaceholder")}
                    value={passwordOtpCode}
                    onChange={(event) => setPasswordOtpCode(event.target.value)}
                  />
                </label>
              ) : null}
              {passwordStatus ? <p>{passwordStatus}</p> : null}
              {passwordError ? <p className="settings-error-text">{passwordError}</p> : null}
            </>
          ) : (
            config.fields.map((field) => (
              <label className="settings-account-field" key={field.label}>
                <span>{field.label}</span>
                <input
                  type={field.type}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                />
              </label>
            ))
          )}
        </div>

        <footer className="settings-account-modal-footer">
          <button type="button" className="settings-account-cancel" onClick={onClose}>
            {t("cancel")}
          </button>
          {type === "phone" ? (
            <button
              type="button"
              className="settings-account-submit"
              onClick={isOtpSent ? handleConfirmPhoneOtp : handleSendPhoneOtp}
              disabled={isSendingPhoneOtp || isConfirmingPhoneOtp}
            >
              {isOtpSent
                ? (isConfirmingPhoneOtp ? `${t("phone.confirmActionLabel")}...` : t("phone.confirmActionLabel"))
                : (isSendingPhoneOtp ? `${config.actionLabel}...` : config.actionLabel)}
            </button>
          ) : type === "password" ? (
            <button
              type="button"
              className="settings-account-submit"
              onClick={isPasswordOtpSent ? handleConfirmPasswordOtp : handleSendPasswordOtp}
              disabled={isSendingPasswordOtp || isConfirmingPasswordOtp}
            >
              {isPasswordOtpSent
                ? (isConfirmingPasswordOtp ? `${t("password.confirmActionLabel")}...` : t("password.confirmActionLabel"))
                : (isSendingPasswordOtp ? `${t("password.sendOtpActionLabel")}...` : t("password.sendOtpActionLabel"))}
            </button>
          ) : (
            <button type="button" className="settings-account-submit" onClick={onClose}>
              {config.actionLabel}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

function LanguageModal({ open, onClose }) {
  const t = useTranslations("settings.languageModal");

  if (!open) return null;

  function switchLocale(locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{t("title")}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("closeAria")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          <div className="settings-actions-v2">
            <button type="button" className="settings-action-button" onClick={() => switchLocale("en")}>
              {t("english")}
            </button>
            <button type="button" className="settings-action-button" onClick={() => switchLocale("ar")}>
              {t("arabic")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlockedUsersModal({ open, onClose }) {
  const t = useTranslations("settings.blockedUsersModal");
  const { data: users = [], isLoading, isError } = useGetBlockedUsersQuery(undefined, {
    skip: !open
  });
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  if (!open) return null;

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{t("title")}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          {isLoading ? (
            <p>Loading...</p>
          ) : null}
          {!isLoading && isError ? (
            <p>Could not load blocked users.</p>
          ) : null}
          {!isLoading && !isError && users.length === 0 ? (
            <p>{t("empty")}</p>
          ) : (
            <div className="settings-list-v2">
              {users.map((user) => (
                <div className="settings-row" key={String(user.id ?? user.user_id ?? user.name)}>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.reason}</small>
                  </div>
                  <button
                    type="button"
                    className="settings-account-cancel"
                    disabled={isUnblocking}
                    onClick={async () => {
                      const userId = user?.user_id ?? user?.id;
                      if (!userId) return;
                      try {
                        await unblockUser({ user_id: userId }).unwrap();
                      } catch (error) {
                        console.error("Failed to unblock user", error);
                      }
                    }}
                  >
                    {isUnblocking ? `${t("unblock")}...` : t("unblock")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SupportModal({ type, onClose }) {
  const t = useTranslations("settings");

  const config = useMemo(() => {
    if (!type) return null;
    const all = t.raw("supportContent");
    return all?.[type] ?? null;
  }, [t, type]);

  if (!type || !config) return null;

  return (
    <div className="settings-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-account-modal-header">
          <div>
            <h3>{config.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label={t("supportModal.closeAria")}>
            <X size={20} />
          </button>
        </header>

        <div className="settings-account-modal-body">
          <p>{config.body}</p>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("settings");
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const currentUserPayload = useAppSelector(selectCurrentUser);
  const currentUser = unwrapCurrentUser(currentUserPayload);
  const currentPhone = formatPhoneForSettings(currentUser);
  const currentCountryCode = resolveCountryCodeForSettings(currentUser);

  function readList(key) {
    const value = t.raw(key);
    return Array.isArray(value) ? value : [];
  }

  const accountItems = readList("accountItems");
  const supportItems = readList("supportItems");

  const [activeAccountModal, setActiveAccountModal] = useState(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isBlockedUsersOpen, setIsBlockedUsersOpen] = useState(false);
  const [activeSupportModal, setActiveSupportModal] = useState(null);
  const [passwordChangedMessage, setPasswordChangedMessage] = useState("");

  function handleAccountClick(key) {
    if (key === "phone" || key === "password") {
      setActiveAccountModal(key);
      return;
    }

    if (key === "language") {
      setIsLanguageModalOpen(true);
      return;
    }

    if (key === "blocked") {
      setIsBlockedUsersOpen(true);
    }
  }

  async function handleLogout() {
    const logoutRequest = logout();
    clearStoredAuthToken();
    dispatch(clearAuth());
    router.replace("/login");

    try {
      await logoutRequest.unwrap();
    } catch {
      // The logout mutation clears local auth state even if the server rejects the token.
    }
  }

  return (
    <DashboardShell activePageKey="settings" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="settings-page">
        <div className="settings-grid">
          <article className="settings-card-v2">
            <SectionHeader icon={User} title={t("sections.account")} tone="peach" />
            <div className="settings-list-v2">
              {accountItems.map(({ key, title, description, icon, tone }) => {
                const Icon = resolveSettingsIcon(icon);
                const resolvedSubtitle =
                  key === "language"
                    ? t(`languages.${locale}`)
                    : key === "phone"
                      ? currentPhone || description
                      : description;

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={key}
                    type="button"
                    onClick={() => handleAccountClick(key)}
                  >
                    <span className={`settings-badge ${tone}`}>
                      <Icon size={16} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      {resolvedSubtitle ? <small>{resolvedSubtitle}</small> : null}
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </article>

          <article className="settings-card-v2">
            <SectionHeader icon={HelpCircle} title={t("sections.support")} tone="mint" />
            <div className="settings-list-v2">
              {supportItems.map(({ key, title, subtitle, icon }) => {
                const Icon = resolveSettingsIcon(icon);

                return (
                  <button
                    className="settings-row settings-link-row"
                    key={key}
                    type="button"
                    onClick={() => setActiveSupportModal(key)}
                  >
                    <Icon size={16} />
                    <div>
                      <strong>{title}</strong>
                      {subtitle ? <small>{subtitle}</small> : null}
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <div className="settings-actions-v2">
          <button type="button" className="settings-action-button" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut size={15} />
            {isLoggingOut ? `${t("actions.logout")}...` : t("actions.logout")}
          </button>
          <button type="button" className="settings-action-button danger">
            <Trash2 size={15} />
            {t("actions.deleteAccount")}
          </button>
        </div>
      </section>

      <AccountModal
        key={activeAccountModal ?? "none"}
        type={activeAccountModal}
        onClose={() => setActiveAccountModal(null)}
        currentPhone={currentPhone}
        currentCountryCode={currentCountryCode}
        onPasswordChanged={(message) => {
          const fallback = t("modal.password.changedPopupMessage");
          setPasswordChangedMessage(message || fallback);
        }}
      />
      <LanguageModal open={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
      <BlockedUsersModal open={isBlockedUsersOpen} onClose={() => setIsBlockedUsersOpen(false)} />
      <SupportModal type={activeSupportModal} onClose={() => setActiveSupportModal(null)} />
      {passwordChangedMessage ? (
        <div className="settings-modal-overlay" role="presentation" onClick={() => setPasswordChangedMessage("")}>
          <section
            className="settings-account-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("modal.password.changedPopupTitle")}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="settings-account-modal-header">
              <div>
                <h3>{t("modal.password.changedPopupTitle")}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordChangedMessage("")}
                aria-label={t("modal.password.changedPopupConfirm")}
              >
                <X size={20} />
              </button>
            </header>

            <div className="settings-account-modal-body">
              <p>{passwordChangedMessage}</p>
            </div>

            <footer className="settings-account-modal-footer">
              <button
                type="button"
                className="settings-account-submit"
                onClick={() => setPasswordChangedMessage("")}
              >
                {t("modal.password.changedPopupConfirm")}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </DashboardShell>
  );
}
