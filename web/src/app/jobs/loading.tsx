export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-5 w-80 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-slate-200 sm:max-w-xs" />
          <div className="h-11 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

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
    </div>
  );
}
