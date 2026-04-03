"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import {
  AuthApiError,
  signInWithEmail,
  signUpWithEmail,
  subscribeToAuthChanges,
  syncAuthSession,
} from "../../lib/auth-api";
import { readAuthSession } from "../../lib/auth-session";
import { hasSupabaseBrowserConfig } from "../../lib/supabase-browser";

type AuthMode = "signin" | "signup";
type AuthErrors = Partial<
  Record<"username" | "email" | "password" | "confirmPassword" | "form", string>
>;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 3 21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.7 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.2 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6 6.7C4.1 8.3 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9A3 3 0 0 0 14.1 14.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AuthExperience() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasSupabaseConfig = hasSupabaseBrowserConfig();

  useEffect(() => {
    if (readAuthSession()) {
      router.replace("/app");
      return;
    }

    if (!hasSupabaseConfig) {
      return;
    }

    let active = true;

    async function restoreSession() {
      try {
        const session = await syncAuthSession();

        if (active && session) {
          router.replace("/app");
        }
      } catch {
        // The auth form is still usable even if session restore fails.
      }
    }

    void restoreSession();
    const unsubscribe = subscribeToAuthChanges((session) => {
      if (active && session) {
        router.replace("/app");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [hasSupabaseConfig, router]);

  function applyApiError(error: unknown) {
    if (error instanceof AuthApiError) {
      if (error.field === "email" || error.field === "username" || error.field === "password") {
        setErrors({ [error.field]: error.message });
        return;
      }

      setErrors({ form: error.message });
      return;
    }

    setErrors({ form: "Something went wrong. Please try again." });
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: AuthErrors = {};

    if (!isValidEmail(signIn.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!signIn.password.trim()) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      await signInWithEmail(normalizeEmail(signIn.email), signIn.password);
      router.replace("/app");
    } catch (error) {
      applyApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: AuthErrors = {};

    if (signUp.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!isValidEmail(signUp.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (signUp.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (signUp.confirmPassword !== signUp.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const result = await signUpWithEmail(
        signUp.username.trim(),
        normalizeEmail(signUp.email),
        signUp.password,
      );

      if (result.session) {
        router.replace("/app");
        return;
      }

      setMode("signin");
      setSignIn({
        email: normalizeEmail(signUp.email),
        password: "",
      });
      setSignUp({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setSuccessMessage(
        result.message || "Account created. Please sign in with your email and password.",
      );
    } catch (error) {
      applyApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="auth-shell">
        <section className="auth-hero">
          <div className="auth-copy">
            <p className="eyebrow">Simple calorie app</p>
            <h1>Sign in and track your day.</h1>
            <p className="auth-copy__lead">Meals, calories, and burn in one clean place.</p>
            <div className="auth-copy__chips">
              <span className="auth-chip">Food search</span>
              <span className="auth-chip">Meal log</span>
              <span className="auth-chip">Burn tracker</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__top">
            <p className="eyebrow">{mode === "signin" ? "Sign in" : "Sign up"}</p>
            <h2>{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
            <p>
              {mode === "signin" ? "Use your email and password." : "Create an account to save your tracker."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={`auth-tab ${mode === "signin" ? "auth-tab--active" : ""}`}
              onClick={() => {
                setMode("signin");
                setErrors({});
                setSuccessMessage("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
              onClick={() => {
                setMode("signup");
                setErrors({});
                setSuccessMessage("");
              }}
            >
              Sign up
            </button>
          </div>

          {mode === "signin" ? (
            <form className="auth-form" onSubmit={handleSignIn}>
              {successMessage ? <p className="success-banner">{successMessage}</p> : null}

              <label className="field field--full">
                <span>Email</span>
                <input
                  type="email"
                  value={signIn.email}
                  onChange={(event) =>
                    setSignIn((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email ? <p className="field-error">{errors.email}</p> : null}
              </label>

              <label className="field field--full">
                <span>Password</span>
                <div className="password-row">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signIn.password}
                    onChange={(event) =>
                      setSignIn((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignInPassword((current) => !current)}
                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    <PasswordVisibilityIcon visible={showSignInPassword} />
                  </button>
                </div>
                {errors.password ? <p className="field-error">{errors.password}</p> : null}
              </label>

              {errors.form ? <p className="auth-error-banner">{errors.form}</p> : null}

              <button
                type="submit"
                className="primary-button primary-button--full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUp}>
              <label className="field field--full">
                <span>Username</span>
                <input
                  value={signUp.username}
                  onChange={(event) =>
                    setSignUp((current) => ({ ...current, username: event.target.value }))
                  }
                  placeholder="Choose a username"
                  autoComplete="username"
                />
                {errors.username ? <p className="field-error">{errors.username}</p> : null}
              </label>

              <label className="field field--full">
                <span>Email</span>
                <input
                  type="email"
                  value={signUp.email}
                  onChange={(event) =>
                    setSignUp((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email ? <p className="field-error">{errors.email}</p> : null}
              </label>

              <label className="field field--full">
                <span>Password</span>
                <div className="password-row">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUp.password}
                    onChange={(event) =>
                      setSignUp((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Use at least 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignUpPassword((current) => !current)}
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    <PasswordVisibilityIcon visible={showSignUpPassword} />
                  </button>
                </div>
                {errors.password ? <p className="field-error">{errors.password}</p> : null}
              </label>

              <label className="field field--full">
                <span>Confirm password</span>
                <div className="password-row">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={signUp.confirmPassword}
                    onChange={(event) =>
                      setSignUp((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <PasswordVisibilityIcon visible={showConfirmPassword} />
                  </button>
                </div>
                {errors.confirmPassword ? <p className="field-error">{errors.confirmPassword}</p> : null}
              </label>

              {errors.form ? <p className="auth-error-banner">{errors.form}</p> : null}

              <button
                type="submit"
                className="primary-button primary-button--full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          <p className="auth-switch">
            {mode === "signin" ? "No account yet? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setErrors({});
                setSuccessMessage("");
              }}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
