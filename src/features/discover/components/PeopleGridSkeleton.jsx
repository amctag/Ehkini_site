function SkeletonCard() {
  return (
    <div className="profile-card people-skeleton-card" aria-hidden="true">
      <div className="people-skeleton-shimmer" />
      <div className="people-skeleton-content">
        <span className="people-skeleton-line people-skeleton-line-lg" />
        <span className="people-skeleton-line people-skeleton-line-sm" />
        <span className="people-skeleton-line people-skeleton-line-md" />
        <span className="people-skeleton-line people-skeleton-line-xs" />
        <div className="people-skeleton-tags">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function PeopleGridSkeleton({ count = 8 }) {
  return (
    <div className="people-grid people-grid-skeleton" aria-label="Loading people">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
