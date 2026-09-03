export const UTM_STORAGE_KEY = 'noblecare4u_attribution_v1';
export const MAX_UTM_LENGTH = 200;

export const ALLOWED_UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'platform',
  'gclid',
  'fbclid',
  'fbp',
  'fbc',
  'matchtype',
  'network',
  'device',
  'keyword',
  'placement',
  'campaignid',
  'adgroupid',
] as const;

export type AllowedUtmKey = (typeof ALLOWED_UTM_KEYS)[number];
export type UtmAttribution = Partial<Record<AllowedUtmKey, string>>;

const ALLOWED_SET = new Set<string>(ALLOWED_UTM_KEYS);

/**
 * Sanitizes a single tracking parameter value:
 * - Trims whitespace
 * - Clamps length to 200 characters max
 * - Discards empty or non-string values
 */
export function sanitizeUtmValue(val: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, MAX_UTM_LENGTH);
}

/**
 * Parses URL search string (or URLSearchParams) and returns only
 * allowlisted, trimmed, non-empty tracking parameters capped at 200 chars.
 * Any unknown query parameters, PII, or advertising cookies are strictly ignored.
 */
export function extractUtmFromSearchParams(
  searchParams: URLSearchParams | string
): UtmAttribution {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams.startsWith('?') ? searchParams.slice(1) : searchParams)
      : searchParams;

  const result: UtmAttribution = {};

  for (const key of ALLOWED_UTM_KEYS) {
    const rawVal = params.get(key);
    if (rawVal !== null) {
      const cleanVal = sanitizeUtmValue(rawVal);
      if (cleanVal !== undefined) {
        result[key] = cleanVal;
      }
    }
  }

  return result;
}

/**
 * Safely checks if browser sessionStorage is available and writable.
 */
function isSessionStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__nc4u_storage_test__';
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads stored attribution from sessionStorage with strict allowlisting,
 * sanitization, and defensive JSON parsing.
 * Returns empty object if storage is missing, unavailable, or corrupted.
 */
export function getStoredAttribution(): UtmAttribution {
  if (!isSessionStorageAvailable()) return {};

  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      window.sessionStorage.removeItem(UTM_STORAGE_KEY);
      return {};
    }

    const cleaned: UtmAttribution = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (ALLOWED_SET.has(k)) {
        const cleanVal = sanitizeUtmValue(v);
        if (cleanVal !== undefined) {
          cleaned[k as AllowedUtmKey] = cleanVal;
        }
      }
    }

    return cleaned;
  } catch {
    // Corrupted JSON or storage error - clear safely
    try {
      window.sessionStorage.removeItem(UTM_STORAGE_KEY);
    } catch {
      // Ignore cleanup error
    }
    return {};
  }
}

/**
 * Saves allowlisted attribution parameters into sessionStorage.
 * Omits unknown keys, empty strings, and PII.
 */
export function saveAttribution(attribution: UtmAttribution): void {
  if (!isSessionStorageAvailable()) return;

  const sanitized: UtmAttribution = {};
  for (const key of ALLOWED_UTM_KEYS) {
    const cleanVal = sanitizeUtmValue(attribution[key]);
    if (cleanVal !== undefined) {
      sanitized[key] = cleanVal;
    }
  }

  if (Object.keys(sanitized).length === 0) return;

  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // Gracefully handle storage quota or private browsing restriction
  }
}

/**
 * Captures live URL parameters on initial landing or page load:
 * - If live URL has allowlisted tracking params, saves them and returns them.
 * - If live URL has NO tracking params (clean URL), preserves and returns stored attribution.
 */
export function captureAndStoreUtm(): UtmAttribution {
  if (typeof window === 'undefined') return {};

  const liveParams = extractUtmFromSearchParams(window.location.search);

  if (Object.keys(liveParams).length > 0) {
    saveAttribution(liveParams);
    return liveParams;
  }

  return getStoredAttribution();
}

/**
 * Returns the effective attribution to attach to form submission:
 * - Live URL parameters take precedence if present.
 * - Falls back to stored attribution if the current URL is clean.
 */
export function getEffectiveAttribution(): UtmAttribution {
  if (typeof window === 'undefined') return {};

  const liveParams = extractUtmFromSearchParams(window.location.search);
  if (Object.keys(liveParams).length > 0) {
    return liveParams;
  }

  return getStoredAttribution();
}

/**
 * Clears stored attribution from sessionStorage.
 * Must ONLY be called after verified API success.
 */
export function clearAttribution(): void {
  if (!isSessionStorageAvailable()) return;

  try {
    window.sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch {
    // Ignore cleanup error
  }
}
