import csv
import time
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from jobspy import scrape_jobs


# ---------------------------------------------------------
# LADDER SCRAPER SETTINGS
# ---------------------------------------------------------

# Each location acts as a search center.
# The radius helps Ladder cover the surrounding area.
# Top US metros for teen job markets.
SEARCH_AREAS = [
    # Northeast
    {
        "name": "New York City",
        "location": "New York, NY",
        "distance": 25,
    },
    {
        "name": "North Jersey",
        "location": "Newark, NJ",
        "distance": 30,
    },
    {
        "name": "Philadelphia",
        "location": "Philadelphia, PA",
        "distance": 30,
    },
    {
        "name": "Boston",
        "location": "Boston, MA",
        "distance": 30,
    },
    {
        "name": "Washington DC",
        "location": "Washington, DC",
        "distance": 30,
    },
    # Southeast
    {
        "name": "Atlanta",
        "location": "Atlanta, GA",
        "distance": 35,
    },
    {
        "name": "Miami",
        "location": "Miami, FL",
        "distance": 30,
    },
    {
        "name": "Orlando",
        "location": "Orlando, FL",
        "distance": 30,
    },
    {
        "name": "Charlotte",
        "location": "Charlotte, NC",
        "distance": 30,
    },
    {
        "name": "Tampa",
        "location": "Tampa, FL",
        "distance": 30,
    },
    # Midwest
    {
        "name": "Chicago",
        "location": "Chicago, IL",
        "distance": 35,
    },
    {
        "name": "Detroit",
        "location": "Detroit, MI",
        "distance": 30,
    },
    {
        "name": "Minneapolis",
        "location": "Minneapolis, MN",
        "distance": 30,
    },
    {
        "name": "Columbus",
        "location": "Columbus, OH",
        "distance": 30,
    },
    {
        "name": "Indianapolis",
        "location": "Indianapolis, IN",
        "distance": 30,
    },
    # Southwest
    {
        "name": "Dallas",
        "location": "Dallas, TX",
        "distance": 35,
    },
    {
        "name": "Houston",
        "location": "Houston, TX",
        "distance": 35,
    },
    {
        "name": "Austin",
        "location": "Austin, TX",
        "distance": 30,
    },
    {
        "name": "San Antonio",
        "location": "San Antonio, TX",
        "distance": 30,
    },
    {
        "name": "Phoenix",
        "location": "Phoenix, AZ",
        "distance": 35,
    },
    {
        "name": "Denver",
        "location": "Denver, CO",
        "distance": 30,
    },
    # West Coast
    {
        "name": "Los Angeles",
        "location": "Los Angeles, CA",
        "distance": 35,
    },
    {
        "name": "San Francisco Bay",
        "location": "San Francisco, CA",
        "distance": 30,
    },
    {
        "name": "San Diego",
        "location": "San Diego, CA",
        "distance": 30,
    },
    {
        "name": "Seattle",
        "location": "Seattle, WA",
        "distance": 30,
    },
    {
        "name": "Portland",
        "location": "Portland, OR",
        "distance": 30,
    },
    {
        "name": "Las Vegas",
        "location": "Las Vegas, NV",
        "distance": 30,
    },
]


# These searches are intentionally specific.
# Searching only for "high school" causes adult jobs with
# "high school diploma required" to appear.
SEARCHES = [
    {
        "name": "high_school_internship",
        "term": (
            '"high school internship" '
            '-senior -manager -director -principal'
        ),
    },
    {
        "name": "high_school_students",
        "term": (
            '("for high school students" '
            'OR "open to high school students" '
            'OR "high school students are eligible") '
            '(internship OR summer OR employment) '
            '-senior -manager -director'
        ),
    },
    {
        "name": "youth_employment",
        "term": (
            '("summer youth employment" '
            'OR "youth employment program" '
            'OR "youth job program")'
        ),
    },
    {
        "name": "teen_part_time",
        "term": (
            '("16 years old" '
            'OR "17 years old" '
            'OR "at least 16 years old" '
            'OR "minimum age 16") '
            '("part time" OR seasonal OR summer OR internship) '
            '-senior -manager -director'
        ),
    },
    {
        "name": "student_athlete",
        "term": (
            '"student-athlete" '
            '(internship OR counselor OR coach OR summer) '
            '-manager -director'
        ),
    },
]


RESULTS_PER_SEARCH = 50

# Only scrape listings posted during the last 14 days.
HOURS_OLD = 24 * 14

# Delay between searches to avoid rate limiting.
SLEEP_BETWEEN_SEARCHES = 3

OUTPUT_FOLDER = Path("data")
OUTPUT_FILE = OUTPUT_FOLDER / "jobs.csv"


# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------

def normalize_column(
    jobs: pd.DataFrame,
    column_name: str,
) -> pd.Series:
    """
    Return a cleaned lowercase version of a dataframe column.
    """

    if column_name not in jobs.columns:
        return pd.Series(
            "",
            index=jobs.index,
            dtype="object",
        )

    return (
        jobs[column_name]
        .fillna("")
        .astype(str)
        .str.lower()
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
    )


def remove_duplicates(jobs: pd.DataFrame) -> pd.DataFrame:
    """
    Remove duplicate jobs found through different searches or locations.

    Ladder tries these identifiers in order:

    1. JobSpy job ID
    2. Direct application URL
    3. Job-board URL
    4. Title + company + location
    """

    jobs = jobs.copy()

    job_id = normalize_column(jobs, "id")
    direct_url = normalize_column(jobs, "job_url_direct")
    board_url = normalize_column(jobs, "job_url")
    title = normalize_column(jobs, "title")
    company = normalize_column(jobs, "company")
    location = normalize_column(jobs, "location")

    fallback_key = title + "|" + company + "|" + location

    jobs["_dedupe_key"] = job_id

    missing_key = jobs["_dedupe_key"] == ""
    jobs.loc[missing_key, "_dedupe_key"] = direct_url[missing_key]

    missing_key = jobs["_dedupe_key"] == ""
    jobs.loc[missing_key, "_dedupe_key"] = board_url[missing_key]

    missing_key = jobs["_dedupe_key"] == ""
    jobs.loc[missing_key, "_dedupe_key"] = fallback_key[missing_key]

    jobs = jobs.drop_duplicates(
        subset=["_dedupe_key"],
        keep="first",
    )

    return jobs.drop(columns=["_dedupe_key"])


def run_single_search(
    search_area: dict,
    search: dict,
) -> pd.DataFrame:
    """
    Run one Indeed search for one location and search query.
    """

    area_name = search_area["name"]
    location = search_area["location"]
    distance = search_area["distance"]

    search_name = search["name"]
    search_term = search["term"]

    print()
    print("----------------------------------------")
    print(f"Area: {area_name}")
    print(f"Location: {location}")
    print(f"Search: {search_name}")
    print("----------------------------------------")

    jobs = scrape_jobs(
        site_name=["indeed"],
        search_term=search_term,
        location=location,
        distance=distance,
        results_wanted=RESULTS_PER_SEARCH,
        hours_old=HOURS_OLD,
        country_indeed="USA",
        description_format="markdown",
        verbose=1,
    )

    if jobs is None or jobs.empty:
        print("No jobs found.")
        return pd.DataFrame()

    # Add Ladder-specific information.
    jobs["ladder_search_name"] = search_name
    jobs["ladder_search_area"] = area_name
    jobs["ladder_search_location"] = location
    jobs["ladder_search_distance"] = distance
    jobs["ladder_scraped_at"] = datetime.now(
        timezone.utc
    ).isoformat()

    print(f"Found {len(jobs)} jobs.")

    return jobs


# ---------------------------------------------------------
# MAIN SCRAPER
# ---------------------------------------------------------

def main() -> None:
    print("========================================")
    print("Starting Ladder job scraper")
    print("========================================")
    print(f"Search areas: {len(SEARCH_AREAS)}")
    print(f"Search queries: {len(SEARCHES)}")
    print(
        "Total searches: "
        f"{len(SEARCH_AREAS) * len(SEARCHES)}"
    )

    collected_jobs: list[pd.DataFrame] = []
    successful_searches = 0
    failed_searches = 0

    for search_area in SEARCH_AREAS:
        for search in SEARCHES:
            try:
                jobs = run_single_search(
                    search_area=search_area,
                    search=search,
                )

                successful_searches += 1

                if not jobs.empty:
                    collected_jobs.append(jobs)

            except Exception as error:
                failed_searches += 1

                print()
                print("Search failed.")
                print(
                    f"Location: {search_area['location']}"
                )
                print(
                    f"Search: {search['name']}"
                )
                print(f"Error: {error}")

            # Avoid immediately sending another request.
            time.sleep(SLEEP_BETWEEN_SEARCHES)

    print()
    print("========================================")
    print("Combining Ladder search results")
    print("========================================")

    if not collected_jobs:
        print("No jobs were collected.")
        print(
            "The existing data/jobs.csv file "
            "was not changed."
        )
        return

    all_jobs = pd.concat(
        collected_jobs,
        ignore_index=True,
    )

    total_before_deduplication = len(all_jobs)

    all_jobs = remove_duplicates(all_jobs)

    total_after_deduplication = len(all_jobs)

    duplicates_removed = (
        total_before_deduplication
        - total_after_deduplication
    )

    # Sort newest jobs first when date_posted exists.
    if "date_posted" in all_jobs.columns:
        all_jobs["_parsed_date"] = pd.to_datetime(
            all_jobs["date_posted"],
            errors="coerce",
        )

        all_jobs = all_jobs.sort_values(
            by="_parsed_date",
            ascending=False,
            na_position="last",
        )

        all_jobs = all_jobs.drop(
            columns=["_parsed_date"],
        )

    OUTPUT_FOLDER.mkdir(
        parents=True,
        exist_ok=True,
    )

    all_jobs.to_csv(
        OUTPUT_FILE,
        quoting=csv.QUOTE_NONNUMERIC,
        escapechar="\\",
        index=False,
    )

    print()
    print("========================================")
    print("Ladder scraping completed")
    print("========================================")
    print(
        f"Successful searches: {successful_searches}"
    )
    print(f"Failed searches: {failed_searches}")
    print(
        "Jobs before duplicate removal: "
        f"{total_before_deduplication}"
    )
    print(
        f"Duplicates removed: {duplicates_removed}"
    )
    print(
        f"Unique jobs saved: {total_after_deduplication}"
    )
    print(f"Raw jobs file: {OUTPUT_FILE}")
    print()
    print("Next command:")
    print("python filter_jobs.py")


if __name__ == "__main__":
    main()