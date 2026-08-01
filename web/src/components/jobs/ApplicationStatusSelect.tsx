"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { useAuth } from "@/components/auth";
import {
  createApplication,
  updateApplicationStatus,
} from "@/lib/user-actions";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  type ApplicationStatus,
} from "@/types";

interface ApplicationStatusSelectProps {
  jobId: string;
  currentStatus: ApplicationStatus | null;
  onStatusChange?: (status: ApplicationStatus | null) => void;
}

const STATUSES: ApplicationStatus[] = [
  "interested",
  "applied",
  "interview",
  "offer",
  "rejected",
  "closed",
];

export function ApplicationStatusSelect({
  jobId,
  currentStatus,
  onStatusChange,
}: ApplicationStatusSelectProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus | null>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    try {
      if (status === null) {
        await createApplication(user.id, jobId, newStatus);
      } else {
        await updateApplicationStatus(user.id, jobId, newStatus);
      }
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackJob = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      await createApplication(user.id, jobId, "interested");
      setStatus("interested");
      onStatusChange?.("interested");
    } catch (error) {
      console.error("Error tracking job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === null) {
    return (
      <button
        onClick={handleTrackJob}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Track Application
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${APPLICATION_STATUS_COLORS[status]}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {APPLICATION_STATUS_LABELS[status]}
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                  s === status ? "font-medium text-blue-600" : "text-slate-700"
                }`}
              >
                {APPLICATION_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
