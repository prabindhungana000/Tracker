import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="auth-shell">
        <section className="auth-card auth-card--callback">
          <div className="auth-card__top">
            <p className="eyebrow">Page not found</p>
            <h2>That page does not exist</h2>
            <p>The route may have changed while the dev server was rebuilding.</p>
          </div>

          <Link href="/auth" className="primary-button primary-button--full">
            Back to sign in
          </Link>
        </section>
      </div>
    </main>
  );
}
