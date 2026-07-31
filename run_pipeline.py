import argparse
import subprocess
import sys
import time
from pathlib import Path


PIPELINE_STEPS = [
    {
        "name": "Scraping jobs",
        "file": "scrape_jobs.py",
    },
    {
        "name": "Filtering jobs",
        "file": "filter_jobs.py",
    },
    {
        "name": "Preparing Supabase data",
        "file": "prepare_supabase_jobs.py",
    },
    {
        "name": "Uploading jobs to Supabase",
        "file": "upload_jobs.py",
    },
]

# Intermediate files to clean up after successful upload.
# supabase_jobs.csv is kept as a backup.
INTERMEDIATE_FILES = [
    Path("data/jobs.csv"),
    Path("data/classified_jobs.csv"),
    Path("data/teen_jobs.csv"),
    Path("data/hidden_jobs.csv"),
    Path("data/rejected_jobs.csv"),
]


def run_step(
    step_number: int,
    total_steps: int,
    name: str,
    filename: str,
) -> None:
    print()
    print("========================================")
    print(
        f"Step {step_number} of {total_steps}: "
        f"{name}"
    )
    print("========================================")

    started_at = time.perf_counter()

    subprocess.run(
        [
            sys.executable,
            "-u",
            filename,
        ],
        check=True,
    )

    elapsed_seconds = (
        time.perf_counter() - started_at
    )

    print(
        f"{name} completed in "
        f"{elapsed_seconds:.1f} seconds."
    )


def cleanup_intermediate_files() -> None:
    """
    Delete intermediate CSV files after successful upload.
    Keeps supabase_jobs.csv as a backup of what was uploaded.
    """
    print()
    print("========================================")
    print("Cleaning up intermediate files")
    print("========================================")

    deleted_count = 0
    total_bytes = 0

    for file_path in INTERMEDIATE_FILES:
        if file_path.exists():
            file_size = file_path.stat().st_size
            file_path.unlink()
            deleted_count += 1
            total_bytes += file_size
            print(f"Deleted: {file_path}")

    if deleted_count == 0:
        print("No intermediate files to clean up.")
    else:
        size_mb = total_bytes / (1024 * 1024)
        print(
            f"Deleted {deleted_count} files, "
            f"freed {size_mb:.1f} MB."
        )
        print(
            "Kept: data/supabase_jobs.csv (backup)"
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run the complete Ladder job pipeline."
    )
    parser.add_argument(
        "--cleanup",
        action="store_true",
        help=(
            "Delete intermediate CSV files after "
            "successful upload to save disk space. "
            "Keeps supabase_jobs.csv as backup."
        ),
    )
    args = parser.parse_args()

    print("========================================")
    print("Starting complete Ladder job pipeline")
    print("========================================")
    if args.cleanup:
        print("Cleanup mode: ON")

    total_steps = len(PIPELINE_STEPS)
    pipeline_started_at = time.perf_counter()

    try:
        for index, step in enumerate(
            PIPELINE_STEPS,
            start=1,
        ):
            run_step(
                step_number=index,
                total_steps=total_steps,
                name=step["name"],
                filename=step["file"],
            )

    except subprocess.CalledProcessError as error:
        print()
        print("========================================")
        print("Ladder pipeline failed")
        print("========================================")
        print(
            f"Failed while running: "
            f"{error.cmd[-1]}"
        )
        print(
            "Later steps were not executed."
        )
        print(
            "Intermediate files were NOT deleted."
        )

        raise SystemExit(1) from error

    # Clean up if requested and pipeline succeeded.
    if args.cleanup:
        cleanup_intermediate_files()

    total_seconds = (
        time.perf_counter()
        - pipeline_started_at
    )

    print()
    print("========================================")
    print("Ladder pipeline completed successfully")
    print("========================================")
    print(
        f"Total runtime: "
        f"{total_seconds / 60:.1f} minutes"
    )


if __name__ == "__main__":
    main()