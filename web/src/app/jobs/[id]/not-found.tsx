import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <FileQuestion className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Job Not Found</h1>
      <p className="mb-6 max-w-md text-slate-600">
        This job listing may have been removed or is no longer available. Browse
        other opportunities to find your next role.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Browse Jobs
      </Link>
    </div>
  );
}
