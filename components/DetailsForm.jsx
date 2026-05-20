import Link from "next/link";

const interests = [
  "Travel",
  "Music",
  "Movies",
  "Fitness",
  "Cooking",
  "Reading",
  "Art",
  "Gaming",
  "Coffee",
  "Outdoors"
];

export default function DetailsForm() {
  return (
    <form className="auth-card auth-card-large">
      <div className="card-heading">
        <h2>Details</h2>
        <p>These fields are optional</p>
      </div>

      <label className="field">
        <span>Occupation <em>Optional</em></span>
        <input type="text" name="occupation" placeholder="What do you do?" autoComplete="organization-title" />
      </label>

      <label className="field">
        <span>Education <em>Optional</em></span>
        <input type="text" name="education" placeholder="School, degree, or field" />
      </label>

      <fieldset className="interest-field">
        <legend>Interests <em>Optional</em></legend>
        <div className="interest-grid">
          {interests.map((interest) => (
            <label className="interest-chip" key={interest}>
              <input type="checkbox" name="interests" value={interest.toLowerCase()} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="button-row">
        <Link className="secondary-button" href="/signup/profile">
          Back
        </Link>
        <Link className="primary-button" href="/">
          Continue
        </Link>
      </div>
    </form>
  );
}
