import AuthShell from "@/components/AuthShell";
import DetailsForm from "@/components/DetailsForm";
import { getTranslations } from "next-intl/server";

export default async function DetailsPage() {
  const t = await getTranslations("authShell");

  return (
    <AuthShell label={t("detailsLabel")}>
      <DetailsForm />
    </AuthShell>
  );
}
