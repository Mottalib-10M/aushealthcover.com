import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, RB = P.rebate, PR = RB.proposal2027;
const now = RB.periods[RB.current].rates;
const nswC = K.cell('NSW', 'couple'), qldS = K.cell('QLD', 'single');
const medCouple = nswC.median * 12, medSingle = qldS.median * 12;
const loss = (gp: number, t: 0 | 1 | 2, age: number) => gp * (K.reb(t, age) - K.reb(t, age, 'proposal2027'));

export default definePage({
  id: 'rebate-over-65', group: 'rebate', order: 2, slug: 'rebate-over-65',
  nav: 'Rebate over 65', card: `Higher rates today; a bill would end them from ${K.day(PR.from)}.`,
  title: 'Health Insurance Rebate Over 65 in 2026: Rates and 2027 Bill',
  description: `Health insurance rebate over 65 in 2026: ${K.pct(now[1][0], 3)} from 65 and ${K.pct(now[2][0], 3)} from 70 at the base tier, and what the bill before Parliament would cost from April 2027.`,
  h1: 'Private health insurance rebate over 65: today\'s rates and the 2027 bill',
  intro: 'Enter the age of the oldest person on your policy, your premium and your income: you see your rebate now and what the proposed 1 April 2027 change would take off it.',
  resume: `People aged 65 and over receive a higher private health insurance rebate than younger people on the same income. Until 31 March 2027, when the oldest person on the policy is 65 to 69, the rebate is ${K.pct(now[1][0], 3)} at the base tier, ${K.pct(now[1][1], 3)} at tier 1 and ${K.pct(now[1][2], 3)} at tier 2; from 70 it is ${K.pct(now[2][0], 3)}, ${K.pct(now[2][1], 3)} and ${K.pct(now[2][2], 3)}. Under 65, the same tiers give ${K.pct(now[0][0], 3)}, ${K.pct(now[0][1], 3)} and ${K.pct(now[0][2], 3)}. In July 2026 the Department of Health announced that from ${K.day(PR.from)} everyone would receive the under-65 rates, "subject to legislation passing Parliament", and put the average extra cost for those affected at ${K.usd(PR.deptAverageCost)} a year. The bill was introduced in the House of Representatives on ${K.day(PR.billIntroduced)}. On ${K.day(P.retrieved_at)} it is still ${PR.billStatus.toLowerCase()}: it is not law, and the rates you pay today are unchanged.`,
  tool: 'retiree',
  toolArg: { age: 68, gp: Math.round(medCouple), st: 'couple', inc: 90000 },
  faqs: [
    { q: 'Is the rebate for over 65s being cut in 2027?', a: `It is proposed, not decided. The Department of Health says older Australians would receive the same rate as others in their income tier from ${K.day(PR.from)}, subject to legislation. The Modernising the Private Health Insurance Rebate Bill 2026 [No. 2] was introduced on ${K.day(PR.billIntroduced)} and is ${PR.billStatus.toLowerCase()} as of ${K.day(P.retrieved_at)}. We will update this page when it passes or fails.` },
    { q: 'How much more would a retired couple pay if the bill passes?', a: `On the median NSW couple policy that avoids the surcharge, ${K.usd(medCouple)} a year, a couple whose oldest member is 67 and whose income is at the base tier would lose ${K.usd(loss(medCouple, 0, 67))} a year. If the oldest is 72, the loss is ${K.usd(loss(medCouple, 0, 72))}. The department's average for all affected people is ${K.usd(PR.deptAverageCost)}.` },
    { q: 'Would the 2027 rates still change with the rebate adjustment factor?', a: `Not on 1 April 2027. The department says the adjustment factor will be set to ${PR.raf} for that date, so the under-65 percentages stay at ${K.pct(now[0][0], 3)}, ${K.pct(now[0][1], 3)} and ${K.pct(now[0][2], 3)}. Indexation would resume on 1 April 2028, based on the gap between inflation and the average premium increase.` },
    { q: 'Would people under 65 lose anything under the 2027 proposal?', a: `No. Under the department's table the under-65 row stays at ${K.pct(now[0][0], 3)}, ${K.pct(now[0][1], 3)} and ${K.pct(now[0][2], 3)} on 1 April 2027, the same as today, because the adjustment factor would be set to ${PR.raf} that year. Only the 65 to 69 and 70 and over rows would come down to those figures. Tier 3 stays at zero for everyone.` },
    { q: 'Does the proposed change affect the Medicare levy surcharge?', a: `No. The bill concerns the rebate percentages only. The surcharge thresholds for ${P.incomeYear} (${K.usd(P.mls.single[0])} single and ${K.usd(P.mls.family[0])} for couples and families) and its rates of ${K.pct(P.mls.rates[1], 0)} to ${K.pct(P.mls.rates[3], 1)} are unchanged, and so is the Lifetime Health Cover loading.` },
  ],
  body: (h) => `
<h2>Today's extra support, row by row</h2>
<p>The rebate has three rows. A policy whose oldest member is under 65 sits on the first; 65 to 69, the second; 70 and over, the third. On the same income, the second row adds about four points and the third about eight, at every tier except tier 3, which receives no rebate at any age.</p>
${h.table(['Income tier', 'Under 65', '65 to 69', '70 and over', 'Proposed from April 2027, all ages'], [0, 1, 2, 3].map((t) => [K.TN[t], K.pct(now[0][t], 3), K.pct(now[1][t], 3), K.pct(now[2][t], 3), K.pct(PR.rates[2][t], 3)]), `Rates from 1 April 2026 (${h.src('ato_rebate_rates', 'ATO')}) and the proposal of July 2026 (${h.src('health_rebate_2027', 'Department of Health')}).`, ['l', 'r', 'r', 'r', 'r'])}
<p>The tiers for ${P.incomeYear} are the surcharge tiers: base tier up to ${K.usd(P.mls.single[0])} for a single person and ${K.usd(P.mls.family[0])} for a couple. Many retirees sit at the base tier because their income for surcharge purposes is low, even when their assets are not, and that is where the extra support is largest in dollars.</p>

<h2>What the bill would do</h2>
<p>The Department of Health paper of July 2026 says that from ${K.day(PR.from)} older Australians "will receive the same rebate rate as other people in the same income tier, subject to legislation passing Parliament". Its reasons: people on the same income currently receive different support depending on age, and the savings would go to aged care, including residential places and home care. It estimates the average extra cost for the people affected at ${K.usd(PR.deptAverageCost)} a year, "less than a dollar a day".</p>
<p>The vehicle is the ${h.src('aph_bill_2027', 'Private Health Insurance Amendment (Modernising the Private Health Insurance Rebate) Bill 2026 [No. 2]')}. The Parliament site records its introduction and the moving of the second reading in the House of Representatives on ${K.day(PR.billIntroduced)}, and gives its status as before the House. A bill needs to pass both chambers and receive assent before it changes anything. Until then this page treats the 2027 rates as a scenario.</p>
${h.box('What is certain and what is not', `<p>Certain: the rates in the first three columns apply until 31 March 2027. Not certain: whether the bill passes, in this form or amended, and when. Also not known yet: the rates for under 65s from 1 April 2027. The department says the adjustment factor would be ${PR.raf} that year, but the ATO will only publish the 1 April 2027 rates in ${RB.nextRatesPublished}.</p>`)}

<h2>The cost for typical retired households</h2>
<p>The department's average hides a wide range. The loss is the gap between your row and the first row, applied to your full premium. A large Gold policy loses more dollars than a Basic one; a household at tier 2 loses about the same number of points as one at the base tier, but on a smaller rebate.</p>
${h.table(['Household', 'Premium per year', 'Rebate today', 'Under the proposal', 'Extra cost per year'], [
  ['Couple, oldest 67, base tier, median NSW policy', medCouple, 0, 67],
  ['Couple, oldest 72, base tier, median NSW policy', medCouple, 0, 72],
  ['Couple, oldest 72, tier 2, median NSW policy', medCouple, 2, 72],
  ['Single, 66, base tier, median QLD policy', medSingle, 0, 66],
  ['Single, 75, tier 1, median QLD policy', medSingle, 1, 75],
].map(([n, gp, t, a]) => [n as string, K.usd(gp as number), K.usd((gp as number) * K.reb(t as 0, a as number)), K.usd((gp as number) * K.reb(t as 0, a as number, 'proposal2027')), K.usd(loss(gp as number, t as 0, a as number))]), `Median exempt policies of the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, premiums held at their October 2026 level.`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('retiree', { t: 'Your own premium under the proposal', p: ['age', 'gp'], d: { age: 71, gp: 5200 }, c: 'Open the over 65 calculator' })}
<p>Premiums themselves will also move on 1 April 2027, as they do every year (the average increase was ${K.dec(RB.premiumRise2026 * 100, 2)} % in 2026). The figures above isolate the effect of the rebate change alone.</p>

<h2>Couples with an age gap</h2>
<p>The age band is not a personal attribute: it belongs to the policy, and it is set by its oldest member. A couple aged 62 and 66 today receives the 65 to 69 row on the whole premium, ${K.pct(now[1][0], 3)} at the base tier, so the younger partner benefits from the older one's age. That also means the proposed change would reach households where only one person is over 65. On the median NSW couple policy, such a couple at the base tier would lose ${K.usd(loss(medCouple, 0, 66))} a year. A couple who both stay under 65 until after April 2027 would see no change at all, whatever happens to the bill.</p>
<p>Income works the same way for everyone. The tier comes from the income for surcharge purposes of both partners together, tested on the family thresholds when you have a spouse on 30 June. A retired couple whose combined income for surcharge purposes stays under the family threshold sits at the base tier, where both the current extra support and the proposed loss are largest.</p>

<h2>Should anything change now?</h2>
<p>For most people, no. The proposal does not change what any policy covers, and dropping hospital cover has its own cost: a Lifetime Health Cover loading may apply if you return later, and the surcharge applies to incomes above the threshold. The department paper points to the Ombudsman's comparison service at PrivateHealth.gov.au for anyone who wants to look at cheaper cover, and notes that switching usually does not mean serving waiting periods again for services your current policy already covers. ${h.a('compare-health-insurance', 'Compare health insurance')} shows how the cheapest policies differ by state. The general rule for the rebate is on ${h.a('private-health-insurance-rebate', 'the rebate page')}.</p>
`,
  related: ['private-health-insurance-rebate', 'rebate-premium-reduction-or-tax-offset', 'compare-health-insurance', 'is-private-health-insurance-worth-it', 'lhc-10-year-removal'],
  sources: ['ato_rebate_rates', 'health_rebate_2027', 'aph_bill_2027', 'health_raf_2026', 'datagov_phi'],
});
