import { User } from "lucide-react";
import { formatMinimumAge } from "@/lib/format";

interface AgeBadgeProps {
  age: number | null;
  showIcon?: boolean;
}

export function AgeBadge({ age, showIcon = true }: AgeBadgeProps) {
  const label = formatMinimumAge(age);
  const hasAge = age !== null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        hasAge
          ? "bg-blue-100 text-blue-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {showIcon && <User className="h-3 w-3" />}
      {label}
    </span>
  );
}
