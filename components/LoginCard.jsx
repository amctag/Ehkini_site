import Link from "next/link";

export default function LoginCard() {
  return (
    <form className="auth-card" action="/discover">
      <div className="card-heading">
        <h2>Welcome Back</h2>
        <p>Log in to your account</p>
      </div>

      <label className="field">
        <span>Email or Phone</span>
        <input
          type="text"
          name="identifier"
          placeholder="Enter your email or phone"
          autoComplete="username"
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </label>

      <Link className="reset-link" href="/forgot-password">
        Forgot Password?
      </Link>

      <button type="submit">Login</button>

      <p className="signup-copy">
        Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </form>
  );
}
