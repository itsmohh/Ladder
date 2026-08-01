import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Wifi,
  Tag,
  Calendar,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { getJobById } from "@/lib/jobs";
import {
  formatDatePosted,
  formatJobType,
  formatLocation,
  normalizeMarkdown,
} from "@/lib/format";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SalaryDisplay } from "@/components/ui/SalaryDisplay";
import { AgeBadge } from "@/components/ui/AgeBadge";
import { JobDetailActions } from "@/components/jobs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company ?? "Unknown Company"}`,
    description: job.description
      ? job.description.substring(0, 160)
      : `View details for ${job.title} position`,
  };
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const jobTypeLabel = formatJobType(job.job_type);
  const locationText = formatLocation(job.location, job.is_remote);
  const dateText = formatDatePosted(job.date_posted);
  const normalizedDescription = job.description
    ? normalizeMarkdown(job.description)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <CompanyLogo
              logoUrl={job.company_logo}
              companyName={job.company}
              size="lg"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 text-lg text-slate-600">
                {job.company ?? "Company not listed"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {locationText}
                </span>

                {job.is_remote && (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <Wifi className="h-4 w-4" />
                    Remote
                  </span>
                )}

                {jobTypeLabel && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {jobTypeLabel}
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {dateText}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <SalaryDisplay
                  min={job.salary_min}
                  max={job.salary_max}
                  interval={job.salary_interval}
                  currency={job.currency}
                />

                <AgeBadge age={job.minimum_age} />

                {job.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    <Tag className="h-3.5 w-3.5" />
                    {job.category}
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <JobDetailActions jobId={job.id} />
              </div>
            </div>
          </div>
        </div>

        {normalizedDescription && (
          <div className="p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Job Description
            </h2>
            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:marker:text-slate-400">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {normalizedDescription}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              You are leaving Ladder and applying through the employer&apos;s
              website. Verify the age, schedule, and eligibility requirements
              before submitting personal information.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply Now
                <ExternalLink className="h-5 w-5" />
              </a>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-center text-sm text-slate-500">
                Application link not available
              </div>
            )}

            <Link
              href="/jobs"
              className="text-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:text-left"
            >
              Browse more jobs
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
