import type { AuthSession } from "./auth-session";

type AuthField = "email" | "username" | "password" | "form";

type AuthApiResponse = {
  success?: boolean;
  error?: string;
  field?: AuthField;
  data?: AuthSession;
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

async function performRequest(
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

  return body.data;
}

export function signInWithEmail(email: string, password: string) {
  return performRequest("/login", { email, password });
}

export function signUpWithEmail(username: string, email: string, password: string) {
  return performRequest("/register", { username, email, password });
}
