"use client";

import type { PreferencesFormData } from "@/types";

interface StepAgeProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

export function StepAge({ data, onChange }: StepAgeProps) {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        We use your age to show jobs that match your eligibility. Many employers
        have minimum age requirements.
      </p>

      <div>
        <label
          htmlFor="age"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          How old are you?
        </label>
        <select
          id="age"
          value={data.age ?? ""}
          onChange={(e) =>
            onChange({ age: e.target.value ? parseInt(e.target.value) : undefined })
          }
          className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Select your age</option>
          {Array.from({ length: 6 }, (_, i) => i + 16).map((age) => (
            <option key={age} value={age}>
              {age} years old
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Why we ask:</strong> Different jobs have different age
          requirements. For example, some jobs require you to be 16, while
          others require you to be 18 or 21.
        </p>
      </div>
    </div>
  );
}
