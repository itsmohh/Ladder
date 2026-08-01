"use client";

import type { PreferencesFormData } from "@/types";

interface StepAvailabilityProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

const TIME_SLOTS = [
  { key: "morning", label: "Morning", description: "6am - 12pm" },
  { key: "afternoon", label: "Afternoon", description: "12pm - 6pm" },
  { key: "evening", label: "Evening", description: "6pm - 10pm" },
] as const;

export function StepAvailability({ data, onChange }: StepAvailabilityProps) {
  const toggleAvailability = (day: "weekday" | "weekend", time: string) => {
    const key = `available_${day}_${time}` as keyof PreferencesFormData;
    onChange({ [key]: !data[key] });
  };

  const isSelected = (day: "weekday" | "weekend", time: string) => {
    const key = `available_${day}_${time}` as keyof PreferencesFormData;
    return data[key] === true;
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        When are you available to work? Select all times that work for you.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 font-medium text-slate-900">Weekdays</h3>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={`weekday-${slot.key}`}
                type="button"
                onClick={() => toggleAvailability("weekday", slot.key)}
                className={`rounded-lg border-2 p-4 text-center transition-all ${
                  isSelected("weekday", slot.key)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="font-medium">{slot.label}</div>
                <div className="text-xs text-slate-500">{slot.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-slate-900">Weekends</h3>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={`weekend-${slot.key}`}
                type="button"
                onClick={() => toggleAvailability("weekend", slot.key)}
                className={`rounded-lg border-2 p-4 text-center transition-all ${
                  isSelected("weekend", slot.key)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="font-medium">{slot.label}</div>
                <div className="text-xs text-slate-500">{slot.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> Many entry-level jobs offer flexible schedules that work
          around school or other commitments. Part-time roles often need evening and weekend
          availability.
        </p>
      </div>
    </div>
  );
}
