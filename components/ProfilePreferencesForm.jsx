"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateSignupDraft } from "@/src/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";

export default function ProfilePreferencesForm() {
  const t = useTranslations("profilePreferencesForm");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.auth.signupDraft);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(
      updateSignupDraft({
        location: String(formData.get("location") ?? "").trim(),
        about_me: String(formData.get("bio") ?? "").trim()
      })
    );

    router.push("/signup/details");
  }

  return (
    <form className="auth-card auth-card-large" onSubmit={handleSubmit}>
      <div className="card-heading">
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <label className="field">
        <span>{t("profilePhoto")} <em>{t("optional")}</em></span>
        <input type="file" name="profilePhoto" accept="image/*" />
      </label>

      <label className="field">
        <span>{t("location")} <em>{t("optional")}</em></span>
        <input
          type="text"
          name="location"
          placeholder={t("locationPlaceholder")}
          autoComplete="address-level2"
          defaultValue={draft.location ?? ""}
        />
      </label>

      <label className="field">
        <span>{t("bio")} <em>{t("optional")}</em></span>
        <textarea
          name="bio"
          placeholder={t("bioPlaceholder")}
          rows="4"
          defaultValue={draft.about_me ?? ""}
        />
      </label>

      <div className="button-row">
        <Link className="secondary-button" href="/signup">
          {t("back")}
        </Link>
        <button className="primary-button" type="submit">
          {t("continue")}
        </button>
      </div>
    </form>
  );
}
