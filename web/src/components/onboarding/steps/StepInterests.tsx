"use client";

import { EXPERIENCE_OPTIONS, JOB_TYPE_LABELS } from "@/types";
import type { PreferencesFormData } from "@/types";

interface StepInterestsProps {
  data: PreferencesFormData;
  onChange: (updates: Partial<PreferencesFormData>) => void;
}

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

export function StepInterests({ data, onChange }: StepInterestsProps) {
  const toggleInterest = (interest: string) => {
    const current = data.job_interests ?? [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    onChange({ job_interests: updated });
  };

  const toggleExperience = (exp: string) => {
    const current = data.previous_experience ?? [];
    const updated = current.includes(exp)
      ? current.filter((e) => e !== exp)
      : [...current, exp];
    onChange({ previous_experience: updated });
  };

  const toggleJobType = (type: string) => {
    const current = data.preferred_job_types ?? [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ preferred_job_types: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-medium text-slate-900">
          What types of jobs interest you?
        </h3>
        <p className="mb-4 text-sm text-slate-600">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleInterest(cat.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                (data.job_interests ?? []).includes(cat.value)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-slate-900">
          What kind of job are you looking for?
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleJobType(value)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                (data.preferred_job_types ?? []).includes(value)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-slate-900">
          Do you have any previous experience?
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Select all that apply (it&apos;s okay if you don&apos;t have any!)
        </p>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_OPTIONS.map((exp) => (
            <button
              key={exp.value}
              type="button"
              onClick={() => toggleExperience(exp.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                (data.previous_experience ?? []).includes(exp.value)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
