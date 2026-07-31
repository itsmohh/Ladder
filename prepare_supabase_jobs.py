from pathlib import Path

import pandas as pd


INPUT_FILE = Path("data/teen_jobs.csv")
OUTPUT_FILE = Path("data/supabase_jobs.csv")


def column_or_blank(
    jobs: pd.DataFrame,
    column_name: str,
) -> pd.Series:
    if column_name in jobs.columns:
        return jobs[column_name]

    return pd.Series(
        "",
        index=jobs.index,
        dtype="object",
    )


def main() -> None:
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            "Could not find data/teen_jobs.csv. "
            "Run scrape_jobs.py and filter_jobs.py first."
        )

    jobs = pd.read_csv(INPUT_FILE)

    # Extra protection in case the file contains
    # hidden or rejected jobs.
    if "ladder_decision" in jobs.columns:
        jobs = jobs[
            jobs["ladder_decision"] == "publish"
        ].copy()

    direct_urls = (
        column_or_blank(jobs, "job_url_direct")
        .fillna("")
        .astype(str)
        .str.strip()
    )

    board_urls = (
        column_or_blank(jobs, "job_url")
        .fillna("")
        .astype(str)
        .str.strip()
    )

    application_urls = direct_urls.mask(
        direct_urls == "",
        board_urls,
    )

    output = pd.DataFrame(
        {
            "source_job_id": column_or_blank(
                jobs,
                "id",
            ),
            "source": column_or_blank(
                jobs,
                "site",
            ),
            "title": column_or_blank(
                jobs,
                "title",
            ),
            "company": column_or_blank(
                jobs,
                "company",
            ),
            "location": column_or_blank(
                jobs,
                "location",
            ),
            "description": column_or_blank(
                jobs,
                "description",
            ),
            "date_posted": column_or_blank(
                jobs,
                "date_posted",
            ),
            "job_type": column_or_blank(
                jobs,
                "job_type",
            ),
            "salary_interval": column_or_blank(
                jobs,
                "interval",
            ),
            "salary_min": column_or_blank(
                jobs,
                "min_amount",
            ),
            "salary_max": column_or_blank(
                jobs,
                "max_amount",
            ),
            "currency": column_or_blank(
                jobs,
                "currency",
            ),
            "is_remote": column_or_blank(
                jobs,
                "is_remote",
            ),
            "minimum_age": column_or_blank(
                jobs,
                "minimum_age",
            ),
            "category": column_or_blank(
                jobs,
                "ladder_category",
            ),
            "teen_score": column_or_blank(
                jobs,
                "teen_score",
            ),
            "application_url": application_urls,
            "company_logo": column_or_blank(
                jobs,
                "company_logo",
            ),
            "status": "published",
        }
    )

    # Make numeric columns compatible with Supabase.
    output["minimum_age"] = pd.to_numeric(
        output["minimum_age"],
        errors="coerce",
    ).astype("Int64")

    output["teen_score"] = pd.to_numeric(
        output["teen_score"],
        errors="coerce",
    ).astype("Int64")

    output["salary_min"] = pd.to_numeric(
        output["salary_min"],
        errors="coerce",
    )

    output["salary_max"] = pd.to_numeric(
        output["salary_max"],
        errors="coerce",
    )

    # Standardize dates.
    output["date_posted"] = pd.to_datetime(
        output["date_posted"],
        errors="coerce",
    ).dt.strftime("%Y-%m-%d")

    # Remove unusable rows.
    output["source_job_id"] = (
        output["source_job_id"]
        .fillna("")
        .astype(str)
        .str.strip()
    )

    output["title"] = (
        output["title"]
        .fillna("")
        .astype(str)
        .str.strip()
    )

    output = output[
        (output["source_job_id"] != "")
        & (output["title"] != "")
    ]

    # Remove duplicate source IDs.
    output = output.drop_duplicates(
        subset=[
            "source",
            "source_job_id",
        ],
        keep="first",
    )

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    output.to_csv(
        OUTPUT_FILE,
        index=False,
    )

    print(
        f"Prepared {len(output)} jobs for Supabase."
    )
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()