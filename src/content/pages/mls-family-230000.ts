import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, A = 140000, B = 90000, KIDS = 2;
const fam = (a: number, b: number, kids = KIDS) => K.mls({ status: 'family', children: kids, you: { mlsIncome: a }, partner: { mlsIncome: b } });
const m = fam(A, B);
const cmp = (r: (typeof K.REGIONS)[number]) => K.cmp({ status: 'family', children: KIDS, you: { mlsIncome: A }, partner: { mlsIncome: B }, region: r, oldest: 40, loading: 0 });
const nsw = cmp('NSW'), wa = cmp('WA');
const floor = M.spouseOwnIncomeFloor;
const avgL = K.avgLoad([K.lhc(40), 0]);
const loadedN = K.cmp({ status: 'family', children: KIDS, you: { mlsIncome: A }, partner: { mlsIncome: B }, region: 'NSW', oldest: 40, loading: avgL });
const splits: Array<[number, number]> = [[115000, 115000], [A, B], [180000, 50000], [200000, 30000], [230000 - floor.value, floor.value]];

export default definePage({
  id: 'mls-family-230000', group: 'income', order: 5, slug: 'mls-family-230000',
  nav: 'Family on $230,000', card: `Tier 1 family with two children: ${K.usd(m.total)} without cover, shared by income.`,
  title: 'MLS for a Family on $230,000 in 2026-27: Tier 1 Split by Two',
  description: `Medicare levy surcharge for a family on $230,000 with two children in 2026-27: tier 1, ${K.usd(m.total)} without cover split by own income, against family cover by state.`,
  h1: 'Medicare levy surcharge for a family on $230,000: one tier, two bills',
  intro: 'Enter each partner\'s income and the number of children: the calculator tests the family threshold on the total, then charges each partner on their own income.',
  resume: `A couple with two dependent children and a combined income for MLS purposes of ${K.usd(A + B)} in ${P.incomeYear} is above the family threshold, which is ${K.usd(M.family[0])} plus ${K.usd(M.childIncrement)} for the second child, ${K.usd(m.thresholds[0])} in all. That puts the household in tier 1, where the surcharge rate is ${K.pct(M.rates[1], 0)}. The rate is not charged on the household total. Each partner pays it on their own taxable income and reportable fringe benefits, for the days the family was not covered: with ${K.usd(A)} and ${K.usd(B)}, that is ${K.usd(m.you.amount)} and ${K.usd(m.partner!.amount)}, ${K.usd(m.total)} together. To avoid it, the policy must cover both partners and both children. The cheapest exempt family policy in New South Wales costs ${K.usd(nsw.premium.net)} a year after the tier 1 rebate of ${K.pct(K.reb(1, 40), 3)}, ${nsw.coverCheaper ? `${K.usd(nsw.saving)} less than` : `${K.usd(-nsw.saving)} more than`} the two surcharges, in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}.`,
  tool: 'cover',
  toolArg: { st: 'family', inc: A, pinc: B, ch: KIDS, rg: 'NSW', age: 40 },
  faqs: [
    { q: 'Does each partner pay the surcharge on the family income?', a: `No. The family income only decides the tier. Each partner then pays the tier rate on their own taxable income and reportable fringe benefits. A family on ${K.usd(A + B)} split ${K.usd(A)} and ${K.usd(B)} pays ${K.usd(m.you.amount)} on one return and ${K.usd(m.partner!.amount)} on the other, if nobody was covered all year.` },
    { q: 'How many children raise the family threshold?', a: `Every MLS dependent child after the first adds ${K.usd(M.childIncrement)}. With one child the ${P.incomeYear} threshold is ${K.usd(M.family[0])}, with two ${K.usd(K.thr('family', 2)[0])}, with three ${K.usd(K.thr('family', 3)[0])}. A child counts if under ${P.dependants.childUnder}, or under ${P.dependants.studentUnder} and a full-time student. A foster child does not count.` },
    { q: 'What if one partner earns very little?', a: `A partner whose own income for MLS purposes is ${K.usd(floor.value)} or less is not liable, even when the family total is over the threshold (${floor.year} figure from the ATO's M2 instructions; the ${P.incomeYear} amount is not yet published). The other partner still pays on their own income.` },
  ],
  body: (h) => `
<h2>Same total, different split</h2>
${h.table(['Partner A', 'Partner B', 'Surcharge A', 'Surcharge B', 'Household'], splits.map(([a, b]) => { const x = fam(a, b); return [K.usd(a), K.usd(b), K.usd(x.you.amount), x.partner!.liable ? K.usd(x.partner!.amount) : 'not liable', K.usd(x.total)]; }), `Couple with two dependent children, combined income ${K.usd(A + B)}, tier 1, full year without hospital cover, ${P.incomeYear}.`, ['r', 'r', 'r', 'r', 'r'])}
<p>As long as both partners are liable, the household pays the same ${K.usd(m.total)} however the income is shared, because ${K.pct(M.rates[1], 0)} of each part adds up to ${K.pct(M.rates[1], 0)} of the whole. The split only matters at the bottom, when one partner's own income for MLS purposes falls to ${K.usd(floor.value)} or less: that partner drops out and the household bill falls by their share. The ${h.a('mls-couples', 'couples page')} covers spouses for part of the year and separations.</p>

<h2>Family cover state by state</h2>
${h.table(['State or territory', 'Household surcharge', 'Cheapest family policy, full premium', 'After the tier 1 rebate', 'Difference'], K.REGIONS.map((r) => { const c = cmp(r); return [K.RS[r], K.usd(c.mls.total), K.usd(c.premium.gross), K.usd(c.premium.net), c.coverCheaper ? `cover ${K.usd(c.saving)} cheaper` : `surcharge ${K.usd(-c.saving)} cheaper`]; }), `Oldest person on the policy aged 40, no loading. PrivateHealth.gov.au file of ${K.day(K.PREM.release)}; the ACT buys the NSW policies.`, ['l', 'r', 'r', 'r', 'l'])}
<p>The margin is narrow in the eastern states and wide in the west and north: in Western Australia the cheapest family policy costs ${K.usd(wa.premium.net)} after the rebate. Family policies cost about twice a single one, while the household surcharge here comes from two incomes, which is why cover tends to win once both partners are liable.</p>
${h.mini('mls', { t: 'Your household surcharge', p: ['st', 'inc', 'pinc', 'ch'], d: { st: 'family', inc: A, pinc: B, ch: KIDS }, c: 'Open the surcharge calculator' })}

<h2>Everyone on the policy, or the surcharge</h2>
<p>PrivateHealth.gov.au is explicit: a family whose combined income is above the family threshold must hold hospital cover for both partners and their dependants, and if the partner or one dependant is not covered, the surcharge is payable. A family policy does that in one contract. A child who is covered as a dependant on the family policy is not liable for the surcharge, provided they have no spouse or dependants of their own. The ${h.a('mls-families', 'families page')} explains who counts as a dependant, including students up to ${P.dependants.studentUnder - 1}.</p>

<h2>When one partner joins late: the averaged loading</h2>
<p>On a couple or family policy the Lifetime Health Cover loading is the average of the adults' own loadings. If one partner first takes out hospital cover at 40, with a ${K.pct(K.lhc(40), 0)} loading, and the other has held cover since their twenties, the family policy carries ${K.pct(avgL, 0)}. In New South Wales that brings the cheapest family policy to ${K.usd(loadedN.premium.net)} a year after the rebate, against ${K.usd(loadedN.mls.total)} of household surcharge, since the rebate is not paid on the loading. Children do not add to the average, unless a dependant with a disability carries a loading of their own, as in the Ombudsman's example of Lucy. The ${h.a('lifetime-health-cover-loading', 'loading page')} has the Ombudsman's examples.</p>

<h2>What the children change</h2>
<p>Each child after the first lifts the family thresholds by ${K.usd(M.childIncrement)}. At ${K.usd(A + B)} that does not change the tier for this family: with three children the base threshold would be ${K.usd(K.thr('family', 3)[0])}, still well below the combined income. It matters for families a few thousand dollars over the line. A child stops counting at ${P.dependants.childUnder}, or at ${P.dependants.studentUnder} for a full-time student, and from then on no longer raises the threshold. The insurance rules are separate: insurers may keep adult children on a family policy up to ${P.dependants.policyDependantMaxAge}, depending on their own rules.</p>

<h2>Close to the next tier</h2>
<p>Tier 1 for this family ends at ${K.usd(m.thresholds[1])}. Above it the rate is ${K.pct(M.rates[2], 2)} and the rebate falls to ${K.pct(K.reb(2, 40), 3)}. The ${h.a('mls-family-260000', 'family $260,000 page')} shows that case.</p>
`,
  related: ['mls-family-260000', 'mls-families', 'mls-couples', 'mls-single-parents', 'mls-thresholds', 'compare-health-insurance'],
  sources: ['ato_mls_rates', 'ato_mls_family', 'ato_m2', 'phio_mls', 'datagov_phi'],
});
