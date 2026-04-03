import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseBrowserClient: SupabaseClient | null = null;

function readBrowserEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  return process.env[name]?.trim() || "";
}

export function getSupabaseBrowserConfigError() {
  const hasMissingUrl = !readBrowserEnv("NEXT_PUBLIC_SUPABASE_URL");
  const hasMissingAnonKey = !readBrowserEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!hasMissingUrl && !hasMissingAnonKey) {
    return null;
  }

  return "App setup is incomplete. Please try again later.";
}

export function hasSupabaseBrowserConfig() {
  return getSupabaseBrowserConfigError() === null;
}

export function getSupabaseBrowserClient() {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const configError = getSupabaseBrowserConfigError();

  if (configError) {
    throw new Error(configError);
  }

  const supabaseUrl = readBrowserEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readBrowserEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: "foodjourney.supabase.auth",
    },
  });

  return supabaseBrowserClient;
}
