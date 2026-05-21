/** Default avatar when the user has no profile photo */
export default function ProfileAvatarPlaceholder({ className = "" }) {
  return (
    <div className={`profile-avatar-placeholder ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 120 140" className="profile-avatar-placeholder-icon">
        <circle cx="60" cy="38" r="24" />
        <ellipse cx="60" cy="108" rx="44" ry="34" />
      </svg>
    </div>
  );
}
