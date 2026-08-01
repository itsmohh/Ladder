"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import { useAuth } from "@/components/auth";
import { updatePreferences, completeOnboarding } from "@/lib/preferences";
import type { PreferencesFormData } from "@/types";
import { StepAge } from "./steps/StepAge";
import { StepLocation } from "./steps/StepLocation";
import { StepTransportation } from "./steps/StepTransportation";
import { StepAvailability } from "./steps/StepAvailability";
import { StepInterests } from "./steps/StepInterests";
import { StepPay } from "./steps/StepPay";

const STEPS = [
  { id: "age", title: "Your Age", component: StepAge },
  { id: "location", title: "Your Location", component: StepLocation },
  { id: "transportation", title: "Getting Around", component: StepTransportation },
  { id: "availability", title: "Your Schedule", component: StepAvailability },
  { id: "interests", title: "Your Interests", component: StepInterests },
  { id: "pay", title: "Pay Preferences", component: StepPay },
];

export function OnboardingWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PreferencesFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (updates: Partial<PreferencesFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      await updatePreferences(user.id, formData);
      await completeOnboarding(user.id);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await completeOnboarding(user.id);
      router.push("/jobs");
      router.refresh();
    } catch (err) {
      console.error("Error skipping onboarding:", err);
      router.push("/jobs");
    }
  };

  const CurrentStepComponent = STEPS[currentStep]?.component;
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700"
          >
            Skip for now
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {STEPS[currentStep]?.title}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-8">
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={formData}
            onChange={updateFormData}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {isLastStep ? (
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Complete Setup
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
