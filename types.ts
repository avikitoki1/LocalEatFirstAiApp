
export interface Restaurant {
  name: string;
  cuisine: string;
  description: string;
  address?: string;
  rating?: string;
  mapUrl?: string;
  image?: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface AppState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  location: { lat: number; lng: number } | null;
  query: string;
  aiExplanation: string;
}
