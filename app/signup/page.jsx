import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthShell label="Sign up">
      <SignUpForm />
    </AuthShell>
  );
}
