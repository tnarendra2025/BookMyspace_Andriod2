import { Venue, VenueSortOption } from '../types';

export interface FetchVenuesParams {
  categoryId?: string;
  categorySlug?: string;
  city?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  sortBy?: VenueSortOption | string;
  userLat?: number;
  userLng?: number;
  availabilityDate?: string;
  limit?: number;
}

export interface VenueFetchResponse {
  success: boolean;
  source: string;
  query_executed: {
    category_id: string | null;
    category_slug: string | null;
    city: string | null;
    query: string | null;
    sort_by: string;
    user_lat?: number | null;
    user_lng?: number | null;
    availability_date?: string | null;
  };
  applied_sort?: string;
  total: number;
  count: number;
  venues: Venue[];
  timestamp: number;
}

/**
 * Optimized venue-fetch service:
 * Passes `category_id`, location coordinates (`user_lat`, `user_lng`), availability date,
 * and intelligent multi-factor sorting criteria directly to the backend database query API.
 * Ensures users receive intelligent ranking (distance, popularity, and availability)
 * directly from the server without redundant client-side filtering.
 */
export async function fetchVenuesFromBackend(
  params: FetchVenuesParams = {}
): Promise<VenueFetchResponse> {
  const queryParams = new URLSearchParams();

  if (params.categoryId && params.categoryId !== 'all' && params.categoryId !== 'cat_all') {
    queryParams.set('category_id', params.categoryId);
  }
  if (params.categorySlug && params.categorySlug !== 'all') {
    queryParams.set('category_slug', params.categorySlug);
  }
  if (params.city && params.city !== 'All' && params.city !== 'All Cities') {
    queryParams.set('city', params.city);
  }
  if (params.query?.trim()) {
    queryParams.set('query', params.query.trim());
  }
  if (params.minPrice !== undefined && params.minPrice > 0) {
    queryParams.set('min_price', params.minPrice.toString());
  }
  if (params.maxPrice !== undefined && params.maxPrice < 1000000) {
    queryParams.set('max_price', params.maxPrice.toString());
  }
  if (params.minCapacity !== undefined && params.minCapacity > 0) {
    queryParams.set('min_capacity', params.minCapacity.toString());
  }
  if (params.sortBy) {
    queryParams.set('sort_by', params.sortBy);
  }
  if (params.userLat !== undefined && !isNaN(params.userLat)) {
    queryParams.set('user_lat', params.userLat.toString());
  }
  if (params.userLng !== undefined && !isNaN(params.userLng)) {
    queryParams.set('user_lng', params.userLng.toString());
  }
  if (params.availabilityDate?.trim()) {
    queryParams.set('availability_date', params.availabilityDate.trim());
  }
  if (params.limit) {
    queryParams.set('limit', params.limit.toString());
  }

  const url = `/api/venues?${queryParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Venue fetch failed HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

export async function createVenueOnBackend(venueData: Partial<Venue>): Promise<{ success: boolean; venue?: Venue; error?: string }> {
  try {
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venueData),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save venue to database' };
  }
}

export async function updateVenueOnBackend(id: string, updates: Partial<Venue>): Promise<{ success: boolean; venue?: Venue; error?: string }> {
  try {
    const res = await fetch(`/api/venues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update venue on database' };
  }
}

export async function deleteVenueOnBackend(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/venues/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete venue from database' };
  }
}

export async function purgeSampleVenuesOnBackend(): Promise<{ success: boolean; remainingCount: number; message: string }> {
  try {
    const res = await fetch('/api/venues/purge-samples', {
      method: 'POST',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, remainingCount: 0, message: err?.message || 'Failed to purge samples' };
  }
}

export async function resetSampleVenuesOnBackend(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const res = await fetch('/api/venues/reset-samples', {
      method: 'POST',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, count: 0, message: err?.message || 'Failed to reset sample venues' };
  }
}
