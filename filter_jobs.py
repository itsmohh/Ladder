import csv
import re
from pathlib import Path

import pandas as pd


# ---------------------------------------------------------
# LADDER FILTER SETTINGS
# ---------------------------------------------------------

MIN_LADDER_AGE = 16
MAX_LADDER_AGE = 21

PUBLISH_SCORE = 70

DATA_FOLDER = Path("data")

INPUT_FILE = DATA_FOLDER / "jobs.csv"

PUBLISHED_FILE = DATA_FOLDER / "teen_jobs.csv"
HIDDEN_FILE = DATA_FOLDER / "hidden_jobs.csv"
REJECTED_FILE = DATA_FOLDER / "rejected_jobs.csv"
ALL_CLASSIFIED_FILE = DATA_FOLDER / "classified_jobs.csv"


# ---------------------------------------------------------
# TEXT HELPERS
# ---------------------------------------------------------

def clean_text(value: object) -> str:
    """
    Convert a value into normalized lowercase text.
    """

    if value is None:
        return ""

    try:
        if pd.isna(value):
            return ""
    except (TypeError, ValueError):
        pass

    text = str(value)

    text = text.replace("’", "'")
    text = text.replace("–", "-")
    text = text.replace("—", "-")

    text = re.sub(r"\s+", " ", text)

    return text.strip().lower()


def contains_any(
    text: str,
    patterns: list[str],
) -> bool:
    """
    Return True when at least one regex pattern matches.
    """

    return any(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in patterns
    )


# ---------------------------------------------------------
# TEEN ELIGIBILITY PATTERNS
# ---------------------------------------------------------

# These phrases clearly suggest that the opportunity is
# intended for high-school students or teenagers.
TEEN_TARGET_PATTERNS = [
    r"\bfor (?:current )?high school students?\b",
    r"\bopen to (?:current )?high school students?\b",
    r"\bhigh school students? (?:are )?eligible\b",
    r"\bhigh school students? (?:are )?encouraged\b",
    r"\bhigh school students? (?:are )?welcome\b",
    r"\bcurrently enrolled in high school\b",
    r"\bcurrent high school students?\b",
    r"\bhigh school internship\b",
    r"\bhigh school interns?\b",
    r"\brising (?:high school )?freshm[ae]n\b",
    r"\brising (?:high school )?sophomores?\b",
    r"\brising (?:high school )?juniors?\b",
    r"\brising (?:high school )?seniors?\b",
    r"\bgrades? 9(?:\s*(?:-|through|to)\s*12)?\b",
    r"\bgrades? 10(?:\s*(?:-|through|to)\s*12)?\b",
    r"\bgrades? 11(?:\s*(?:-|through|to)\s*12)?\b",
    r"\bsummer youth employment\b",
    r"\byouth employment program\b",
    r"\byouth job program\b",
    r"\bteen employment\b",
    r"\bteen jobs?\b",
    r"\bteenagers?\b",
    r"\bminor work permit\b",
    r"\bworking papers\b",
]


AGE_PATTERNS = [
    (
        r"\bmust be(?: at least)?\s*"
        r"(1[4-9]|2[01])"
        r"(?:\s*years?(?: old| of age)?)?\b"
    ),
    (
        r"\bminimum age(?: is|:)?\s*"
        r"(1[4-9]|2[01])\b"
    ),
    (
        r"\bapplicants? (?:must|need to|should) be"
        r"(?: at least)?\s*"
        r"(1[4-9]|2[01])"
        r"(?:\s*years?(?: old| of age)?)?\b"
    ),
    (
        r"\b(?:age|ages)\s*"
        r"(1[4-9]|2[01])"
        r"\s*(?:and older|or older|and up)\b"
    ),
    (
        r"\bminimum hiring age(?: is|:)?\s*"
        r"(1[4-9]|2[01])\b"
    ),
]


NO_EXPERIENCE_PATTERNS = [
    r"\bno experience required\b",
    r"\bno prior experience required\b",
    r"\bno previous experience required\b",
    r"\bentry[- ]level\b",
    r"\btraining provided\b",
    r"\bpaid training\b",
    r"\bwill train\b",
    r"\bexperience preferred but not required\b",
]


GOOD_OPPORTUNITY_PATTERNS = [
    r"\bintern\b",
    r"\binternship\b",
    r"\bsummer job\b",
    r"\bsummer employment\b",
    r"\bseasonal\b",
    r"\bpart[- ]time\b",
    r"\bcamp counselor\b",
    r"\bafter[- ]school\b",
    r"\bstudent worker\b",
]


COMMON_TEEN_TITLE_PATTERNS = [
    r"\bintern\b",
    r"\bcamp counselor\b",
    r"\bcashier\b",
    r"\bcrew member\b",
    r"\bteam member\b",
    r"\bretail associate\b",
    r"\bsales associate\b",
    r"\bstore associate\b",
    r"\bfood service worker\b",
    r"\bserver assistant\b",
    r"\bhost\b",
    r"\bbusser\b",
    r"\blifeguard\b",
    r"\btutor\b",
    r"\brecreation assistant\b",
    r"\byouth assistant\b",
    r"\bseasonal associate\b",
]


# ---------------------------------------------------------
# AUTOMATIC REJECTION PATTERNS
# ---------------------------------------------------------

COLLEGE_DEGREE_REQUIRED_PATTERNS = [
    (
        r"\bassociate'?s degree"
        r".{0,60}\brequired\b"
    ),
    (
        r"\bbachelor'?s degree"
        r".{0,60}\brequired\b"
    ),
    (
        r"\bmaster'?s degree"
        r".{0,60}\brequired\b"
    ),
    (
        r"\bdoctoral degree"
        r".{0,60}\brequired\b"
    ),
    (
        r"\bph\.?d\.?"
        r".{0,60}\brequired\b"
    ),
    (
        r"\brequires? (?:an? )?"
        r"(?:associate'?s|bachelor'?s|master'?s)"
        r" degree\b"
    ),
    (
        r"\bmust possess (?:an? )?"
        r"(?:associate'?s|bachelor'?s|master'?s)"
        r" degree\b"
    ),
    (
        r"\bgraduate of an? accredited"
        r".{0,100}\bprogram\b"
        r".{0,40}\brequired\b"
    ),
]


COLLEGE_DEGREE_PREFERRED_PATTERNS = [
    r"\bbachelor'?s degree preferred\b",
    r"\bcollege degree preferred\b",
    r"\bassociate'?s degree preferred\b",
]


PROFESSIONAL_CREDENTIAL_PATTERNS = [
    r"\bregistered nurse\b",
    r"\blicensed practical nurse\b",
    r"\blicensed vocational nurse\b",
    r"\bactive nursing license\b",
    r"\brn license\b",
    r"\blpn license\b",
    r"\blvn license\b",
    r"\bcertified medical assistant\b",
    r"\bcertified nursing assistant\b",
    r"\bcna certification\b",
    r"\bcma certification\b",
    r"\bcommercial driver'?s license\b",
    r"\bcdl(?:-[a-z])?\b",
    r"\bparamedic certification\b",
    r"\bprofessional engineer license\b",
    r"\bcosmetology license\b",
    r"\bsecurity officer license\b",
]


ADVANCED_TITLE_PATTERNS = [
    r"\bsenior\b",
    r"\bsr\.\b",
    r"\bmanager\b",
    r"\bdirector\b",
    r"\bprincipal\b",
    r"\bsupervisor\b",
    r"\bdepartment head\b",
    r"\bregistered nurse\b",
    r"\blicensed practical nurse\b",
    r"\blicensed vocational nurse\b",
    r"\bmedical assistant\b",
    r"\bphysician assistant\b",
    r"\bphlebotomist\b",
    r"\baccountant\b",
    r"\battorney\b",
    r"\bparalegal\b",
]


SUPERVISORY_PATTERNS = [
    r"\blead the store team\b",
    r"\bpart of management\b",
    r"\bsupervise employees\b",
    r"\bsupervise staff\b",
    r"\bmanage employees\b",
    r"\bmanage staff\b",
    r"\bopen and close the store\b",
    r"\btrain and mentor employees\b",
    r"\bretail leadership experience\b",
    r"\bmanagement experience required\b",
]


ADULT_INDUSTRY_PATTERNS = [
    r"\bbartender\b",
    r"\bcasino\b",
    r"\bgambling\b",
    r"\bcannabis\b",
    r"\bmarijuana\b",
    r"\bdispensary\b",
    r"\bliquor store\b",
    r"\balcohol sales\b",
    r"\btobacco\b",
    r"\bvape shop\b",
    r"\bfirearms?\b",
    r"\bammunition\b",
    r"\badult entertainment\b",
]


DRIVER_LICENSE_REQUIRED_PATTERNS = [
    r"\bvalid driver'?s license required\b",
    r"\bmust have a valid driver'?s license\b",
    r"\breliable personal vehicle required\b",
    r"\bmust provide your own vehicle\b",
]


SCAM_WARNING_PATTERNS = [
    r"\bpay (?:a|the) application fee\b",
    r"\bpay (?:a|the) training fee\b",
    r"\bupfront payment required\b",
    r"\bsend money\b",
    r"\bwire transfer\b",
    r"\bcrypto(?:currency)? payment\b",
    r"\bcontact us (?:on|through|via) whatsapp\b",
    r"\bcontact us (?:on|through|via) telegram\b",
    r"\bcheck will be mailed to you\b",
    r"\bpurchase equipment with the check\b",
]


# ---------------------------------------------------------
# EXPERIENCE EXTRACTION
# ---------------------------------------------------------

NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
}


NUMBER_TOKEN = (
    r"(?:\d+|zero|one|two|three|four|five|"
    r"six|seven|eight|nine|ten)"
)


def number_to_integer(value: str | None) -> int:
    """
    Convert a number word or digit into an integer.
    """

    if not value:
        return 0

    value = value.lower().strip()

    if value.isdigit():
        return int(value)

    return NUMBER_WORDS.get(value, 0)


def required_experience_years(text: str) -> int:
    """
    Extract the largest clearly required experience amount.

    This avoids treating company-history statements such as
    'serving the community for 100 years' as experience.
    """

    patterns = [
        (
            rf"\b(?:minimum(?: of)?|at least|must have|"
            rf"requires?|required)\s*"
            rf"({NUMBER_TOKEN})"
            rf"(?:\s*(?:-|to|or)\s*({NUMBER_TOKEN}))?"
            rf"\+?\s*years?"
            rf".{{0,80}}\bexperience\b"
        ),
        (
            rf"\b({NUMBER_TOKEN})"
            rf"(?:\s*(?:-|to|or)\s*({NUMBER_TOKEN}))?"
            rf"\+?\s*years?"
            rf".{{0,80}}\bexperience\b"
            rf".{{0,40}}\b(?:required|minimum)\b"
        ),
    ]

    largest_requirement = 0

    for pattern in patterns:
        matches = re.finditer(
            pattern,
            text,
            re.IGNORECASE,
        )

        for match in matches:
            first_number = number_to_integer(
                match.group(1)
            )

            second_number = number_to_integer(
                match.group(2)
            )

            years = max(
                first_number,
                second_number,
            )

            largest_requirement = max(
                largest_requirement,
                years,
            )

    return largest_requirement


# ---------------------------------------------------------
# AGE EXTRACTION
# ---------------------------------------------------------

def extract_minimum_age(text: str) -> int | None:
    """
    Extract an applicant minimum age from the description.

    The largest age is used when several applicant-age
    requirements appear, which is the safer interpretation.
    """

    ages: list[int] = []

    for pattern in AGE_PATTERNS:
        matches = re.finditer(
            pattern,
            text,
            re.IGNORECASE,
        )

        for match in matches:
            age = int(match.group(1))

            if 16 <= age <= 21:
                ages.append(age)

    if not ages:
        return None

    return max(ages)


# ---------------------------------------------------------
# CATEGORY DETECTION
# ---------------------------------------------------------

CATEGORY_PATTERNS = {
    "Pre-College Programs": [
        r"\bpre-college\b",
        r"\bprecollege\b",
        r"\bsummer program\b",
        r"\bresearch program\b",
        r"\bbridge program\b",
        r"\buniversity program\b",
        r"\bcollege prep\b",
        r"\brising senior\b",
        r"\brising junior\b",
    ],
    "Technology": [
        r"\bsoftware\b",
        r"\bcoding\b",
        r"\bprogramming\b",
        r"\bdeveloper\b",
        r"\btechnology\b",
        r"\bcomputer science\b",
        r"\bit support\b",
        r"\bdata analyst\b",
    ],
    "Healthcare": [
        r"\bhealthcare\b",
        r"\bhospital\b",
        r"\bmedical\b",
        r"\bpatient\b",
        r"\bclinic\b",
        r"\bnursing\b",
    ],
    "Education and Tutoring": [
        r"\btutor\b",
        r"\bteacher assistant\b",
        r"\beducation\b",
        r"\bafter[- ]school\b",
        r"\bclassroom\b",
        r"\bmentor\b",
    ],
    "Sports and Camps": [
        r"\bcamp counselor\b",
        r"\bcoach\b",
        r"\bsports\b",
        r"\brecreation\b",
        r"\bathletic\b",
        r"\blifeguard\b",
    ],
    "Retail": [
        r"\bretail\b",
        r"\bcashier\b",
        r"\bsales associate\b",
        r"\bstore associate\b",
        r"\bmerchandise\b",
    ],
    "Food Service": [
        r"\brestaurant\b",
        r"\bfood service\b",
        r"\bcrew member\b",
        r"\bserver\b",
        r"\bbusser\b",
        r"\bhost\b",
        r"\bkitchen\b",
    ],
    "Office and Administration": [
        r"\breceptionist\b",
        r"\badministrative\b",
        r"\bdata entry\b",
        r"\boffice assistant\b",
        r"\bcustomer service\b",
    ],
    "Arts and Media": [
        r"\bgraphic design\b",
        r"\bphotography\b",
        r"\bvideo production\b",
        r"\bsocial media\b",
        r"\bmarketing intern\b",
        r"\btheater\b",
        r"\bmusic\b",
    ],
}


def detect_category(text: str) -> str:
    """
    Assign a broad Ladder category to the job.
    """

    for category, patterns in CATEGORY_PATTERNS.items():
        if contains_any(text, patterns):
            return category

    return "Other"


# ---------------------------------------------------------
# DUPLICATE REMOVAL
# ---------------------------------------------------------

def normalized_column(
    jobs: pd.DataFrame,
    column_name: str,
) -> pd.Series:
    """
    Return a normalized dataframe column.
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


def remove_duplicates(
    jobs: pd.DataFrame,
) -> pd.DataFrame:
    """
    Perform another duplicate check after scraping.
    """

    jobs = jobs.copy()

    job_id = normalized_column(jobs, "id")
    direct_url = normalized_column(
        jobs,
        "job_url_direct",
    )
    board_url = normalized_column(
        jobs,
        "job_url",
    )
    title = normalized_column(jobs, "title")
    company = normalized_column(jobs, "company")
    location = normalized_column(jobs, "location")

    fallback_key = (
        title
        + "|"
        + company
        + "|"
        + location
    )

    jobs["_filter_dedupe_key"] = job_id

    missing = jobs["_filter_dedupe_key"] == ""
    jobs.loc[
        missing,
        "_filter_dedupe_key",
    ] = direct_url[missing]

    missing = jobs["_filter_dedupe_key"] == ""
    jobs.loc[
        missing,
        "_filter_dedupe_key",
    ] = board_url[missing]

    missing = jobs["_filter_dedupe_key"] == ""
    jobs.loc[
        missing,
        "_filter_dedupe_key",
    ] = fallback_key[missing]

    jobs = jobs.drop_duplicates(
        subset=["_filter_dedupe_key"],
        keep="first",
    )

    return jobs.drop(
        columns=["_filter_dedupe_key"],
    )


# ---------------------------------------------------------
# JOB CLASSIFICATION
# ---------------------------------------------------------

def classify_job(
    row: pd.Series,
) -> pd.Series:
    """
    Score and classify one job.

    Decisions:

    publish:
        Strong evidence that a Ladder-age teenager qualifies.

    hide:
        Not clearly unsuitable, but not enough evidence to
        safely display it.

    reject:
        Clearly outside Ladder eligibility.
    """

    title = clean_text(row.get("title"))
    description = clean_text(
        row.get("description")
    )
    job_type = clean_text(row.get("job_type"))

    search_name = clean_text(
        row.get("ladder_search_name")
    )

    text = f"{title} {description}"

    minimum_age = extract_minimum_age(text)
    experience_years = required_experience_years(
        text
    )

    teen_targeted = contains_any(
        text,
        TEEN_TARGET_PATTERNS,
    )

    no_experience_required = contains_any(
        text,
        NO_EXPERIENCE_PATTERNS,
    )

    common_teen_title = contains_any(
        title,
        COMMON_TEEN_TITLE_PATTERNS,
    )

    score = 0

    positive_reasons: list[str] = []
    negative_reasons: list[str] = []
    rejection_reasons: list[str] = []

    # -----------------------------------------------------
    # Hard rejection checks
    # -----------------------------------------------------

    if minimum_age is not None:
        if minimum_age > MAX_LADDER_AGE:
            rejection_reasons.append(
                f"Minimum age is {minimum_age}"
            )

    if contains_any(
        text,
        COLLEGE_DEGREE_REQUIRED_PATTERNS,
    ):
        rejection_reasons.append(
            "College degree or accredited professional "
            "program required"
        )

    if contains_any(
        text,
        PROFESSIONAL_CREDENTIAL_PATTERNS,
    ):
        rejection_reasons.append(
            "Professional license or credential required"
        )

    if contains_any(
        title,
        ADVANCED_TITLE_PATTERNS,
    ):
        rejection_reasons.append(
            "Advanced or professionally specialized title"
        )

    if contains_any(
        text,
        ADULT_INDUSTRY_PATTERNS,
    ):
        rejection_reasons.append(
            "Adult or age-restricted industry"
        )

    if contains_any(
        text,
        SCAM_WARNING_PATTERNS,
    ):
        rejection_reasons.append(
            "Possible scam or payment-request language"
        )

    if experience_years >= 3:
        rejection_reasons.append(
            f"Requires approximately "
            f"{experience_years} years of experience"
        )

    # -----------------------------------------------------
    # Positive scoring
    # -----------------------------------------------------

    # Pre-college and educational programs
    if re.search(
        r"\b(?:pre-college|precollege)\b",
        text,
        re.IGNORECASE,
    ):
        score += 50
        positive_reasons.append(
            "Pre-college program"
        )

    if re.search(
        r"\bsummer program\b",
        text,
        re.IGNORECASE,
    ) and re.search(
        r"\b(?:high school|university|college|student|rising)\b",
        text,
        re.IGNORECASE,
    ):
        score += 45
        positive_reasons.append(
            "Summer program for students"
        )

    if re.search(
        r"\b(?:research|bridge|enrichment) program\b",
        text,
        re.IGNORECASE,
    ):
        score += 40
        positive_reasons.append(
            "Educational enrichment program"
        )

    if teen_targeted:
        score += 55
        positive_reasons.append(
            "Explicitly targets high-school or youth applicants"
        )

    if minimum_age is not None:
        if MIN_LADDER_AGE <= minimum_age <= 17:
            score += 45
            positive_reasons.append(
                f"Minimum age appears to be {minimum_age}"
            )

        elif 18 <= minimum_age <= MAX_LADDER_AGE:
            score += 25
            positive_reasons.append(
                f"Available to older teenagers age "
                f"{minimum_age}+"
            )

    if re.search(
        r"\bintern(?:ship)?\b",
        title,
        re.IGNORECASE,
    ):
        score += 25
        positive_reasons.append(
            "Internship appears in the title"
        )

    if job_type == "internship":
        score += 20
        positive_reasons.append(
            "Job type is internship"
        )

    if job_type == "parttime":
        score += 15
        positive_reasons.append(
            "Part-time position"
        )

    if contains_any(
        text,
        GOOD_OPPORTUNITY_PATTERNS,
    ):
        score += 10
        positive_reasons.append(
            "Summer, seasonal, part-time, or student wording"
        )

    if no_experience_required:
        score += 20
        positive_reasons.append(
            "No-experience or training language found"
        )

    if common_teen_title:
        score += 15
        positive_reasons.append(
            "Common teen-friendly job title"
        )

    if search_name in {
        "high_school_internship",
        "high_school_students",
        "youth_employment",
        "teen_part_time",
    }:
        score += 10
        positive_reasons.append(
            "Found through a targeted Ladder search"
        )

    # -----------------------------------------------------
    # Negative scoring
    # -----------------------------------------------------

    if experience_years == 1:
        score -= 15
        negative_reasons.append(
            "Requires approximately one year of experience"
        )

    elif experience_years == 2:
        score -= 35
        negative_reasons.append(
            "Requires approximately two years of experience"
        )

    if job_type == "fulltime":
        score -= 15
        negative_reasons.append(
            "Full-time position"
        )

    if contains_any(
        text,
        COLLEGE_DEGREE_PREFERRED_PATTERNS,
    ):
        score -= 10
        negative_reasons.append(
            "College degree preferred"
        )

    if contains_any(
        text,
        DRIVER_LICENSE_REQUIRED_PATTERNS,
    ):
        score -= 10
        negative_reasons.append(
            "Driver's license or personal vehicle required"
        )

    if contains_any(
        text,
        SUPERVISORY_PATTERNS,
    ):
        score -= 25
        negative_reasons.append(
            "Includes management or supervisory duties"
        )

    if not description:
        score -= 30
        negative_reasons.append(
            "Description is missing"
        )

    # Keep the display score between 0 and 100.
    display_score = max(
        0,
        min(score, 100),
    )

    # -----------------------------------------------------
    # Final automatic decision
    # -----------------------------------------------------

    clear_age_or_student_evidence = (
        teen_targeted
        or (
            minimum_age is not None
            and MIN_LADDER_AGE
            <= minimum_age
            <= MAX_LADDER_AGE
        )
    )

    strong_entry_level_evidence = (
        common_teen_title
        and no_experience_required
        and job_type == "parttime"
    )

    if rejection_reasons:
        decision = "reject"

    elif (
        score >= PUBLISH_SCORE
        and (
            clear_age_or_student_evidence
            or strong_entry_level_evidence
        )
    ):
        decision = "publish"

    else:
        # Hidden jobs are not manually reviewed.
        # They simply do not appear in Ladder.
        decision = "hide"

    category = detect_category(text)

    age_label = (
        f"{minimum_age}+"
        if minimum_age is not None
        else "Not stated"
    )

    return pd.Series(
        {
            "ladder_decision": decision,
            "teen_score": display_score,
            "minimum_age": minimum_age,
            "minimum_age_label": age_label,
            "teen_targeted": teen_targeted,
            "no_experience_required": (
                no_experience_required
            ),
            "experience_years_required": (
                experience_years
            ),
            "ladder_category": category,
            "positive_reasons": "; ".join(
                positive_reasons
            ),
            "negative_reasons": "; ".join(
                negative_reasons
            ),
            "rejection_reasons": "; ".join(
                rejection_reasons
            ),
        }
    )


# ---------------------------------------------------------
# OUTPUT HELPERS
# ---------------------------------------------------------

def save_csv(
    jobs: pd.DataFrame,
    output_file: Path,
) -> None:
    """
    Save jobs using CSV settings compatible with descriptions
    that contain commas and quotation marks.
    """

    jobs.to_csv(
        output_file,
        quoting=csv.QUOTE_NONNUMERIC,
        escapechar="\\",
        index=False,
    )


def sort_jobs(
    jobs: pd.DataFrame,
) -> pd.DataFrame:
    """
    Sort by teen score and then posting date.
    """

    jobs = jobs.copy()

    sort_columns = ["teen_score"]
    ascending = [False]

    if "date_posted" in jobs.columns:
        jobs["_filter_date"] = pd.to_datetime(
            jobs["date_posted"],
            errors="coerce",
        )

        sort_columns.append("_filter_date")
        ascending.append(False)

    jobs = jobs.sort_values(
        by=sort_columns,
        ascending=ascending,
        na_position="last",
    )

    if "_filter_date" in jobs.columns:
        jobs = jobs.drop(
            columns=["_filter_date"]
        )

    return jobs


# ---------------------------------------------------------
# MAIN FILTER
# ---------------------------------------------------------

def main() -> None:
    print("========================================")
    print("Starting Ladder automatic job filter")
    print("========================================")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            "Could not find data/jobs.csv. "
            "Run python scrape_jobs.py first."
        )

    DATA_FOLDER.mkdir(
        parents=True,
        exist_ok=True,
    )

    jobs = pd.read_csv(INPUT_FILE)

    print(f"Raw jobs loaded: {len(jobs)}")

    jobs = remove_duplicates(jobs)

    print(
        f"Unique jobs being classified: {len(jobs)}"
    )

    classifications = jobs.apply(
        classify_job,
        axis=1,
    )

    jobs = pd.concat(
        [
            jobs.reset_index(drop=True),
            classifications.reset_index(drop=True),
        ],
        axis=1,
    )

    published_jobs = jobs[
        jobs["ladder_decision"] == "publish"
    ].copy()

    hidden_jobs = jobs[
        jobs["ladder_decision"] == "hide"
    ].copy()

    rejected_jobs = jobs[
        jobs["ladder_decision"] == "reject"
    ].copy()

    published_jobs = sort_jobs(published_jobs)
    hidden_jobs = sort_jobs(hidden_jobs)
    rejected_jobs = sort_jobs(rejected_jobs)
    all_jobs = sort_jobs(jobs)

    save_csv(
        published_jobs,
        PUBLISHED_FILE,
    )

    save_csv(
        hidden_jobs,
        HIDDEN_FILE,
    )

    save_csv(
        rejected_jobs,
        REJECTED_FILE,
    )

    save_csv(
        all_jobs,
        ALL_CLASSIFIED_FILE,
    )

    print()
    print("========================================")
    print("Ladder filtering completed")
    print("========================================")
    print(
        f"Published to Ladder: {len(published_jobs)}"
    )
    print(
        f"Automatically hidden: {len(hidden_jobs)}"
    )
    print(
        f"Automatically rejected: {len(rejected_jobs)}"
    )
    print()
    print(f"Published jobs: {PUBLISHED_FILE}")
    print(f"Hidden jobs: {HIDDEN_FILE}")
    print(f"Rejected jobs: {REJECTED_FILE}")
    print(
        f"All classified jobs: {ALL_CLASSIFIED_FILE}"
    )


if __name__ == "__main__":
    main()