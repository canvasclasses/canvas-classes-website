/**
 * Legal document versions. Bumping either version string causes every user
 * with a stale stored version to see the re-consent modal on their next
 * authenticated page load. See docs/superpowers/specs/2026-04-20-privacy-policy-design.md
 * section 7.4 for the full update workflow.
 *
 * Remember to review Section 6 ("Sub-processors") of the Privacy Policy
 * whenever a new vendor is added or removed from the analytics stack.
 */
export const PRIVACY_VERSION = '1.0';
export const TERMS_VERSION = '1.0';
export const LAST_UPDATED = '2026-04-20';
