import { supabase } from "./supabase";
import type { Job, JobCardData, JobFilters, UserPreferences } from "@/types";

const JOBS_PER_PAGE = 24;

const JOB_CARD_FIELDS = `
  id,
  title,
  company,
  location,
  job_type,
  salary_interval,
  salary_min,
  salary_max,
  currency,
  is_remote,
  minimum_age,
  category,
  date_posted,
  company_logo
`;

export interface JobsResult {
  jobs: JobCardData[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export async function getJobs(filters: JobFilters): Promise<JobsResult> {
  const page = filters.page ?? 1;
  const offset = (page - 1) * JOBS_PER_PAGE;

  let query = supabase
    .from("jobs")
    .select(JOB_CARD_FIELDS, { count: "exact" })
    .eq("status", "published");

  if (filters.keyword) {
    const searchTerm = `%${filters.keyword}%`;
    query = query.or(`title.ilike.${searchTerm},company.ilike.${searchTerm}`);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.minAge !== undefined && filters.minAge > 0) {
    query = query.or(`minimum_age.lte.${filters.minAge},minimum_age.is.null`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.jobType) {
    query = query.eq("job_type", filters.jobType);
  }

  if (filters.remoteOnly) {
    query = query.eq("is_remote", true);
  }

  if (filters.datePosted) {
    const daysAgo = parseInt(filters.datePosted, 10);
    if (!isNaN(daysAgo) && daysAgo > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      query = query.gte("date_posted", cutoffDate.toISOString().split("T")[0]);
    }
  }

  query = query
    .order("date_posted", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + JOBS_PER_PAGE - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error:", error);
    throw new Error("Failed to fetch jobs. Please try again later.");
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PER_PAGE));

  return {
    jobs: (data ?? []) as JobCardData[],
    totalCount,
    page,
    totalPages,
  };
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Supabase query error:", error);
    throw new Error("Failed to fetch job details. Please try again later.");
  }

  return data as Job;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("category")
    .eq("status", "published")
    .not("category", "is", null);

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  const categories = new Set<string>();
  for (const row of data ?? []) {
    if (row.category) {
      categories.add(row.category);
    }
  }

  return Array.from(categories).sort();
}

export async function getJobTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("job_type")
    .eq("status", "published")
    .not("job_type", "is", null);

  if (error) {
    console.error("Failed to fetch job types:", error);
    return [];
  }

  const jobTypes = new Set<string>();
  for (const row of data ?? []) {
    if (row.job_type) {
      jobTypes.add(row.job_type);
    }
  }

  return Array.from(jobTypes).sort();
}

export function buildFiltersFromPreferences(
  preferences: UserPreferences
): Partial<JobFilters> {
  const filters: Partial<JobFilters> = {};

  // Use state for "For You" location filter (broader results)
  if (preferences.state) {
    filters.location = preferences.state;
  }

  return filters;
}

export async function getRecommendedJobs(
  preferences: UserPreferences,
  limit: number = 12
): Promise<JobCardData[]> {
  let query = supabase
    .from("jobs")
    .select(JOB_CARD_FIELDS)
    .eq("status", "published");

  // Use state for location filter (broader results)
  if (preferences.state) {
    query = query.ilike("location", `%${preferences.state}%`);
  }

  query = query
    .order("date_posted", { ascending: false, nullsFirst: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recommended jobs:", error);
    return [];
  }

  return (data ?? []) as JobCardData[];
}

export async function getJobsExcludingHidden(
  filters: JobFilters,
  hiddenJobIds: string[]
): Promise<JobsResult> {
  const page = filters.page ?? 1;
  const offset = (page - 1) * JOBS_PER_PAGE;

  let query = supabase
    .from("jobs")
    .select(JOB_CARD_FIELDS, { count: "exact" })
    .eq("status", "published");

  if (hiddenJobIds.length > 0) {
    query = query.not("id", "in", `(${hiddenJobIds.join(",")})`);
  }

  if (filters.keyword) {
    const searchTerm = `%${filters.keyword}%`;
    query = query.or(`title.ilike.${searchTerm},company.ilike.${searchTerm}`);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.minAge !== undefined && filters.minAge > 0) {
    query = query.or(`minimum_age.lte.${filters.minAge},minimum_age.is.null`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.jobType) {
    query = query.eq("job_type", filters.jobType);
  }

  if (filters.remoteOnly) {
    query = query.eq("is_remote", true);
  }

  if (filters.datePosted) {
    const daysAgo = parseInt(filters.datePosted, 10);
    if (!isNaN(daysAgo) && daysAgo > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      query = query.gte("date_posted", cutoffDate.toISOString().split("T")[0]);
    }
  }

  query = query
    .order("date_posted", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + JOBS_PER_PAGE - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error:", error);
    throw new Error("Failed to fetch jobs. Please try again later.");
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PER_PAGE));

  return {
    jobs: (data ?? []) as JobCardData[],
    totalCount,
    page,
    totalPages,
  };
}
