import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, RB = P.rebate;
const now = RB.periods[RB.current].rates, before = RB.periods[0].rates;
const nswC = K.cell('NSW', 'couple').cheapest.monthly * 12;
const nswS = K.cell('NSW', 'single').cheapest.monthly * 12;
const medC = K.cell('NSW', 'couple').median * 12;
const s = K.thr('single'), f = K.thr('family', 1);

export default definePage({
  id: 'private-health-insurance-rebate', group: 'rebate', order: 1, slug: 'private-health-insurance-rebate',
  nav: 'Private health insurance rebate', card: `${K.pct(now[0][0], 3)} at the base tier under 65, nothing at tier 3.`,
  title: 'Private Health Insurance Rebate 2026-27: Rates and Dollars',
  description: `Private health insurance rebate 2026-27: ${K.pct(now[0][0], 3)} to ${K.pct(now[2][0], 3)} at the base tier, by income tier and the age of the oldest person covered. Your rebate in dollars.`,
  h1: 'Private health insurance rebate 2026-27: your percentage and your dollars',
  intro: 'Give your income for surcharge purposes, your premium and the age of the oldest person on the policy: the rebate comes out in dollars a year and a month.',
  resume: `The private health insurance rebate is the government's share of your premium. From 1 April 2026 to 31 March 2027 it is ${K.pct(now[0][0], 3)} of the premium at the base tier when everyone on the policy is under 65, ${K.pct(now[0][1], 3)} at tier 1, ${K.pct(now[0][2], 3)} at tier 2 and nothing at tier 3. The rate rises with the age of the oldest person covered: ${K.pct(now[1][0], 3)} at the base tier between 65 and 69, ${K.pct(now[2][0], 3)} from 70. The tier is set by your income for surcharge purposes, the same test and the same thresholds as the Medicare levy surcharge: for ${P.incomeYear}, the base tier stops at ${K.usd(s[0])} for a single person and ${K.usd(f[0])} for a couple or a family. On the cheapest couple policy that avoids the surcharge in New South Wales, ${K.usd(nswC)} a year before the rebate, a couple under 65 at the base tier gets ${K.usd(nswC * now[0][0])} back. The rebate is never paid on a Lifetime Health Cover loading, and the percentages change each 1 April.`,
  tool: 'rebate',
  toolArg: { st: 'single', inc: 95000, gp: 2400, age: 40 },
  faqs: [
    { q: 'What are the private health insurance rebate rates from 1 April 2026?', a: `Under 65: ${K.pct(now[0][0], 3)}, ${K.pct(now[0][1], 3)} and ${K.pct(now[0][2], 3)} for the base tier, tier 1 and tier 2. From 65 to 69: ${K.pct(now[1][0], 3)}, ${K.pct(now[1][1], 3)} and ${K.pct(now[1][2], 3)}. From 70: ${K.pct(now[2][0], 3)}, ${K.pct(now[2][1], 3)} and ${K.pct(now[2][2], 3)}. Tier 3 gets nothing at any age. These rates run until 31 March 2027.` },
    { q: 'Which policies attract the rebate?', a: 'Hospital, general treatment (extras) and ambulance policies from an Australian registered health insurer, provided the policy is a complying one. Overseas Visitors Health Cover and policies from an overseas insurer not registered in Australia attract no rebate. You must also be eligible for Medicare and have an income for surcharge purposes below the tier 3 threshold.' },
    { q: 'Whose age sets the rebate on a couple policy?', a: `The age of the oldest person the policy covers. A couple aged 63 and 67 gets the 65 to 69 rate on the whole premium, ${K.pct(now[1][0], 3)} at the base tier instead of ${K.pct(now[0][0], 3)}. The rate changes when the oldest person reaches 65 or 70, not on 1 July or 1 April.` },
    { q: 'Why did my rebate fall slightly on 1 April 2026?', a: `Because the rebate adjustment factor for 2026 was ${K.dec(RB.raf2026, 3)}. Each 1 April the percentages are multiplied by a factor that reflects the gap between inflation and the average premium increase, which was ${K.dec(RB.premiumRise2026 * 100, 2)} % in 2026. The base tier rate under 65 went from ${K.pct(before[0][0], 3)} to ${K.pct(now[0][0], 3)}.` },
    { q: 'Do my children\'s incomes count towards the rebate tier?', a: `No. Family income for surcharge purposes is your income and your spouse's, nothing more. Children only raise the family threshold: ${K.usd(P.mls.childIncrement)} for each Medicare levy surcharge dependent child after the first, so a family with three such children reaches tier 1 only above ${K.usd(K.thr('family', 3)[0])} in ${P.incomeYear}.` },
  ],
  body: (h) => `
<h2>Twelve percentages, one table</h2>
<p>The whole rebate fits in a grid of three age bands by four income tiers. The rows below are those of ${h.src('ato_rebate_rates', 'the ATO')} and of the Department of Health circular that set them, ${h.src('health_raf_2026', 'PHI 12/26')}.</p>
${h.table(['Oldest person covered', K.TN[0], K.TN[1], K.TN[2], K.TN[3]], K.AB.map((a, i) => [a, ...now[i].map((r) => K.pct(r, 3))]), 'Rebate from 1 April 2026 to 31 March 2027.', ['l', 'r', 'r', 'r', 'r'])}
<p>The tiers are not specific to the rebate. They are the Medicare levy surcharge tiers, tested on the same income for surcharge purposes: taxable income, reportable fringe benefits, net investment losses and reportable super contributions, added for you and your spouse. For ${P.incomeYear} a single person is at the base tier up to ${K.usd(s[0])}, at tier 1 up to ${K.usd(s[1])}, at tier 2 up to ${K.usd(s[2])}, and at tier 3 beyond. For a couple, a single parent or a family the limits are ${K.usd(f[0])}, ${K.usd(f[1])} and ${K.usd(f[2])}. ${h.a('income-for-mls-purposes', 'Income for MLS purposes')} explains each item of the total.</p>

<h2>What the percentage is worth on real premiums</h2>
<p>A rate means little until it is applied to a price. Two couple policies from the PrivateHealth.gov.au file of ${K.day(K.PREM.release)} show the range: the cheapest hospital policy for a couple in NSW that avoids the surcharge (${K.usd(nswC)} a year before the rebate), and the median policy of the same kind (${K.usd(medC)}).</p>
${h.table(['Tier and age band', 'Cheapest NSW couple policy', 'Median NSW couple policy'], [0, 1, 2].flatMap((t) => [0, 1, 2].map((b) => [`${K.TN[t]}, ${K.AB[b]}`, K.usd(nswC * now[b][t]), K.usd(medC * now[b][t])])), 'Rebate per year, rates of 1 April 2026.', ['l', 'r', 'r'])}
<p>The gap between the top and the bottom of that table is large. A retired couple over 70 on a modest income gets ${K.usd(medC * now[2][0])} a year towards a median policy; a couple under 65 at tier 2 gets ${K.usd(medC * now[0][2])} on the same premium. Tier 3 households pay the full price.</p>
${h.mini('rebate', { t: 'Rebate on a couple policy', p: ['inc', 'gp', 'age'], d: { st: 'couple', inc: 180000, gp: Math.round(medC), age: 58 }, c: 'Open the rebate calculator' })}

<h2>Your status on 30 June decides the threshold</h2>
<p>The ATO tests the rebate on your family status on the last day of the income year. If you had a spouse on 30 June, the family thresholds apply to your combined income for the whole year, even if you met in March. If you separated during the year and had no dependent child on 30 June, the single thresholds apply to your own income alone. A single parent is always tested on the family thresholds, with only their own income counted. When a spouse dies during the year and the survivor has no dependant on 30 June, the family thresholds still apply, to the incomes of both.</p>
<p>That date rule produces surprises in both directions. A person on ${K.usd(110000)} who moves in with a partner on ${K.usd(40000)} before 30 June goes from tier 1 as a single (${K.pct(now[0][1], 3)}) to the base tier as a couple (${K.pct(now[0][0], 3)}), because ${K.usd(150000)} is under the family threshold. The reverse happens to a couple on a high joint income who separate in May.</p>

<h2>Three periods in the same calendar year</h2>
<p>Rates move on 1 April and thresholds on 1 July, so 2026 had three combinations. From 1 July 2025 to 31 March 2026, the ${P.mls.prior.year} thresholds (base tier up to ${K.usd(P.mls.prior.single[0])} single) went with the old rates, ${K.pct(before[0][0], 3)} at the base tier under 65. From 1 April to 30 June 2026, PrivateHealth.gov.au shows the new rates applied to the same old thresholds. From 1 July 2026 to 31 March 2027, the new rates go with the new thresholds of ${K.usd(s[0])}, ${K.usd(s[1])} and ${K.usd(s[2])}. The rates from 1 April 2027 will be published in ${RB.nextRatesPublished}.</p>
${h.box('The rebate and the loading', `<p>If your premium includes a Lifetime Health Cover loading, the rebate is worked out on the premium without it. The ATO example is Rebecca: ${K.usd(220)} for two months of cover, of which ${K.usd(20)} is a ${K.pct(0.1, 0)} loading. Only ${K.usd(200)} is eligible, and at ${K.pct(before[0][0], 3)} she gets ${K.usd(Math.round(200 * before[0][0]))}. The ${h.a('lifetime-health-cover-loading', 'loading page')} shows what that means over ten years.</p>`)}

<h2>Who can claim it</h2>
<p>The ATO lists four conditions: a complying policy with an Australian registered insurer, eligibility for Medicare, being a private health insurance incentive beneficiary, and an income for surcharge purposes below the tier 3 threshold. Every adult the policy covers is an incentive beneficiary. If the policy covers only a dependent child, the parents are; if they are not a couple on 30 June, the one who pays the premium is. When an employer pays the premium under a salary packaging arrangement, the rebate still depends on your income, not the employer's. How the money reaches you, as a lower premium or at tax time, is on the page ${h.a('rebate-premium-reduction-or-tax-offset', 'premium reduction or tax offset')}.</p>
<p>A change to the rates for people aged 65 and over is before Parliament: ${h.a('rebate-over-65', 'the over 65 page')} sets out what it would cost. For a single person, the cheapest exempt policy in NSW costs ${K.usd(nswS)} a year, and the base tier rebate under 65 takes ${K.usd(nswS * now[0][0])} off it.</p>
`,
  related: ['rebate-premium-reduction-or-tax-offset', 'rebate-over-65', 'income-for-mls-purposes', 'lifetime-health-cover-loading', 'mls-thresholds', 'private-health-insurance'],
  sources: ['ato_rebate_rates', 'ato_rebate_eligibility', 'phio_rebate', 'health_raf_2026', 'datagov_phi'],
});
