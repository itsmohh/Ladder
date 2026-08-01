import { DollarSign } from "lucide-react";
import { formatSalary } from "@/lib/format";

interface SalaryDisplayProps {
  min: number | null;
  max: number | null;
  interval: string | null;
  currency: string | null;
  showIcon?: boolean;
}

export function SalaryDisplay({
  min,
  max,
  interval,
  currency,
  showIcon = true,
}: SalaryDisplayProps) {
  const salary = formatSalary(min, max, interval, currency);
  const hasSalary = min !== null || max !== null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${
        hasSalary ? "text-green-700" : "text-slate-500"
      }`}
    >
      {showIcon && <DollarSign className="h-3.5 w-3.5" />}
      {salary}
    </span>
  );
}
