export interface LocationData {
  city?: string;
  country: string;
  flag?: string;
  countryRegion?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  answers: {
    id: string;
    text: string;
    outcome: string;
  }[];
}
