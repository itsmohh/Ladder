"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ClipboardList,
  History,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import {
  getSavedJobs,
  getApplications,
  getRecentlyViewed,
} from "@/lib/user-actions";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  type Application,
} from "@/types";

export default function DashboardPage() {
  const { user, profile, preferences } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentCount, setRecentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const [saved, apps, recent] = await Promise.all([
          getSavedJobs(user.id),
          getApplications(user.id),
          getRecentlyViewed(user.id),
        ]);

        setSavedCount(saved.length);
        setApplications(apps);
        setRecentCount(recent.length);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  const activeApplications = applications.filter(
    (app) => !["rejected", "closed"].includes(app.status)
  );

  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-1 text-slate-600">
          Here&apos;s an overview of your job search activity.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/saved"
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Bookmark className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{savedCount}</p>
          <p className="text-sm text-slate-600">Saved Jobs</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/dashboard/applications"
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <ClipboardList className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {activeApplications.length}
          </p>
          <p className="text-sm text-slate-600">Active Applications</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/dashboard/history"
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <History className="h-5 w-5 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{recentCount}</p>
          <p className="text-sm text-slate-600">Recently Viewed</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {applications.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Application Status
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className={`rounded-lg px-4 py-2 ${APPLICATION_STATUS_COLORS[status as keyof typeof APPLICATION_STATUS_COLORS]}`}
              >
                <span className="font-medium">{count}</span>{" "}
                <span className="text-sm">
                  {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!preferences?.onboarding_completed && user && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                Get personalized job recommendations
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Complete your profile to see jobs tailored to your location.
              </p>
              <Link
                href="/onboarding"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                Complete setup <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {applications.length === 0 && savedCount === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="mb-4 text-slate-600">
            You haven&apos;t saved any jobs or tracked any applications yet.
          </p>
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
