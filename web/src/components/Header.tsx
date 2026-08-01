"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/components/auth";

export function Header() {
  const { user, profile, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-slate-900 transition-colors hover:text-blue-600"
        >
          <Briefcase className="h-6 w-6 text-blue-600" />
          <span>Ladder</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/jobs"
            className={`text-sm font-medium transition-colors ${
              pathname === "/jobs" || pathname.startsWith("/jobs/")
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Browse Jobs
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {profile?.display_name?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <span className="hidden sm:inline">
                      {profile?.display_name ||
                        user.email?.split("@")[0] ||
                        "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-sm font-medium text-slate-900">
                            {profile?.display_name || "User"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/saved"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Bookmark className="h-4 w-4" />
                            Saved Jobs
                          </Link>
                          <Link
                            href="/dashboard/applications"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <ClipboardList className="h-4 w-4" />
                            Applications
                          </Link>
                        </div>

                        <div className="border-t border-slate-100 py-1">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
