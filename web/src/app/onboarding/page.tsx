"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/components/auth";
import { OnboardingWizard } from "@/components/onboarding";

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-slate-900">Ladder</span>
          </Link>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Let&apos;s personalize your experience
          </h1>
          <p className="mt-2 text-slate-600">
            Answer a few quick questions so we can show you the best job matches.
          </p>
        </div>

        <OnboardingWizard />
      </main>
    </div>
  );
}
