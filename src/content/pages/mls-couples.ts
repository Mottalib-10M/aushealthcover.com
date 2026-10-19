import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, R = M.rates;
const F = K.thr('couple'), S = K.thr('single');
const floor = M.spouseOwnIncomeFloor;
const pair = (a: number, b: number) => K.mls({ status: 'couple', you: { mlsIncome: a }, partner: { mlsIncome: b } });
const splits: Array<[number, number]> = [[125000, 125000], [160000, 90000], [200000, 50000], [250000 - floor.value, floor.value]];
const ex = pair(180000, 75000);
const solo = K.mls({ status: 'single', you: { mlsIncome: 180000 } });
/** ATO M2 examples, 2025-26 thresholds and rates. */
const michelle = 102000 * R[1] * 262 / 365;
const alice = 142000 * R[2] * 200 / 365;

export default definePage({
  id: 'mls-couples', group: 'surcharge', order: 3, slug: 'mls-couples',
  nav: 'MLS for couples', card: `Tier from combined income over ${K.usd(F[0])}, each partner billed on their own income.`,
  title: 'MLS for Couples 2026-27: Combined Income, Separate Bills',
  description: `MLS for couples in 2026-27: the tier comes from combined income against ${K.usd(F[0])}, then each partner pays on own income. Spouse floor, marriage and separation.`,
  h1: 'Medicare levy surcharge for couples: one test, two bills',
  intro: "Enter both incomes for MLS purposes: the tool finds the household tier, then shows what each partner would pay without hospital cover.",
  resume: `A couple, married or de facto, with or without children, is tested on the family threshold: for ${P.incomeYear} the surcharge starts when the two partners' incomes for MLS purposes add up to more than ${K.usd(F[0])}. The combined total also decides the rate, ${K.pct(R[1], 0)} up to ${K.usd(F[1])}, ${K.pct(R[2], 2)} up to ${K.usd(F[2])} and ${K.pct(R[3], 1)} beyond. Each partner then pays that rate on their own taxable income and reportable fringe benefits, not on the household total, so the bill is split in proportion to income. A couple on ${K.usd(180000)} and ${K.usd(75000)}, without cover, pays ${K.usd(ex.you.amount)} and ${K.usd(ex.partner!.amount)}. A partner who had a spouse all year and whose own income for MLS purposes is ${K.usd(floor.value)} or less pays nothing (${floor.year} figure, the latest published). To avoid the surcharge, both partners and every dependant need an appropriate level of private patient hospital cover, ideally on the same couple or family policy.`,
  tool: 'mls',
  toolArg: { st: 'couple', inc: 180000, pinc: 75000 },
  faqs: [
    { q: 'Do de facto partners count as a couple for the surcharge?', a: 'Yes. For MLS purposes your spouse includes a person of any sex you live with on a genuine domestic basis as a couple, and a person whose relationship with you is registered under a prescribed state or territory law. Marriage is not needed. Once you are a couple, the family threshold applies and your incomes for MLS purposes are combined.' },
    { q: 'If only one partner has hospital cover, does the couple avoid the surcharge?', a: 'No. Above the family threshold, the surcharge applies for any day on which you, your spouse or a dependent child lacked an appropriate level of private patient hospital cover. PrivateHealth.gov.au says it plainly: if your partner or one of your dependants is not covered, you pay. A single policy in one name leaves both partners exposed.' },
    { q: 'Does a low-earning partner pay the surcharge?', a: `Not if their own income for MLS purposes is ${K.usd(floor.value)} or less and they had a spouse for the whole year. The M2 instructions for ${floor.year} give that figure; the ATO page on paying the surcharge, last updated in May 2026, still prints an older, lower amount. The ${P.incomeYear} amount had not been published on ${K.day(P.retrieved_at)}. The higher earner still pays on their own income.` },
    { q: 'What happens to the surcharge in the year we marry or separate?', a: 'Both thresholds can apply, each for its own period. For the days you were single you are compared with the single threshold, for the days you had a spouse with the family one, using your own income for MLS purposes in each test. The rate is then set by your situation on 30 June: combined income and family tiers with a spouse, own income and single tiers without.' },
    { q: 'Does our surcharge change if my spouse earns nothing?', a: `The test then rests on your income alone against the family threshold of ${K.usd(F[0])}, which is twice the single one. A spouse with no income is still your dependant, and still needs hospital cover. On ${K.usd(180000)} with a spouse earning nothing you pay no surcharge at all; single, the same income would cost ${K.usd(solo.total)} without cover.` },
  ],
  body: (h) => `
<h2>How the household test works</h2>
<p>The ATO runs the test in two steps. First it adds your income for MLS purposes to your spouse's and compares the sum with the family thresholds. That gives the tier and the rate for the household. Then it charges each partner the rate on their own taxable income and reportable fringe benefits, for their own days without cover. The order matters: a high earner with a low-earning partner can end up below the family threshold and pay nothing, while a pair of middle incomes can cross it together.</p>
${h.table(['Your income', "Partner's income", 'Combined', 'Tier', 'You pay', 'Partner pays'], splits.map(([a, b]) => { const m = pair(a, b); return [K.usd(a), K.usd(b), K.usd(m.testIncome), K.TN[m.tier], K.usd(m.you.amount), m.partner!.liable ? K.usd(m.partner!.amount) : 'not liable']; }), `The same combined ${K.usd(250000)} split four ways, ${P.incomeYear} thresholds, no hospital cover all year, no fringe benefits or add-backs.`, ['r', 'r', 'r', 'l', 'r', 'r'])}
<p>The household total is the same in every row, so the rate is the same. Only the split differs. The last row shows the spouse floor at work: the partner on ${K.usd(floor.value)} is not liable, and the other partner pays on their own income only.</p>

<h2>Who counts as your spouse</h2>
<p>For MLS purposes your spouse is a person of any sex who is legally married to you, whose relationship with you is registered under a prescribed state or territory law, or who lives with you on a genuine domestic basis as a couple. The ATO treats a spouse as your dependant regardless of their income: if your spouse worked at any time in the year and you had a spouse all year, you are still taken to have maintained them for the whole year. A temporary separation, for a holiday or travel overseas, does not end it. An ex-spouse to whom you pay maintenance is not your dependant.</p>
${h.mini('mls', { t: 'Try your own split', p: ['inc', 'pinc'], d: { st: 'couple', inc: 140000, pinc: 115000 }, c: 'Open the household calculator' })}

<h2>The year you move in, marry or separate</h2>
<p>When a couple forms or ends during the year, the M2 instructions split the year into periods. For the days you were single, you are liable if your own income for MLS purposes is over the single threshold and you lacked cover. For the days you had a spouse, you are liable only if your own income for MLS purposes is over the family threshold. The rate is set by your status on 30 June. The ATO gives two ${M.prior.year} examples, with that year's thresholds of ${K.usd(M.prior.single[0])} and ${K.usd(M.prior.family[0])}.</p>
<ul>
<li><strong>Michael and Michelle separated on 12 October 2025.</strong> For the first 104 days each is compared with the family threshold, and neither is liable. For the 262 single days, Michelle's ${K.usd(102000)} is above ${K.usd(M.prior.single[0])}; Michael's ${K.usd(69000)} is not. Michelle, single on 30 June, pays the tier 1 rate on her own income for those days: ${K.usd2(michelle)}. Michael pays nothing.</li>
<li><strong>Alice and Adam married on 17 January 2026.</strong> For the first 200 days each is single; Alice's ${K.usd(150000)} is above the single threshold, Adam's ${K.usd(89000)} is not. After the wedding each is compared with the family threshold, and neither is over it. Because Alice is married on 30 June, her rate comes from the couple's combined ${K.usd(239000)}, which was tier 2 in ${M.prior.year}: ${K.pct(R[2], 2)} on her ${K.usd(142000)} of taxable income for 200 days, ${K.usd2(alice)}.</li>
</ul>
<p>If your spouse died during the year and you had no new spouse by 30 June, the ATO asks you to assume you had a spouse for the whole year when working out your income for MLS purposes.</p>

${h.box('One policy or two', `<p>The law asks that every member of the family hold an appropriate level of hospital cover. Two single policies, each with an excess of ${K.usd(M.excessLimit.single)} or less, meet the condition as well as one couple policy with an excess of ${K.usd(M.excessLimit.other)} or less. In the October 2026 premium file a couple policy is, for the cheapest products, exactly twice the single price, so the choice is about cover and convenience more than tax. ${h.a('mls-hospital-cover-excess', 'The excess page')} has the limits.</p>`)}

<h2>Sharing the bill fairly</h2>
<p>Because each partner pays on their own income, the surcharge lands mostly on the higher earner, while a couple policy is usually paid from one account. In the example of the summary, the household would pay ${K.usd(ex.total)} without cover, ${K.usd(ex.you.amount)} of it on the ${K.usd(180000)} income. Compare that total with the net price of a couple policy in your state: the calculator on the ${h.a('home', 'home page')} does it with the rebate and any Lifetime Health Cover loading, which on a couple policy is the average of the two partners' loadings.</p>

<h2>Sources</h2>
<p>The two-step test, the floor and the change-of-status rules are in ${h.src('ato_m2')}; the definition of a spouse and of maintenance in ${h.src('ato_mls_family')}; the thresholds in ${h.src('ato_mls_rates')}. ${h.src('phio_mls', 'PrivateHealth.gov.au')} confirms that couples are on the family tiers and that every member must be covered.</p>
`,
  related: ['mls-families', 'mls-single-parents', 'income-for-mls-purposes', 'mls-thresholds', 'mls-part-year-cover'],
  sources: ['ato_m2', 'ato_mls_family', 'ato_mls_rates', 'phio_mls', 'ato_mls_paying'],
});
