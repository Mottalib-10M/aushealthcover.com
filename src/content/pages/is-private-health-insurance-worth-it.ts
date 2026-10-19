import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls;
const nsw = K.cell('NSW', 'single');
const at = (inc: number, opts: { prem?: number; age?: number; lhc?: number } = {}) =>
  K.cmp({ status: 'single', you: { mlsIncome: inc }, region: 'NSW', oldest: opts.age ?? 35, loading: opts.lhc ?? 0, monthlyPremium: opts.prem });
const beCheap = K.be({ status: 'single', region: 'NSW', oldest: 35, loading: 0 });
const beMedian = K.be({ status: 'single', region: 'NSW', oldest: 35, loading: 0, monthlyPremium: nsw.median }, 500);
const beSilver = K.be({ status: 'single', region: 'NSW', oldest: 35, loading: 0, monthlyPremium: nsw.byTier.Silver.median }, 500);
const late = at(140000, { age: 50, lhc: K.lhc(50) });
const r140 = at(140000), m140 = at(140000, { prem: nsw.median });
const wait3 = K.tool('wait', { age: 31, yrs: 3, inc: 115000, rg: 'NSW' });

export default definePage({
  id: 'is-private-health-insurance-worth-it', group: 'decide', order: 1, slug: 'is-private-health-insurance-worth-it',
  nav: 'Is private health insurance worth it?', card: 'The tax side in dollars: surcharge, rebate and loading at your income.',
  title: 'Private Health Insurance Worth It? 2026-27 Break-Even Test',
  description: `Is private health insurance worth it in 2026-27? Income where cover costs less than the surcharge, at the cheapest and median price, with rebate and loading.`,
  h1: 'Is private health insurance worth it? The tax answer at your income',
  intro: 'Pick your state, your household and the age of the oldest person covered: the calculator finds the income from which hospital cover costs less than the surcharge.',
  resume: `On the tax side alone, private hospital cover is worth it once the Medicare levy surcharge you would pay without it is larger than what the policy costs after the rebate. Below the ${P.incomeYear} threshold of ${K.usd(M.single[0])} for a single person or ${K.usd(M.family[0])} for a family there is no surcharge, so cover never pays for itself through tax. Above it, the answer turns on the policy you buy. With the cheapest exempt single policy in New South Wales, ${K.usd2(nsw.cheapest.monthly)} a month before the rebate in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, cover is cheaper ${beCheap === null ? 'at no income under a million dollars' : `from ${K.usd(beCheap)}`}. With a policy at the median price, ${K.usd2(nsw.median)} a month, the line moves to ${beMedian === null ? 'beyond a million dollars' : K.usd(beMedian)}. A Lifetime Health Cover loading pushes it further out, since the rebate is never paid on the loading. Whether the cover is worth it for your health is a separate question that this page does not try to answer.`,
  tool: 'breakeven',
  toolArg: { st: 'single', rg: 'NSW', age: 35, lhc: 0 },
  faqs: [
    { q: 'At what income does private hospital cover pay for itself?', a: `Only above the surcharge threshold, ${K.usd(M.single[0])} for a single in ${P.incomeYear}. In NSW the cheapest exempt single policy beats the surcharge ${beCheap === null ? 'at no income under a million dollars' : `from ${K.usd(beCheap)}`}; a median-priced policy only from ${beMedian === null ? 'over a million dollars' : K.usd(beMedian)}. The tool above gives the line for your state, household, age band and loading, holding a partner's income fixed.` },
    { q: 'Why does the answer change so much with the policy chosen?', a: `Because the surcharge is fixed by your income while the premium is set by the policy. A single on ${K.usd(140000)} pays ${K.usd(r140.mls.total)} of surcharge in ${P.incomeYear}. The cheapest exempt NSW policy costs ${K.usd(r140.premium.net)} after the rebate, a median one ${K.usd(m140.premium.net)}. Same income, same tax, two opposite answers.` },
    { q: 'Does a Lifetime Health Cover loading make cover a bad deal?', a: `It makes it dearer, not necessarily a bad deal. Someone joining at 50 carries a ${K.pct(K.lhc(50), 0)} loading, so the cheapest NSW policy costs ${K.usd(late.premium.net)} a year at ${K.usd(140000)} instead of ${K.usd(r140.premium.net)}. The loading goes after ${P.lhc.removedAfterYears} continuous years, while the surcharge comes back every year you stay uncovered above the threshold.` },
    { q: 'Is waiting a few years before buying cover a saving?', a: `Rarely, once you are past your base day and above the threshold. The waiting calculator puts three years of waiting from age 31 on ${K.usd(115000)} at ${wait3.value} in NSW: more loading for ten years plus the surcharge in the meantime, after the premium you would not have paid. Under the threshold, waiting costs only the growing loading.` },
    { q: 'What does this page leave out of the worth it question?', a: 'Everything that is not tax: the treatments a policy covers, waiting periods, gap payments, choice of doctor and hospital, and how you weigh public hospital waiting times. Those depend on the policy and on your health. Our figures answer one narrow question, whether the policy costs more or less than the surcharge, so you can then judge the rest on its own merits.' },
  ],
  body: (h) => `
<h2>Two questions hidden in one</h2>
<p>People who type "is private health insurance worth it" usually mean two things at once. The first is a money question: will a hospital policy cost me more than the tax I pay without one? The second is a health question: will the policy pay out when I need it, for the treatment I care about? Only the first has an answer that holds for everybody with the same income, state and family, because it rests on published rules and published prices. This page answers that one, and it answers it in dollars.</p>
<p>The money question has three moving parts. The ${h.a('home', 'Medicare levy surcharge')} you pay without cover rises with your income, from ${K.pct(M.rates[1], 0)} to ${K.pct(M.rates[3], 1)}. The ${h.a('private-health-insurance-rebate', 'rebate')} lowers the premium but falls as your income rises, and disappears at tier 3. The ${h.a('lifetime-health-cover-loading', 'Lifetime Health Cover loading')} raises the premium if you join after your base day. All three are set from the same income tiers, so they have to be computed together, not one after the other.</p>

<h2>The break-even income for a single person in NSW</h2>
${h.table(['Income for MLS purposes', 'Surcharge without cover', 'Cheapest exempt policy, net', 'Median exempt policy, net', 'Cheaper option'], [100000, 110000, 120000, 130000, 150000, 170000, 200000].map((inc) => { const c = at(inc), m = at(inc, { prem: nsw.median }); return [K.usd(inc), K.usd(c.mls.total), K.usd(c.premium.net), K.usd(m.premium.net), c.mls.total === 0 ? 'no surcharge' : m.coverCheaper ? 'any of the two' : c.coverCheaper ? 'cheapest policy only' : 'the surcharge']; }), `Single, aged 35, no loading, ${P.incomeYear} thresholds and the rebate of 1 April 2026. Premiums: PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, NSW and ACT.`, ['l', 'r', 'r', 'r', 'l'])}
<p>Read the table from the top. Under ${K.usd(M.single[0])} there is nothing to compare: no surcharge, and the policy is a pure cost on the tax side. Just above the threshold, the surcharge is ${K.pct(M.rates[1], 0)} of your income and the cheapest policy, after the tier 1 rebate of ${K.pct(K.reb(1, 35), 3)}, is already a little cheaper. The median policy only wins at incomes where the surcharge has grown to ${K.pct(M.rates[3], 1)}, and a Silver policy at the median Silver price wins ${beSilver === null ? 'at no income under a million dollars' : `from ${K.usd(beSilver)}`}.</p>
${h.mini('cover', { t: 'Your income and your own premium', p: ['inc', 'prem'], d: { inc: 140000, prem: 160 }, c: 'Open the full cover or surcharge calculator' })}

<h2>Why the rebate works against you as income rises</h2>
<p>The rebate is not a fixed discount. For a person under 65 it is ${K.pct(K.reb(0, 35), 3)} at the base tier, ${K.pct(K.reb(1, 35), 3)} at tier 1, ${K.pct(K.reb(2, 35), 3)} at tier 2 and nothing at tier 3. So the net price of the same policy goes up exactly when the surcharge goes up. That is why the gap between the two does not simply widen with income: at the step into tier 3 the surcharge rate rises to ${K.pct(M.rates[3], 1)} and the rebate falls to zero at the same moment. The ${h.a('mls-thresholds', 'thresholds page')} shows the exact boundaries.</p>
<p>Older households get more rebate. When the oldest person on the policy is 70 or over, the base tier rebate is ${K.pct(K.reb(0, 72), 3)}, which lowers the break-even income. A bill before Parliament would bring the over 65 rates down to the under 65 ones from 1 April 2027; it is not law, and the ${h.a('rebate-over-65', 'over 65 page')} prices the change.</p>

<h2>The loading changes the sum for late joiners</h2>
<p>A person who first takes out hospital cover at 50 pays ${K.pct(K.lhc(50), 0)} more on the hospital premium for ten years, and the rebate does not reduce that extra. On ${K.usd(140000)} in NSW the cheapest policy then costs ${K.usd(late.premium.net)} a year against a surcharge of ${K.usd(late.mls.total)}. ${late.coverCheaper ? 'Cover still wins, but by less.' : 'In that case the surcharge is cheaper for now.'} The loading ends after ten continuous years, while the surcharge is due every year you stay uncovered above the threshold, so a single year's comparison understates the case for joining. The ${h.a('lhc-base-day-turning-31', 'base day page')} shows what each year of delay adds.</p>

<h2>Couples and families</h2>
<p>For a couple the tier comes from combined income, tested against ${K.usd(M.family[0])}, and both partners and every dependant must be covered to avoid the surcharge: PrivateHealth.gov.au says plainly that if your partner or one of your dependants is not covered, you will pay it. A couple policy costs about twice a single one, and the surcharge is charged on both incomes, so the break-even depends on how the income is split. Set the household in the calculator and enter your partner's income; the result is your own income from which the cheapest family policy costs less. The ${h.a('mls-couples', 'couples page')} and the ${h.a('mls-families', 'families page')} go through the cases.</p>

<h2>What the numbers cannot tell you</h2>
<p>A cheap Basic policy that removes the surcharge can leave you without cover for treatments you might want as a private patient. Every policy has a Private Health Information Statement that lists what it covers and excludes, and PrivateHealth.gov.au publishes the statement of every policy on sale. Our comparison stops at the tax line on purpose. If the cheapest exempt policy is all you want, the sum above is the whole story; if you want cover you would actually use, put its premium in the calculator and see what it really costs you after the surcharge it saves.</p>
`,
  related: ['private-health-insurance', 'basic-hospital-cover', 'compare-health-insurance', 'mls-thresholds', 'lifetime-health-cover-loading', 'private-health-insurance-rebate'],
  sources: ['ato_mls_rates', 'ato_rebate_rates', 'phio_mls', 'phio_lhc', 'datagov_phi'],
});
