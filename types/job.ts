export const filterSortOptions = [
  { key: 'createdAt_desc', label: 'Recent', icon: 'schedule' },
  { key: 'price_desc', label: 'Price', icon: 'currency-rupee' },
  { key: 'radius_asc', label: 'Nearest', icon: 'location-on' },
] as const;

export const modeOptions = [
  { key: 'remote', icon: 'wifi' },
  { key: 'onsite', icon: 'location-on' },
  { key: 'hybrid', icon: 'public' },
] as const;

export type ModeType = (typeof modeOptions)[number]['key'];
export type SortType = (typeof filterSortOptions)[number]['key'];

export interface CreateJobPayload {
  createdBy: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  price: number;
  category: string;
  mode: ModeType;
  duration: string;
}

export interface FetchJobsParams {
  userId: string;
  minPrice?: number;
  maxPrice?: number;
  mode: ModeType;
  radius?: number;
  sortBy?: SortType;
  limit?: number;
  offset?: number;
}

export interface Job {
  jobID: string;
  title: string;
  description: string;
  price: number;
  lat: number;
  lng: number;
  category: string;
  mode: ModeType;
  duration: string;
  createdAt: string;
}
