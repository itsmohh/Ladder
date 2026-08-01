"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function JobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Job details error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Something went wrong
      </h1>
      <p className="mb-6 max-w-md text-slate-600">
        We couldn&apos;t load this job listing. Please try again or browse other
        opportunities.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Try again
        </button>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
