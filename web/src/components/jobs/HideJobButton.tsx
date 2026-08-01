"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth";
import { hideJob, unhideJob } from "@/lib/user-actions";

interface HideJobButtonProps {
  jobId: string;
  isHidden: boolean;
  onToggle?: (hidden: boolean) => void;
}

export function HideJobButton({
  jobId,
  isHidden: initialHidden,
  onToggle,
}: HideJobButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(initialHidden);
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
      if (isHidden) {
        await unhideJob(user.id, jobId);
        setIsHidden(false);
        onToggle?.(false);
      } else {
        await hideJob(user.id, jobId);
        setIsHidden(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error("Error toggling hide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        isHidden
          ? "border-slate-300 bg-slate-100 text-slate-600"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
      {isHidden ? "Hidden" : "Hide"}
    </button>
  );
}
