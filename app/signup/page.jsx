import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
  const t = await getTranslations("authShell");

  return (
    <AuthShell label={t("signupLabel")}>
      <SignUpForm />
    </AuthShell>
  );
}
