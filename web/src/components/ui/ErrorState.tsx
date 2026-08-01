import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  retryHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the jobs right now. Please try again later.",
  showRetry = true,
  retryHref = "/jobs",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-600">{message}</p>
      {showRetry && (
        <Link
          href={retryHref}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Try Again
        </Link>
      )}
    </div>
  );
}
