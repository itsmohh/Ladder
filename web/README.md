# Ladder Web Frontend

Ladder is a job-discovery web application designed for young people ages 16–21. It helps users find jobs, internships, seasonal opportunities, youth employment programs, and other age-appropriate work.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: react-markdown with remark-gfm and rehype-sanitize

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- A Supabase project with the jobs table (populated by the Python pipeline)

## Installation

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.local.example .env.local
   ```

4. Open `.env.local` and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
   ```

   > **Important**: Use only the **anon public** key, never the service_role or secret key. The frontend is read-only.

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Type Checking

Run TypeScript compiler to check for type errors:

```bash
npx tsc --noEmit
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page (/)
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── jobs/
│   │       ├── page.tsx        # Job feed (/jobs)
│   │       └── [id]/
│   │           └── page.tsx    # Job details (/jobs/[id])
│   ├── components/             # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobFilters.tsx
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utilities and data fetching
│   │   ├── supabase.ts         # Supabase client
│   │   ├── jobs.ts             # Job queries
│   │   └── format.ts           # Formatting utilities
│   └── types/                  # TypeScript type definitions
│       └── job.ts              # Job schema types
├── public/                     # Static assets
├── .env.local.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Supabase Jobs Schema

The frontend expects a `public.jobs` table with the following columns:

| Column           | Type      | Nullable | Description                        |
| ---------------- | --------- | -------- | ---------------------------------- |
| id               | uuid      | No       | Primary key                        |
| source_job_id    | text      | No       | Original job ID from source        |
| source           | text      | No       | Job source (e.g., "indeed")        |
| title            | text      | No       | Job title                          |
| company          | text      | Yes      | Company name                       |
| location         | text      | Yes      | Job location                       |
| description      | text      | Yes      | Full job description (markdown)    |
| date_posted      | date      | Yes      | When the job was posted            |
| job_type         | text      | Yes      | parttime, fulltime, internship, etc |
| salary_interval  | text      | Yes      | hourly, yearly, monthly, etc       |
| salary_min       | numeric   | Yes      | Minimum salary                     |
| salary_max       | numeric   | Yes      | Maximum salary                     |
| currency         | text      | Yes      | Currency code (default: USD)       |
| is_remote        | boolean   | No       | Whether the job is remote          |
| minimum_age      | integer   | Yes      | Minimum applicant age              |
| category         | text      | Yes      | Job category                       |
| teen_score       | integer   | Yes      | Relevance score for teens          |
| application_url  | text      | Yes      | Direct link to apply               |
| company_logo     | text      | Yes      | URL to company logo                |
| status           | text      | No       | "published" for visible jobs       |
| first_seen_at    | timestamp | No       | When job was first scraped         |
| last_seen_at     | timestamp | No       | When job was last seen             |
| created_at       | timestamp | No       | Record creation time               |

### Row Level Security

The Supabase table should have Row Level Security (RLS) enabled with a policy allowing anonymous users to read rows where `status = 'published'`.

## Data Pipeline

Jobs are populated by the Python pipeline in the parent directory:

```
scrape_jobs.py → filter_jobs.py → prepare_supabase_jobs.py → upload_jobs.py
```

The frontend only reads published jobs from Supabase. It never writes to the database.

## Security Notes

- The frontend uses only the Supabase **anon/public** key
- Never add the `SUPABASE_SECRET_KEY` or `service_role` key to the frontend
- All database writes happen through the Python pipeline, which uses the secret key separately
- External links open in new tabs with `rel="noopener noreferrer"`
- Job descriptions are sanitized before rendering

## Environment Variables

| Variable                              | Required | Description                   |
| ------------------------------------- | -------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Yes      | Your Supabase project URL     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| Yes      | Your Supabase anon public key |

## License

Private project. All rights reserved.
