/**
 * R2 Media Utility
 * Centralized utility for fetching media from R2
 */

// R2 Public Domain - Single source of truth
export const R2_PUBLIC_DOMAIN = 'https://pub-76140dda4e8944f0a04e7b8026066f34.r2.dev';

/**
 * Get R2 URL from r2_key
 */
export function getR2Url(r2Key: string): string {
  return `${R2_PUBLIC_DOMAIN}/${r2Key}`;
}

/**
 * Fetch media metadata from D1 and return R2 URL
 * @param mediaKey - The media key (e.g., 'hero.background', 'icons.logo')
 * @returns Promise that resolves to R2 URL or null if not found
 */
export async function getMediaR2Url(mediaKey: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/media/${encodeURIComponent(mediaKey)}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.media && data.media.r2_key) {
      return getR2Url(data.media.r2_key);
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch media ${mediaKey}:`, error);
    return null;
  }
}

/**
 * Fetch media metadata from D1
 * @param mediaKey - The media key (e.g., 'hero.background', 'icons.logo')
 * @returns Promise that resolves to media object or null if not found
 */
export async function getMediaMetadata(mediaKey: string) {
  try {
    const response = await fetch(`/api/media/${encodeURIComponent(mediaKey)}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.media || null;
  } catch (error) {
    console.error(`Failed to fetch media metadata ${mediaKey}:`, error);
    return null;
  }
}

/**
 * Batch fetch media metadata from D1
 * @param keys - Array of media keys
 * @returns Promise that resolves to object with media keys as keys
 */
export async function getBatchMediaMetadata(keys: string[]): Promise<Record<string, any>> {
  try {
    const response = await fetch('/api/media/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    });
    
    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return data.media || {};
  } catch (error) {
    console.error('Failed to fetch batch media metadata:', error);
    return {};
  }
}

