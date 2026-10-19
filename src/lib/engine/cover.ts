/**
 * The tax side of hospital cover in Australia, 2026-27 income year (params-2026.json):
 *  - Medicare levy surcharge (MLS): tier from income for MLS purposes (combined with a spouse),
 *    rate applied to taxable income + reportable fringe benefits (+ FTDT amounts), per day without cover;
 *  - private health insurance rebate: percentage by tier and age of the oldest person on the policy,
 *    never paid on the Lifetime Health Cover loading;
 *  - Lifetime Health Cover loading: 2 % per year over 30 at the 1 July before joining, 70 % at most,
 *    removed after 10 continuous years;
 *  - cheapest open hospital policy that avoids the MLS, per state and cover type (premiums.json).
 * Pure functions, no rounding until display.
 */
import P from '../../data/params-2026.json';
import PREM from '../../data/premiums.json';

export type Status = 'single' | 'couple' | 'family' | 'singleParent';
export type Region = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT';
export type Tier = 0 | 1 | 2 | 3;
export type AgeBand = 0 | 1 | 2;

export const REGIONS: Region[] = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'];
export const REGION_NAMES: Record<Region, string> = {
  NSW: 'New South Wales and the ACT', VIC: 'Victoria', QLD: 'Queensland', SA: 'South Australia', WA: 'Western Australia', TAS: 'Tasmania', NT: 'Northern Territory',
};
export const REGION_SHORT: Record<Region, string> = { NSW: 'NSW and ACT', VIC: 'Victoria', QLD: 'Queensland', SA: 'South Australia', WA: 'Western Australia', TAS: 'Tasmania', NT: 'Northern Territory' };
export const STATUS_NAMES: Record<Status, string> = { single: 'Single, no children', couple: 'Couple, no children', family: 'Couple with children', singleParent: 'Single parent' };
export const TIER_NAMES = ['Base tier', 'Tier 1', 'Tier 2', 'Tier 3'] as const;
export const AGE_BANDS = ['under 65', '65 to 69', '70 or over'] as const;
export const DAYS = P.daysInYear;

/** A family for MLS and rebate purposes: a spouse, or a dependent child. */
export const isFamily = (s: Status) => s !== 'single';
/** Children who raise the family thresholds: none for a couple without children, at least one otherwise. */
export const kids = (s: Status, children: number) => (s === 'family' || s === 'singleParent' ? Math.max(1, Math.floor(children)) : 0);

/** The three tier boundaries (upper limit of base, tier 1 and tier 2), inclusive. */
export function thresholds(s: Status, children = 0, table: { single: number[]; family: number[] } = P.mls): [number, number, number] {
  if (!isFamily(s)) return table.single as [number, number, number];
  const add = Math.max(0, kids(s, children) - 1) * P.mls.childIncrement;
  return table.family.map((x) => x + add) as [number, number, number];
}
export function tierOf(income: number, s: Status, children = 0): Tier {
  const [a, b, c] = thresholds(s, children);
  return income <= a ? 0 : income <= b ? 1 : income <= c ? 2 : 3;
}
export const mlsRate = (t: Tier) => P.mls.rates[t];

export interface Person {
  /** Income for MLS purposes: taxable income + reportable fringe benefits + net investment losses + reportable super contributions. */
  mlsIncome: number;
  /** Part of that income the surcharge is charged on: taxable income + reportable fringe benefits (+ FTDT amounts). Defaults to mlsIncome. */
  base?: number;
}
export interface MlsIn { status: Status; children?: number; you: Person; partner?: Person; daysWithout?: number }
export interface MlsPart { liable: boolean; amount: number; base: number; why: string }
export interface MlsOut { tier: Tier; rate: number; testIncome: number; thresholds: [number, number, number]; you: MlsPart; partner?: MlsPart; total: number; days: number }

/** Medicare levy surcharge for a whole household, assuming the status held all year. */
export function mls(x: MlsIn): MlsOut {
  const days = Math.min(DAYS, Math.max(0, x.daysWithout ?? DAYS));
  const share = days / DAYS;
  const th = thresholds(x.status, x.children ?? 0);
  const couple = x.status === 'couple' || x.status === 'family';
  const testIncome = x.you.mlsIncome + (couple ? x.partner?.mlsIncome ?? 0 : 0);
  const tier = tierOf(testIncome, x.status, x.children ?? 0);
  const rate = mlsRate(tier);
  const floor = P.mls.spouseOwnIncomeFloor.value;
  const part = (p: Person): MlsPart => {
    const base = Math.max(0, Math.min(p.base ?? p.mlsIncome, p.mlsIncome));
    if (tier === 0) return { liable: false, amount: 0, base, why: couple ? 'combined income at or under the family threshold' : 'income at or under the threshold' };
    if (couple && p.mlsIncome <= floor) return { liable: false, amount: 0, base, why: 'own income for MLS purposes at or under the spouse floor' };
    return { liable: true, amount: rate * base * share, base, why: `${TIER_NAMES[tier]} rate on taxable income and fringe benefits` };
  };
  const you = part(x.you);
  const partner = couple && x.partner ? part(x.partner) : undefined;
  return { tier, rate, testIncome, thresholds: th, you, partner, total: you.amount + (partner?.amount ?? 0), days };
}

/** Age band of the rebate from the age of the oldest person on the policy. */
export const ageBand = (oldest: number): AgeBand => (oldest >= 70 ? 2 : oldest >= 65 ? 1 : 0);
export type RebateTable = 'current' | 'previous' | 'proposal2027';
export function rebatePct(t: Tier, oldest: number, table: RebateTable = 'current'): number {
  const rates = table === 'proposal2027' ? P.rebate.proposal2027.rates : P.rebate.periods[table === 'previous' ? 0 : P.rebate.current].rates;
  return rates[ageBand(oldest)][t];
}

/** Lifetime Health Cover loading on joining, from the age on the 1 July before joining. */
export function lhcLoading(ageAtJuly1: number, opts: { bornBefore1934?: boolean } = {}): number {
  if (opts.bornBefore1934) return 0;
  const years = Math.floor(ageAtJuly1) - P.lhc.freeUntilAge;
  return Math.min(P.lhc.max, Math.max(0, years * P.lhc.perYear));
}
/** Couple or family policy: the average of the adults' loadings. */
export const policyLoading = (loadings: number[]) => (loadings.length ? loadings.reduce((a, b) => a + b, 0) / loadings.length : 0);

export type Scale = 'single' | 'couple' | 'family' | 'singleParent';
export const scaleOf = (s: Status): Scale => s;
export interface Policy { fund: string; product: string; tier: string; monthly: number; excess: number; excessPolicy: number; ageDiscount: boolean }
export interface Cell { n: number; funds: number; cheapest: Policy; runnersUp: Policy[]; median: number; byTier: Record<string, { cheapest: number; fund: string; median: number; n: number }> }
const CELLS = PREM.cells as unknown as Record<string, Cell>;
export const cell = (r: Region, s: Status): Cell => CELLS[`${r}:${scaleOf(s)}`];
export const PREMIUMS = PREM;
export const HOSPITAL_TIERS = ['Basic', 'BasicPlus', 'Bronze', 'BronzePlus', 'Silver', 'SilverPlus', 'Gold'] as const;
export const tierLabel = (t: string) => t.replace('Plus', ' Plus');

export interface PremiumOut { gross: number; rebatePct: number; rebate: number; loadingPct: number; loading: number; net: number }
/** Yearly cost of a hospital policy: rebate on the base premium, LHC loading on top, no rebate on the loading. */
export function netPremium(grossYear: number, rebate: number, loading: number): PremiumOut {
  const r = grossYear * rebate, l = grossYear * loading;
  return { gross: grossYear, rebatePct: rebate, rebate: r, loadingPct: loading, loading: l, net: grossYear - r + l };
}

export interface CompareIn extends MlsIn { region: Region; oldest: number; loading: number; monthlyPremium?: number; rebateTable?: RebateTable }
export interface CompareOut { mls: MlsOut; policy: Policy; premium: PremiumOut; saving: number; coverCheaper: boolean; premiumTier: Tier }
/** The surcharge you would pay without cover against the cheapest policy that avoids it (or your own premium). */
export function compare(x: CompareIn): CompareOut {
  const m = mls(x);
  const c = cell(x.region, x.status);
  const policy = c.cheapest;
  const monthly = x.monthlyPremium && x.monthlyPremium > 0 ? x.monthlyPremium : policy.monthly;
  const share = m.days / DAYS;
  const rebate = rebatePct(m.tier, x.oldest, x.rebateTable);
  const premium = netPremium(monthly * 12 * share, rebate, x.loading);
  const saving = m.total - premium.net;
  return { mls: m, policy, premium, saving, coverCheaper: saving > 0, premiumTier: m.tier };
}

/** Lowest income (step of $100) from which the cheapest cover costs less than the surcharge. Partner income held fixed. */
export function breakEven(x: Omit<CompareIn, 'you'> & { you?: Person }, step = 100): number | null {
  const start = x.status === 'couple' || x.status === 'family' ? Math.max(0, thresholds(x.status, x.children ?? 0)[0] - (x.partner?.mlsIncome ?? 0)) : thresholds(x.status, x.children ?? 0)[0];
  for (let inc = Math.floor(start / step) * step; inc <= 1_000_000; inc += step) {
    const r = compare({ ...x, you: { mlsIncome: inc } } as CompareIn);
    if (r.mls.total > 0 && r.coverCheaper) return inc;
  }
  return null;
}

/** Extra paid over the 10 loaded years for a loading, with premiums rising by `rise` a year. */
export function loadingCost(grossYear: number, loading: number, years = P.lhc.removedAfterYears, rise = 0) {
  let total = 0;
  for (let y = 0; y < years; y++) total += grossYear * (1 + rise) ** y * loading;
  return total;
}

/** Days without cover in the income year from a number of months (whole months, 365-day year). */
export const daysFromMonths = (m: number) => Math.round((Math.min(12, Math.max(0, m)) / 12) * DAYS);
