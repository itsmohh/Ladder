import { supabase } from "./supabase";
import type { Application, ApplicationStatus, SavedJob, HiddenJob } from "@/types";

export async function getSavedJobs(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching saved jobs:", error);
    return [];
  }

  return (data ?? []).map((row) => row.job_id);
}

export async function saveJob(userId: string, jobId: string): Promise<void> {
  const { error } = await supabase.from("saved_jobs").insert({
    user_id: userId,
    job_id: jobId,
  });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getHiddenJobs(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("hidden_jobs")
    .select("job_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching hidden jobs:", error);
    return [];
  }

  return (data ?? []).map((row) => row.job_id);
}

export async function hideJob(userId: string, jobId: string): Promise<void> {
  const { error } = await supabase.from("hidden_jobs").insert({
    user_id: userId,
    job_id: jobId,
  });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function unhideJob(userId: string, jobId: string): Promise<void> {
  const { error } = await supabase
    .from("hidden_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getApplications(userId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return (data ?? []) as Application[];
}

export async function getApplication(
  userId: string,
  jobId: string
): Promise<Application | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching application:", error);
    return null;
  }

  return data as Application;
}

export async function createApplication(
  userId: string,
  jobId: string,
  status: ApplicationStatus = "interested"
): Promise<void> {
  const { error } = await supabase.from("applications").insert({
    user_id: userId,
    job_id: jobId,
    status,
    applied_at: status === "applied" ? new Date().toISOString() : null,
  });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function updateApplicationStatus(
  userId: string,
  jobId: string,
  status: ApplicationStatus
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "applied") {
    updates.applied_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("applications")
    .update(updates)
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateApplicationNotes(
  userId: string,
  jobId: string,
  notes: string
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteApplication(
  userId: string,
  jobId: string
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function logRecentlyViewed(
  userId: string,
  jobId: string
): Promise<void> {
  const { error } = await supabase.from("recently_viewed").upsert(
    {
      user_id: userId,
      job_id: jobId,
      viewed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,job_id",
    }
  );

  if (error) {
    console.error("Error logging recently viewed:", error);
  }
}

export async function getRecentlyViewed(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("recently_viewed")
    .select("job_id")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching recently viewed:", error);
    return [];
  }

  return (data ?? []).map((row) => row.job_id);
}
