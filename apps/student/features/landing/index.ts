// features/landing — homepage + landing variants + site-level command palette
// search index.
//
// Routes:
//   /              → app/page.tsx renders LandingPage from here
//   /landing       → app/landing/page.tsx (alternate landing variant)
//
// Landing-flavoured top-level chrome (FAQSection, NCERTSection, etc.) lives
// here even though they appear on multiple non-homepage routes too — those
// uses are "marketing section embeds" and the landing feature owns the source.

export { default as LandingPage } from './components/LandingPage';
export { default as FAQSection } from './components/FAQSection';
export { default as NCERTSection } from './components/NCERTSection';
export { default as OfferingsSection } from './components/OfferingsSection';
export { default as StudentTestimonialCards } from './components/StudentTestimonialCards';
export { default as WhyChooseUsSection } from './components/WhyChooseUsSection';
export { default as QuickRevisionCard } from './components/QuickRevisionCard';
export { default as ComingSoonTemplate } from './components/ComingSoonTemplate';
