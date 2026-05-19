/**
 * Security utility to validate redirect URLs and prevent open redirect vulnerabilities
 */

/**
 * Validates if a redirect URL is safe (internal to the application)
 * @param url - The URL to validate
 * @returns true if the URL is safe to redirect to, false otherwise
 */
export function isValidRedirect(url: string): boolean {
  if (!url) return false;
  
  try {
    // Parse the URL with a dummy base to handle relative URLs
    const parsed = new URL(url, 'https://example.com');
    
    // Only allow relative paths (no protocol or host)
    // Must start with / but not with // (which would be protocol-relative)
    return parsed.pathname.startsWith('/') && !parsed.pathname.startsWith('//');
  } catch {
    // If URL parsing fails, reject it
    return false;
  }
}

/**
 * Sanitizes a redirect URL, returning a safe default if invalid
 * @param url - The URL to sanitize
 * @param defaultPath - The default path to return if URL is invalid (default: '/')
 * @returns A safe redirect URL
 */
export function sanitizeRedirect(url: string | null, defaultPath: string = '/'): string {
  if (!url) return defaultPath;
  return isValidRedirect(url) ? url : defaultPath;
}
