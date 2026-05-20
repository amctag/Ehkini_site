import AuthShell from "./AuthShell";
import LoginCard from "./LoginCard";

export default function LoginScreen() {
  return (
    <AuthShell label="Login">
      <LoginCard />
    </AuthShell>
  );
}
