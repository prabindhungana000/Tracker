export type AuthUser = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const AUTH_SESSION_KEY = "calorie-tracker.auth.session";

function readStoredJson<T>(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readAuthSession() {
  return readStoredJson<AuthSession>(AUTH_SESSION_KEY);
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
