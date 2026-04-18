const COOKIE = 'cookie_consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c === `${COOKIE}=granted`);
}

export function setConsent(value: 'granted' | 'denied') {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=${value}; max-age=${MAX_AGE}; path=/; samesite=lax`;
}

export function clearConsent() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=; max-age=0; path=/`;
}
