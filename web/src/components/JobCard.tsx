import Link from "next/link";
import { MapPin, Clock, Wifi, Tag } from "lucide-react";
import type { JobCardData } from "@/types";
import { formatDatePosted, formatJobType, formatLocation } from "@/lib/format";
import { CompanyLogo } from "./ui/CompanyLogo";
import { SalaryDisplay } from "./ui/SalaryDisplay";
import { AgeBadge } from "./ui/AgeBadge";

interface JobCardProps {
  job: JobCardData;
}

export function JobCard({ job }: JobCardProps) {
  const jobTypeLabel = formatJobType(job.job_type);
  const locationText = formatLocation(job.location, job.is_remote);
  const dateText = formatDatePosted(job.date_posted);

  return (
    <article className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <Link
        href={`/jobs/${job.id}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`View details for ${job.title} at ${job.company ?? "Unknown company"}`}
      />

      <div className="flex gap-4">
        <CompanyLogo
          logoUrl={job.company_logo}
          companyName={job.company}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-base font-semibold text-slate-900 group-hover:text-blue-600">
            {job.title}
          </h3>
          <p className="truncate text-sm text-slate-600">
            {job.company ?? "Company not listed"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="max-w-[180px] truncate">{locationText}</span>
        </span>

        {job.is_remote && (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <Wifi className="h-3.5 w-3.5" />
            Remote
          </span>
        )}

        {jobTypeLabel && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {jobTypeLabel}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <SalaryDisplay
          min={job.salary_min}
          max={job.salary_max}
          interval={job.salary_interval}
          currency={job.currency}
        />

        <AgeBadge age={job.minimum_age} />

        {job.category && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            <Tag className="h-3 w-3" />
            {job.category}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">{dateText}</span>
        <span className="text-sm font-medium text-blue-600 group-hover:underline">
          View Details
        </span>
      </div>
    </article>
  );
}
