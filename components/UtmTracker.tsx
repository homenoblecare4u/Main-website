'use client';

import { useEffect } from 'react';
import { captureAndStoreUtm } from '@/lib/utm';

/**
 * UtmTracker is a client-side component mounted in root layout.
 * It reads allowlisted UTM and tracking parameters from window.location.search
 * and persists them into sessionStorage under `noblecare4u_attribution_v1`.
 * Renders nothing to the DOM and does not deopt layout into dynamic rendering.
 */
export default function UtmTracker() {
  useEffect(() => {
    captureAndStoreUtm();
  }, []);

  return null;
}
