import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, RB = P.rebate, M = P.mls;
const now = RB.periods[RB.current].rates;
const s = K.thr('single'), old = M.prior.single;
const gp = 3000;
const gap = (tNom: 0 | 1 | 2 | 3, tReal: 0 | 1 | 2 | 3, age = 45) => gp * (K.reb(tNom, age) - K.reb(tReal, age));

export default definePage({
  id: 'rebate-premium-reduction-or-tax-offset', group: 'rebate', order: 3, slug: 'rebate-premium-reduction-or-tax-offset',
  nav: 'Premium reduction or tax offset', card: 'Two ways to get the same rebate, and what a wrong tier costs at tax time.',
  title: 'Rebate as Premium Reduction or Tax Offset 2026: Which Tier?',
  description: `Health insurance rebate in 2026-27: take it as a lower premium or as a refundable offset in your return. Nominate the right tier or settle up at tax time.`,
  h1: 'Premium reduction or tax offset: two ways to receive the rebate',
  intro: 'Choose the tier you would nominate and test the income you really expect: the calculator shows the rebate you are owed, so you can see whether a tax bill or a refund is coming.',
  resume: `The private health insurance rebate can reach you in two ways, and the amount is the same in the end. Most people take it as a premium reduction: you nominate an income tier with your insurer, which charges you the premium minus the rebate of that tier. The alternative is to pay the full premium and claim the rebate as a refundable tax offset when you lodge your return. Either way, the ATO checks your actual income for surcharge purposes after 30 June. If you nominated a tier that was too low, you received too much rebate and the difference becomes a tax liability; if you nominated too high a tier, the ATO pays the shortfall as an offset. There is no extra penalty for a wrong estimate. In ${P.incomeYear} the tiers moved up: the base tier for a single person now runs to ${K.usd(s[0])} instead of ${K.usd(old[0])}, so some people who nominated tier 1 last year can now nominate the base tier and pay less each month.`,
  tool: 'rebate',
  toolArg: { st: 'single', inc: 120000, gp, age: 45 },
  faqs: [
    { q: 'Is it better to take the rebate as a lower premium or at tax time?', a: 'The total is the same, because the ATO reconciles both methods against your actual income after 30 June. A premium reduction spreads the benefit over the year and lowers each payment. Claiming it in your return means paying the full premium first and waiting for the refund. The premium reduction carries the risk of a tax bill if your income ends up in a higher tier than you nominated.' },
    { q: 'What happens if I nominate the wrong income tier with my insurer?', a: `If your actual income is in a higher tier, you received more rebate than you were entitled to and you will have a tax liability for the excess when you lodge. If it is in a lower tier, the ATO gives you the missing amount as a tax offset. PrivateHealth.gov.au states there are no additional penalties for estimating your income incorrectly.` },
    { q: 'How do I change the tier I nominated?', a: 'Contact your insurer, or use the rebate claim form PrivateHealth.gov.au mentions, to nominate a new tier. The ATO advises telling your insurer when your income for surcharge purposes changes and you move into a different tier, so that the reduction you receive during the year stays close to what you will be entitled to.' },
    { q: 'Who receives the rebate when an employer pays the premium?', a: 'Each adult on the policy is income tested, whoever pays. If your employer pays your private health insurance, the ATO says you are generally entitled to the rebate as a reduced premium and your employer pays the rest. The tier is still set by your own income for surcharge purposes, as the ATO example of Belinda shows.' },
    { q: 'Where does the rebate information on my tax return come from?', a: 'Usually from your insurer. PrivateHealth.gov.au says rebate details are generally filled in automatically in the tax return, and you can ask your insurer for a statement after the end of the financial year. The statement shows the premiums paid, the rebate received as a reduction and the tier you nominated.' },
  ],
  body: (h) => `
<h2>Same entitlement, different timing</h2>
<p>The rebate you are owed for a year is fixed after 30 June, once your income for surcharge purposes and your family status on that day are known. What you choose is only how the money moves before then.</p>
${h.table(['', 'Premium reduction', 'Refundable tax offset'], [
  ['What you pay the insurer', 'Premium minus the rebate of the tier you nominate', 'The full premium'],
  ['When you receive the rebate', 'With every payment', 'After you lodge your return'],
  ['What you tell the insurer', 'Your expected income tier', 'Nothing about income'],
  ['If your income lands in a higher tier', 'Tax liability for the excess rebate', 'Smaller offset'],
  ['If your income lands in a lower tier', 'Offset for the shortfall', 'Larger offset'],
], 'The two methods described by the ATO and PrivateHealth.gov.au.', ['l', 'l', 'l'])}
<p>Both are described on ${h.src('ato_rebate_eligibility', 'the ATO eligibility page')} and on ${h.src('phio_rebate', 'PrivateHealth.gov.au')}. The rebate itself is the same percentage either way: ${K.pct(now[0][0], 3)}, ${K.pct(now[0][1], 3)} or ${K.pct(now[0][2], 3)} under 65, more when the oldest person covered is 65 or over.</p>

<h2>The cost of nominating the wrong tier</h2>
<p>Suppose your full premium is ${K.usd(gp)} a year and everyone on the policy is under 65. Every step between the tier you nominate and the tier you end up in is worth a fixed amount, which the table sets out.</p>
${h.table(['Nominated', 'Actual tier', 'Result at tax time'], [
  [K.TN[0], K.TN[1], `pay back ${K.usd(gap(0, 1))}`],
  [K.TN[1], K.TN[2], `pay back ${K.usd(gap(1, 2))}`],
  [K.TN[2], K.TN[3], `pay back ${K.usd(gap(2, 3))}`],
  [K.TN[0], K.TN[3], `pay back ${K.usd(gap(0, 3))}`],
  [K.TN[1], K.TN[0], `offset of ${K.usd(-gap(1, 0))}`],
  [K.TN[3], K.TN[1], `offset of ${K.usd(-gap(3, 1))}`],
], `Premium of ${K.usd(gp)} a year, rates of 1 April 2026, oldest person under 65.`, ['l', 'l', 'r'])}
<p>The amounts are modest, but they arrive in one go with the notice of assessment, and they come on top of any Medicare levy surcharge if the same income rise also took you above the surcharge threshold without hospital cover. Nominating a tier higher than you expect, or taking the rebate at tax time, removes the risk of a bill at the price of paying more during the year.</p>
${h.mini('rebate', { t: 'The rebate your real income gives', p: ['inc', 'gp'], d: { inc: 128000, gp: 3600 }, c: 'Open the rebate calculator' })}

<h2>The ATO example: a promotion in the middle of the year</h2>
<p>The ATO tells the story of Belinda, single, whose employer pays her hospital premium under a salary sacrifice arrangement. At the start of ${M.prior.year} her income for surcharge purposes is ${K.usd(132000)}, tier 2, and her employer pays premiums reduced by the tier 2 rebate. Part way through the year a promotion lifts her income to ${K.usd(159000)}, which is tier 3 for that year (the ${M.prior.year} tier 3 threshold was ${K.usd(old[2] + 1)}). She is not entitled to any rebate from that point, but she does not tell her insurer. When she lodges, she has a tax liability for the excess reduction she received. Two lessons come out of it: the employer paying the premium does not change whose income counts, and a pay rise is the moment to update your nominated tier.</p>

<h2>The ${P.incomeYear} thresholds move tiers down</h2>
<p>Income thresholds rise each 1 July. For ${P.incomeYear} the single tiers are ${K.usd(s[0])}, ${K.usd(s[1])} and ${K.usd(s[2])}, up from ${K.usd(old[0])}, ${K.usd(old[1])} and ${K.usd(old[2])}. An income that has not changed may therefore fall into a lower tier this year, with a higher rebate. A single person on ${K.usd(103000)} was at tier 1 in ${M.prior.year} and is at the base tier in ${P.incomeYear}; if they kept their old nomination, they are paying ${K.usd(gap(1, 0) * -1)} a year too much on a ${K.usd(gp)} premium and will get it back only at tax time. PrivateHealth.gov.au also notes that the new rebate rates of 1 April 2026 applied to the old thresholds until 30 June 2026, so a return for ${M.prior.year} uses two sets of rates.</p>
${h.box('Several adults on one policy', `<p>Each adult covered is a private health insurance incentive beneficiary and is income tested on their share. When a couple shares a policy, the rebate is spread evenly between them. A policy that covers only dependent children gives the entitlement to the parents, or, if they are not a couple on 30 June, to the one who pays the premiums.</p>`)}

<h2>Changes of status during the year</h2>
<p>Because the tier is tested on your family status on 30 June, a change of status can make your nomination wrong even when your salary has not moved. Moving in with a partner before 30 June puts you on the family thresholds, tested on your combined income: ${K.usd(K.thr('family', 1)[0])} for the base tier in ${P.incomeYear}. Separating and having no dependent child on 30 June puts you back on the single thresholds, tested on your own income. A single parent is always on the family thresholds with their own income alone. The ATO table of statuses covers the less common cases, such as the death of a spouse during the year, where the incomes of both are still used.</p>
<p>When the change pushes you into a higher tier, the same reconciliation applies as for a pay rise: the excess rebate is collected when you lodge. When it pulls you into a lower one, the offset makes up the difference. Updating your tier with the insurer as soon as the change happens keeps both amounts small.</p>

<h2>Before you choose</h2>
<p>Look at the income you expect for the whole year, not your current salary: bonuses, reportable fringe benefits, salary sacrificed super and net investment losses all count. ${h.a('income-for-mls-purposes', 'Income for MLS purposes')} adds them up. If you are near a threshold, the ${h.a('mls-thresholds', 'thresholds page')} shows what one more dollar changes for the surcharge and the rebate, and ${h.a('private-health-insurance-rebate', 'the rebate page')} gives the full table of rates.</p>
`,
  related: ['private-health-insurance-rebate', 'income-for-mls-purposes', 'mls-thresholds', 'rebate-over-65', 'mls-fringe-benefits-salary-packaging'],
  sources: ['ato_rebate_eligibility', 'ato_rebate_rates', 'phio_rebate'],
});
