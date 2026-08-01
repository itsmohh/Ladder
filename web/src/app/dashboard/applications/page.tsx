"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ExternalLink } from "lucide-react";
import { useAuth } from "@/components/auth";
import { getApplications } from "@/lib/user-actions";
import { supabase } from "@/lib/supabase";
import { ApplicationStatusSelect } from "@/components/jobs";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDatePosted } from "@/lib/format";
import type { Application, Job } from "@/types";

interface ApplicationWithJob extends Application {
  job?: Pick<Job, "id" | "title" | "company" | "company_logo" | "location">;
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      if (!user) return;

      try {
        const apps = await getApplications(user.id);

        if (apps.length === 0) {
          setApplications([]);
          return;
        }

        const jobIds = apps.map((app) => app.job_id);
        const { data: jobs, error } = await supabase
          .from("jobs")
          .select("id, title, company, company_logo, location")
          .in("id", jobIds);

        if (error) {
          console.error("Error fetching jobs:", error);
          setApplications(apps);
          return;
        }

        const jobMap = new Map(jobs?.map((job) => [job.id, job]));
        const appsWithJobs = apps.map((app) => ({
          ...app,
          job: jobMap.get(app.job_id),
        }));

        setApplications(appsWithJobs);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, [user]);

  const handleStatusChange = (jobId: string, newStatus: string | null) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.job_id === jobId
          ? { ...app, status: newStatus as Application["status"] }
          : app
      )
    );
  };

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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
          <ClipboardList className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-600">
            Track your job application progress
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications tracked"
          message="Start tracking your job applications to stay organized."
          showClearFilters={false}
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
            >
              <CompanyLogo
                logoUrl={app.job?.company_logo ?? null}
                companyName={app.job?.company ?? null}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/jobs/${app.job_id}`}
                  className="font-medium text-slate-900 hover:text-blue-600"
                >
                  {app.job?.title ?? "Job"}
                </Link>
                <p className="truncate text-sm text-slate-600">
                  {app.job?.company ?? "Company"} •{" "}
                  {app.job?.location ?? "Location"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {app.applied_at
                    ? `Applied ${formatDatePosted(app.applied_at)}`
                    : `Added ${formatDatePosted(app.created_at)}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ApplicationStatusSelect
                  jobId={app.job_id}
                  currentStatus={app.status}
                  onStatusChange={(status) =>
                    handleStatusChange(app.job_id, status)
                  }
                />
                <Link
                  href={`/jobs/${app.job_id}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 && (
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
