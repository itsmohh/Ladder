import { SearchX } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  message?: string;
  showClearFilters?: boolean;
}

export function EmptyState({
  title = "No jobs found",
  message = "Try adjusting your search or filters to find more opportunities.",
  showClearFilters = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <SearchX className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-600">{message}</p>
      {showClearFilters && (
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Clear All Filters
        </Link>
      )}
    </div>
  );
}
