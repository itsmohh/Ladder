import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

import pandas as pd
from dotenv import load_dotenv
from supabase import Client, create_client


INPUT_FILE = Path("data/supabase_jobs.csv")
BATCH_SIZE = 100


def get_required_environment_variable(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(
            f"Missing environment variable: {name}"
        )

    return value


def nullable_string(value: object) -> str | None:
    if value is None or pd.isna(value):
        return None

    text = str(value).strip()

    if not text:
        return None

    return text


def nullable_integer(value: object) -> int | None:
    if value is None or pd.isna(value):
        return None

    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def nullable_number(value: object) -> float | None:
    if value is None or pd.isna(value):
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def parse_boolean(value: object) -> bool:
    if isinstance(value, bool):
        return value

    if value is None or pd.isna(value):
        return False

    return str(value).strip().lower() in {
        "true",
        "1",
        "yes",
        "y",
    }


def clean_date(value: object) -> str | None:
    if value is None or pd.isna(value):
        return None

    parsed_date = pd.to_datetime(
        value,
        errors="coerce",
    )

    if pd.isna(parsed_date):
        return None

    return parsed_date.strftime("%Y-%m-%d")


def create_database_record(
    row: dict,
    last_seen_at: str,
) -> dict | None:
    source = nullable_string(
        row.get("source")
    ) or "indeed"

    source_job_id = nullable_string(
        row.get("source_job_id")
    )

    title = nullable_string(
        row.get("title")
    )

    if not source_job_id or not title:
        return None

    # Generates the same UUID every time for the same job.
    database_id = str(
        uuid5(
            NAMESPACE_URL,
            f"ladder:{source}:{source_job_id}",
        )
    )

    return {
        "id": database_id,
        "source": source,
        "source_job_id": source_job_id,
        "title": title,
        "company": nullable_string(
            row.get("company")
        ),
        "location": nullable_string(
            row.get("location")
        ),
        "description": nullable_string(
            row.get("description")
        ),
        "date_posted": clean_date(
            row.get("date_posted")
        ),
        "job_type": nullable_string(
            row.get("job_type")
        ),
        "salary_interval": nullable_string(
            row.get("salary_interval")
        ),
        "salary_min": nullable_number(
            row.get("salary_min")
        ),
        "salary_max": nullable_number(
            row.get("salary_max")
        ),
        "currency": (
            nullable_string(
                row.get("currency")
            )
            or "USD"
        ),
        "is_remote": parse_boolean(
            row.get("is_remote")
        ),
        "minimum_age": nullable_integer(
            row.get("minimum_age")
        ),
        "category": nullable_string(
            row.get("category")
        ),
        "teen_score": nullable_integer(
            row.get("teen_score")
        ),
        "application_url": nullable_string(
            row.get("application_url")
        ),
        "company_logo": nullable_string(
            row.get("company_logo")
        ),
        "status": "published",
        "last_seen_at": last_seen_at,
    }


def upload_batch(
    supabase: Client,
    batch: list[dict],
) -> None:
    supabase.table("jobs").upsert(
        batch,
        on_conflict="source,source_job_id",
    ).execute()


def main() -> None:
    load_dotenv()

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            "Could not find data/supabase_jobs.csv. "
            "Run prepare_supabase_jobs.py first."
        )

    supabase_url = (
        get_required_environment_variable(
            "SUPABASE_URL"
        )
    )

    supabase_secret_key = (
        get_required_environment_variable(
            "SUPABASE_SECRET_KEY"
        )
    )

    supabase: Client = create_client(
        supabase_url,
        supabase_secret_key,
    )

    jobs = pd.read_csv(INPUT_FILE)

    current_time = datetime.now(
        timezone.utc
    ).isoformat()

    records: list[dict] = []

    for row in jobs.to_dict(orient="records"):
        record = create_database_record(
            row=row,
            last_seen_at=current_time,
        )

        if record is not None:
            records.append(record)

    if not records:
        print("No valid jobs were available to upload.")
        return

    print(
        f"Preparing to upload {len(records)} jobs..."
    )

    uploaded_count = 0

    for batch_start in range(
        0,
        len(records),
        BATCH_SIZE,
    ):
        batch = records[
            batch_start:
            batch_start + BATCH_SIZE
        ]

        upload_batch(
            supabase=supabase,
            batch=batch,
        )

        uploaded_count += len(batch)

        print(
            f"Uploaded {uploaded_count} "
            f"of {len(records)} jobs."
        )

    print()
    print("Supabase upload completed.")
    print(
        f"Jobs inserted or updated: "
        f"{uploaded_count}"
    )


if __name__ == "__main__":
    main()