import { useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import LoginCard from "./LoginCard";

export default function LoginScreen() {
  const t = useTranslations("authShell");

  return (
    <AuthShell label={t("loginLabel")}>
      <LoginCard />
    </AuthShell>
  );
}
