import { ModularFeature } from '../types';
import { DEFAULT_PLUG_PLAY_FEATURES } from '../data/defaultFeatures';

export interface FeaturesApiResponse {
  success: boolean;
  features: ModularFeature[];
  storagePath: string;
  totalCount: number;
  experimentalCount: number;
  enabledCount: number;
  timestamp: number;
}

export interface RawJsonConfigResponse {
  success: boolean;
  filePath: string;
  rawJson: string;
  sizeBytes: number;
  lastModified: number;
}

/**
 * Fetch all plug-and-play and experimental feature configurations from backend JSON
 */
export async function getBackendFeatures(): Promise<ModularFeature[]> {
  try {
    const res = await fetch('/api/features');
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    const data: FeaturesApiResponse = await res.json();
    if (data && Array.isArray(data.features) && data.features.length > 0) {
      return data.features;
    }
  } catch (err) {
    console.warn('Failed to fetch /api/features from backend, falling back to local defaults:', err);
  }
  return DEFAULT_PLUG_PLAY_FEATURES;
}

/**
 * Toggle a feature on or off dynamically in the backend JSON file without redeployment
 */
export async function toggleBackendFeature(
  id: string,
  isEnabled?: boolean,
  updatedBy: string = 'Admin'
): Promise<ModularFeature | null> {
  try {
    const res = await fetch(`/api/features/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isEnabled, updatedBy }),
    });
    if (!res.ok) {
      throw new Error(`Toggle failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.feature || null;
  } catch (err) {
    console.error(`Failed to toggle backend feature ${id}:`, err);
    return null;
  }
}

/**
 * Update parameters or rollout percentage for a feature in the backend JSON
 */
export async function updateBackendFeature(
  id: string,
  updateData: Partial<ModularFeature>
): Promise<ModularFeature | null> {
  try {
    const res = await fetch(`/api/features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) {
      throw new Error(`Update failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.feature || null;
  } catch (err) {
    console.error(`Failed to update backend feature ${id}:`, err);
    return null;
  }
}

/**
 * Apply preset configurations across all features in backend JSON
 */
export async function applyBackendPreset(
  preset: 'all-on' | 'all-off-experimental' | 'all-on-experimental' | 'strict-reliability',
  updatedBy: string = 'Admin'
): Promise<ModularFeature[] | null> {
  try {
    const res = await fetch('/api/features/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset, updatedBy }),
    });
    if (!res.ok) {
      throw new Error(`Bulk preset failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.features || null;
  } catch (err) {
    console.error('Failed to apply backend preset:', err);
    return null;
  }
}

/**
 * Fetch raw JSON string directly from backend features_config.json
 */
export async function fetchRawFeaturesJson(): Promise<RawJsonConfigResponse | null> {
  try {
    const res = await fetch('/api/features/config-json');
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch raw features JSON:', err);
    return null;
  }
}

/**
 * Directly save raw JSON string to backend features_config.json
 */
export async function saveRawFeaturesJson(rawJson: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/features/config-json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawJson }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save raw JSON');
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    console.error('Failed to save raw features JSON:', err);
    return { success: false, message: err?.message || 'Unknown error' };
  }
}

/**
 * Reset backend features to factory default configuration
 */
export async function resetBackendFeatures(): Promise<ModularFeature[] | null> {
  try {
    const res = await fetch('/api/features/reset', { method: 'POST' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return data.features || null;
  } catch (err) {
    console.error('Failed to reset backend features:', err);
    return null;
  }
}
