"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { getPreferences, updatePreferences } from "@/lib/preferences";
import { Loader2, Save, Check } from "lucide-react";
import {
  US_STATES,
  TRANSPORTATION_LABELS,
  EXPERIENCE_OPTIONS,
  JOB_TYPE_LABELS,
  type TransportationType,
  type UserPreferences,
  type PreferencesFormData,
} from "@/types";

const JOB_CATEGORIES = [
  { value: "Retail", label: "Retail & Shopping" },
  { value: "Food Service", label: "Food & Restaurant" },
  { value: "Recreation", label: "Recreation & Sports" },
  { value: "Education", label: "Education & Tutoring" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Office", label: "Office & Admin" },
  { value: "Technology", label: "Technology" },
  { value: "Arts", label: "Arts & Entertainment" },
  { value: "Nonprofit", label: "Nonprofit & Community" },
  { value: "Other", label: "Other" },
];

const DISTANCE_OPTIONS = [
  { value: 5, label: "Up to 5 miles" },
  { value: 10, label: "Up to 10 miles" },
  { value: 15, label: "Up to 15 miles" },
  { value: 20, label: "Up to 20 miles" },
  { value: 25, label: "Up to 25 miles" },
  { value: 50, label: "Up to 50 miles" },
];

const TIME_SLOTS = [
  { key: "morning", label: "Morning", description: "6am - 12pm" },
  { key: "afternoon", label: "Afternoon", description: "12pm - 6pm" },
  { key: "evening", label: "Evening", description: "6pm - 10pm" },
] as const;

export default function PreferencesPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [formData, setFormData] = useState<PreferencesFormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;
      try {
        const prefs = await getPreferences(user.id);
        if (prefs) {
          setPreferences(prefs);
          setFormData({
            age: prefs.age ?? undefined,
            zip_code: prefs.zip_code ?? undefined,
            city: prefs.city ?? undefined,
            state: prefs.state ?? undefined,
            has_transportation: prefs.has_transportation,
            transportation_type: prefs.transportation_type ?? undefined,
            max_travel_miles: prefs.max_travel_miles,
            available_weekday_morning: prefs.available_weekday_morning,
            available_weekday_afternoon: prefs.available_weekday_afternoon,
            available_weekday_evening: prefs.available_weekday_evening,
            available_weekend_morning: prefs.available_weekend_morning,
            available_weekend_afternoon: prefs.available_weekend_afternoon,
            available_weekend_evening: prefs.available_weekend_evening,
            job_interests: prefs.job_interests ?? undefined,
            previous_experience: prefs.previous_experience ?? undefined,
            preferred_job_types: prefs.preferred_job_types ?? undefined,
            needs_work_permit: prefs.needs_work_permit ?? undefined,
            has_work_permit: prefs.has_work_permit ?? undefined,
            desired_pay_min: prefs.desired_pay_min ?? undefined,
            desired_pay_max: prefs.desired_pay_max ?? undefined,
          });
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      await updatePreferences(user.id, formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (updates: Partial<PreferencesFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (
    key: "job_interests" | "previous_experience" | "preferred_job_types",
    value: string
  ) => {
    const current = formData[key] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFormData({ [key]: updated });
  };

  const toggleAvailability = (day: "weekday" | "weekend", time: string) => {
    const key = `available_${day}_${time}` as keyof PreferencesFormData;
    updateFormData({ [key]: !formData[key] });
  };

  const isAvailabilitySelected = (day: "weekday" | "weekend", time: string) => {
    const key = `available_${day}_${time}` as keyof PreferencesFormData;
    return formData[key] === true;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Preferences</h1>
          <p className="text-slate-600">
            Update your preferences to get better job recommendations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveSuccess ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Personal Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Age
              </label>
              <select
                value={formData.age ?? ""}
                onChange={(e) =>
                  updateFormData({
                    age: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select age</option>
                {Array.from({ length: 6 }, (_, i) => i + 16).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                type="text"
                value={formData.city ?? ""}
                onChange={(e) =>
                  updateFormData({ city: e.target.value || undefined })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Newark"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                State
              </label>
              <select
                value={formData.state ?? ""}
                onChange={(e) =>
                  updateFormData({ state: e.target.value || undefined })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zip_code ?? ""}
                onChange={(e) =>
                  updateFormData({ zip_code: e.target.value || undefined })
                }
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 07102"
                maxLength={10}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Transportation
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Do you have reliable transportation?
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="hasTransportation"
                    checked={formData.has_transportation === true}
                    onChange={() => updateFormData({ has_transportation: true })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="hasTransportation"
                    checked={formData.has_transportation === false}
                    onChange={() => updateFormData({ has_transportation: false })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {formData.has_transportation && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Transportation type
                  </label>
                  <select
                    value={formData.transportation_type ?? ""}
                    onChange={(e) =>
                      updateFormData({
                        transportation_type:
                          (e.target.value as TransportationType) || undefined,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    {Object.entries(TRANSPORTATION_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Max travel distance
                  </label>
                  <select
                    value={formData.max_travel_miles ?? 10}
                    onChange={(e) =>
                      updateFormData({
                        max_travel_miles: parseInt(e.target.value),
                      })
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {DISTANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Availability
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">
                Weekdays
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={`weekday-${slot.key}`}
                    type="button"
                    onClick={() => toggleAvailability("weekday", slot.key)}
                    className={`rounded-lg border-2 p-3 text-center text-sm transition-all ${
                      isAvailabilitySelected("weekday", slot.key)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-xs text-slate-500">
                      {slot.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">
                Weekends
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={`weekend-${slot.key}`}
                    type="button"
                    onClick={() => toggleAvailability("weekend", slot.key)}
                    className={`rounded-lg border-2 p-3 text-center text-sm transition-all ${
                      isAvailabilitySelected("weekend", slot.key)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-xs text-slate-500">
                      {slot.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Job Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleArrayItem("job_interests", cat.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  (formData.job_interests ?? []).includes(cat.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Preferred Job Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleArrayItem("preferred_job_types", value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  (formData.preferred_job_types ?? []).includes(value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Previous Experience
          </h2>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <button
                key={exp.value}
                type="button"
                onClick={() => toggleArrayItem("previous_experience", exp.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  (formData.previous_experience ?? []).includes(exp.value)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Pay Preferences
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Minimum hourly pay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={formData.desired_pay_min ?? ""}
                  onChange={(e) =>
                    updateFormData({
                      desired_pay_min: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 pl-7 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 15"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Maximum hourly pay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={formData.desired_pay_max ?? ""}
                  onChange={(e) =>
                    updateFormData({
                      desired_pay_max: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 pl-7 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Work Permit
          </h2>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.needs_work_permit === true}
                onChange={(e) =>
                  updateFormData({
                    needs_work_permit: e.target.checked || undefined,
                    has_work_permit: e.target.checked
                      ? formData.has_work_permit
                      : undefined,
                  })
                }
                className="mt-0.5 h-4 w-4 rounded"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">
                  I need a work permit (working papers)
                </span>
                <p className="text-xs text-slate-500">
                  Most states require minors under 18 to have a work permit
                </p>
              </div>
            </label>

            {formData.needs_work_permit && (
              <label className="flex cursor-pointer items-center gap-3 pl-7">
                <input
                  type="checkbox"
                  checked={formData.has_work_permit === true}
                  onChange={(e) =>
                    updateFormData({
                      has_work_permit: e.target.checked || undefined,
                    })
                  }
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-slate-700">
                  I already have my work permit
                </span>
              </label>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveSuccess ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
