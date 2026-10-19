/**
 * Engine tests: the worked examples of the ATO and of PrivateHealth.gov.au become tests (RECETTE §17.4),
 * plus the boundaries of every tier and the premiums file.
 */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import PREM from '../src/data/premiums.json';
import { mls, thresholds, tierOf, rebatePct, lhcLoading, policyLoading, netPremium, compare, breakEven, cell, REGIONS, daysFromMonths, loadingCost } from '../src/lib/engine/cover';
import { TOOL_KINDS, runTool } from '../src/lib/tool-specs';

describe('Medicare levy surcharge 2026-27 (ATO, updated 22 June 2026)', () => {
  it('thresholds: singles 105,000 / 123,000 / 164,000, families double, +1,500 per child after the first', () => {
    expect(thresholds('single')).toEqual([105000, 123000, 164000]);
    expect(thresholds('couple')).toEqual([210000, 246000, 328000]);
    expect(thresholds('family', 1)).toEqual([210000, 246000, 328000]);
    expect(thresholds('family', 3)).toEqual([213000, 249000, 331000]);
    expect(thresholds('singleParent', 2)).toEqual([211500, 247500, 329500]);
  });
  it('tier boundaries are inclusive', () => {
    expect(tierOf(105000, 'single')).toBe(0);
    expect(tierOf(105001, 'single')).toBe(1);
    expect(tierOf(123000, 'single')).toBe(1);
    expect(tierOf(123001, 'single')).toBe(2);
    expect(tierOf(164000, 'single')).toBe(2);
    expect(tierOf(164001, 'single')).toBe(3);
    expect(tierOf(328001, 'couple')).toBe(3);
  });
  it('ATO example "Tom": 90,000 taxable income + 27,000 fringe benefits = 117,000, tier 1, 1,170', () => {
    const m = mls({ status: 'single', you: { mlsIncome: 117000, base: 117000 } });
    expect(m.tier).toBe(1);
    expect(m.total).toBeCloseTo(1170, 6);
  });
  it('ATO example "Josh" logic: the rate falls on taxable income + fringe benefits, not on investment losses', () => {
    const m = mls({ status: 'single', you: { mlsIncome: 127000, base: 110000 } });
    expect(m.tier).toBe(2);
    expect(m.total).toBeCloseTo(1375, 6);
  });
  it('part year: the surcharge is charged per day without cover (ATO "Michelle" formula, 262 / 365)', () => {
    const m = mls({ status: 'single', you: { mlsIncome: 110000 }, daysWithout: 262 });
    expect(m.total).toBeCloseTo(110000 * 0.01 * 262 / 365, 6);
  });
  it('couples: tier from combined income, each partner on their own income', () => {
    const m = mls({ status: 'couple', you: { mlsIncome: 180000 }, partner: { mlsIncome: 80000 } });
    expect(m.testIncome).toBe(260000);
    expect(m.tier).toBe(2);
    expect(m.you.amount).toBeCloseTo(2250, 6);
    expect(m.partner!.amount).toBeCloseTo(1000, 6);
  });
  it('a partner whose own income is at or under the spouse floor pays nothing', () => {
    const m = mls({ status: 'couple', you: { mlsIncome: 240000 }, partner: { mlsIncome: P.mls.spouseOwnIncomeFloor.value } });
    expect(m.partner!.liable).toBe(false);
    expect(m.you.liable).toBe(true);
  });
  it('ATO example "Jill and Kevin": 3 children, family threshold 202,000 + 2 x 1,500 in 2025-26; 210,000 + 3,000 in 2026-27', () => {
    expect(P.mls.prior.family[0] + 2 * P.mls.childIncrement).toBe(205000);
    expect(thresholds('family', 3)[0]).toBe(213000);
  });
  it('a single parent is tested on family thresholds with own income only', () => {
    const m = mls({ status: 'singleParent', children: 1, you: { mlsIncome: 150000 } });
    expect(m.total).toBe(0);
  });
});

describe('Private health insurance rebate (ATO, updated 22 June 2026; PHI 12/26)', () => {
  it('1 April 2026 to 31 March 2027', () => {
    expect(rebatePct(0, 40)).toBe(0.24118); expect(rebatePct(1, 40)).toBe(0.16079); expect(rebatePct(2, 40)).toBe(0.08038); expect(rebatePct(3, 40)).toBe(0);
    expect(rebatePct(0, 65)).toBe(0.28139); expect(rebatePct(1, 69)).toBe(0.20098); expect(rebatePct(2, 66)).toBe(0.12058);
    expect(rebatePct(0, 70)).toBe(0.32158); expect(rebatePct(1, 80)).toBe(0.24118); expect(rebatePct(2, 75)).toBe(0.16079);
  });
  it('ATO example "Rebecca": 200 of eligible premium at 24.288 % = 49 (rounded), nothing on the 20 of loading', () => {
    const p = netPremium(200, rebatePct(0, 40, 'previous'), 0.1);
    expect(Math.round(p.rebate)).toBe(49);
    expect(p.loading).toBeCloseTo(20, 6);
  });
  it('2027 proposal: everyone on the under-65 row', () => {
    expect(rebatePct(0, 72, 'proposal2027')).toBe(0.24118);
    expect(rebatePct(2, 66, 'proposal2027')).toBe(0.08038);
  });
});

describe('Lifetime Health Cover (PrivateHealth.gov.au examples)', () => {
  it('Lukas 41 never covered: 22 %; Noor 0 %; couple 11 %', () => {
    expect(lhcLoading(41)).toBeCloseTo(0.22, 9);
    expect(policyLoading([lhcLoading(41), 0])).toBeCloseTo(0.11, 9);
  });
  it('Shona, 39 on the 1 July before joining: 18 %; Sonja 36: 12 %; Chloe 31: 2 %', () => {
    expect(lhcLoading(39)).toBeCloseTo(0.18, 9);
    expect(lhcLoading(36)).toBeCloseTo(0.12, 9);
    expect(lhcLoading(31)).toBeCloseTo(0.02, 9);
  });
  it('30 or under: nothing; cap 70 % from 65', () => {
    expect(lhcLoading(30)).toBe(0); expect(lhcLoading(25)).toBe(0);
    expect(lhcLoading(65)).toBeCloseTo(0.7, 9); expect(lhcLoading(90)).toBeCloseTo(0.7, 9);
  });
  it('dependent with a disability averaged over three adults: 6 % gives 2 %', () => {
    expect(policyLoading([0.06, 0, 0])).toBeCloseTo(0.02, 9);
  });
  it('days of absence tool: Wei 1114 days gives 2 %, Haruki about 3.3 years past the 1094 days gives 8 %', () => {
    expect(runTool('absence', { gap: 1114, cur: 0 }).value).toMatch(/^2/);
    expect(runTool('absence', { gap: 1094 + 1195, cur: 0 }).value).toMatch(/^8/);
    expect(runTool('absence', { gap: 1069, cur: 4 }).value).toMatch(/25 days/);
  });
  it('loading over 10 years at a flat premium', () => { expect(loadingCost(1000, 0.1)).toBeCloseTo(1000, 6); });
});

describe('premiums file (PrivateHealth.gov.au, data.gov.au)', () => {
  it('every state and cover type has a cheapest policy that avoids the surcharge, within the excess limits', () => {
    for (const r of REGIONS) for (const s of ['single', 'couple', 'singleParent', 'family'] as const) {
      const c = cell(r, s);
      expect(c.n, `${r} ${s}`).toBeGreaterThan(0);
      expect(c.cheapest.monthly).toBeGreaterThan(20);
      expect(c.cheapest.monthly).toBeLessThanOrEqual(c.median);
      expect(c.cheapest.excess).toBeLessThanOrEqual(P.mls.excessLimit.single);
      expect(c.cheapest.excessPolicy).toBeLessThanOrEqual(P.mls.excessLimit.other);
    }
    expect(PREM.release).toBe('2026-10-01');
  });
  it('compare: single 130,000 in NSW, tier 2: surcharge 1,625 against the cheapest policy after the 8.038 % rebate', () => {
    const r = compare({ status: 'single', you: { mlsIncome: 130000 }, region: 'NSW', oldest: 35, loading: 0 });
    expect(r.mls.total).toBeCloseTo(1625, 6);
    const gross = cell('NSW', 'single').cheapest.monthly * 12;
    expect(r.premium.net).toBeCloseTo(gross * (1 - 0.08038), 6);
  });
  it('break-even income sits above the threshold', () => {
    const be = breakEven({ status: 'single', region: 'NSW', oldest: 35, loading: 0 })!;
    expect(be).toBeGreaterThan(105000);
    const at = compare({ status: 'single', you: { mlsIncome: be }, region: 'NSW', oldest: 35, loading: 0 });
    expect(at.coverCheaper).toBe(true);
  });
  it('days from months', () => { expect(daysFromMonths(12)).toBe(365); expect(daysFromMonths(0)).toBe(0); });
});

describe('every calculator runs on its defaults with real numbers', () => {
  for (const k of TOOL_KINDS) it(k, () => {
    const o = runTool(k);
    expect(o.value).not.toMatch(/NaN|undefined|Infinity/);
    for (const r of o.rows) expect(r[1]).not.toMatch(/NaN|undefined|Infinity/);
  });
});
