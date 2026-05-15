// @canvas/core — cross-cutting platform utilities.
//
// Subpath imports are the primary pattern:
//   import { createRateLimiter } from '@canvas/core/rate-limit';
//   import { validateLaTeX }     from '@canvas/core/latex-validator';
//   import { sanitizeRedirect }  from '@canvas/core/redirect-validation';
//   import { uploadToR2 }        from '@canvas/core/r2-storage';
//   import { cn }                from '@canvas/core/utils';
//   import { track }             from '@canvas/core/analytics/mixpanel';
//
// The barrel below re-exports the most-touched symbols for ad-hoc usage.
// It is NOT a contract — reach for the subpath when a symbol is missing.

// ── Rate limiting ──
export {
  createRateLimiter,
  getClientIp,
  type RateLimitOptions,
  type RateLimitResult,
  type Limiter,
} from './rate-limit';

// ── LaTeX validation ──
export {
  validateLaTeX,
  autoFixLatex,
  getLatexSuggestions,
  extractLatexExpressions,
  type LaTeXIssue,
  type LaTeXValidationResult,
  type AutoFixResult,
} from './latex-validator';

// ── Redirect validation (SSRF guard) ──
export { isValidRedirect, sanitizeRedirect } from './redirect-validation';

// ── R2 storage ──
export {
  r2Client,
  uploadToR2,
  getSignedR2Url,
  deleteFromR2,
  generateAssetFileName,
  getExtensionFromMimeType,
  type AssetType,
  type UploadResult,
} from './r2-storage';

// ── Class-name utility ──
export { cn } from './utils';
