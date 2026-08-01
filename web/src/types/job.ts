export interface Job {
  id: string;
  source_job_id: string;
  source: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  date_posted: string | null;
  job_type: string | null;
  salary_interval: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  is_remote: boolean;
  minimum_age: number | null;
  category: string | null;
  teen_score: number | null;
  application_url: string | null;
  company_logo: string | null;
  status: string;
  first_seen_at: string;
  last_seen_at: string;
  created_at: string;
}

export interface JobCardData {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  job_type: string | null;
  salary_interval: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  is_remote: boolean;
  minimum_age: number | null;
  category: string | null;
  date_posted: string | null;
  company_logo: string | null;
}

export type JobType = "parttime" | "fulltime" | "internship" | "contract";

export const JOB_TYPE_LABELS: Record<string, string> = {
  parttime: "Part-time",
  fulltime: "Full-time",
  internship: "Internship",
  contract: "Contract",
};

export type SalaryInterval =
  | "hourly"
  | "yearly"
  | "monthly"
  | "weekly"
  | "daily";

export const SALARY_INTERVAL_LABELS: Record<string, string> = {
  hourly: "per hour",
  yearly: "per year",
  monthly: "per month",
  weekly: "per week",
  daily: "per day",
};

export interface JobFilters {
  keyword?: string;
  location?: string;
  minAge?: number;
  category?: string;
  jobType?: string;
  remoteOnly?: boolean;
  datePosted?: string;
  page?: number;
}

export const DATE_FILTER_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
] as const;
