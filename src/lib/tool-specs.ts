/**
 * The calculators of the site, one entry per subject. Every figure comes from the engine
 * (src/lib/engine/cover.ts), which reads params-2026.json and premiums.json.
 * A spec lists its inputs (visible first, `adv` ones folded, `show` for fields that depend on another)
 * and a pure `run` that returns a result card.
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatPercent, formatNumber } from './format';
import {
  mls, compare, breakEven, ageBand, rebatePct, lhcLoading, policyLoading, cell, netPremium, thresholds, tierOf, mlsRate, loadingCost, daysFromMonths,
  REGIONS, REGION_SHORT, STATUS_NAMES, TIER_NAMES, AGE_BANDS, HOSPITAL_TIERS, tierLabel, DAYS, PREMIUMS,
  type Status, type Region, type Tier,
} from './engine/cover';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const usd2 = (x: number) => formatMoney(x, 2);
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const st = (v: V) => s(v, 'st') as Status;
const rg = (v: V) => s(v, 'rg') as Region;
const couple = (v: V) => st(v) === 'couple' || st(v) === 'family';
const withKids = (v: V) => st(v) === 'family' || st(v) === 'singleParent';

/* ---------- shared inputs ---------- */
const STATUS_OPTS: Opt[] = (Object.keys(STATUS_NAMES) as Status[]).map((k) => ({ value: k, label: STATUS_NAMES[k] }));
const statusIn = (def: Status = 'single'): Input => ({ kind: 'select', id: 'st', label: 'Your situation on 30 June', def, options: STATUS_OPTS });
const kidsIn = (def = 2): Input => ({ id: 'ch', label: 'Dependent children', def, unit: 'kids', max: 15, help: 'Under 21, or 21 to 24 in full-time study', show: withKids });
const incIn = (def = 130000, label = 'Your income for MLS purposes', help: string | undefined = 'Taxable income plus fringe benefits, super contributions, investment losses'): Input => ({ id: 'inc', label, def, unit: '$', max: 5000000, ...(help ? { help } : {}) });
const pincIn = (def = 70000): Input => ({ id: 'pinc', label: "Partner's income for MLS purposes", def, unit: '$', max: 5000000, show: couple });
const REGION_OPTS: Opt[] = REGIONS.map((r) => ({ value: r, label: REGION_SHORT[r] }));
const regionIn = (def: Region = 'NSW', adv = false): Input => ({ kind: 'select', id: 'rg', label: 'State or territory', def, options: REGION_OPTS, adv });
const ageIn = (def = 35, adv = false): Input => ({ id: 'age', label: 'Age of the oldest person covered', def, unit: 'yrs', max: 120, help: 'Sets the rebate band: under 65, 65 to 69, 70 or over', adv });
const lhcIn = (def = 0, adv = false): Input => ({ id: 'lhc', label: 'Lifetime Health Cover loading', def, unit: '%', max: 70, decimals: 1, help: '0 % if you have held hospital cover since 31', adv });
const premIn = (): Input => ({ id: 'prem', label: 'Your own monthly premium (0 = cheapest)', def: 0, unit: '$', max: 5000, decimals: 2, adv: true, help: 'Full premium before rebate, as printed on the quote' });
const notSurchargedIn = (): Input => ({ id: 'nb', label: 'Of which super contributions and investment losses', def: 0, unit: '$', max: 5000000, adv: true, help: 'Counted for the tier, not charged at the rate' });
const monthsIn = (def = 12): Input => ({ id: 'mo', label: 'Months without hospital cover', def, unit: 'mths', max: 12, adv: true });

const persons = (v: V) => ({
  status: st(v), children: n(v, 'ch'),
  you: { mlsIncome: n(v, 'inc'), base: Math.max(0, n(v, 'inc') - n(v, 'nb')) },
  partner: couple(v) ? { mlsIncome: n(v, 'pinc') } : undefined,
});
const thrText = (v: V) => { const t = thresholds(st(v), n(v, 'ch')); return `${usd(t[0])} / ${usd(t[1])} / ${usd(t[2])}`; };
const cheapestLine = (r: Region, sx: Status) => { const c = cell(r, sx).cheapest; return `${c.fund}, ${c.product} (${tierLabel(c.tier)}, ${usd(c.excess)} excess)`; };

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Home: the surcharge without cover against the cheapest policy that avoids it */
  cover: () => ({
    inputs: [statusIn('single'), incIn(130000), pincIn(70000), kidsIn(2), regionIn('NSW'), ageIn(35), lhcIn(0, true), premIn(), notSurchargedIn(), monthsIn(12)],
    run: (v) => {
      const r = compare({ ...persons(v), daysWithout: daysFromMonths(n(v, 'mo')), region: rg(v), oldest: n(v, 'age'), loading: n(v, 'lhc') / 100, monthlyPremium: n(v, 'prem') });
      const m = r.mls, own = n(v, 'prem') > 0;
      const be = breakEven({ ...persons(v), region: rg(v), oldest: n(v, 'age'), loading: n(v, 'lhc') / 100, monthlyPremium: n(v, 'prem') }, 500);
      const rows: Array<[string, string, number?]> = [
        [`Income tested: ${usd(m.testIncome)}`, `${TIER_NAMES[m.tier]}, ${pct(m.rate, 2)}`],
        ['Surcharge without cover, you', usd(m.you.amount), m.you.amount],
        ...(m.partner ? [['Surcharge without cover, partner', usd(m.partner.amount), m.partner.amount] as [string, string, number]] : []),
        [own ? 'Your policy, full premium' : 'Cheapest exempt policy, full premium', usd(r.premium.gross), r.premium.gross],
        [`Rebate (${pct(r.premium.rebatePct, 3)})`, `-${usd(r.premium.rebate)}`],
        ...(r.premium.loading > 0 ? [[`LHC loading (${pct(r.premium.loadingPct, 0)}), no rebate`, `+${usd(r.premium.loading)}`] as [string, string]] : []),
        ['Net cost of the policy', usd(r.premium.net), r.premium.net],
        ['Income from which cover is cheaper', be === null ? 'none under $1M' : usd(be)],
      ];
      if (m.total === 0) return { label: 'Medicare levy surcharge, 2026-27', value: usd(0), sub: `No surcharge: ${m.you.why}. Hospital cover is then a health choice, not a tax one; it would cost ${usd(r.premium.net)} a year after the rebate.`, rows };
      return {
        label: r.coverCheaper ? 'The cheapest exempt cover costs less than the surcharge by' : 'Paying the surcharge costs less than the cheapest cover by',
        value: usd(Math.abs(r.saving)),
        sub: `Surcharge ${usd(m.total)} against ${usd(r.premium.net)} of cover${own ? ' (your premium)' : `: ${cheapestLine(rg(v), st(v))}, ${usd2(r.policy.monthly)} a month before rebate`}.`,
        rows,
        note: `Premiums: PrivateHealth.gov.au file of ${PREMIUMS.release}, ${formatNumber(cell(rg(v), st(v)).n)} open policies that avoid the surcharge for this cover type in ${REGION_SHORT[rg(v)]}. Premiums change on 1 April 2027.`,
      };
    },
  }),
  /* The surcharge alone, with the split between partners */
  mls: () => ({
    inputs: [statusIn('single'), incIn(120000), pincIn(90000), kidsIn(2), notSurchargedIn(), monthsIn(12)],
    run: (v) => {
      const m = mls({ ...persons(v), daysWithout: daysFromMonths(n(v, 'mo')) });
      return {
        label: 'Medicare levy surcharge, 2026-27', value: usd(m.total),
        sub: m.tier === 0 ? `Under the ${couple(v) || withKids(v) ? 'family' : 'single'} threshold of ${usd(m.thresholds[0])}: no surcharge.` : `${TIER_NAMES[m.tier]} rate of ${pct(m.rate, 2)} on ${m.days} days without cover.`,
        rows: [
          ['Income tested for the tier', usd(m.testIncome), m.testIncome],
          ['Thresholds (base / tier 1 / tier 2)', thrText(v)],
          ['You', `${usd(m.you.amount)} on ${usd(m.you.base)}`],
          ...(m.partner ? [['Partner', m.partner.liable ? `${usd(m.partner.amount)} on ${usd(m.partner.base)}` : 'not liable'] as [string, string]] : []),
        ],
        note: m.partner && !m.partner.liable && m.tier > 0 ? `A partner whose own income for MLS purposes is ${usd(P.mls.spouseOwnIncomeFloor.value)} or less pays no surcharge (${P.mls.spouseOwnIncomeFloor.year} figure; the ${P.incomeYear} one is not yet published).` : undefined,
      };
    },
  }),
  /* Which tier, which surcharge rate and which rebate */
  tier: () => ({
    inputs: [statusIn('single'), { id: 'inc', label: 'Income for MLS purposes (combined for a couple)', def: 115000, unit: '$', max: 5000000 }, kidsIn(2)],
    run: (v) => {
      const t = tierOf(n(v, 'inc'), st(v), n(v, 'ch')), th = thresholds(st(v), n(v, 'ch'));
      const next = t < 3 ? th[t] + 1 - n(v, 'inc') : 0;
      return {
        label: `Your 2026-27 tier`, value: TIER_NAMES[t],
        sub: t < 3 ? `${usd(next)} more income moves you to ${TIER_NAMES[t + 1]}.` : 'The top tier: 1.5 % surcharge and no rebate.',
        rows: [['Surcharge rate without cover', pct(mlsRate(t), 2)], ...AGE_BANDS.map((a, i) => [`Rebate, oldest ${a}`, pct(rebatePct(t, [40, 67, 72][i]), 3)] as [string, string]), ['Thresholds (base / tier 1 / tier 2)', thrText(v)]],
      };
    },
  }),
  /* The rebate in dollars on a premium */
  rebate: () => ({
    inputs: [statusIn('single'), { id: 'inc', label: 'Income for surcharge purposes (combined for a couple)', def: 95000, unit: '$', max: 5000000 }, { id: 'gp', label: 'Full yearly premium before rebate', def: 2400, unit: '$', max: 60000 }, ageIn(40), kidsIn(2), lhcIn(0, true)],
    run: (v) => {
      const t = tierOf(n(v, 'inc'), st(v), n(v, 'ch')), r = rebatePct(t, n(v, 'age')), p = netPremium(n(v, 'gp'), r, n(v, 'lhc') / 100);
      return {
        label: 'Private health insurance rebate, per year', value: usd(p.rebate),
        sub: `${pct(r, 3)}: ${TIER_NAMES[t]}, oldest person ${AGE_BANDS[ageBand(n(v, 'age'))]}, rates of 1 April 2026 to 31 March 2027.`,
        rows: [['Full premium', usd(p.gross), p.gross], ['Rebate', `-${usd(p.rebate)}`, p.rebate], ...(p.loading > 0 ? [['LHC loading, no rebate on it', `+${usd(p.loading)}`, p.loading] as [string, string, number]] : []), ['You pay', usd(p.net), p.net], ['Per month', usd2(p.net / 12)]],
        note: t === 3 ? 'Tier 3: no rebate at any age.' : undefined,
      };
    },
  }),
  /* Lifetime Health Cover loading */
  lhc: () => ({
    inputs: [{ id: 'age', label: 'Your age on the 1 July before you join', def: 40, unit: 'yrs', max: 110, help: 'No hospital cover since your LHC base day' }, { id: 'page', label: "Partner's age on that 1 July (0 = single policy)", def: 0, unit: 'yrs', max: 110, help: 'Enter 30 for a partner covered since 31' }, regionIn('NSW')],
    run: (v) => {
      const mine = lhcLoading(n(v, 'age')), two = n(v, 'page') > 0, theirs = two ? lhcLoading(n(v, 'page')) : 0;
      const L = two ? policyLoading([mine, theirs]) : mine;
      const gross = cell(rg(v), two ? 'couple' : 'single').cheapest.monthly * 12;
      return {
        label: two ? 'Loading on your couple policy' : 'Your Lifetime Health Cover loading', value: pct(L, 0),
        sub: L === 0 ? 'No loading: you join by your base day, or you are 30 or under on the 1 July before joining.' : `${usd(gross * L)} a year on the cheapest policy in ${REGION_SHORT[rg(v)]}, for ${P.lhc.removedAfterYears} years of continuous cover.`,
        rows: [['Your own loading', pct(mine, 0)], ...(two ? [["Partner's loading", pct(theirs, 0)] as [string, string]] : []), ['Cheapest exempt policy, full premium', usd(gross), gross], ['Loading per year', usd(gross * L), gross * L], [`Over ${P.lhc.removedAfterYears} years at today's premium`, usd(loadingCost(gross, L))]],
        note: n(v, 'age') - P.lhc.freeUntilAge > 35 ? `Capped at ${pct(P.lhc.max, 0)}.` : undefined,
      };
    },
  }),
  /* The cost of waiting before joining */
  wait: () => ({
    inputs: [{ id: 'age', label: 'Your age on 1 July 2026', def: 31, unit: 'yrs', max: 100 }, { id: 'yrs', label: 'Years you wait before joining', def: 3, unit: 'yrs', max: 30 }, incIn(115000, 'Income for MLS purposes', ''), regionIn('NSW')],
    run: (v) => {
      const now = lhcLoading(n(v, 'age')), later = lhcLoading(n(v, 'age') + n(v, 'yrs'));
      const gross = cell(rg(v), 'single').cheapest.monthly * 12, t = tierOf(n(v, 'inc'), 'single');
      const mlsYear = mls({ status: 'single', you: { mlsIncome: n(v, 'inc') } }).total;
      const extra = loadingCost(gross, later) - loadingCost(gross, now);
      return {
        label: `Waiting ${n(v, 'yrs')} years costs you`, value: usd(extra + mlsYear * n(v, 'yrs')),
        sub: `Loading ${pct(now, 0)} if you join now, ${pct(later, 0)} after ${n(v, 'yrs')} years, plus the surcharge in the meantime at today's ${TIER_NAMES[t].toLowerCase()} rate.`,
        rows: [['Extra loading over the 10 loaded years', usd(extra), extra], [`Surcharge paid while you wait (${n(v, 'yrs')} years)`, usd(mlsYear * n(v, 'yrs')), mlsYear * n(v, 'yrs')], ['Premium saved meanwhile (net of rebate)', `-${usd(gross * (1 - rebatePct(t, n(v, 'age'))) * n(v, 'yrs'))}`]],
        note: 'Thresholds and premiums held at their 2026-27 level; both move every year.',
      };
    },
  }),
  /* Income at which cover becomes cheaper */
  breakeven: () => ({
    inputs: [statusIn('single'), regionIn('NSW'), pincIn(60000), kidsIn(2), ageIn(35), lhcIn(0)],
    run: (v) => {
      const x = { status: st(v), children: n(v, 'ch'), partner: couple(v) ? { mlsIncome: n(v, 'pinc') } : undefined, region: rg(v), oldest: n(v, 'age'), loading: n(v, 'lhc') / 100 };
      const be = breakEven(x);
      const th = thresholds(st(v), n(v, 'ch'));
      const at = be === null ? null : compare({ ...x, you: { mlsIncome: be } });
      return {
        label: couple(v) ? 'Your income from which cover is cheaper' : 'Income from which cover is cheaper', value: be === null ? 'none' : usd(be),
        sub: be === null ? 'With this loading, the cheapest cover never costs less than the surcharge under $1 million.' : `At that income the surcharge is ${usd(at!.mls.total)} and the cheapest exempt policy costs ${usd(at!.premium.net)} after the rebate.`,
        rows: [['Surcharge threshold', usd(th[0])], ['Cheapest policy, per month', usd2(cell(rg(v), st(v)).cheapest.monthly)], ['Median exempt policy, per month', usd2(cell(rg(v), st(v)).median)]],
      };
    },
  }),
  /* Joining part way through the year */
  partyear: () => ({
    inputs: [{ id: 'gone', label: 'Months already without cover since 1 July', def: 4, unit: 'mths', max: 12 }, statusIn('single'), incIn(125000, 'Your income for MLS purposes', ''), pincIn(70000), kidsIn(2), regionIn('NSW'), ageIn(35, true), lhcIn(0, true)],
    run: (v) => {
      const g = Math.min(12, n(v, 'gone')), x = { ...persons(v), region: rg(v), oldest: n(v, 'age'), loading: n(v, 'lhc') / 100 };
      const stay = mls({ ...x, daysWithout: DAYS }).total;
      const sofar = mls({ ...x, daysWithout: daysFromMonths(g) }).total;
      const rest = compare({ ...x, daysWithout: DAYS - daysFromMonths(g) }).premium.net;
      const join = sofar + rest;
      return {
        label: stay > join ? 'Joining now saves you' : 'Staying uncovered to 30 June costs less by', value: usd(Math.abs(stay - join)),
        sub: `Surcharge for the ${g} months already gone: ${usd(sofar)}. It cannot be undone; only the remaining ${12 - g} months are still yours to decide.`,
        rows: [['Stay uncovered to 30 June: surcharge', usd(stay), stay], ['Join now: surcharge so far', usd(sofar), sofar], [`Join now: cover for ${12 - g} months, after rebate`, usd(rest), rest], ['Join now: total', usd(join), join]],
      };
    },
  }),
  /* Building the income for MLS purposes */
  income: () => ({
    inputs: [{ id: 'ti', label: 'Taxable income', def: 98000, unit: '$', max: 5000000 }, { id: 'rfb', label: 'Reportable fringe benefits', def: 12000, unit: '$', max: 2000000, help: 'Grossed-up amount on your income statement' }, { id: 'sup', label: 'Reportable super contributions', def: 0, unit: '$', max: 500000, help: 'Reportable employer and deductible personal contributions' }, { id: 'inv', label: 'Net investment losses', def: 0, unit: '$', max: 2000000, help: 'Rental and financial investment losses' }, statusIn('single'), pincIn(0), kidsIn(1)],
    run: (v) => {
      const inc = n(v, 'ti') + n(v, 'rfb') + n(v, 'sup') + n(v, 'inv'), base = n(v, 'ti') + n(v, 'rfb');
      const m = mls({ status: st(v), children: n(v, 'ch'), you: { mlsIncome: inc, base }, partner: couple(v) ? { mlsIncome: n(v, 'pinc') } : undefined });
      return {
        label: 'Your income for MLS purposes', value: usd(inc),
        sub: m.tier === 0 ? `At or under the threshold of ${usd(m.thresholds[0])}: no surcharge, even without cover.` : `${TIER_NAMES[m.tier]}: the ${pct(m.rate, 2)} rate falls on ${usd(base)} of taxable income and fringe benefits, ${usd(m.you.amount)} a year without cover.`,
        rows: [['Taxable income', usd(n(v, 'ti')), n(v, 'ti')], ['Fringe benefits', `+${usd(n(v, 'rfb'))}`, n(v, 'rfb')], ['Super contributions', `+${usd(n(v, 'sup'))}`, n(v, 'sup')], ['Investment losses added back', `+${usd(n(v, 'inv'))}`, n(v, 'inv')], ['Surcharge without cover', usd(m.you.amount)]],
      };
    },
  }),
  /* The cheapest exempt policy in every state */
  states: () => ({
    inputs: [statusIn('single'), { kind: 'select', id: 'ht', label: 'Lowest hospital tier you would accept', def: 'any', options: [{ value: 'any', label: 'Any (Basic and up)' }, ...HOSPITAL_TIERS.slice(1).map((t) => ({ value: t, label: `${tierLabel(t)} and up` }))] }],
    run: (v) => {
      const from = s(v, 'ht') === 'any' ? 0 : HOSPITAL_TIERS.indexOf(s(v, 'ht') as (typeof HOSPITAL_TIERS)[number]);
      const ok = HOSPITAL_TIERS.slice(from);
      const best = (r: Region) => { const c = cell(r, st(v)); const opts = ok.map((t) => c.byTier[t] ? { t, ...c.byTier[t] } : null).filter((x): x is NonNullable<typeof x> => !!x); return opts.sort((a, b) => a.cheapest - b.cheapest)[0]; };
      const rows = REGIONS.map((r) => ({ r, b: best(r) })).filter((x) => x.b).sort((a, b) => a.b.cheapest - b.b.cheapest);
      return {
        label: `Cheapest ${s(v, 'ht') === 'any' ? '' : `${tierLabel(s(v, 'ht'))}-or-better `}exempt policy, ${STATUS_NAMES[st(v)].toLowerCase()}`, value: `${usd2(rows[0].b.cheapest)} a month`,
        sub: `In ${REGION_SHORT[rows[0].r]}, before the rebate and any loading. PrivateHealth.gov.au file of ${PREMIUMS.release}.`,
        rows: rows.slice(0, 3).map((x) => [REGION_SHORT[x.r], usd2(x.b.cheapest)] as [string, string]),
        table: { caption: 'Cheapest open hospital policy that avoids the surcharge, per month before rebate', headers: ['State or territory', 'Hospital tier', 'Insurer', 'Per month', 'Per year'], align: ['l', 'l', 'l', 'r', 'r'], rows: rows.map((x) => [REGION_SHORT[x.r], tierLabel(x.b.t), x.b.fund, usd2(x.b.cheapest), usd(x.b.cheapest * 12)]) },
      };
    },
  }),
  /* Rebate for people aged 65 or more: now and under the 2027 proposal */
  retiree: () => ({
    inputs: [{ id: 'age', label: 'Age of the oldest person covered', def: 68, unit: 'yrs', max: 120 }, { id: 'gp', label: 'Full yearly premium before rebate', def: 4200, unit: '$', max: 60000 }, statusIn('couple'), { id: 'inc', label: 'Income for surcharge purposes (combined for a couple)', def: 90000, unit: '$', max: 5000000 }, kidsIn(1)],
    run: (v) => {
      const t = tierOf(n(v, 'inc'), st(v), n(v, 'ch')), now = rebatePct(t, n(v, 'age')), next = rebatePct(t, n(v, 'age'), 'proposal2027');
      const d = n(v, 'gp') * (now - next);
      return {
        label: 'Extra cost per year if the 2027 rebate change passes', value: usd(d),
        sub: d > 0 ? `Rebate ${pct(now, 3)} today, ${pct(next, 3)} from 1 April 2027 under the bill before Parliament. Not law on ${P.retrieved_at}.` : 'No change for you: under 65, or tier 3, keeps the same rebate.',
        rows: [['Rebate today', usd(n(v, 'gp') * now), n(v, 'gp') * now], ['Rebate under the proposal', usd(n(v, 'gp') * next), n(v, 'gp') * next], ['Tier', TIER_NAMES[t]], ['Per month', usd2(d / 12)]],
      };
    },
  }),
  /* Days without Medicare entitlement (temporary residents, foreign residents) */
  visa: () => ({
    inputs: [{ id: 'ex', label: 'Days in 2026-27 with a Medicare levy exemption', def: 200, unit: 'days', max: 365, help: 'Medicare Entitlement Statement or foreign resident days' }, incIn(130000), statusIn('single'), pincIn(0), kidsIn(1)],
    run: (v) => {
      const ex = Math.min(DAYS, n(v, 'ex')), m = mls({ ...persons(v), daysWithout: DAYS - ex });
      return {
        label: 'Surcharge on the days you were not exempt', value: usd(m.total),
        sub: `${DAYS - ex} days without complying hospital cover and without an exemption. Overseas visitors cover (OVHC) does not stop the surcharge.`,
        rows: [['Exempt days', String(ex)], ['Days charged', String(DAYS - ex)], ['Tier', `${TIER_NAMES[m.tier]}, ${pct(m.rate, 2)}`], ['Full-year surcharge for comparison', usd(mls({ ...persons(v) }).total)]],
        note: 'The exemption needs every dependant, your spouse included, to be exempt too.',
      };
    },
  }),
  /* Excess limits for the surcharge */
  excess: () => ({
    inputs: [{ kind: 'select', id: 'who', label: 'The policy covers', def: 'one', options: [{ value: 'one', label: 'One person' }, { value: 'more', label: 'Two people or more' }] }, { id: 'xs', label: 'Yearly excess on the policy', def: 750, unit: '$', max: 20000 }],
    run: (v) => {
      const lim = s(v, 'who') === 'one' ? P.mls.excessLimit.single : P.mls.excessLimit.other, ok = n(v, 'xs') <= lim;
      return { label: 'Does this excess avoid the surcharge?', value: ok ? 'Yes' : 'No', sub: ok ? `At or under the ${usd(lim)} limit: the policy is an appropriate level of hospital cover.` : `Above the ${usd(lim)} limit: with income over the threshold you would still pay the surcharge.`,
        rows: [['Limit, policy for one person', usd(P.mls.excessLimit.single)], ['Limit, couple or family policy', usd(P.mls.excessLimit.other)], ['Your excess', usd(n(v, 'xs'))]] };
    },
  }),
  /* Days of absence: rejoining after a gap */
  absence: () => ({
    inputs: [{ id: 'gap', label: 'Days without hospital cover since your base day', def: 900, unit: 'days', max: 20000, help: 'Lifetime total; suspensions and time overseas excluded' }, { id: 'cur', label: 'Loading you had before the gap', def: 0, unit: '%', max: 70, decimals: 1 }, regionIn('NSW')],
    run: (v) => {
      const gap = n(v, 'gap'), left = P.lhc.daysOfAbsence - gap, cur = n(v, 'cur') / 100;
      const extraYears = left >= 0 ? 0 : Math.floor((gap - P.lhc.daysOfAbsence) / 365) + 1;
      const L = Math.min(P.lhc.max, cur + extraYears * P.lhc.perYear), gross = cell(rg(v), 'single').cheapest.monthly * 12;
      return {
        label: left >= 0 ? 'Days of absence you still have' : 'Your loading on rejoining (estimate)', value: left >= 0 ? `${formatNumber(left)} days` : pct(L, 0),
        sub: left >= 0 ? `Rejoin within ${formatNumber(left)} days and your loading stays at ${pct(cur, 0)}.` : `The ${formatNumber(P.lhc.daysOfAbsence)} days are used up: ${pct(P.lhc.perYear, 0)} on top of your old loading, plus ${pct(P.lhc.perYear, 0)} for each further year. Your insurer fixes the exact figure from the clearance certificate.`,
        rows: [['Lifetime allowance', `${formatNumber(P.lhc.daysOfAbsence)} days`], ['Used', `${formatNumber(gap)} days`], ['Loading on rejoining', pct(left >= 0 ? cur : L, 0)], ['Per year on the cheapest single policy', usd(gross * (left >= 0 ? cur : L))]],
      };
    },
  }),
  /* When the loading goes: ten continuous years */
  removal: () => ({
    inputs: [{ id: 'held', label: 'Years already held with the loading', def: 4, unit: 'yrs', max: 10, decimals: 1 }, { id: 'ld', label: 'Your loading', def: 20, unit: '%', max: 70, decimals: 1 }, statusIn('single'), regionIn('NSW')],
    run: (v) => {
      const left = Math.max(0, P.lhc.removedAfterYears - n(v, 'held')), L = n(v, 'ld') / 100, gross = cell(rg(v), st(v) === 'family' || st(v) === 'couple' ? 'couple' : st(v)).cheapest.monthly * 12;
      return {
        label: 'Loaded years still to go', value: `${formatNumber(left * 12)} months`,
        sub: left === 0 ? 'Ten continuous years done: the loading drops to 0 % while you keep your cover.' : `Keep your hospital cover without a break and the ${pct(L, 0)} loading stops after ${formatNumber(left * 12)} more months.`,
        rows: [['Loading per year, cheapest policy', usd(gross * L), gross * L], ['Still to pay at that rate', usd(gross * L * left), gross * L * left], ['Cancel now and rejoin later', 'the 10 years restart']],
      };
    },
  }),
  /* Medicare levy and surcharge together */
  levy: () => ({
    inputs: [{ id: 'ti', label: 'Taxable income', def: 140000, unit: '$', max: 5000000 }, statusIn('single'), pincIn(0), kidsIn(1), { kind: 'choice', id: 'hc', label: 'Hospital cover all year', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] } as Input],
    run: (v) => {
      const lev = n(v, 'ti') > P.medicareLevy.lowIncome2025.upper ? n(v, 'ti') * P.medicareLevy.rate : 0;
      const m = mls({ status: st(v), children: n(v, 'ch'), you: { mlsIncome: n(v, 'ti') }, partner: couple(v) ? { mlsIncome: n(v, 'pinc') } : undefined, daysWithout: s(v, 'hc') === 'yes' ? 0 : DAYS });
      return { label: 'Medicare levy and surcharge, 2026-27', value: usd(lev + m.you.amount), sub: `${pct(P.medicareLevy.rate, 0)} levy that almost everyone pays, plus ${s(v, 'hc') === 'yes' ? 'no surcharge: you hold hospital cover' : `${pct(m.rate, 2)} surcharge without hospital cover`}.`,
        rows: [['Medicare levy', usd(lev), lev], ['Medicare levy surcharge', usd(m.you.amount), m.you.amount], ['Share of taxable income', pct((lev + m.you.amount) / Math.max(1, n(v, 'ti')), 2)]],
        note: n(v, 'ti') <= P.medicareLevy.lowIncome2025.upper ? 'Low income: the levy may be reduced or nil (2025-26 thresholds; 2026-27 not yet published).' : undefined };
    },
  }),
};
/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: arg[i.id] } as typeof i))) };
}
/** Run a calculator with its defaults (or the values given), the way the page renders it. */
export function runTool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = resolve(spec.inputs, { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args });
  return spec.run(v);
}
export const TOOL_KINDS = Object.keys(SPECS);
export type { Tier };
