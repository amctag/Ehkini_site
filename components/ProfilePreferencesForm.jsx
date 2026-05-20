import Link from "next/link";

export default function ProfilePreferencesForm() {
  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>Profile &amp; Preferences</h2>
        <p>Add a little more about yourself</p>
      </div>

      <label className="field">
        <span>Profile Photo <em>Optional</em></span>
        <input type="file" name="profilePhoto" accept="image/*" />
      </label>

      <label className="field">
        <span>Location <em>Optional</em></span>
        <input type="text" name="location" placeholder="City or area" autoComplete="address-level2" />
      </label>

      <label className="field">
        <span>Bio <em>Optional</em></span>
        <textarea name="bio" placeholder="Tell people a bit about you" rows="4" />
      </label>

      <div className="button-row">
        <Link className="secondary-button" href="/signup">
          Back
        </Link>
        <Link className="primary-button" href="/signup/details">
          Continue
        </Link>
      </div>
    </form>
  );
}
