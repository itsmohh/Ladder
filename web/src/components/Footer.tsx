import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 text-slate-900">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Ladder</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <Link href="/" className="transition-colors hover:text-slate-900">
              Home
            </Link>
            <Link
              href="/jobs"
              className="transition-colors hover:text-slate-900"
            >
              Browse Jobs
            </Link>
            <Link
              href="/#about"
              className="transition-colors hover:text-slate-900"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          <p>
            Ladder helps organize job opportunities, but applicants should
            always verify requirements on the employer&apos;s official
            application page.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Ladder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
