import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, A = 160000, B = 100000, KIDS = 2, T = A + B;
const fam = (a: number, b: number) => K.mls({ status: 'family', children: KIDS, you: { mlsIncome: a }, partner: { mlsIncome: b } });
const m = fam(A, B);
const floor = M.spouseOwnIncomeFloor;
const low = fam(T - floor.value, floor.value);
const lowAbove = fam(T - floor.value - 1000, floor.value + 1000);
const sp = K.mls({ status: 'singleParent', children: KIDS, you: { mlsIncome: T } });
const vic = K.cmp({ status: 'family', children: KIDS, you: { mlsIncome: A }, partner: { mlsIncome: B }, region: 'VIC', oldest: 42, loading: 0 });
const vicSp = K.cmp({ status: 'singleParent', children: KIDS, you: { mlsIncome: T }, region: 'VIC', oldest: 42, loading: 0 });
const gF = K.cell('VIC', 'family').cheapest.monthly * 12;

export default definePage({
  id: 'mls-family-260000', group: 'income', order: 6, slug: 'mls-family-260000',
  nav: 'Family on $260,000', card: `Tier 2 family: ${K.usd(m.total)} without cover, and the spouse floor.`,
  title: 'MLS for a Family on $260,000 in 2026-27: Spouse Floor',
  description: `Medicare levy surcharge for a family on $260,000 in 2026-27: tier 2 at ${K.pct(M.rates[2], 2)}, ${K.usd(m.total)} without cover, the low-income spouse rule and a single parent case.`,
  h1: 'Medicare levy surcharge for a family on $260,000: tier 2 and the spouse floor',
  intro: 'At $260,000 a family with two children is in tier 2. Change the split between partners in the calculator to see when the lower earner stops being liable.',
  resume: `A couple with two dependent children and a combined income for MLS purposes of ${K.usd(T)} in ${P.incomeYear} is past ${K.usd(m.thresholds[1])}, the top of the family tier 1 once the ${K.usd(M.childIncrement)} for the second child is added. That makes it a tier 2 household. The surcharge rate is ${K.pct(M.rates[2], 2)}, and each partner pays it on their own taxable income and reportable fringe benefits: with ${K.usd(A)} and ${K.usd(B)}, ${K.usd(m.you.amount)} and ${K.usd(m.partner!.amount)}, ${K.usd(m.total)} for a full year without hospital cover. The rebate on a family policy falls at this tier to ${K.pct(K.reb(2, 42), 3)} for a household whose oldest member is under 65. One rule changes the bill sharply here: a partner whose own income for MLS purposes is ${K.usd(floor.value)} or less is not liable at all (${floor.year} amount). In Victoria the cheapest exempt family policy costs ${K.usd(vic.premium.net)} a year after the rebate.`,
  tool: 'cover',
  toolArg: { st: 'family', inc: A, pinc: B, ch: KIDS, rg: 'VIC', age: 42 },
  faqs: [
    { q: 'What is the low-income spouse rule for the surcharge?', a: `If you had a spouse all year and your combined income is over the family threshold, you are still not liable if your own income for MLS purposes is ${K.usd(floor.value)} or less. That is the amount in the ATO's M2 instructions for 2026, which relate to ${floor.year}. Another ATO page still shows an older, lower amount, and no ${P.incomeYear} amount had been published when we checked.` },
    { q: 'Does a single parent on $260,000 pay more than a couple?', a: `A single parent is tested on the family thresholds against their own income, so ${K.usd(T)} with two children is tier 2 as well. With one earner the whole surcharge falls on one return: ${K.usd(sp.total)} without cover, the same total as the couple here, since the rate is the same on the same total income.` },
    { q: 'How much rebate does a tier 2 family get?', a: `${K.pct(K.reb(2, 42), 3)} of the premium when the oldest person on the policy is under 65, ${K.pct(K.reb(2, 67), 3)} from 65 to 69 and ${K.pct(K.reb(2, 72), 3)} from 70, for the rates of 1 April 2026 to 31 March 2027. On the cheapest Victorian family policy, ${K.usd(gF)} a year, the under 65 rate is worth about ${K.usd(gF * K.reb(2, 42))}.` },
  ],
  body: (h) => `
<h2>The spouse floor in numbers</h2>
${h.table(['Higher earner', 'Lower earner', 'Lower earner liable', 'Household surcharge'], [[A, B], [200000, 60000], [T - floor.value - 1000, floor.value + 1000], [T - floor.value, floor.value], [T, 0]].map(([a, b]) => { const x = fam(a, b); return [K.usd(a), K.usd(b), x.partner!.liable ? 'yes' : 'no', K.usd(x.total)]; }), `Couple with two dependent children, combined income ${K.usd(T)}, full year without hospital cover, ${P.incomeYear} thresholds, ${floor.year} spouse floor of ${K.usd(floor.value)}.`, ['r', 'r', 'l', 'r'])}
<p>Look at the two rows around the floor. With the lower earner at ${K.usd(floor.value + 1000)}, the household pays ${K.usd(lowAbove.total)}. With the lower earner at ${K.usd(floor.value)}, that partner is not liable and the household pays ${K.usd(low.total)}. The higher earner pays the same rate in both cases, on their own income; the floor only removes the lower earner's share. It does not move the household out of tier 2, because the tier is still set by the combined income.</p>
<p>The floor is the weak point of this page. The ATO's tax return instructions for 2026, last updated on 30 May 2026, give ${K.usd(floor.value)}; its page on paying the surcharge, updated earlier, still gives an older and lower amount. Neither is a ${P.incomeYear} figure. We use ${K.usd(floor.value)} and will replace it when the ATO publishes the amount for the income year.</p>

<h2>A single parent with the same income</h2>
<p>Single parents are tested on the family thresholds, with the extra ${K.usd(M.childIncrement)} per child after the first, but on their income alone. A single parent of two on ${K.usd(T)} is therefore in the same tier 2, and pays ${K.usd(sp.total)} without cover, all on one return. The policy that avoids it is a single parent policy, covering the parent and the children. In Victoria the cheapest exempt one costs ${K.usd(vicSp.premium.net)} a year after the rebate, against ${K.usd(vic.premium.net)} for a couple's family policy. The ${h.a('mls-single-parents', 'single parents page')} goes further into the single parent case.</p>
${h.mini('mls', { t: 'Move the split between partners', p: ['inc', 'pinc'], d: { st: 'family', ch: KIDS, inc: T - floor.value, pinc: floor.value }, c: 'Open the surcharge calculator' })}

<h2>Tier 2 for the household, tier 2 for the rebate</h2>
<p>Because the rebate uses the same tiers, this family's rebate is about half what it was at tier 1: ${K.pct(K.reb(2, 42), 3)} against ${K.pct(K.reb(1, 42), 3)}. A household that already holds cover and takes the rebate as a premium reduction should tell its insurer when the combined income crosses ${K.usd(m.thresholds[1] + 1)}; the ATO notes that claiming too much as a premium reduction may leave a tax liability at lodgment. Even at the lower rebate, the cheapest exempt family cover costs less than the household surcharge in every state at this income; the ${h.a('mls-family-230000', 'family $230,000 page')} has the state table for tier 1.</p>

<h2>The top of the family scale</h2>
<p>Tier 2 for this family runs to ${K.usd(m.thresholds[2])}. Above it, the rate becomes ${K.pct(M.rates[3], 1)} and there is no rebate at any age. The ${h.a('mls-families', 'families page')} gives the thresholds for any number of children, and the ${h.a('mls-thresholds', 'thresholds page')} the full table for ${P.incomeYear}. Those thresholds are set for each income year starting on 1 July, so a family whose income stays at ${K.usd(T)} should check its tier again when the next income year starts, and again on 1 April, when premiums and rebate percentages change. A comparison made today holds for the ${P.incomeYear} income year only, and is worth redoing with each new year's figures.</p>
`,
  related: ['mls-family-230000', 'mls-couples', 'mls-single-parents', 'mls-families', 'mls-thresholds', 'private-health-insurance-rebate'],
  sources: ['ato_m2', 'ato_mls_paying', 'ato_mls_rates', 'ato_mls_family', 'ato_rebate_rates', 'datagov_phi'],
});
