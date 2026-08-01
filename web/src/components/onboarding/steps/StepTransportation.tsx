"use client";

import { TRANSPORTATION_LABELS, type TransportationType } from "@/types";
import type { PreferencesFormData } from "@/types";

interface StepTransportationProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

const DISTANCE_OPTIONS = [
  { value: 5, label: "Up to 5 miles" },
  { value: 10, label: "Up to 10 miles" },
  { value: 15, label: "Up to 15 miles" },
  { value: 20, label: "Up to 20 miles" },
  { value: 25, label: "Up to 25 miles" },
  { value: 50, label: "Up to 50 miles" },
];

export function StepTransportation({ data, onChange }: StepTransportationProps) {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        How do you plan to get to work? This helps us filter jobs within your
        travel range.
      </p>

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Do you have reliable transportation?
        </label>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="hasTransportation"
              checked={data.has_transportation === true}
              onChange={() => onChange({ has_transportation: true })}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Yes</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="hasTransportation"
              checked={data.has_transportation === false}
              onChange={() => onChange({ has_transportation: false })}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">No / Not sure</span>
          </label>
        </div>
      </div>

      {data.has_transportation && (
        <div>
          <label
            htmlFor="transportationType"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            How will you get to work?
          </label>
          <select
            id="transportationType"
            value={data.transportation_type ?? ""}
            onChange={(e) =>
              onChange({
                transportation_type: (e.target.value as TransportationType) || undefined,
              })
            }
            className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select transportation type</option>
            {Object.entries(TRANSPORTATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="maxDistance"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          How far are you willing to travel for work?
        </label>
        <select
          id="maxDistance"
          value={data.max_travel_miles ?? 10}
          onChange={(e) =>
            onChange({ max_travel_miles: parseInt(e.target.value) })
          }
          className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {DISTANCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
