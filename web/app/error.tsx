"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="auth-shell">
        <section className="auth-card auth-card--callback">
          <div className="auth-card__top">
            <p className="eyebrow">Something went wrong</p>
            <h2>We hit a page error</h2>
            <p>{error.message || "Please try refreshing this page."}</p>
          </div>

          <button
            type="button"
            className="primary-button primary-button--full"
            onClick={() => reset()}
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}
