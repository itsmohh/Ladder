"use client";

import { useState } from "react";
import { getCompanyInitials } from "@/lib/format";

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
};

export function CompanyLogo({
  logoUrl,
  companyName,
  size = "md",
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const initials = getCompanyInitials(companyName);
  const sizeClass = sizeClasses[size];

  if (!logoUrl || hasError) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 font-semibold text-blue-700`}
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} relative shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={companyName ? `${companyName} logo` : "Company logo"}
        className="h-full w-full object-contain p-1"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
