export default function JobDetailsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 h-5 w-28 animate-pulse rounded bg-slate-200" />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-slate-200" />

            <div className="flex-1 space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />

              <div className="flex flex-wrap gap-4">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="mb-4 h-16 animate-pulse rounded-lg bg-slate-200" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-14 w-40 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
