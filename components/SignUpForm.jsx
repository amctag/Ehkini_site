import Link from "next/link";

export default function SignUpForm() {
  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>Create Account</h2>
        <p>Start with your basic information</p>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>First Name</span>
          <input type="text" name="firstName" placeholder="First name" autoComplete="given-name" />
        </label>

        <label className="field">
          <span>Last Name</span>
          <input type="text" name="lastName" placeholder="Last name" autoComplete="family-name" />
        </label>
      </div>

      <label className="field">
        <span>Date of Birth</span>
        <input type="date" name="dateOfBirth" autoComplete="bday" />
      </label>

      <label className="field">
        <span>Gender</span>
        <select name="gender" defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </label>

      <label className="field">
        <span>Phone Number</span>
        <input type="tel" name="phone" placeholder="Enter your phone number" autoComplete="tel" />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          autoComplete="new-password"
        />
      </label>

      <label className="field">
        <span>Confirm Password</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
      </label>

      <label className="check-field">
        <input type="checkbox" name="terms" />
        <span>I agree to the terms and conditions</span>
      </label>

      <div className="button-row">
        <Link className="secondary-button" href="/">
          Back
        </Link>
        <Link className="primary-button" href="/signup/profile">
          Continue
        </Link>
      </div>

      <p className="signup-copy">
        Already have an account? <Link href="/">Sign in</Link>
      </p>
    </form>
  );
}
