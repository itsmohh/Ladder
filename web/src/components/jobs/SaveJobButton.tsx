"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth";
import { saveJob, unsaveJob } from "@/lib/user-actions";

interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
  variant?: "icon" | "button";
  onToggle?: (saved: boolean) => void;
}

export function SaveJobButton({
  jobId,
  isSaved: initialSaved,
  variant = "button",
  onToggle,
}: SaveJobButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        await unsaveJob(user.id, jobId);
        setIsSaved(false);
        onToggle?.(false);
      } else {
        await saveJob(user.id, jobId);
        setIsSaved(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          isSaved
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }`}
        aria-label={isSaved ? "Unsave job" : "Save job"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        isSaved
          ? "border-blue-200 bg-blue-50 text-blue-600"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
      )}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
