import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('NSW'), c = S.one, f = S.fam, P = K.P;
const fams = [[130000, 85000], [150000, 95000], [170000, 110000], [220000, 120000]];
const famAt = (a: number, b: number, m?: number) => S.vs(a, m, 'family', b, 42);
const t0 = K.thr('family', 2)[0];

export default definePage({
  id: 'state-nsw', group: 'state', order: 1, slug: 'cheapest-hospital-cover-nsw-act',
  nav: 'NSW and ACT', card: `From ${K.usd2(c.cheapest.monthly)} single, ${K.usd2(f.cheapest.monthly)} family, the same policies in the ACT.`,
  title: 'Hospital Cover NSW and ACT 2026: Family Cost vs the MLS',
  description: `Hospital cover in NSW and the ACT for 2026: cheapest family policy that avoids the surcharge ${K.usd2(f.cheapest.monthly)} a month pre-rebate, against what families pay without it.`,
  h1: 'Hospital cover in New South Wales and the ACT: what a family pays either way',
  intro: 'One price list serves Sydney and Canberra. Enter a household and see the surcharge without cover against the cheapest family policy.',
  resume: `Residents of New South Wales and the Australian Capital Territory choose from the same hospital policies: the PrivateHealth.gov.au file of ${K.day(K.PREM.release)} lists no separate ACT prices, so the NSW premiums apply to both. The cheapest open policy that avoids the Medicare levy surcharge costs ${K.usd2(c.cheapest.monthly)} a month for one person and ${K.usd2(f.cheapest.monthly)} for a family, before the rebate, from ${f.cheapest.fund}. A family with two dependent children is tested on the combined income of both parents against ${K.usd(t0)} in ${P.incomeYear}, the ${K.usd(P.mls.family[0])} family threshold plus ${K.usd(P.mls.childIncrement)} for the second child. Over that line each parent pays the surcharge on their own income. On a combined ${K.usd(245000)}, split ${K.usd(150000)} and ${K.usd(95000)}, the household pays ${K.usd(famAt(150000, 95000).mls.total)} without cover against ${K.usd(famAt(150000, 95000).premium.net)} for the cheapest family policy after the rebate.`,
  tool: 'cover',
  toolArg: { rg: 'NSW', st: 'family', ch: 2, inc: 150000, pinc: 95000, age: 42 },
  faqs: [
    { q: 'Do ACT residents pay the same hospital premiums as NSW?', a: `In the public product file, yes: it publishes prices by state and has no ACT list, and policies sold in the ACT appear under New South Wales. Our figures for NSW therefore stand for Canberra too. The surcharge and the rebate are federal, with the same thresholds and rates in both places.` },
    { q: 'How much does the cheapest family hospital policy cost in NSW?', a: `${K.usd2(f.cheapest.monthly)} a month before the rebate in the file of ${K.day(K.PREM.release)}, a Basic policy from ${f.cheapest.fund} with an excess of ${K.usd(f.cheapest.excessPolicy)} per policy. The median family policy that avoids the surcharge costs ${K.usd2(f.median)}. Families have ${K.num(f.n)} open policies to choose from in the state.` },
    { q: 'Does every child on the policy raise the family threshold?', a: `Every MLS dependent child after the first adds ${K.usd(P.mls.childIncrement)}. With one child the threshold stays at ${K.usd(P.mls.family[0])}; with three it is ${K.usd(K.thr('family', 3)[0])}. A child counts if under 21, or 21 to 24 and studying full time. A foster child is not an MLS dependant.` },
  ],
  body: (h) => `
<h2>Four households, same state</h2>
<p>Each row is a couple with two dependent children, the older parent aged 42 and no Lifetime Health Cover loading. The surcharge is the sum of what both parents would pay without cover; the policy figures are net of the rebate.</p>
${h.table(['Parent 1', 'Parent 2', 'Combined', 'Surcharge, household', 'Cheapest family policy', 'Median family policy'], fams.map(([a, b]) => { const x = famAt(a, b), m = famAt(a, b, f.median); return [K.usd(a), K.usd(b), K.usd(a + b), K.usd(x.mls.total), K.usd(x.premium.net), K.usd(m.premium.net)]; }), `NSW and ACT, ${P.incomeYear} thresholds with two children (${K.usd(t0)}, ${K.usd(K.thr('family', 2)[1])}, ${K.usd(K.thr('family', 2)[2])}), rebate of 1 April 2026.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The first household is just over the line and in tier 1, where the surcharge is ${K.pct(P.mls.rates[1], 0)} of each income and the rebate is still ${K.pct(K.reb(1, 42), 3)}. Even there, the cheapest family policy costs less than the tax. A policy at the median family price is another matter: it costs more than the surcharge on every row, although the gap shrinks as the tiers rise, to ${K.usd(famAt(220000, 120000, f.median).premium.net - famAt(220000, 120000).mls.total)} at the last one. At that row, in tier 3, the rebate is gone and the full family premium is paid.</p>
<p>That gap is the real choice for a Sydney or Canberra family. The cheapest policy is the cheapest way to settle the tax question. A fuller policy is a decision about health care, and the surcharge you avoid pays for part of it: on the second row, ${K.usd(famAt(150000, 95000).mls.total)} of the ${K.usd(famAt(150000, 95000, f.median).premium.net)} a median policy costs. The ${h.a('is-private-health-insurance-worth-it', 'worth it page')} sets out that reasoning, and the cover calculator above takes your own premium in its folded options.</p>
${h.mini('mls', { t: 'The household surcharge for your two incomes', p: ['inc', 'pinc'], d: { st: 'family', ch: 2, inc: 160000, pinc: 90000 }, c: 'Open the surcharge calculator' })}

<h2>When one parent earns little</h2>
<p>The combined test can catch a family where one parent stays at home. If the other earns ${K.usd(240000)} alone, the household is in tier 1 and that parent pays ${K.usd(K.mls({ status: 'family', children: 2, you: { mlsIncome: 240000 }, partner: { mlsIncome: 0 } }).you.amount)} without cover. The partner with an income for MLS purposes of ${K.usd(P.mls.spouseOwnIncomeFloor.value)} or less owes nothing (the ${P.mls.spouseOwnIncomeFloor.year} figure; the ${P.incomeYear} one is not published yet). Cover still has to include the whole family to stop the surcharge: a single policy for the earner leaves the household liable. The ${h.a('mls-families', 'families page')} goes through the dependants rules.</p>

<p>Children change the threshold, not the rate. A third child lifts the family line to ${K.usd(K.thr('family', 3)[0])}, a fourth to ${K.usd(K.thr('family', 4)[0])}. A child is an MLS dependant while under 21, or from 21 to 24 while studying full time, which is why families with older children should check who still counts before they read the table.</p>
<h2>The family price list in NSW</h2>
${h.table(['Tier', 'Cheapest from', 'Cheapest per month', 'Median per month', 'Policies'], S.tierRows('family'), 'Family cover, NSW and ACT, open insurers, excess within the surcharge limits, before the rebate.', ['l', 'l', 'r', 'r', 'r'])}
<p>The cheapest family policies cost twice the single ones, ${K.usd2(c.cheapest.monthly)} against ${K.usd2(f.cheapest.monthly)}, and the three cheapest are within a few dollars: ${f.cheapest.fund}, ${f.runnersUp[0].fund} at ${K.usd2(f.runnersUp[0].monthly)} and ${f.runnersUp[1].fund} at ${K.usd2(f.runnersUp[1].monthly)}. A single parent policy, for one adult and children, starts at ${K.usd2(S.sp.cheapest.monthly)}. Each of these is Basic tier: it avoids the surcharge, and its Private Health Information Statement says what else it pays for. Naming the cheapest policy reports a price, it is not a recommendation.</p>
<p>Sources: PrivateHealth.gov.au file of ${K.day(K.PREM.release)} on ${h.src('datagov_phi', 'data.gov.au')}, ${h.src('ato_mls_family', 'ATO rules on family and dependants')}, ${h.src('ato_mls_rates', 'thresholds and rates')}. ${h.a('method', 'How the figures are built')}.</p>
`,
  related: ['mls-families', 'state-vic', 'state-qld', 'mls-family-260000', 'compare-health-insurance'],
  sources: ['datagov_phi', 'ato_mls_family', 'ato_mls_rates', 'ato_rebate_rates'],
});
