import AuthShell from "@/components/AuthShell";
import ProfilePreferencesForm from "@/components/ProfilePreferencesForm";

export default function ProfilePreferencesPage() {
  return (
    <AuthShell label="Profile and preferences">
      <ProfilePreferencesForm />
    </AuthShell>
  );
}
