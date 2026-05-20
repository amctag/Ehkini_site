import BrandMark from "./BrandMark";

export default function AuthShell({ children, label = "Authentication" }) {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label={label}>
        <div className="brand">
          <BrandMark />
          <h1>E7kini</h1>
          <p>Connect with your perfect match</p>
        </div>

        {children}
      </section>
    </main>
  );
}
