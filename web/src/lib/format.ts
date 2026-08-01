import { SALARY_INTERVAL_LABELS, JOB_TYPE_LABELS } from "@/types";

export function formatSalary(
  min: number | null,
  max: number | null,
  interval: string | null,
  currency: string | null
): string {
  if (min === null && max === null) {
    return "Pay not listed";
  }

  const currencyCode = currency ?? "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const intervalLabel = interval
    ? SALARY_INTERVAL_LABELS[interval] ?? `per ${interval}`
    : "";

  if (min !== null && max !== null) {
    if (min === max) {
      return `${formatter.format(min)} ${intervalLabel}`.trim();
    }
    return `${formatter.format(min)}–${formatter.format(max)} ${intervalLabel}`.trim();
  }

  if (min !== null) {
    return `From ${formatter.format(min)} ${intervalLabel}`.trim();
  }

  if (max !== null) {
    return `Up to ${formatter.format(max)} ${intervalLabel}`.trim();
  }

  return "Pay not listed";
}

export function formatMinimumAge(age: number | null): string {
  if (age === null) {
    return "Age not listed";
  }
  return `Age ${age}+`;
}

export function formatDatePosted(dateString: string | null): string {
  if (!dateString) {
    return "Date not listed";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Date not listed";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const postDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffTime = today.getTime() - postDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Posted today";
  }

  if (diffDays === 1) {
    return "Posted yesterday";
  }

  if (diffDays > 1 && diffDays <= 30) {
    return `Posted ${diffDays} days ago`;
  }

  return `Posted ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function formatJobType(jobType: string | null): string {
  if (!jobType) {
    return "";
  }
  return JOB_TYPE_LABELS[jobType] ?? jobType;
}

export function formatLocation(
  location: string | null,
  isRemote: boolean
): string {
  if (isRemote && location) {
    return `${location} (Remote)`;
  }
  if (isRemote) {
    return "Remote";
  }
  if (location) {
    return location;
  }
  return "Location not listed";
}

export function getCompanyInitials(company: string | null): string {
  if (!company) {
    return "?";
  }

  const words = company.trim().split(/\s+/);
  if (words.length === 1) {
    return (words[0]?.substring(0, 2) ?? "?").toUpperCase();
  }

  const firstLetter = words[0]?.[0] ?? "";
  const secondLetter = words[1]?.[0] ?? "";
  return (firstLetter + secondLetter).toUpperCase();
}

export function normalizeMarkdown(text: string): string {
  let normalized = text;

  // Handle literal \n and \t sequences
  normalized = normalized.replace(/\\n/g, "\n");
  normalized = normalized.replace(/\\t/g, "  ");

  // Remove all backslash escaping before special characters
  // Handle 4+ backslashes: \\\\- -> -
  normalized = normalized.replace(/\\\\\\\\([&\-+*#\[\](){}|^$?!@=<>:;,/'".])/g, "$1");
  // Handle 2 backslashes: \\- -> -
  normalized = normalized.replace(/\\\\([&\-+*#\[\](){}|^$?!@=<>:;,/'".])/g, "$1");
  // Handle 1 backslash: \- -> -
  normalized = normalized.replace(/\\([&\-+*#\[\](){}|^$?!@=<>:;,/'".])/g, "$1");

  // Convert "**Bold Header** – content" to header + paragraph
  // This handles patterns like "**Customer Assistance & Communication** – Engage with..."
  normalized = normalized.replace(/\*\*([^*]+)\*\*\s*[–—-]\s*/g, "\n\n**$1**\n\n");

  // Convert standalone **HEADER** on its own line to ### Header
  normalized = normalized.replace(/^\*\*([A-Z][A-Z\s&]+)\*\*$/gm, "### $1");

  // Fix inline bullets: "word* Next item" -> "word:\n\n- Next item"
  normalized = normalized.replace(/([a-zA-Z0-9)])[ ]*\*[ ]+([A-Z])/g, "$1:\n\n- $2");

  // Fix bullets after punctuation: "sentence.* Item" -> "sentence.\n\n- Item"
  normalized = normalized.replace(/([.!?])[ ]*\*[ ]+([A-Z])/g, "$1\n\n- $2");

  // Convert standalone * at line start to proper bullets
  normalized = normalized.replace(/^[ ]*\*[ ]+/gm, "- ");

  // Clean up multiple consecutive newlines
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  // Clean up spaces before newlines and empty lines with just spaces
  normalized = normalized.replace(/ +\n/g, "\n");
  normalized = normalized.replace(/\n[ ]+\n/g, "\n\n");

  return normalized.trim();
}
