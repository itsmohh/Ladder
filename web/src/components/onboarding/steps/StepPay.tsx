"use client";

import type { PreferencesFormData } from "@/types";

interface StepPayProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

export function StepPay({ data, onChange }: StepPayProps) {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        What hourly pay are you looking for? This helps us highlight jobs that
        match your expectations.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="payMin"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Minimum hourly pay
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              $
            </span>
            <input
              id="payMin"
              type="number"
              min="0"
              step="0.50"
              value={data.desired_pay_min ?? ""}
              onChange={(e) =>
                onChange({
                  desired_pay_min: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="e.g., 15"
              className="h-12 w-full rounded-lg border border-slate-300 pl-8 pr-4 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="payMax"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Maximum hourly pay (optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              $
            </span>
            <input
              id="payMax"
              type="number"
              min="0"
              step="0.50"
              value={data.desired_pay_max ?? ""}
              onChange={(e) =>
                onChange({
                  desired_pay_max: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="e.g., 20"
              className="h-12 w-full rounded-lg border border-slate-300 pl-8 pr-4 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-slate-900">Work permit status</h3>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={data.needs_work_permit === true}
              onChange={(e) =>
                onChange({ needs_work_permit: e.target.checked || undefined })
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-slate-700">
                I need a work permit (working papers)
              </span>
              <p className="text-xs text-slate-500">
                Most states require minors under 18 to have a work permit
              </p>
            </div>
          </label>

          {data.needs_work_permit && (
            <label className="flex cursor-pointer items-start gap-3 pl-7">
              <input
                type="checkbox"
                checked={data.has_work_permit === true}
                onChange={(e) =>
                  onChange({ has_work_permit: e.target.checked || undefined })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">
                I already have my work permit
              </span>
            </label>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Almost done!</strong> Click &quot;Complete Setup&quot; to save
          your preferences. You can update these anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
