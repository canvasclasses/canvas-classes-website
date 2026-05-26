/*
 * Per-spec view-layer metadata (kept outside the CareerSpec schema).
 *
 *   - visualKey: which animated SVG from visuals.tsx renders for this career
 *     (used both on the index card and as the detail-page hero band).
 *   - note: the short footnote on the index card ("Career your parents
 *     recommend", "New career nobody mentions", etc.) — per-card editorial,
 *     not a derivable function of archetype alone.
 *
 * Lives in /features so both the index page and detail page can import it
 * without duplicating the map.
 */

import type { VisualKey } from './visuals';

export interface CardMeta {
  visualKey: VisualKey;
  note: string;
}

export const CARD_META: Record<string, CardMeta> = {
  'software-engineer-product': {
    visualKey: 'software',
    note: 'Career your parents recommend.',
  },
  'ml-engineer': {
    visualKey: 'ml',
    note: "New career — most students and parents haven't heard of it.",
  },
  'semiconductor-engineer': {
    visualKey: 'semi',
    note: "New career — most students and parents haven't heard of it.",
  },
  'robotics-engineer': {
    visualKey: 'robotics',
    note: 'Career your parents recommend — but the job has changed.',
  },
  'energy-materials-engineer': {
    visualKey: 'energy',
    note: "New career — most students and parents haven't heard of it.",
  },
  'clinical-doctor': {
    visualKey: 'clinical',
    note: 'Established career.',
  },
  'biotech-research': {
    visualKey: 'biotech',
    note: "New career — most students and parents haven't heard of it.",
  },
  'data-engineer': {
    visualKey: 'data',
    note: 'Career your parents half-recognise.',
  },
  'quant-developer': {
    visualKey: 'quant',
    note: 'Career your parents recommend.',
  },
  'healthcare-ai': {
    visualKey: 'healthAI',
    note: "New career — most students and parents haven't heard of it.",
  },
  'product-designer': {
    visualKey: 'product',
    note: 'Career your parents underestimate.',
  },
  'ai-evaluations-engineer': {
    visualKey: 'safety',
    note: "New career — didn't exist as a job title in 2022.",
  },
};
