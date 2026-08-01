"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/components/auth";
import { getSavedJobs } from "@/lib/user-actions";
import { supabase } from "@/lib/supabase";
import type { JobCardData } from "@/types";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSavedJobs() {
      if (!user) return;

      try {
        const savedJobIds = await getSavedJobs(user.id);

        if (savedJobIds.length === 0) {
          setJobs([]);
          return;
        }

        const { data, error } = await supabase
          .from("jobs")
          .select(
            "id, title, company, location, job_type, salary_interval, salary_min, salary_max, currency, is_remote, minimum_age, category, date_posted, company_logo"
          )
          .in("id", savedJobIds)
          .eq("status", "published");

        if (error) {
          console.error("Error fetching saved jobs:", error);
          return;
        }

        setJobs((data ?? []) as JobCardData[]);
      } catch (error) {
        console.error("Error loading saved jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedJobs();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <Bookmark className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Saved Jobs</h1>
          <p className="text-sm text-slate-600">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} saved
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          message="Save jobs you're interested in to review them later."
          showClearFilters={false}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {jobs.length === 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
