import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, DAYS = K.DAYS;
const S = K.thr('single');
const inc = 130000;
const full = K.mls({ status: 'single', you: { mlsIncome: inc } });
const perDay = full.total / DAYS;
const rows = [1, 3, 6, 9, 12].map((m) => {
  const d = K.days(m), sur = K.mls({ status: 'single', you: { mlsIncome: inc }, daysWithout: d }).total;
  const cover = K.cmp({ status: 'single', you: { mlsIncome: inc }, region: 'NSW', oldest: 35, loading: 0, daysWithout: DAYS - d }).premium.net;
  return [String(m), String(d), K.usd(sur), K.usd(cover)];
});
/** ATO example Jacinta, 2025-26: 109,000, covered from 16 January 2026 (166 days), so 199 days liable. Amount assumes all of it is taxable income. */
const jacinta = 109000 * M.rates[1] * (DAYS - 166) / DAYS;

export default definePage({
  id: 'mls-part-year-cover', group: 'surcharge', order: 6, slug: 'mls-part-year-cover',
  nav: 'Part-year cover and the MLS', card: 'Charged per day without cover: what joining now saves.',
  title: 'MLS Part-Year Cover 2026-27: The Surcharge Per Day Uncovered',
  description: `MLS with part-year cover in 2026-27: charged per day without hospital cover, so joining in January roughly halves it. Days already gone, suspensions and travel.`,
  h1: 'Part-year hospital cover: how the surcharge counts the days',
  intro: 'Say how many months of the income year have gone without cover: the tool compares staying uncovered to 30 June with joining today.',
  resume: `The Medicare levy surcharge is not an all-or-nothing charge for the year. It is worked out for the number of days on which you, your spouse or a dependant lacked an appropriate level of private patient hospital cover, divided by ${DAYS}. A single person on ${K.usd(inc)} of income for MLS purposes, which is ${K.TN[full.tier].toLowerCase()} in ${P.incomeYear}, would pay ${K.usd(full.total)} for a full year without cover, about ${K.usd2(perDay)} a day. Take out a policy on 1 January and roughly half of that disappears. The days already gone cannot be undone, but every day after the start date of the policy is free of surcharge. Your insurer's private health insurance statement shows the number of covered days, and you report the days you are not liable at question M2 of your return. Suspending a policy, for example while travelling, does not count as cover: the surcharge runs for the suspended days. Cancelling cover to travel overseas exposes you in the same way.`,
  tool: 'partyear',
  toolArg: { gone: 4, st: 'single', inc: 130000, rg: 'NSW' },
  faqs: [
    { q: 'If I take out hospital cover in March, do I still pay the surcharge?', a: `Only for the days from 1 July until the day before your policy started, if your income for MLS purposes is above the threshold. For a single person on ${K.usd(inc)}, eight months without cover come to about ${K.usd(K.mls({ status: 'single', you: { mlsIncome: inc }, daysWithout: K.days(8) }).total)}. The days from the start of the policy to 30 June carry no surcharge.` },
    { q: 'Does suspending my health insurance while overseas trigger the surcharge?', a: 'Yes. PrivateHealth.gov.au states that if you hold hospital cover but temporarily suspend it, for example to travel overseas, you are not exempt for the suspended period and pay the surcharge for those days. The ATO suggests asking your fund how much premium a suspension or cancellation would save and comparing it with the surcharge it would cost you.' },
    { q: 'Where do I find the number of days I was covered?', a: 'On the private health insurance statement your insurer sends after 30 June. It gives, for each policy, the number of days the policy provided an appropriate level of private patient hospital cover. You use it to fill question M2, where label A takes the number of days for which you do not have to pay the surcharge.' },
    { q: 'Does travel insurance count as cover for the days I am away?', a: 'No. The ATO states that travel insurance is not private patient hospital cover for the surcharge, and that cover provided by an overseas fund does not count either. Only a policy for hospital treatment in Australia from a registered Australian health insurer stops the days from being charged, with an excess within the limits.' },
  ],
  body: (h) => `
<h2>The formula</h2>
<p>For each person liable, the ATO applies the rate of the tier to taxable income and reportable fringe benefits, then multiplies by the share of the year without cover:</p>
<p><strong>surcharge = (taxable income + reportable fringe benefits) x rate x days without cover / ${DAYS}</strong></p>
<p>The ATO's own illustration of the fraction is Michelle, in the ${M.prior.year} M2 instructions: ${K.usd(102000)} x ${K.pct(M.rates[1], 0)} x 262 / 365. The days counted are those on which you, your spouse or any dependent child lacked cover. If one family member joins the policy late, the whole family is charged for the uncovered days, as the ${h.a('mls-families', 'families page')} shows with the ATO example of Jill and Kevin.</p>

<h2>Months without cover, side by side</h2>
<p>The table takes a single person in NSW on ${K.usd(inc)} and sets the surcharge for the months without cover against the cost, after the rebate, of the cheapest exempt policy for the rest of the year.</p>
${h.table(['Months without cover', 'Days charged', 'Surcharge for those days', 'Cheapest cover for the rest of the year'], rows, `${P.incomeYear} thresholds, tier rebate from 1 April 2026, cheapest NSW single policy in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. Months converted to days on a ${DAYS}-day year.`, ['l', 'r', 'r', 'r'])}
<p>The two columns move in opposite directions: each month of delay adds surcharge and saves premium. At this income the month of premium is cheaper than the month of surcharge, so joining sooner costs less in total. At an income just over the threshold the gap narrows, and a ${h.a('lifetime-health-cover-loading', 'Lifetime Health Cover loading')} raises the premium side.</p>
${h.mini('partyear', { t: 'Joining now or waiting to 30 June', p: ['gone', 'inc'], d: { gone: 7, inc: 112000 }, c: 'Open the part-year calculator' })}

<p>Nothing of this shows during the year. Your employer does not withhold anything for the surcharge, so the days without cover only appear when the ATO processes your return: the amount is added to your tax liability and comes out of your refund, or adds to your bill. A policy started in May therefore saves money you would otherwise only see go when you lodge after 30 June.</p>

<h2>The ATO example: Jacinta</h2>
<p>In ${M.prior.year}, Jacinta is single with no dependants and an income for MLS purposes of ${K.usd(109000)}, above that year's single threshold of ${K.usd(M.prior.single[0])}. She takes out private patient hospital cover on 16 January 2026. From then to 30 June she is not liable: 166 days, the number she writes at label A of question M2. For the other ${DAYS - 166} days she pays the surcharge. The ATO does not print the amount; if all of her ${K.usd(109000)} were taxable income, it would be about ${K.usd2(jacinta)} at the tier 1 rate of ${K.pct(M.rates[1], 0)}.</p>

<h2>Travel, suspension and cancellation</h2>
<p>Two situations catch people out. The first is a <strong>suspension</strong>: an insurer may agree to suspend a policy and its payments during a long trip, on terms that vary from fund to fund, but PrivateHealth.gov.au is explicit that suspended days are not covered days for the surcharge. The second is <strong>cancelling to travel</strong>: the ATO warns that if you cancel your cover while overseas, you may have to pay the surcharge for that period. In both cases the ATO suggests asking your fund how much premium you would save and comparing it with the surcharge. Travel insurance and cover from an overseas fund never replace Australian hospital cover for this purpose.</p>
${h.box('Suspensions help with the loading, not the surcharge', `<p>A suspension your insurer approves does count in your favour for the Lifetime Health Cover loading: those days are not deducted from your ${K.num(P.lhc.daysOfAbsence)} days of absence. For the surcharge, though, they are days without cover. The ${h.a('lhc-days-of-absence', 'days of absence page')} explains the loading side.</p>`)}

<h2>Status changes split the year too</h2>
<p>Days can also be counted differently because your household changed. If you married, separated, or became or stopped being a sole parent, the M2 instructions apply the single threshold to the days you were single and the family threshold to the days you had a spouse or a dependent child. The ${h.a('mls-couples', 'couples page')} works through the ATO examples of a separation in October and a wedding in January.</p>

<h2>Sources</h2>
<p>Days, label A and the Jacinta example: ${h.src('ato_m2')}. Suspension: ${h.src('phio_mls', 'PrivateHealth.gov.au, Medicare Levy Surcharge')}. Travel and overseas funds: ${h.src('ato_mls_cover')}. Thresholds: ${h.src('ato_mls_rates')}. Premiums: ${h.src('datagov_phi', 'data.gov.au')}.</p>
`,
  related: ['mls-thresholds', 'mls-couples', 'mls-families', 'mls-visa-holders-expats', 'lhc-days-of-absence', 'is-private-health-insurance-worth-it'],
  sources: ['ato_m2', 'phio_mls', 'ato_mls_cover', 'ato_mls_rates', 'datagov_phi'],
});
