"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearAuthSession } from "../../lib/auth-session";
import { syncAuthSession } from "../../lib/auth-api";
import {
  getSupabaseBrowserClient,
  getSupabaseBrowserConfigError,
} from "../../lib/supabase-browser";

type AuthCallbackExperienceProps = {
  code?: string;
  error?: string;
  errorDescription?: string;
};

export function AuthCallbackExperience({
  code,
  error,
  errorDescription,
}: AuthCallbackExperienceProps) {
  const router = useRouter();
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    let active = true;

    async function finishAuth() {
      try {
        const configError = getSupabaseBrowserConfigError();

        if (configError) {
          throw new Error(configError);
        }

        if (errorDescription || error) {
          throw new Error(errorDescription || error);
        }

        const supabase = getSupabaseBrowserClient();

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        }

        const session = await syncAuthSession();

        if (!active) {
          return;
        }

        if (!session) {
          setMessage("Sign-in did not finish. Please try again.");
          return;
        }

        router.replace("/app");
      } catch (nextError) {
        if (!active) {
          return;
        }

        clearAuthSession();
        setMessage(
          nextError instanceof Error
            ? nextError.message
            : "Unable to finish sign-in right now.",
        );
      }
    }

    void finishAuth();

    return () => {
      active = false;
    };
  }, [code, error, errorDescription, router]);

  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="auth-shell">
        <section className="auth-card auth-card--callback">
          <div className="auth-card__top">
            <p className="eyebrow">Account</p>
            <h2>Finishing your sign-in</h2>
            <p>{message}</p>
          </div>

          <p className="auth-helper-note">
            If this page stays here, go back and try signing in again.
          </p>
        </section>
      </div>
    </main>
  );
}
