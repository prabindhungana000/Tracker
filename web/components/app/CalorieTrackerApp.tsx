"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { ACTIVITY_CATALOG } from "../../lib/activity-catalog";
import { clearAuthSession, readAuthSession, type AuthSession } from "../../lib/auth-session";
import { FOOD_CATALOG, FOOD_CATEGORIES, type FoodItem } from "../../lib/food-catalog";
import {
  fetchTrackerSnapshot,
  saveTrackerSnapshot,
  type TrackerSnapshot,
} from "../../lib/tracker-api";

type MealEntry = {
  id: string;
  name: string;
  calories: number;
  meal: string;
  time: string;
  source: "catalog" | "manual";
};

type BurnEntry = {
  id: string;
  name: string;
  calories: number;
  minutes: number;
  note?: string;
};

type TrackerState = {
  goal: number | null;
  burnGoal: number | null;
  weightKg: number;
  meals: MealEntry[];
  burns: BurnEntry[];
};

type PartialTrackerState = Partial<Omit<TrackerState, "goal" | "burnGoal">> & {
  goal?: number | null | "";
  burnGoal?: number | null | "";
  meals?: Partial<MealEntry>[];
  burns?: Partial<BurnEntry>[];
};

type TrackerPanel = "overview" | "food-search" | "meal-log" | "burn-zone" | "about";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
const ALL_FOOD_CATEGORIES = "All";

const STORAGE_KEY = "calorie-tracker.state";

const DEFAULT_STATE: TrackerState = {
  goal: 2200,
  burnGoal: 450,
  weightKg: 70,
  meals: [
    {
      id: "m1",
      name: "Oats and banana",
      calories: 420,
      meal: "Breakfast",
      time: "08:10",
      source: "manual",
    },
    {
      id: "m2",
      name: "Chicken rice bowl",
      calories: 640,
      meal: "Lunch",
      time: "13:05",
      source: "manual",
    },
  ],
  burns: [{ id: "b1", name: "Brisk walk", calories: 180, minutes: 35, note: "Estimated burn" }],
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function normalizeTrackerState(raw: PartialTrackerState | null): TrackerState {
  if (!raw) {
    return DEFAULT_STATE;
  }

  return {
    goal:
      raw.goal === "" || raw.goal === null ? null : typeof raw.goal === "number" ? raw.goal : DEFAULT_STATE.goal,
    burnGoal:
      raw.burnGoal === "" || raw.burnGoal === null
        ? null
        : typeof raw.burnGoal === "number"
          ? raw.burnGoal
          : DEFAULT_STATE.burnGoal,
    weightKg: typeof raw.weightKg === "number" ? raw.weightKg : DEFAULT_STATE.weightKg,
    meals: Array.isArray(raw.meals)
      ? raw.meals
          .filter((entry) => Boolean(entry?.name) && typeof entry?.calories === "number")
          .map((entry, index) => ({
            id: typeof entry.id === "string" ? entry.id : `meal-restored-${index}`,
            name: entry.name || "Food",
            calories: entry.calories || 0,
            meal: entry.meal || "Meal",
            time: entry.time || "Any time",
            source: entry.source === "catalog" ? "catalog" : "manual",
          }))
      : DEFAULT_STATE.meals,
    burns: Array.isArray(raw.burns)
      ? raw.burns
          .filter((entry) => Boolean(entry?.name) && typeof entry?.calories === "number")
          .map((entry, index) => ({
            id: typeof entry.id === "string" ? entry.id : `burn-restored-${index}`,
            name: entry.name || "Activity",
            calories: entry.calories || 0,
            minutes: typeof entry.minutes === "number" ? entry.minutes : 0,
            note: entry.note,
          }))
      : DEFAULT_STATE.burns,
  };
}

function getStorageKey(userId: string) {
  return `${STORAGE_KEY}:${userId}`;
}

function readState(userId?: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = userId
    ? window.localStorage.getItem(getStorageKey(userId)) || window.localStorage.getItem(STORAGE_KEY)
    : window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return normalizeTrackerState(JSON.parse(raw) as PartialTrackerState);
  } catch {
    return null;
  }
}

function trackerStateFromSnapshot(snapshot: TrackerSnapshot): TrackerState {
  return normalizeTrackerState(snapshot);
}

function trackerPayloadFromState(state: TrackerState) {
  return {
    goal: state.goal,
    burnGoal: state.burnGoal,
    weightKg: state.weightKg,
    meals: state.meals,
    burns: state.burns,
  };
}

function serializeTrackerPayload(payload: ReturnType<typeof trackerPayloadFromState>) {
  return JSON.stringify(payload);
}

function sanitizeWholeNumberInput(value: string) {
  return value.replace(/[^\d]/g, "");
}

function formatMealTime(value: string) {
  if (!value) {
    return "Current time";
  }

  const [hourValue, minuteValue] = value.split(":");
  const hours = Number(hourValue);
  const minutes = Number(minuteValue);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2024, 0, 1, hours, minutes));
}

function getMealTimeSuggestions(mealType: string) {
  switch (mealType) {
    case "Breakfast":
      return ["07:30", "08:00", "09:00"];
    case "Lunch":
      return ["12:30", "13:00", "13:30"];
    case "Dinner":
      return ["18:30", "19:00", "20:00"];
    default:
      return ["10:30", "15:30", "21:00"];
  }
}

function progress(current: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(Math.round((current / target) * 100), 100);
}

function getCurrentTimeValue() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function estimateBurnCalories(met: number, weightKg: number, minutes: number) {
  const hours = minutes / 60;
  return Math.round(met * weightKg * hours);
}

function CircleMeter({
  label,
  value,
  target,
  strokeColor,
  trailColor,
  radius,
}: {
  label: string;
  value: number;
  target: number;
  strokeColor: string;
  trailColor: string;
  radius: number;
}) {
  const normalizedTarget = target > 0 ? target : 1;
  const circumference = 2 * Math.PI * radius;
  const cappedProgress = Math.min(value / normalizedTarget, 1);
  const strokeDashoffset = circumference * (1 - cappedProgress);

  return (
    <div className="ring-meter">
      <svg viewBox="0 0 140 140" className="ring-meter__svg" aria-hidden="true">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={trailColor}
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="ring-meter__content">
        <span>{label}</span>
        <strong>{progress(value, target)}%</strong>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="tracker-icon" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg viewBox="0 0 24 24" className="tracker-icon" aria-hidden="true">
      <path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CalorieTrackerApp() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<TrackerState>(DEFAULT_STATE);
  const stateRef = useRef<TrackerState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [hasRemoteLoaded, setHasRemoteLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState<TrackerPanel>("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [foodQuery, setFoodQuery] = useState("");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState(ALL_FOOD_CATEGORIES);
  const [isFoodPickerOpen, setIsFoodPickerOpen] = useState(false);
  const [activityQuery, setActivityQuery] = useState("");
  const [isActivityPickerOpen, setIsActivityPickerOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(String(DEFAULT_STATE.goal));
  const [burnGoalInput, setBurnGoalInput] = useState(String(DEFAULT_STATE.burnGoal));
  const [weightInput, setWeightInput] = useState(String(DEFAULT_STATE.weightKg));
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isEditingBurnGoal, setIsEditingBurnGoal] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedFoodMessage, setSelectedFoodMessage] = useState("");
  const [mealError, setMealError] = useState("");
  const [burnError, setBurnError] = useState("");
  const [manualMealForm, setManualMealForm] = useState({ name: "", calories: "" });
  const [selectedActivityId, setSelectedActivityId] = useState(ACTIVITY_CATALOG[0]?.id || "");
  const [activityMinutes, setActivityMinutes] = useState("30");
  const [manualBurnForm, setManualBurnForm] = useState({ name: "", calories: "", minutes: "" });
  const foodInputRef = useRef<HTMLInputElement | null>(null);
  const foodPickerRef = useRef<HTMLDivElement | null>(null);
  const activityPickerRef = useRef<HTMLDivElement | null>(null);
  const lastSyncedAtRef = useRef<string | null>(null);
  const lastSavedPayloadRef = useRef("");
  const skipNextSaveRef = useRef(false);
  const saveRequestIdRef = useRef(0);
  const syncErrorLoggedRef = useRef(false);

  useEffect(() => {
    const nextSession = readAuthSession();

    if (!nextSession) {
      router.replace("/auth");
      return;
    }

    setSession(nextSession);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const stored = readState(session.user.id);
    const restoredState = stored || DEFAULT_STATE;
    const serializedPayload = serializeTrackerPayload(trackerPayloadFromState(restoredState));

    stateRef.current = restoredState;
    lastSavedPayloadRef.current = serializedPayload;
    lastSyncedAtRef.current = null;
    skipNextSaveRef.current = false;
    setHasRemoteLoaded(false);
    setState(restoredState);
    setLoaded(true);
  }, [session]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!loaded || !session || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(getStorageKey(session.user.id), JSON.stringify(state));
  }, [loaded, session, state]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activePanel]);

  useEffect(() => {
    if (!isEditingGoal) {
      setGoalInput(state.goal === null ? "" : String(state.goal));
    }
  }, [isEditingGoal, state.goal]);

  useEffect(() => {
    if (!isEditingBurnGoal) {
      setBurnGoalInput(state.burnGoal === null ? "" : String(state.burnGoal));
    }
  }, [isEditingBurnGoal, state.burnGoal]);

  useEffect(() => {
    if (!isEditingWeight) {
      setWeightInput(String(state.weightKg));
    }
  }, [isEditingWeight, state.weightKg]);

  const goalValue = typeof state.goal === "number" ? state.goal : 0;
  const burnGoalValue = typeof state.burnGoal === "number" ? state.burnGoal : 0;
  const hasGoal = goalValue > 0;
  const hasBurnGoal = burnGoalValue > 0;
  const eaten = state.meals.reduce((sum, item) => sum + item.calories, 0);
  const burned = state.burns.reduce((sum, item) => sum + item.calories, 0);
  const net = eaten - burned;
  const remaining = hasGoal ? goalValue - net : 0;
  const intakeProgress = progress(eaten, goalValue);
  const burnProgress = progress(burned, burnGoalValue);

  const filteredFoods = useMemo(() => {
    const normalizedQuery = foodQuery.trim().toLowerCase();

    return FOOD_CATALOG.filter((food) => {
      const matchesCategory =
        selectedFoodCategory === ALL_FOOD_CATEGORIES || food.category === selectedFoodCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return selectedFoodCategory !== ALL_FOOD_CATEGORIES;
      }

      const haystack = `${food.name} ${food.category} ${food.serving} ${food.keywords?.join(" ") || ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    }).slice(0, 36);
  }, [foodQuery, selectedFoodCategory]);

  const foodCategorySummaries = useMemo(
    () =>
      FOOD_CATEGORIES.map((category) => ({
        category,
        count: FOOD_CATALOG.filter((food) => food.category === category).length,
      })),
    [],
  );

  const foodSearchPlaceholder =
    selectedFoodCategory === ALL_FOOD_CATEGORIES
      ? "Search pizza, fruit, dessert, salad, momo..."
      : `Search in ${selectedFoodCategory.toLowerCase()}`;

  const foodPanelBadge =
    selectedFoodCategory === ALL_FOOD_CATEGORIES
      ? foodQuery.trim()
        ? `${filteredFoods.length} matches`
        : `${FOOD_CATEGORIES.length} groups`
      : `${selectedFoodCategory} - ${filteredFoods.length}`;

  const selectedActivity = useMemo(
    () => ACTIVITY_CATALOG.find((activity) => activity.id === selectedActivityId) || ACTIVITY_CATALOG[0],
    [selectedActivityId],
  );

  const filteredActivities = useMemo(() => {
    const normalizedQuery = activityQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return ACTIVITY_CATALOG;
    }

    return ACTIVITY_CATALOG.filter((activity) => {
      const haystack = `${activity.name} ${activity.note}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activityQuery]);

  const mealTimeSuggestions = useMemo(() => getMealTimeSuggestions(selectedMealType), [selectedMealType]);

  const estimatedBurn = useMemo(() => {
    const minutes = Number(activityMinutes);

    if (!selectedActivity || minutes <= 0 || state.weightKg <= 0) {
      return 0;
    }

    return estimateBurnCalories(selectedActivity.met, state.weightKg, minutes);
  }, [activityMinutes, selectedActivity, state.weightKg]);

  useEffect(() => {
    if (!selectedActivity || isActivityPickerOpen) {
      return;
    }

    setActivityQuery(selectedActivity.name);
  }, [isActivityPickerOpen, selectedActivity]);

  useEffect(() => {
    if (!isFoodPickerOpen || typeof document === "undefined") {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (
        foodPickerRef.current &&
        event.target instanceof Node &&
        !foodPickerRef.current.contains(event.target)
      ) {
        setIsFoodPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isFoodPickerOpen]);

  useEffect(() => {
    if (!isActivityPickerOpen || typeof document === "undefined") {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (
        activityPickerRef.current &&
        event.target instanceof Node &&
        !activityPickerRef.current.contains(event.target)
      ) {
        setIsActivityPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isActivityPickerOpen]);

  useEffect(() => {
    if (!loaded || !session) {
      return;
    }

    const sessionToken = session.token;
    let cancelled = false;

    async function syncFromServer() {
      try {
        const snapshot = await fetchTrackerSnapshot(sessionToken);

        if (cancelled) {
          return;
        }

        const remoteState = trackerStateFromSnapshot(snapshot);
        const remotePayload = serializeTrackerPayload(trackerPayloadFromState(remoteState));
        const currentPayload = serializeTrackerPayload(trackerPayloadFromState(stateRef.current));
        const hasPendingLocalChanges = currentPayload !== lastSavedPayloadRef.current;

        syncErrorLoggedRef.current = false;
        setHasRemoteLoaded(true);

        if (remotePayload === currentPayload) {
          lastSavedPayloadRef.current = remotePayload;
          lastSyncedAtRef.current = snapshot.updatedAt;
          return;
        }

        if (hasPendingLocalChanges) {
          return;
        }

        if (
          remotePayload !== lastSavedPayloadRef.current ||
          snapshot.updatedAt !== lastSyncedAtRef.current
        ) {
          applyRemoteSnapshot(snapshot);
        }
      } catch (error) {
        if (!cancelled) {
          setHasRemoteLoaded(true);

          if (!syncErrorLoggedRef.current) {
            console.error("Tracker sync error:", error);
            syncErrorLoggedRef.current = true;
          }
        }
      }
    }

    void syncFromServer();
    const intervalId = window.setInterval(() => {
      void syncFromServer();
    }, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [loaded, session]);

  useEffect(() => {
    if (!loaded || !session || !hasRemoteLoaded) {
      return;
    }

    const sessionToken = session.token;
    const payload = trackerPayloadFromState(state);
    const serializedPayload = serializeTrackerPayload(payload);

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      lastSavedPayloadRef.current = serializedPayload;
      return;
    }

    if (serializedPayload === lastSavedPayloadRef.current) {
      return;
    }

    let cancelled = false;
    const requestId = saveRequestIdRef.current + 1;
    saveRequestIdRef.current = requestId;

    async function persistState() {
      try {
        const snapshot = await saveTrackerSnapshot(sessionToken, payload);

        if (cancelled || requestId !== saveRequestIdRef.current) {
          return;
        }

        const remoteState = trackerStateFromSnapshot(snapshot);
        const remotePayload = serializeTrackerPayload(trackerPayloadFromState(remoteState));

        syncErrorLoggedRef.current = false;
        lastSavedPayloadRef.current = remotePayload;
        lastSyncedAtRef.current = snapshot.updatedAt;

        if (remotePayload !== serializedPayload) {
          applyRemoteSnapshot(snapshot);
        }
      } catch (error) {
        if (!cancelled && !syncErrorLoggedRef.current) {
          console.error("Tracker save error:", error);
          syncErrorLoggedRef.current = true;
        }
      }
    }

    void persistState();

    return () => {
      cancelled = true;
    };
  }, [hasRemoteLoaded, loaded, session, state]);

  function applyRemoteSnapshot(snapshot: TrackerSnapshot) {
    const nextState = trackerStateFromSnapshot(snapshot);
    const serializedPayload = serializeTrackerPayload(trackerPayloadFromState(nextState));

    lastSavedPayloadRef.current = serializedPayload;
    lastSyncedAtRef.current = snapshot.updatedAt;
    setHasRemoteLoaded(true);

    if (serializedPayload === serializeTrackerPayload(trackerPayloadFromState(stateRef.current))) {
      return;
    }

    skipNextSaveRef.current = true;
    stateRef.current = nextState;
    setState(nextState);
  }

  function handleGoalInputChange(value: string) {
    const sanitizedValue = sanitizeWholeNumberInput(value);

    setGoalInput(sanitizedValue);
    setState((current) => ({
      ...current,
      goal: sanitizedValue ? Math.round(Number(sanitizedValue)) : null,
    }));
  }

  function handleBurnGoalInputChange(value: string) {
    const sanitizedValue = sanitizeWholeNumberInput(value);

    setBurnGoalInput(sanitizedValue);
    setState((current) => ({
      ...current,
      burnGoal: sanitizedValue ? Math.round(Number(sanitizedValue)) : null,
    }));
  }

  function commitGoalInput(value: string) {
    const trimmedValue = sanitizeWholeNumberInput(value);

    setIsEditingGoal(false);

    if (!trimmedValue) {
      setState((current) => ({ ...current, goal: null }));
      return;
    }

    const parsedValue = Number(trimmedValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      setGoalInput(stateRef.current.goal === null ? "" : String(stateRef.current.goal));
      return;
    }

    setState((current) => ({
      ...current,
      goal: Math.round(parsedValue),
    }));
  }

  function commitBurnGoalInput(value: string) {
    const trimmedValue = sanitizeWholeNumberInput(value);

    setIsEditingBurnGoal(false);

    if (!trimmedValue) {
      setState((current) => ({ ...current, burnGoal: null }));
      return;
    }

    const parsedValue = Number(trimmedValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      setBurnGoalInput(stateRef.current.burnGoal === null ? "" : String(stateRef.current.burnGoal));
      return;
    }

    setState((current) => ({
      ...current,
      burnGoal: Math.round(parsedValue),
    }));
  }

  function commitWeightInput(value: string) {
    const trimmedValue = value.trim();

    setIsEditingWeight(false);

    if (!trimmedValue) {
      setWeightInput(String(stateRef.current.weightKg));
      return;
    }

    const parsedValue = Number(trimmedValue);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      setWeightInput(String(stateRef.current.weightKg));
      return;
    }

    setState((current) => ({
      ...current,
      weightKg: Math.round(parsedValue * 10) / 10,
    }));
  }

  function handleFoodQueryChange(value: string) {
    setFoodQuery(value);
    setSelectedFoodMessage("");
    setIsFoodPickerOpen(true);
  }

  function selectFoodCategory(category: string) {
    setSelectedFoodCategory(category);
    setFoodQuery("");
    setSelectedFoodMessage("");
    setIsFoodPickerOpen(false);
  }

  function addFoodToLog(food: FoodItem) {
    const entryTime = selectedTime || getCurrentTimeValue();

    setState((current) => ({
      ...current,
      meals: [
        {
          id: createId("meal"),
          name: food.name,
          calories: food.calories,
          meal: selectedMealType,
          time: entryTime,
          source: "catalog",
        },
        ...current.meals,
      ],
    }));

    setFoodQuery("");
    setSelectedFoodCategory(food.category);
    setIsFoodPickerOpen(false);
    setSelectedFoodMessage(`${food.name} added with ${food.calories} kcal.`);
    setMealError("");
  }

  function addManualMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const calories = Number(manualMealForm.calories);
    const nextName = manualMealForm.name.trim();

    if (!nextName || calories <= 0) {
      setMealError("Add a food name and valid calories.");
      return;
    }

    setState((current) => ({
      ...current,
      meals: [
        {
          id: createId("meal"),
          name: nextName,
          calories,
          meal: selectedMealType,
          time: selectedTime || getCurrentTimeValue(),
          source: "manual",
        },
        ...current.meals,
      ],
    }));

    setManualMealForm({ name: "", calories: "" });
    setSelectedFoodMessage(`${nextName} added to your log.`);
    setMealError("");
  }

  function addEstimatedBurn() {
    const minutes = Number(activityMinutes);

    if (!selectedActivity || estimatedBurn <= 0 || minutes <= 0) {
      setBurnError("Choose an activity and valid minutes to estimate calories burned.");
      return;
    }

    setState((current) => ({
      ...current,
      burns: [
        {
          id: createId("burn"),
          name: selectedActivity.name,
          calories: estimatedBurn,
          minutes,
          note: `Estimated from ${current.weightKg} kg body weight`,
        },
        ...current.burns,
      ],
    }));

    setBurnError("");
  }

  function addManualBurn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const calories = Number(manualBurnForm.calories);
    const minutes = Number(manualBurnForm.minutes);
    const nextName = manualBurnForm.name.trim();

    if (!nextName || calories <= 0 || minutes <= 0) {
      setBurnError("Add an activity, calories, and minutes.");
      return;
    }

    setState((current) => ({
      ...current,
      burns: [
        {
          id: createId("burn"),
          name: nextName,
          calories,
          minutes,
          note: "Manual burn entry",
        },
        ...current.burns,
      ],
    }));

    setManualBurnForm({ name: "", calories: "", minutes: "" });
    setBurnError("");
  }

  function handleLogout() {
    clearAuthSession();
    router.replace("/auth");
  }

  function handleResetToday() {
    setState((current) => ({ ...current, goal: null, burnGoal: null, meals: [], burns: [] }));
    setSelectedFoodMessage("");
    setMealError("");
    setBurnError("");
    setIsMenuOpen(false);
  }

  function openActivityPicker() {
    setActivityQuery("");
    setIsActivityPickerOpen(true);
  }

  function selectActivity(activityId: string) {
    const activity = ACTIVITY_CATALOG.find((item) => item.id === activityId);

    setSelectedActivityId(activityId);
    setActivityQuery(activity?.name || "");
    setIsActivityPickerOpen(false);
    setBurnError("");
  }

  if (!ready || !session) {
    return (
      <main className="tracker-page tracker-page--centered">
        <div className="tracker-shell">
          <section className="guard-card">
            <p className="eyebrow">Checking access</p>
            <h2>Opening your tracker.</h2>
            <p>Redirecting you to sign in.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="tracker-page">
      <div className="tracker-page__glow tracker-page__glow--left" />
      <div className="tracker-page__glow tracker-page__glow--right" />

      <div className="tracker-shell">
        <section className="tracker-topbar tracker-section">
          <div className="tracker-topbar__copy">
            <p className="eyebrow">Tracker</p>
            <strong>{session.user.username}</strong>
            <p>Food, burn, and balance in one place.</p>
          </div>

          <div className="tracker-topbar__actions">
            <div className="tracker-topbar__desktop-actions">
              <button type="button" className="ghost-button tracker-action-button" onClick={handleResetToday}>
                Reset
              </button>
              <button
                type="button"
                className="ghost-button tracker-action-button"
                onClick={() => setActivePanel("about")}
              >
                About
              </button>
              <button
                type="button"
                className="tracker-icon-button tracker-icon-button--logout"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <ExitIcon />
              </button>
            </div>

            <div className="tracker-topbar__mobile-actions">
              <button
                type="button"
                className="tracker-icon-button tracker-icon-button--logout"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <ExitIcon />
              </button>

              <div className="tracker-menu">
                <button
                  type="button"
                  className="tracker-icon-button"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  aria-label="Open menu"
                  aria-expanded={isMenuOpen}
                >
                  <MenuIcon />
                </button>

                {isMenuOpen ? (
                  <div className="tracker-menu__panel">
                    <button type="button" className="tracker-menu__item" onClick={handleResetToday}>
                      Reset today
                    </button>
                    <button
                      type="button"
                      className="tracker-menu__item"
                      onClick={() => setActivePanel("about")}
                    >
                      About
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <nav className="tracker-nav" aria-label="Tracker sections">
          {([
            { id: "overview", label: "Overview" },
            { id: "food-search", label: "Foods" },
            { id: "meal-log", label: "Meals" },
            { id: "burn-zone", label: "Burn" },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tracker-nav__link ${activePanel === item.id ? "tracker-nav__link--active" : ""}`}
              onClick={() => setActivePanel(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {activePanel === "overview" ? (
          <>
        <section className="hero-card tracker-section tracker-section--hero">
          <div className="hero-copy">
            <p className="eyebrow">Overview</p>
            <h1>Track calories faster.</h1>
            <p className="hero-copy__lead">Search foods, fruits, desserts, meals, and estimate burn.</p>
            <div className="hero-copy__chips">
              <span className="hero-chip">Food library</span>
              <span className="hero-chip">Meal log</span>
              <span className="hero-chip">Burn estimate</span>
            </div>
          </div>

          <div className="goal-card">
            <div className="card-head">
              <h2>Daily setup</h2>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Calorie goal</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={goalInput}
                  onFocus={() => setIsEditingGoal(true)}
                  onChange={(event) => handleGoalInputChange(event.target.value)}
                  onBlur={(event) => commitGoalInput(event.target.value)}
                  placeholder="2200"
                />
              </label>
              <label className="field">
                <span>Burn goal</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={burnGoalInput}
                  onFocus={() => setIsEditingBurnGoal(true)}
                  onChange={(event) => handleBurnGoalInputChange(event.target.value)}
                  onBlur={(event) => commitBurnGoalInput(event.target.value)}
                  placeholder="450"
                />
              </label>
              <label className="field">
                <span>Weight (kg)</span>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={weightInput}
                  onFocus={() => setIsEditingWeight(true)}
                  onChange={(event) => setWeightInput(event.target.value)}
                  onBlur={(event) => commitWeightInput(event.target.value)}
                />
              </label>
              <div className="field field--full">
                <span>Meal type</span>
                <div className="meal-type-picker" role="radiogroup" aria-label="Meal type">
                  {MEAL_TYPES.map((mealType) => (
                    <button
                      key={mealType}
                      type="button"
                      className={`meal-type-pill ${selectedMealType === mealType ? "meal-type-pill--active" : ""}`}
                      onClick={() => setSelectedMealType(mealType)}
                      aria-pressed={selectedMealType === mealType}
                    >
                      {mealType}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field field--full field--meal-time">
                <span>Meal time</span>
                <div className="meal-time-card">
                  <div className="meal-time-card__top">
                    <div>
                      <strong>{formatMealTime(selectedTime)}</strong>
                      <p>
                        {selectedTime
                          ? `${selectedMealType} will be saved at ${formatMealTime(selectedTime)}.`
                          : "Leave it empty to use the current time."}
                      </p>
                    </div>
                    {selectedTime ? (
                      <button
                        type="button"
                        className="ghost-button meal-time-card__clear"
                        onClick={() => setSelectedTime("")}
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="meal-time-chips">
                    <button
                      type="button"
                      className={`meal-time-chip ${selectedTime === "" ? "meal-time-chip--active" : ""}`}
                      onClick={() => setSelectedTime("")}
                    >
                      Now
                    </button>
                    {mealTimeSuggestions.map((timeValue) => (
                      <button
                        key={timeValue}
                        type="button"
                        className={`meal-time-chip ${selectedTime === timeValue ? "meal-time-chip--active" : ""}`}
                        onClick={() => setSelectedTime(timeValue)}
                      >
                        {formatMealTime(timeValue)}
                      </button>
                    ))}
                  </div>

                  <label className="meal-time-card__custom">
                    <span>Custom time</span>
                    <div className="time-input-shell">
                      <span className="time-input-shell__label">Pick exact time</span>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(event) => setSelectedTime(event.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className="mini-info-card mini-info-card--muted">
                <strong>Burn formula</strong>
                <p>Estimated calories = activity intensity x body weight x hours.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid tracker-section">
          <article className="summary-card">
            <span>Calories eaten</span>
            <strong>{eaten} kcal</strong>
            <p>{state.meals.length} food entries</p>
          </article>
          <article className="summary-card">
            <span>Calories burned</span>
            <strong>{burned} kcal</strong>
            <p>{state.burns.length} activity entries</p>
          </article>
          <article className="summary-card summary-card--accent">
            <span>Net calories</span>
            <strong>{net} kcal</strong>
            <p>
              {hasGoal
                ? remaining >= 0
                  ? `${remaining} kcal left`
                  : `${Math.abs(remaining)} kcal over`
                : "Set your calorie goal"}
            </p>
          </article>
          <article className="summary-card">
            <span>Burn progress</span>
            <strong>{hasBurnGoal ? `${burnProgress}%` : "--"}</strong>
            <p>
              {hasBurnGoal
                ? burned < burnGoalValue
                  ? `${burnGoalValue - burned} kcal still to burn`
                  : "Burn goal reached"
                : "Set your burn goal"}
            </p>
          </article>
        </section>

        <section className="progress-card tracker-section">
          <div className="progress-card__layout">
            <div className="progress-visual">
              <div className="progress-rings">
                      <CircleMeter
                        label="Intake"
                        value={eaten}
                        target={goalValue}
                        radius={50}
                        strokeColor="#d38d63"
                        trailColor="rgba(211, 141, 99, 0.14)"
                      />
                      <CircleMeter
                        label="Burn"
                        value={burned}
                        target={burnGoalValue}
                        radius={38}
                        strokeColor="#6d9882"
                        trailColor="rgba(168, 200, 173, 0.2)"
                      />
              </div>

                    <div className="progress-visual__meta">
                      <span>Net balance</span>
                      <strong>{net} kcal</strong>
                      <p>
                        {hasGoal
                          ? remaining >= 0
                            ? `${remaining} kcal left in your target`
                            : `${Math.abs(remaining)} kcal over target`
                          : "Set a calorie goal to see your target"}
                      </p>
                    </div>
                  </div>

                  <div className="progress-details">
                    <div className="progress-block">
                      <div className="progress-copy">
                        <span>Food goal</span>
                        <strong>{eaten} / {hasGoal ? goalValue : "--"} kcal</strong>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${intakeProgress}%` }} />
                </div>
              </div>

                    <div className="progress-block">
                      <div className="progress-copy">
                        <span>Burn goal</span>
                        <strong>{burned} / {hasBurnGoal ? burnGoalValue : "--"} kcal</strong>
                      </div>
                      <div className="progress-bar progress-bar--soft">
                        <div
                    className="progress-fill progress-fill--soft"
                    style={{ width: `${burnProgress}%` }}
                  />
                </div>
              </div>

              <div className="progress-legend">
                <div className="progress-legend__item">
                  <span className="progress-legend__dot progress-legend__dot--intake" />
                  <p>Food</p>
                </div>
                <div className="progress-legend__item">
                  <span className="progress-legend__dot progress-legend__dot--burn" />
                  <p>Burn</p>
                </div>
              </div>
            </div>
          </div>

                <p className="status-note">
                  {!hasGoal
                    ? "Set your calorie goal to track your target."
                    : remaining > 250
                      ? "You still have room in your day."
                      : remaining >= 0
                        ? "You are getting close to your calorie target."
                        : "You are over target, but the tracker is still giving you the real picture."}
                </p>
              </section>
          </>
        ) : null}

        {activePanel === "food-search" ? (
        <section className="tracker-grid tracker-grid--search tracker-section">
          <article className="panel-card panel-card--search">
            <div className="card-head">
              <div>
                <p className="eyebrow">Food library</p>
                <h2>Search the food library</h2>
              </div>
              <div className="panel-badge">{foodPanelBadge}</div>
            </div>

            <div className="food-finder" ref={foodPickerRef}>
              <label className="field field--full">
                <span>Search foods or categories</span>
                <input
                  ref={foodInputRef}
                  value={foodQuery}
                  onFocus={() => setIsFoodPickerOpen(true)}
                  onChange={(event) => handleFoodQueryChange(event.target.value)}
                  placeholder={foodSearchPlaceholder}
                />
              </label>

              {isFoodPickerOpen ? (
                <div className="food-category-panel">
                  <div className="food-category-panel__copy">
                    <strong>Browse by type</strong>
                    <p>Dessert, fruit, salad, meat, protein, pizza, and more.</p>
                  </div>

                  <div className="food-category-grid">
                    <button
                      type="button"
                      className={`food-category-button ${selectedFoodCategory === ALL_FOOD_CATEGORIES ? "food-category-button--active" : ""}`}
                      onClick={() => {
                        selectFoodCategory(ALL_FOOD_CATEGORIES);
                      }}
                    >
                      <strong>All foods</strong>
                      <span>{FOOD_CATALOG.length} items</span>
                    </button>

                    {foodCategorySummaries.map((item) => (
                      <button
                        key={item.category}
                        type="button"
                        className={`food-category-button ${selectedFoodCategory === item.category ? "food-category-button--active" : ""}`}
                        onClick={() => {
                          selectFoodCategory(item.category);
                        }}
                      >
                        <strong>{item.category}</strong>
                        <span>{item.count} items</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="food-search-meta">
              {selectedFoodCategory !== ALL_FOOD_CATEGORIES ? (
                <button
                  type="button"
                  className="food-filter-pill"
                  onClick={() => selectFoodCategory(ALL_FOOD_CATEGORIES)}
                >
                  {selectedFoodCategory} only
                  <small>Clear</small>
                </button>
              ) : (
                <p className="helper-copy">
                  Tap the search bar to browse categories, or search directly for foods like pizza,
                  fruit, dessert, salad, meat, and protein.
                </p>
              )}
            </div>

            {selectedFoodMessage ? (
              <p className="success-banner">{selectedFoodMessage}</p>
            ) : null}

            <div className="food-results food-results--grid">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className="food-card"
                    onClick={() => addFoodToLog(food)}
                  >
                    <div>
                      <strong>{food.name}</strong>
                      <p>{food.serving}</p>
                    </div>
                    <div className="food-card__meta">
                      <small className="food-card__tag">{food.category}</small>
                      <span>{food.calories} kcal</span>
                      <small>Add food</small>
                    </div>
                  </button>
                ))
              ) : foodQuery.trim() ? (
                <div className="empty-state">
                  <strong>No matching food found.</strong>
                  <p>Try another search or add it manually below.</p>
                </div>
              ) : selectedFoodCategory !== ALL_FOOD_CATEGORIES ? (
                <div className="empty-state">
                  <strong>No foods in this category yet.</strong>
                  <p>Choose another category or search directly.</p>
                </div>
              ) : (
                <div className="empty-state">
                  <strong>Choose a food group to start.</strong>
                  <p>Click the search bar to browse dessert, fruit, salad, meat, protein, pizza, and more.</p>
                </div>
              )}
            </div>
          </article>

          <article className="panel-card panel-card--compact">
            <div className="card-head">
              <div>
                <p className="eyebrow">Manual add</p>
                <h2>Add food</h2>
              </div>
              <div className="panel-badge">Quick add</div>
            </div>

            <form className="entry-form" onSubmit={addManualMeal}>
              <label className="field field--full">
                <span>Food name</span>
                <input
                  value={manualMealForm.name}
                  onChange={(event) =>
                    setManualMealForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Homemade meal, smoothie, custom food..."
                />
              </label>
              <label className="field field--full">
                <span>Calories</span>
                <input
                  type="number"
                  min="0"
                  value={manualMealForm.calories}
                  onChange={(event) =>
                    setManualMealForm((current) => ({ ...current, calories: event.target.value }))
                  }
                  placeholder="420"
                />
              </label>
              {mealError ? <p className="field-error">{mealError}</p> : null}
              <button type="submit" className="primary-button primary-button--full">
                Add manual food
              </button>
            </form>

            <div className="mini-info-card">
              <strong>Current meal context</strong>
              <p>{selectedMealType} - {selectedTime || "Current time will be used"}</p>
            </div>
          </article>
        </section>
        ) : null}

        {activePanel === "meal-log" ? (
        <section className="tracker-grid tracker-grid--log tracker-section">
          <article className="panel-card panel-card--compact">
            <div className="card-head">
              <div>
                <p className="eyebrow">Meal log</p>
                <h2>Your meals</h2>
              </div>
              <div className="panel-badge">{state.meals.length} items</div>
            </div>

            <div className="entry-list entry-list--scroll">
              {state.meals.length > 0 ? (
                state.meals.map((entry) => (
                  <div key={entry.id} className="entry-item">
                    <div>
                      <strong>{entry.name}</strong>
                      <p>
                        {entry.meal} - {entry.time} - {entry.source === "catalog" ? "Food library" : "Manual"}
                      </p>
                    </div>
                    <div className="entry-meta">
                      <span>{entry.calories} kcal</span>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          setState((current) => ({
                            ...current,
                            meals: current.meals.filter((item) => item.id !== entry.id),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No meals added yet.</strong>
                  <p>Search a food or add one manually to start your day.</p>
                </div>
              )}
            </div>
          </article>
        </section>
        ) : null}

        {activePanel === "burn-zone" ? (
        <section className="tracker-grid tracker-grid--log tracker-section">
          <article className="panel-card panel-card--burn">
            <div className="card-head">
              <div>
                <p className="eyebrow">Burn estimator</p>
                <h2>Burn tracker</h2>
              </div>
              <div className="panel-badge">Live estimate</div>
            </div>

            <div className="activity-picker" ref={activityPickerRef}>
              <label className="field field--full">
                <span>Search activity</span>
                <input
                  value={activityQuery}
                  onFocus={openActivityPicker}
                  onChange={(event) => {
                    setActivityQuery(event.target.value);
                    setIsActivityPickerOpen(true);
                  }}
                  placeholder="Search walking, running, yoga..."
                  autoComplete="off"
                  aria-expanded={isActivityPickerOpen}
                  aria-controls="activity-results"
                />
              </label>

              {isActivityPickerOpen ? (
                <div id="activity-results" className="activity-results">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <button
                        key={activity.id}
                        type="button"
                        className={`activity-result ${activity.id === selectedActivityId ? "activity-result--active" : ""}`}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          selectActivity(activity.id);
                        }}
                      >
                        <div className="activity-result__meta">
                          <strong>{activity.name}</strong>
                          <span>{activity.met.toFixed(1)} MET</span>
                        </div>
                        <p>{activity.note}</p>
                      </button>
                    ))
                  ) : (
                    <div className="empty-state">
                      <strong>No matching activity found.</strong>
                      <p>Try another search or add a burn manually below.</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="helper-copy">Tap the search bar to browse activities.</p>
              )}
            </div>

            <div className="entry-form">
              <label className="field field--full">
                <span>Minutes</span>
                <input
                  type="number"
                  min="1"
                  value={activityMinutes}
                  onChange={(event) => setActivityMinutes(event.target.value)}
                />
              </label>
            </div>

            <div className="estimate-card">
              <div>
                <span>Estimated calories burned</span>
                <strong>{estimatedBurn} kcal</strong>
                <p>
                  Based on {state.weightKg} kg body weight and {selectedActivity?.name.toLowerCase()}.
                </p>
              </div>
              <button type="button" className="primary-button" onClick={addEstimatedBurn}>
                Add estimated burn
              </button>
            </div>

            <form className="entry-form" onSubmit={addManualBurn}>
              <label className="field field--full">
                <span>Manual activity</span>
                <input
                  value={manualBurnForm.name}
                  onChange={(event) =>
                    setManualBurnForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Custom workout or activity..."
                />
              </label>
              <label className="field">
                <span>Calories burned</span>
                <input
                  type="number"
                  min="0"
                  value={manualBurnForm.calories}
                  onChange={(event) =>
                    setManualBurnForm((current) => ({ ...current, calories: event.target.value }))
                  }
                  placeholder="180"
                />
              </label>
              <label className="field">
                <span>Minutes</span>
                <input
                  type="number"
                  min="0"
                  value={manualBurnForm.minutes}
                  onChange={(event) =>
                    setManualBurnForm((current) => ({ ...current, minutes: event.target.value }))
                  }
                  placeholder="30"
                />
              </label>
              {burnError ? <p className="field-error">{burnError}</p> : null}
              <button type="submit" className="primary-button primary-button--full">
                Save manual burn
              </button>
            </form>

            <div className="entry-list entry-list--scroll">
              {state.burns.length > 0 ? (
                state.burns.map((entry) => (
                  <div key={entry.id} className="entry-item">
                    <div>
                      <strong>{entry.name}</strong>
                      <p>{entry.minutes} minutes{entry.note ? ` - ${entry.note}` : ""}</p>
                    </div>
                    <div className="entry-meta">
                      <span>{entry.calories} kcal</span>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          setState((current) => ({
                            ...current,
                            burns: current.burns.filter((item) => item.id !== entry.id),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No burn entries added yet.</strong>
                  <p>Select an activity and calculate your estimated burn.</p>
                </div>
              )}
            </div>
          </article>
        </section>
        ) : null}

        {activePanel === "about" ? (
        <section className="tracker-section">
          <article className="panel-card about-card">
            <div className="about-card__top">
              <button
                type="button"
                className="ghost-button about-card__back"
                onClick={() => setActivePanel("overview")}
              >
                {"<"}
              </button>

              <div>
                <p className="eyebrow">About</p>
                <h2>About this tracker</h2>
              </div>
            </div>

            <p className="about-card__lead">
              A simple calorie tracker for meals, burn, and daily balance.
            </p>

            <div className="about-grid">
              <div className="mini-info-card">
                <strong>What you can do</strong>
                <p>Search food, add meals, log burn, and watch your net calories update.</p>
              </div>
              <div className="mini-info-card">
                <strong>Built for</strong>
                <p>Fast use on mobile, tablet, and desktop browsers.</p>
              </div>
              <div className="mini-info-card">
                <strong>Inside the app</strong>
                <p>Overview, food search, meal log, and burn tracking.</p>
              </div>
            </div>
          </article>
        </section>
        ) : null}
      </div>
    </main>
  );
}
