type TrackerMealEntry = {
  id: string;
  name: string;
  calories: number;
  meal: string;
  time: string;
  source: "catalog" | "manual";
};

type TrackerBurnEntry = {
  id: string;
  name: string;
  calories: number;
  minutes: number;
  note?: string;
};

export type TrackerSnapshot = {
  goal: number | null;
  burnGoal: number | null;
  weightKg: number;
  meals: TrackerMealEntry[];
  burns: TrackerBurnEntry[];
  createdAt: string;
  updatedAt: string;
};

type TrackerPayload = {
  goal: number | null;
  burnGoal: number | null;
  weightKg: number;
  meals: TrackerMealEntry[];
  burns: TrackerBurnEntry[];
};

type TrackerApiResponse = {
  success?: boolean;
  error?: string;
  data?: TrackerSnapshot;
};

export class TrackerApiError extends Error {}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function performTrackerRequest(
  path: "",
  token: string,
  options?: {
    method?: "GET" | "PUT";
    body?: TrackerPayload;
  },
) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/tracker${path}`, {
      method: options?.method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new TrackerApiError("The backend is not reachable right now.");
  }

  const body = (await response.json().catch(() => null)) as TrackerApiResponse | null;

  if (!response.ok || !body?.success || !body.data) {
    throw new TrackerApiError(body?.error || "Unable to sync tracker right now.");
  }

  return body.data;
}

export function fetchTrackerSnapshot(token: string) {
  return performTrackerRequest("", token);
}

export function saveTrackerSnapshot(token: string, payload: TrackerPayload) {
  return performTrackerRequest("", token, {
    method: "PUT",
    body: payload,
  });
}
