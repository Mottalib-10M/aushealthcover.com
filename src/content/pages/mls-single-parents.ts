import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, D = P.dependants;
const F1 = K.thr('singleParent', 1), S = K.thr('single');
const sp = (inc: number, kids: number) => K.mls({ status: 'singleParent', children: kids, you: { mlsIncome: inc } });
const solo = (inc: number) => K.mls({ status: 'single', you: { mlsIncome: inc } });
const incomes = [120000, 170000, 211000, 230000, 260000];
const nsw = K.cell('NSW', 'singleParent'), wa = K.cell('WA', 'singleParent');
const ex = sp(230000, 2);
const edge = K.cmp({ status: 'singleParent', children: 1, you: { mlsIncome: F1[0] + 1000 }, region: 'NSW', oldest: 40, loading: 0 });

export default definePage({
  id: 'mls-single-parents', group: 'surcharge', order: 5, slug: 'mls-single-parents',
  nav: 'MLS for single parents', card: `Family tiers from ${K.usd(F1[0])} on your own income alone.`,
  title: 'MLS for Single Parents 2026-27: Family Tiers on One Income',
  description: `MLS for single parents in 2026-27: your own income is tested against the family threshold of ${K.usd(F1[0])}, plus ${K.usd(M.childIncrement)} per extra child, not the single one.`,
  h1: 'Medicare levy surcharge for single parents: the family line, one income',
  intro: 'Enter your income for MLS purposes and your dependent children: the tool tests you on the family threshold, as the rules do for a sole parent.',
  resume: `A single parent with at least one MLS dependent child is not tested on the single threshold of ${K.usd(S[0])}. PrivateHealth.gov.au states that single parents, like couples, are subject to the family tiers, and the M2 instructions list the exemption for a person who was single all year with a dependent child all year: no surcharge while income for MLS purposes stays at or under ${K.usd(F1[0])} for ${P.incomeYear}, plus ${K.usd(M.childIncrement)} for each dependent child after the first. Because there is no spouse, that line is compared with the parent's own income only, which gives a sole parent twice the room of a single person without children. A parent on ${K.usd(170000)} with one child pays nothing, where a single person on the same income would pay ${K.usd(solo(170000).total)} without cover. Above the family line the usual rates apply, ${K.pct(M.rates[1], 0)} to ${K.pct(M.rates[3], 1)}, on taxable income and fringe benefits, and every dependent child also needs hospital cover to avoid them.`,
  tool: 'mls',
  toolArg: { st: 'singleParent', inc: 230000, ch: 2 },
  faqs: [
    { q: 'Is a single parent taxed on the single or the family MLS threshold?', a: `On the family threshold. A person who was single for the whole year and had a dependent child for the whole year is exempt while their income for MLS purposes is at or under the family threshold, ${K.usd(F1[0])} for ${P.incomeYear} with one child and ${K.usd(M.childIncrement)} more for each further child. The parent's own income is the only one counted.` },
    { q: 'Does a child who lives with the other parent count for my surcharge threshold?', a: 'It can. When parents live apart, the ATO treats a child as an equal dependant of each parent, whatever the split of days in care, provided the child is a dependant of each of them. Paying child support counts as maintaining the child even if they live elsewhere. Unlike other Medicare levy rules, Family Tax Benefit Part A received by one parent does not change this.' },
    { q: 'What if I became a single parent part way through the year?', a: 'Then the single and family thresholds can both apply, each for its own period. The M2 instructions say that if you had a new spouse, separated, or became or ceased to be a sole parent during the year, you work out your liability separately for the days you were single, without spouse or child, and for the days you had a spouse or a dependent child.' },
    { q: 'What type of policy does a single parent need to avoid the surcharge?', a: `Hospital cover for yourself and your dependent children, usually a single parent policy, with an excess of no more than ${K.usd(M.excessLimit.other)} because it covers more than one person. In the October 2026 premium file the cheapest such policy in NSW and the ACT costs ${K.usd2(nsw.cheapest.monthly)} a month before the rebate, against ${K.usd2(K.cell('NSW', 'single').cheapest.monthly)} for a single policy.` },
  ],
  body: (h) => `
<h2>The same income, three situations</h2>
<p>The family line makes a large difference for a sole parent. The table compares a single person without children with a single parent of one and of three dependent children, at the same incomes for MLS purposes, without hospital cover for the whole of ${P.incomeYear}.</p>
${h.table(['Income for MLS purposes', 'Single, no children', 'Single parent, 1 child', 'Single parent, 3 children'], incomes.map((i) => [K.usd(i), K.usd(solo(i).total), K.usd(sp(i, 1).total), K.usd(sp(i, 3).total)]), `Surcharge for a full year without cover, no add-backs, ${P.incomeYear} thresholds.`, ['r', 'r', 'r', 'r'])}
<p>Between ${K.usd(S[0])} and ${K.usd(F1[0])} the single person pays and the single parent does not. Above the family line the parent pays the family tier rates on their own income: on ${K.usd(230000)} with two children, ${K.TN[ex.tier].toLowerCase()} at ${K.pct(ex.rate, 0)}, or ${K.usd(ex.total)} for the year.</p>

<h2>Which children count</h2>
<p>The child must be an Australian resident you contributed to maintaining, under ${D.childUnder}, or ${D.childUnder} to 24 and in full-time study. You maintain a child if you live together, give them food, clothing and lodging, help pay their living, medical or education costs, or pay child support for them, even when they do not live with you. A foster child does not count. A stepchild does, but a single parent by definition has no current spouse whose children could be counted.</p>
<p>The rule that surprises separated parents is the equal dependant rule. If the parents lived apart for all or part of the year and the child was a dependant of each, the ATO treats the child as an equal dependant of each parent, irrespective of the number of nights in each home. Receiving Family Tax Benefit Part A does not change that for the surcharge. Both parents may therefore use the family threshold, each on their own income.</p>
${h.mini('mls', { t: 'Test your own income', p: ['inc', 'ch'], d: { st: 'singleParent', inc: 215000, ch: 1 }, c: 'Open the single parent calculator' })}

<h2>Years with a change</h2>
<p>When you become or stop being a sole parent during the year, for example when a separation happens or a youngest child turns ${D.childUnder} and leaves study, the M2 instructions split the year. For days with a spouse or a dependent child, you are liable only if your own income for MLS purposes is above the family threshold and someone in the family lacked cover. For days with neither spouse nor child, the single threshold of ${K.usd(S[0])} applies. Your status on 30 June then decides whether your rate is read from the family tiers with combined income, if you had a spouse, or from the single tiers with your own income, if you were single.</p>
<p>On the return itself, the number of dependent children you had during the year goes at question IT8, label D, and the days for which you do not have to pay the surcharge at question M2, label A. The ATO uses both to choose the threshold. An older child who is covered as a dependant on your single parent policy is not liable for the surcharge personally, as long as they have no spouse or dependants of their own.</p>
<p>The calculator on this page assumes the same situation for the whole year. For a year with a change, run it twice, once per period, and keep the days of each.</p>

${h.box('An ex-partner is not a dependant', `<p>A former spouse to whom you pay maintenance or child support is not your dependant for MLS purposes. The children you support remain dependants, which is why the family threshold can still be yours after a separation even if the children live mostly with the other parent.</p>`)}

<h2>The price of avoiding it</h2>
<p>A single parent policy covers one adult and the children, and counts as a policy for more than one person, so its excess can go up to ${K.usd(M.excessLimit.other)} and still avoid the surcharge. In the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, ${K.num(nsw.n)} open single parent policies qualify in NSW and the ACT; the cheapest costs ${K.usd2(nsw.cheapest.monthly)} a month before the rebate and the median ${K.usd2(nsw.median)}. Western Australia is cheaper, from ${K.usd2(wa.cheapest.monthly)}. Just above the line, on ${K.usd(F1[0] + 1000)} with one child, the surcharge would be ${K.usd(edge.mls.total)} against ${K.usd(edge.premium.net)} for that cheapest NSW policy after the tier 1 rebate of ${K.pct(edge.premium.rebatePct, 3)}. The ${h.a('home', 'home calculator')} sets the two side by side for your state.</p>

<h2>Sources</h2>
<p>Family tiers for single parents: ${h.src('phio_mls', 'PrivateHealth.gov.au')}. Exemption categories and changes during the year: ${h.src('ato_m2')}. Equal dependants, maintenance, child support and foster children: ${h.src('ato_mls_family')}. Thresholds: ${h.src('ato_mls_rates')}.</p>
`,
  related: ['mls-families', 'mls-couples', 'mls-thresholds', 'mls-part-year-cover', 'income-for-mls-purposes'],
  sources: ['phio_mls', 'ato_m2', 'ato_mls_family', 'ato_mls_rates'],
});
