/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_PAGES = [
  'mls-thresholds', 'income-for-mls-purposes', 'mls-couples', 'mls-families', 'mls-single-parents', 'mls-part-year-cover', 'mls-hospital-cover-excess',
  'mls-fringe-benefits-salary-packaging', 'mls-investment-losses-super', 'mls-visa-holders-expats', 'medicare-levy-vs-surcharge',
  'private-health-insurance-rebate', 'rebate-over-65', 'rebate-premium-reduction-or-tax-offset',
  'lifetime-health-cover-loading', 'lhc-base-day-turning-31', 'lhc-new-migrants', 'lhc-overseas-returning-australians', 'lhc-days-of-absence', 'lhc-10-year-removal',
  'is-private-health-insurance-worth-it', 'private-health-insurance', 'compare-health-insurance', 'basic-hospital-cover',
  'mls-110000', 'mls-125000', 'mls-150000', 'mls-170000', 'mls-family-230000', 'mls-family-260000',
  'state-nsw', 'state-vic', 'state-qld', 'state-sa', 'state-wa', 'state-tas', 'state-nt',
];
export const PLANNED_IDS = new Set<string>(PLANNED_PAGES);
