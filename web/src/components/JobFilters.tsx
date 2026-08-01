"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback, useEffect } from "react";
import { Search, MapPin, X, Filter, ChevronDown, Sparkles } from "lucide-react";
import { JOB_TYPE_LABELS, DATE_FILTER_OPTIONS } from "@/types";
import { useAuth } from "@/components/auth";
import { buildFiltersFromPreferences } from "@/lib/jobs";

interface JobFiltersProps {
  categories: string[];
  jobTypes: string[];
}

export function JobFilters({ categories, jobTypes }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { preferences } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const currentKeyword = searchParams.get("keyword") ?? "";
  const currentLocation = searchParams.get("location") ?? "";
  const currentMinAge = searchParams.get("minAge") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentJobType = searchParams.get("jobType") ?? "";
  const currentRemoteOnly = searchParams.get("remoteOnly") === "true";
  const currentDatePosted = searchParams.get("datePosted") ?? "";
  const currentForYou = searchParams.get("forYou") === "true";

  const [keyword, setKeyword] = useState(currentKeyword);
  const [location, setLocation] = useState(currentLocation);

  // Sync input state with URL params when they change
  useEffect(() => {
    setKeyword(currentKeyword);
    setLocation(currentLocation);
  }, [currentKeyword, currentLocation]);

  const hasActiveFilters =
    currentKeyword ||
    currentLocation ||
    currentMinAge ||
    currentCategory ||
    currentJobType ||
    currentRemoteOnly ||
    currentDatePosted ||
    currentForYou;

  const updateFilters = useCallback(
    (updates: Record<string, string | boolean | undefined>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("page");

        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === "" || value === false) {
            params.delete(key);
          } else if (typeof value === "boolean") {
            params.set(key, "true");
          } else {
            params.set(key, value);
          }
        });

        router.push(`/jobs?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ keyword, location });
  };

  const clearAllFilters = () => {
    setKeyword("");
    setLocation("");
    router.push("/jobs");
  };

  const activeFilterCount = [
    currentKeyword,
    currentLocation,
    currentMinAge,
    currentCategory,
    currentJobType,
    currentRemoteOnly,
    currentDatePosted,
    currentForYou,
  ].filter(Boolean).length;

  const applyForYouFilters = () => {
    if (!preferences?.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    const prefFilters = buildFiltersFromPreferences(preferences);
    
    if (!prefFilters.location) {
      // No location set, just show all jobs
      router.push("/jobs?forYou=true");
      return;
    }

    const params = new URLSearchParams();
    params.set("forYou", "true");
    params.set("location", prefFilters.location);

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search job title or company..."
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-semibold text-blue-700">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={applyForYouFilters}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              currentForYou
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            For You
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {isFiltersOpen && (
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <label
              htmlFor="minAge"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Your Age
            </label>
            <select
              id="minAge"
              value={currentMinAge}
              onChange={(e) => updateFilters({ minAge: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Any age</option>
              <option value="16">16 years old</option>
              <option value="17">17 years old</option>
              <option value="18">18 years old</option>
              <option value="19">19 years old</option>
              <option value="20">20 years old</option>
              <option value="21">21 years old</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="jobType"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Job Type
            </label>
            <select
              id="jobType"
              value={currentJobType}
              onChange={(e) => updateFilters({ jobType: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {JOB_TYPE_LABELS[type] ?? type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="datePosted"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Date Posted
            </label>
            <select
              id="datePosted"
              value={currentDatePosted}
              onChange={(e) => updateFilters({ datePosted: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {DATE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={currentRemoteOnly}
                onChange={(e) =>
                  updateFilters({ remoteOnly: e.target.checked || undefined })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-slate-700">Remote only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
