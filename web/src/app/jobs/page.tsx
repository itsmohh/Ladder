import { Suspense } from "react";
import type { Metadata } from "next";
import { getJobs, getCategories, getJobTypes } from "@/lib/jobs";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import type { JobFilters as JobFiltersType } from "@/types";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Find jobs, internships, and opportunities for young people ages 16-21. Filter by location, age, job type, and more.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getFilterValue(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function JobsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-2/3 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function JobsList({ filters }: { filters: JobFiltersType }) {
  try {
    const { jobs, totalCount, page, totalPages } = await getJobs(filters);

    if (jobs.length === 0) {
      return <EmptyState />;
    }

    const searchParamsRecord: Record<string, string> = {};
    if (filters.keyword) searchParamsRecord["keyword"] = filters.keyword;
    if (filters.location) searchParamsRecord["location"] = filters.location;
    if (filters.minAge !== undefined)
      searchParamsRecord["minAge"] = filters.minAge.toString();
    if (filters.category) searchParamsRecord["category"] = filters.category;
    if (filters.jobType) searchParamsRecord["jobType"] = filters.jobType;
    if (filters.remoteOnly) searchParamsRecord["remoteOnly"] = "true";
    if (filters.datePosted)
      searchParamsRecord["datePosted"] = filters.datePosted;

    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-medium text-slate-900">
              {jobs.length.toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {totalCount.toLocaleString()}
            </span>{" "}
            {totalCount === 1 ? "job" : "jobs"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/jobs"
            searchParams={searchParamsRecord}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Failed to load jobs:", error);
    return (
      <ErrorState
        message="We couldn't load the jobs right now. Please try again later."
        retryHref="/jobs"
      />
    );
  }
}

async function FiltersWrapper() {
  try {
    const [categories, jobTypes] = await Promise.all([
      getCategories(),
      getJobTypes(),
    ]);

    return <JobFilters categories={categories} jobTypes={jobTypes} />;
  } catch (error) {
    console.error("Failed to load filter options:", error);
    return <JobFilters categories={[]} jobTypes={[]} />;
  }
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: JobFiltersType = {
    keyword: getFilterValue(params.keyword),
    location: getFilterValue(params.location),
    minAge: params.minAge ? parseInt(getFilterValue(params.minAge) ?? "", 10) : undefined,
    category: getFilterValue(params.category),
    jobType: getFilterValue(params.jobType),
    remoteOnly: getFilterValue(params.remoteOnly) === "true",
    datePosted: getFilterValue(params.datePosted),
    page: params.page ? parseInt(getFilterValue(params.page) ?? "1", 10) : 1,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Browse Jobs
        </h1>
        <p className="mt-2 text-slate-600">
          Discover opportunities designed for young people ages 16-21.
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<JobFilters categories={[]} jobTypes={[]} />}>
          <FiltersWrapper />
        </Suspense>
      </div>

      <Suspense fallback={<JobsLoading />}>
        <JobsList filters={filters} />
      </Suspense>
    </div>
  );
}
