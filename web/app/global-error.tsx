"use client";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body>
        <main className="auth-page">
          <div className="auth-page__glow auth-page__glow--left" />
          <div className="auth-page__glow auth-page__glow--right" />

          <div className="auth-shell">
            <section className="auth-card auth-card--callback">
              <div className="auth-card__top">
                <p className="eyebrow">App error</p>
                <h2>The app could not load</h2>
                <p>{error.message || "Please restart the dev server and try again."}</p>
              </div>

              <button
                type="button"
                className="primary-button primary-button--full"
                onClick={() => reset()}
              >
                Reload app
              </button>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
