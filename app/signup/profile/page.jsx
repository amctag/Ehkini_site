import AuthShell from "@/components/AuthShell";
import ProfilePreferencesForm from "@/components/ProfilePreferencesForm";
import { getTranslations } from "next-intl/server";

export default async function ProfilePreferencesPage() {
  const t = await getTranslations("authShell");

  return (
    <AuthShell label={t("profilePreferencesLabel")}>
      <ProfilePreferencesForm />
    </AuthShell>
  );
}
