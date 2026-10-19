/** Shared computations for the seven state pages (files starting with _ are not pages). Figures only, no prose. */
import { KIT as K } from '../../lib/kit';
import type { Region, Status } from '../../lib/engine/cover';

export const st = (r: Region) => {
  const one = K.cell(r, 'single'), two = K.cell(r, 'couple'), sp = K.cell(r, 'singleParent'), fam = K.cell(r, 'family');
  const tiers = K.HT.filter((t) => one.byTier[t]);
  /** Single, age 35, no loading: surcharge vs net cost of the cheapest policy of a given monthly price. */
  const vs = (inc: number, monthly?: number, s: Status = 'single', partner?: number, oldest = 35, loading = 0) =>
    K.cmp({ status: s, children: 2, you: { mlsIncome: inc }, partner: partner === undefined ? undefined : { mlsIncome: partner }, region: r, oldest, loading, monthlyPremium: monthly });
  /** Break-even income for a single at a given monthly premium (null when never under $1M). */
  const be = (monthly: number, oldest = 35, loading = 0) => K.be({ status: 'single', region: r, oldest, loading, monthlyPremium: monthly }, 500);
  const tierRows = (s: Status = 'single') => { const c = K.cell(r, s); return K.HT.filter((t) => c.byTier[t]).map((t) => [K.tl(t), c.byTier[t].fund, K.usd2(c.byTier[t].cheapest), K.usd2(c.byTier[t].median), String(c.byTier[t].n)]); };
  const nat = K.REGIONS.map((x) => ({ r: x, m: K.cell(x, 'single').cheapest.monthly })).sort((a, b) => a.m - b.m);
  const rank = nat.findIndex((x) => x.r === r) + 1;
  return { one, two, sp, fam, tiers, vs, be, tierRows, rank, nat };
};
