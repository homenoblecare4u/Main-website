import { getEffectiveAttribution } from '@/lib/utm';

export type ApiOutcomeCategory =
  | 'success'
  | 'validation_error'
  | 'missing_backend_url'
  | 'timeout'
  | 'network_error'
  | 'server_error'
  | 'malformed_response'
  | 'spam_rejected';

export interface ApiResponseOutcome {
  ok: boolean;
  category: ApiOutcomeCategory;
  message: string;
  data?: unknown;
}

export interface CallbackFormData {
  name: string;
  phone: string;
  service: string;
  city: string;
  message?: string;
  website?: string;
}

const TIMEOUT_MS = 15000;

/**
 * Safely resolves the user's browser IANA timezone (e.g., "Asia/Kolkata").
 * Defaults gracefully to "Asia/Kolkata" if unavailable.
 */
function resolveBrowserTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz && tz.trim().length > 0 ? tz : 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

/**
 * Safely resolves the current browser pathname.
 */
function resolveCurrentPathname(): string {
  if (typeof window !== 'undefined' && window.location.pathname) {
    return window.location.pathname;
  }
  return '/';
}

/**
 * Submits the callback enquiry to `${NEXT_PUBLIC_BACKEND_URL}/api/signup`
 * with safe payload normalization, 15-second AbortController timeout,
 * dynamic pathname and timezone detection, and defensive response validation.
 *
 * Never exposes raw backend errors or stack traces.
 */
export async function submitCallbackEnquiry(
  formData: CallbackFormData
): Promise<ApiResponseOutcome> {
  // Honeypot spam check
  if (formData.website && formData.website.trim() !== '') {
    return {
      ok: false,
      category: 'spam_rejected',
      message: 'Unable to submit your request.',
    };
  }

  // Check backend configuration
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!backendBaseUrl) {
    return {
      ok: false,
      category: 'missing_backend_url',
      message:
        'Backend API is not configured (NEXT_PUBLIC_BACKEND_URL is not set). No enquiry was sent.',
    };
  }

  // Normalize and trim lead fields
  const trimmedName = formData.name.trim();
  const trimmedPhone = formData.phone.trim();
  const trimmedService = formData.service.trim();
  const trimmedCity = formData.city.trim();
  const trimmedMessage = formData.message?.trim();

  // Read effective UTM attribution (live URL priority with stored fallback)
  const attribution = getEffectiveAttribution();

  const payload: Record<string, unknown> = {
    name: trimmedName,
    phone: trimmedPhone,
    careNeeded: trimmedService,
    city: trimmedCity,
    countryCode: '+91',
    timezone: resolveBrowserTimezone(),
    route: resolveCurrentPathname(),
    ...attribution,
  };

  if (trimmedMessage && trimmedMessage.length > 0) {
    payload.additionalInfo = trimmedMessage;
  }

  const endpoint = `${backendBaseUrl.replace(/\/+$/, '')}/api/signup`;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      return {
        ok: false,
        category: 'malformed_response',
        message:
          'We received an unexpected response from our care server. Please try again shortly.',
      };
    }

    // Verify both HTTP status (2xx) and explicit success boolean envelope
    if (res.ok && json && json.success === true) {
      const successMessage =
        typeof json.message === 'string' && json.message.trim().length > 0
          ? json.message.trim()
          : 'Thank you! Your request has been received. Our care coordinator will contact you shortly.';

      return {
        ok: true,
        category: 'success',
        message: successMessage,
        data: json.data,
      };
    }

    // Categorize server response errors safely without exposing raw database errors
    if (res.status === 400) {
      return {
        ok: false,
        category: 'validation_error',
        message:
          'Please check your details and try again. Some information appears to be missing or formatted incorrectly.',
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        category: 'server_error',
        message: 'The care submission service is temporarily unavailable. Please try again later.',
      };
    }

    return {
      ok: false,
      category: 'server_error',
      message:
        'Something went wrong while submitting your request. Please try again or reach out directly.',
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        ok: false,
        category: 'timeout',
        message:
          'The request timed out while connecting to our care server. Please check your internet connection and try again.',
      };
    }

    return {
      ok: false,
      category: 'network_error',
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
    };
  }
}
