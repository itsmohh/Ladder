"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { useAuth } from "@/components/auth";
import { getRecentlyViewed } from "@/lib/user-actions";
import { supabase } from "@/lib/supabase";
import type { JobCardData } from "@/types";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HistoryPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecentJobs() {
      if (!user) return;

      try {
        const recentJobIds = await getRecentlyViewed(user.id);

        if (recentJobIds.length === 0) {
          setJobs([]);
          return;
        }

        const { data, error } = await supabase
          .from("jobs")
          .select(
            "id, title, company, location, job_type, salary_interval, salary_min, salary_max, currency, is_remote, minimum_age, category, date_posted, company_logo"
          )
          .in("id", recentJobIds)
          .eq("status", "published");

        if (error) {
          console.error("Error fetching recent jobs:", error);
          return;
        }

        const jobMap = new Map(
          (data ?? []).map((job) => [job.id, job as JobCardData])
        );
        const orderedJobs = recentJobIds
          .map((id) => jobMap.get(id))
          .filter((job): job is JobCardData => job !== undefined);

        setJobs(orderedJobs);
      } catch (error) {
        console.error("Error loading recent jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecentJobs();
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <History className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recently Viewed</h1>
          <p className="text-sm text-slate-600">
            Jobs you&apos;ve looked at recently
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No recent history"
          message="Jobs you view will appear here for easy access."
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
