"use client";

import { US_STATES } from "@/types";
import type { PreferencesFormData } from "@/types";

interface StepLocationProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

export function StepLocation({ data, onChange }: StepLocationProps) {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Tell us where you&apos;re located so we can show jobs near you.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            value={data.city ?? ""}
            onChange={(e) => onChange({ city: e.target.value || undefined })}
            placeholder="e.g., Newark"
            className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            State
          </label>
          <select
            id="state"
            value={data.state ?? ""}
            onChange={(e) => onChange({ state: e.target.value || undefined })}
            className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select state</option>
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="zip"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          ZIP Code (optional)
        </label>
        <input
          id="zip"
          type="text"
          value={data.zip_code ?? ""}
          onChange={(e) => onChange({ zip_code: e.target.value || undefined })}
          placeholder="e.g., 07102"
          maxLength={10}
          className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:max-w-xs"
        />
        <p className="mt-1 text-xs text-slate-500">
          Adding your ZIP helps us find jobs closer to you
        </p>
      </div>
    </div>
  );
}
