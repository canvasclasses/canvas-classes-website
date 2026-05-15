// Shared PII sanitizer used by both the browser and the Node-side
// Mixpanel wrappers. Kept in its own module so that neither wrapper has
// to import the other's SDK.

export const PII_KEYS = [
  'email',
  'phone',
  'name',
  'full_name',
  'password',
  'question_content',
  'answer_text',
];

export function sanitize(props: Record<string, unknown> = {}) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.includes(k.toLowerCase())) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[analytics] PII key "${k}" stripped from event props`);
      }
      continue;
    }
    clean[k] = v;
  }
  return clean;
}
