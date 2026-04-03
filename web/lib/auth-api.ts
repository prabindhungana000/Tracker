import type { AuthSession, AuthUser } from "./auth-session";
import {
  clearAuthSession,
  readAuthSession,
  setAuthSession,
  updateAuthSessionToken,
} from "./auth-session";
import { getSupabaseBrowserClient, hasSupabaseBrowserConfig } from "./supabase-browser";

type AuthField = "email" | "username" | "password" | "form";

type AuthApiResponse = {
  success?: boolean;
  error?: string;
  field?: AuthField;
  data?: AuthSession;
};

type AuthMeResponse = {
  success?: boolean;
  error?: string;
  field?: AuthField;
  data?: {
    user: AuthUser;
  };
};

export type SignUpResult = {
  session: AuthSession | null;
  requiresEmailConfirmation: boolean;
  message?: string;
};

export class AuthApiError extends Error {
  field?: AuthField;

  constructor(message: string, field?: AuthField) {
    super(message);
    this.name = "AuthApiError";
    this.field = field;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function performLegacyRequest(
  path: "/login" | "/register",
  payload: Record<string, string>,
) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AuthApiError("The backend is not running. Start the server and try again.", "form");
  }

  const body = (await response.json().catch(() => null)) as AuthApiResponse | null;

  if (!response.ok || !body?.success || !body.data) {
    throw new AuthApiError(
      body?.error || "Unable to continue right now.",
      body?.field || "form",
    );
  }

  setAuthSession(body.data);
  return body.data;
}

function getRedirectUrl() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.origin}/auth/callback`;
}

function mapAuthError(error: unknown, fallbackField: AuthField = "form") {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "Unable to continue right now.";

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("password")) {
    return new AuthApiError(message, "password");
  }

  if (normalizedMessage.includes("email")) {
    return new AuthApiError(message, "email");
  }

  if (normalizedMessage.includes("username")) {
    return new AuthApiError(message, "username");
  }

  return new AuthApiError(message, fallbackField);
}

async function fetchAppUser(accessToken: string) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new AuthApiError(
      "The backend is not reachable right now. Start the API and try again.",
      "form",
    );
  }

  const body = (await response.json().catch(() => null)) as AuthMeResponse | null;

  if (!response.ok || !body?.success || !body.data?.user) {
    throw new AuthApiError(
      body?.error || "Unable to load your account right now.",
      body?.field || "form",
    );
  }

  return body.data.user;
}

async function buildSession(accessToken: string) {
  const user = await fetchAppUser(accessToken);
  const session = {
    token: accessToken,
    user,
  };

  setAuthSession(session);
  return session;
}

export async function syncAuthSession() {
  if (!hasSupabaseBrowserConfig()) {
    return readAuthSession();
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw mapAuthError(error);
  }

  if (!data.session) {
    clearAuthSession();
    return null;
  }

  return buildSession(data.session.access_token);
}

export async function getAccessToken(fallbackToken?: string) {
  if (!hasSupabaseBrowserConfig()) {
    return fallbackToken || readAuthSession()?.token || null;
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw mapAuthError(error);
  }

  const accessToken = data.session?.access_token || fallbackToken || null;

  if (!accessToken) {
    clearAuthSession();
    return null;
  }

  if (data.session?.access_token) {
    updateAuthSessionToken(data.session.access_token);
  }

  return accessToken;
}

export async function signInWithEmail(email: string, password: string) {
  if (!hasSupabaseBrowserConfig()) {
    return performLegacyRequest("/login", { email, password });
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw mapAuthError(error);
  }

  if (!data.session) {
    throw new AuthApiError("Unable to start your session right now.", "form");
  }

  return buildSession(data.session.access_token);
}

export async function signUpWithEmail(
  username: string,
  email: string,
  password: string,
): Promise<SignUpResult> {
  if (!hasSupabaseBrowserConfig()) {
    return {
      session: await performLegacyRequest("/register", { username, email, password }),
      requiresEmailConfirmation: false,
    };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: getRedirectUrl(),
    },
  });

  if (error) {
    throw mapAuthError(error);
  }

  if (data.session) {
    return {
      session: await buildSession(data.session.access_token),
      requiresEmailConfirmation: false,
    };
  }

  clearAuthSession();
  return {
    session: null,
    requiresEmailConfirmation: true,
    message: "Account created. Check your email to confirm it, then come back and sign in.",
  };
}

export async function signOutFromApp() {
  clearAuthSession();

  if (!hasSupabaseBrowserConfig()) {
    return;
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw mapAuthError(error);
  }
}

export function subscribeToAuthChanges(callback: (session: AuthSession | null) => void) {
  if (!hasSupabaseBrowserConfig()) {
    return () => {};
  }

  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      clearAuthSession();
      callback(null);
      return;
    }

    if (event === "TOKEN_REFRESHED") {
      const nextSession = updateAuthSessionToken(session.access_token) || readAuthSession();

      if (nextSession) {
        callback(nextSession);
        return;
      }
    }

    void buildSession(session.access_token)
      .then((nextSession) => {
        callback(nextSession);
      })
      .catch((error) => {
        console.error("Auth session sync error:", error);
        clearAuthSession();
        callback(null);
      });
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
