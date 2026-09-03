import { z } from 'zod';
import { CARE_NEEDED_OPTIONS } from '@/server/models/CareInfo';

const UNICODE_NAME_REGEX = /^[\p{L}][\p{L}\p{M} .'-]{1,59}$/u;
const UNICODE_CITY_REGEX = /^[\p{L}][\p{L}\p{M} .'-]{1,49}$/u;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const sanitizeOptionalTracking = () =>
  z
    .string()
    .trim()
    .max(200, 'Must not exceed 200 characters')
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

export const SignupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Enter your name using 2–60 letters.')
      .max(60, 'Enter your name using 2–60 letters.')
      .refine((v) => UNICODE_NAME_REGEX.test(v), {
        message: 'Enter your name using 2–60 letters.',
      }),
    phone: z
      .string()
      .trim()
      .transform((val) => {
        let cleaned = val.replace(/[\s\-()]/g, '');
        if (cleaned.startsWith('+91')) {
          cleaned = cleaned.slice(3);
        } else if (cleaned.startsWith('91') && cleaned.length === 12) {
          cleaned = cleaned.slice(2);
        } else if (cleaned.startsWith('0') && cleaned.length === 11) {
          cleaned = cleaned.slice(1);
        }
        return cleaned;
      })
      .pipe(
        z.string().regex(INDIAN_MOBILE_REGEX, {
          message: 'Enter a valid 10-digit Indian mobile number beginning with 6–9.',
        })
      ),
    careNeeded: z.enum(CARE_NEEDED_OPTIONS),
    city: z
      .string()
      .trim()
      .min(2, 'Enter a valid city using 2–50 letters.')
      .max(50, 'Enter a valid city using 2–50 letters.')
      .refine((v) => UNICODE_CITY_REGEX.test(v), {
        message: 'Enter a valid city using 2–50 letters.',
      }),
    additionalInfo: z
      .string()
      .trim()
      .max(500, 'Briefly describe the care requirement within 500 characters.')
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    email: z
      .string()
      .trim()
      .email('Invalid email format')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v && v.length > 0 ? v.toLowerCase() : undefined)),
    countryCode: z.string().trim().default('+91'),
    timezone: z.string().trim().default('Asia/Kolkata'),
    route: z.string().trim().default('/'),
    website: z.string().optional(), // Honeypot
    // Strict allowlisted tracking fields (capped at 200 chars)
    utm_source: sanitizeOptionalTracking(),
    utm_medium: sanitizeOptionalTracking(),
    utm_campaign: sanitizeOptionalTracking(),
    utm_content: sanitizeOptionalTracking(),
    utm_term: sanitizeOptionalTracking(),
    platform: sanitizeOptionalTracking(),
    gclid: sanitizeOptionalTracking(),
    fbclid: sanitizeOptionalTracking(),
    fbp: sanitizeOptionalTracking(),
    fbc: sanitizeOptionalTracking(),
    matchtype: sanitizeOptionalTracking(),
    network: sanitizeOptionalTracking(),
    device: sanitizeOptionalTracking(),
    keyword: sanitizeOptionalTracking(),
    placement: sanitizeOptionalTracking(),
    campaignid: sanitizeOptionalTracking(),
    adgroupid: sanitizeOptionalTracking(),
  })
  .strip();

export type SignupInput = z.infer<typeof SignupSchema>;
