/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                         params-2026.json (MLS, rebate, LHC, age discount, Medicare levy, dependants)
 *   K.PREM                      premiums.json (release, counts, cells)
 *   K.cell(region, status)      cheapest exempt policy, median and tiers for a state and a cover type
 *   K.thr(status, kids)         [base, tier 1, tier 2] upper limits for 2026-27
 *   K.tier(income, status, kids), K.rate(tier), K.reb(tier, oldestAge, table?)
 *   K.mls({ status, children, you: { mlsIncome, base? }, partner?, daysWithout? })   household surcharge
 *   K.cmp({ ...mls input, region, oldest, loading, monthlyPremium? })                 surcharge vs cheapest cover
 *   K.be({ status, children?, partner?, region, oldest, loading })                    break-even income
 *   K.lhc(ageAt1July), K.avgLoad([..]), K.loadCost(grossYear, loading)
 *   K.tool(kind, args)          runs a calculator of tool-specs.ts and returns its result card
 *   formats                     K.usd (dollars, AUD), K.usd2, K.pct(0.24118, 3), K.num, K.dec, K.day('2026-10-19')
 *   names                       K.RN (region names), K.RS (short), K.SN (status names), K.TN (tier names)
 */
import P from '../data/params-2026.json';
import { usd, usd2, pct, runTool } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import {
  mls, compare, breakEven, rebatePct, lhcLoading, policyLoading, cell, thresholds, tierOf, mlsRate, loadingCost, netPremium, daysFromMonths, ageBand,
  REGIONS, REGION_NAMES, REGION_SHORT, STATUS_NAMES, TIER_NAMES, AGE_BANDS, HOSPITAL_TIERS, tierLabel, PREMIUMS, DAYS,
} from './engine/cover';

export const KIT = {
  P, PREM: PREMIUMS, DAYS, REGIONS, RN: REGION_NAMES, RS: REGION_SHORT, SN: STATUS_NAMES, TN: TIER_NAMES, AB: AGE_BANDS, HT: HOSPITAL_TIERS, tl: tierLabel,
  cell, thr: thresholds, tier: tierOf, rate: mlsRate, reb: rebatePct, band: ageBand, mls, cmp: compare, be: breakEven, lhc: lhcLoading, avgLoad: policyLoading, loadCost: loadingCost, net: netPremium, days: daysFromMonths,
  tool: runTool, usd, usd2, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-AU'),
};
export type Kit = typeof KIT;
