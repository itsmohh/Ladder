import { supabase } from "./supabase";
import type { UserPreferences, PreferencesFormData } from "@/types";

export async function getPreferences(
  userId: string
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching preferences:", error);
    return null;
  }

  return data as UserPreferences;
}

export async function updatePreferences(
  userId: string,
  updates: PreferencesFormData
): Promise<void> {
  const { error } = await supabase
    .from("user_preferences")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeOnboarding(userId: string): Promise<void> {
  const { error } = await supabase
    .from("user_preferences")
    .update({
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createPreferences(userId: string): Promise<void> {
  const { error } = await supabase.from("user_preferences").insert({
    user_id: userId,
  });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}
