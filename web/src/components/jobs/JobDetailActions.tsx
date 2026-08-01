"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { SaveJobButton } from "./SaveJobButton";
import { HideJobButton } from "./HideJobButton";
import { ApplicationStatusSelect } from "./ApplicationStatusSelect";
import {
  getSavedJobs,
  getHiddenJobs,
  getApplication,
  logRecentlyViewed,
} from "@/lib/user-actions";
import type { ApplicationStatus } from "@/types";

interface JobDetailActionsProps {
  jobId: string;
}

export function JobDetailActions({ jobId }: JobDetailActionsProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const [savedJobs, hiddenJobs, application] = await Promise.all([
          getSavedJobs(user.id),
          getHiddenJobs(user.id),
          getApplication(user.id, jobId),
        ]);

        setIsSaved(savedJobs.includes(jobId));
        setIsHidden(hiddenJobs.includes(jobId));
        setApplicationStatus(application?.status ?? null);

        await logRecentlyViewed(user.id, jobId);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user, jobId]);

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <SaveJobButton
        jobId={jobId}
        isSaved={isSaved}
        onToggle={setIsSaved}
      />
      <HideJobButton
        jobId={jobId}
        isHidden={isHidden}
        onToggle={setIsHidden}
      />
      <ApplicationStatusSelect
        jobId={jobId}
        currentStatus={applicationStatus}
        onStatusChange={setApplicationStatus}
      />
    </div>
  );
}
