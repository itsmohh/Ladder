import Link from "next/link";
import { ArrowRight, CheckCircle, Target, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ladder - Find Work That Fits Your Age and Goals",
  description:
    "Explore jobs, internships, seasonal work, and opportunities designed for young people ages 16-21.",
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find work that fits your{" "}
            <span className="text-blue-600">age and goals</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Explore jobs, internships, seasonal work, and youth opportunities
            designed to help you take your next step.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Browse Jobs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for young people
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Ladder organizes opportunities with young people in mind.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Age-aware opportunities
              </h3>
              <p className="text-slate-600">
                Find jobs that welcome young people. See minimum age requirements
                upfront so you know if you qualify.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Clear job requirements
              </h3>
              <p className="text-slate-600">
                Each listing shows salary, location, job type, and other details
                so you can find the right fit.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Direct employer applications
              </h3>
              <p className="text-slate-600">
                Apply directly on the employer&apos;s website. No middleman, no
                extra accounts, no unnecessary steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to find your next opportunity?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Browse current job listings and take your next step.
          </p>

          <div className="mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Browse All Jobs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm text-slate-500">
            Ladder helps organize job opportunities, but applicants should
            always verify requirements on the employer&apos;s official
            application page.
          </p>
        </div>
      </section>
    </>
  );
}
