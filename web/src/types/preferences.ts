export type TransportationType =
  | "car"
  | "public_transit"
  | "bike"
  | "walk"
  | "rideshare"
  | "other";

export const TRANSPORTATION_LABELS: Record<TransportationType, string> = {
  car: "Car",
  public_transit: "Public Transit",
  bike: "Bike",
  walk: "Walk",
  rideshare: "Rideshare (Uber/Lyft)",
  other: "Other",
};

export const EXPERIENCE_OPTIONS = [
  { value: "retail", label: "Retail / Customer Service" },
  { value: "food_service", label: "Food Service / Restaurant" },
  { value: "tutoring", label: "Tutoring / Teaching" },
  { value: "childcare", label: "Childcare / Babysitting" },
  { value: "office", label: "Office / Administrative" },
  { value: "manual_labor", label: "Manual Labor / Warehouse" },
  { value: "tech", label: "Technology / Computers" },
  { value: "arts", label: "Arts / Creative" },
  { value: "sports", label: "Sports / Recreation" },
  { value: "healthcare", label: "Healthcare" },
  { value: "none", label: "No previous work experience" },
] as const;

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
] as const;

export interface UserPreferences {
  user_id: string;
  age: number | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  has_transportation: boolean;
  transportation_type: TransportationType | null;
  max_travel_miles: number;
  available_weekday_morning: boolean;
  available_weekday_afternoon: boolean;
  available_weekday_evening: boolean;
  available_weekend_morning: boolean;
  available_weekend_afternoon: boolean;
  available_weekend_evening: boolean;
  job_interests: string[] | null;
  previous_experience: string[] | null;
  preferred_job_types: string[] | null;
  needs_work_permit: boolean | null;
  has_work_permit: boolean | null;
  desired_pay_min: number | null;
  desired_pay_max: number | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface PreferencesFormData {
  age?: number;
  zip_code?: string;
  city?: string;
  state?: string;
  has_transportation?: boolean;
  transportation_type?: TransportationType;
  max_travel_miles?: number;
  available_weekday_morning?: boolean;
  available_weekday_afternoon?: boolean;
  available_weekday_evening?: boolean;
  available_weekend_morning?: boolean;
  available_weekend_afternoon?: boolean;
  available_weekend_evening?: boolean;
  job_interests?: string[];
  previous_experience?: string[];
  preferred_job_types?: string[];
  needs_work_permit?: boolean;
  has_work_permit?: boolean;
  desired_pay_min?: number;
  desired_pay_max?: number;
  onboarding_completed?: boolean;
}
