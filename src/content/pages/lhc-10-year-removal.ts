import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc, Y = L.removedAfterYears;
const tas = K.cell('TAS', 'single'), cheap = tas.cheapest.monthly * 12, med = tas.median * 12;
const rise = P.rebate.premiumRise2026;

export default definePage({
  id: 'lhc-10-year-removal', group: 'lhc', order: 6, slug: 'lhc-10-year-removal',
  nav: 'LHC loading removal after 10 years', card: `Ten continuous years with the loading, then it drops to ${K.pct(0, 0)}.`,
  title: 'LHC Loading Removal 2026: When the 10 Years Are Up',
  description: `LHC loading removal in 2026: the loading stops after ${Y} continuous years of hospital cover. Count the months left, what you still pay, and what resets it.`,
  h1: 'When the Lifetime Health Cover loading goes: the ten year count',
  intro: 'Enter how long you have paid your loading and its rate: the calculator counts the months left and what the loading will still cost you before it drops.',
  resume: `A Lifetime Health Cover loading is not for life. Once you have paid it for ${Y} continuous years of hospital cover, your insurer removes it and your premium falls to the standard price, for as long as you keep your cover. The ATO puts it in dollars: join at 40 and you could pay ${K.pct(K.lhc(40), 0)} more each year for ${Y} years; join at 50 and it is ${K.pct(K.lhc(50), 0)} more for ${Y} years. Breaks allowed under the days of absence rules do not reset the count, but they do not count towards it either, so a two year gap pushes the end date back two years. The Ombudsman's example of Kaia shows this: a ${K.pct(K.lhc(33), 0)} loading from November 2005, nine years and two months of cover, two years abroad, then ${K.num(297)} more days of loading before it was removed in January 2018. If you cancel after the loading has gone, a new loading can apply when you return.`,
  tool: 'removal',
  toolArg: { held: 4, ld: 20, st: 'single', rg: 'TAS' },
  faqs: [
    { q: 'Do I have to stay with the same insurer for the ten years?', a: 'No. The count is of continuous hospital cover, not of membership of one fund. You can change insurer or policy during the ten years. To keep the count intact, start the new policy without a gap and give the new insurer the clearance certificate from the old one, which records your loading and the dates already served.' },
    { q: 'Does the loading come off on its own after ten years?', a: 'Yes. The insurer applies the removal once you have held the loading on your hospital cover for ten continuous years, and the loading stays at zero while you keep your cover. If your dates are wrong, for example after several changes of insurer, ask for the dates on record and supply your clearance certificates.' },
    { q: 'Is it worth taking a cheap policy just to run down the ten years?', a: `It can be. The loading is a percentage of whatever hospital premium you pay. On the cheapest exempt single policy in Tasmania, ${K.usd(cheap)} a year before the rebate, a ${K.pct(0.2, 0)} loading costs ${K.usd(cheap * 0.2)} a year; on a median policy, ${K.usd(med * 0.2)}. The ten years run at the same speed on either, and a policy change does not restart them.` },
    { q: 'What happens if I cancel my cover after the loading has been removed?', a: `The ATO and PrivateHealth.gov.au both warn that you may become liable for a loading again if you take out hospital cover later. Your days of absence still apply: a gap within the ${K.num(L.daysOfAbsence)} day lifetime allowance leaves the loading at zero, a longer one brings a loading back with a new ten year count.` },
  ],
  body: (h) => `
<h2>Ten years, measured how?</h2>
<p>${h.src('phio_lhc', 'PrivateHealth.gov.au')} says the loading is removed once you have held it on your hospital cover for ${Y} continuous years. Three rules shape that count:</p>
<ul>
<li>It starts when you first pay the loading, on the day your hospital cover begins.</li>
<li>Permitted days without hospital cover, within your ${K.num(L.daysOfAbsence)} days of absence or while overseas, do not break the continuity, but they are not counted as years with cover.</li>
<li>Using up your days of absence breaks it: the ten years start again from the day you rejoin, on a new loading.</li>
</ul>
<p>The ${h.src('ato_lhc', 'ATO page on the loading')} adds the warning that applies after the end: cancel your cover once the loading is removed, and you may have to pay a loading again on a later policy.</p>

<h2>Kaia's count, with a break abroad</h2>
<p>Kaia, born on 7 March 1972, takes out hospital cover on 17 November 2005 with a ${K.pct(K.lhc(33), 0)} loading, three years over 30. She cancels on 24 January 2015 to go overseas, after ${K.num(3355)} days, nine years, two months and seven days of continuous cover. She does not return to Australia for more than ${L.overseasVisitDays} consecutive days until she comes back for good on 24 January 2017. She rejoins on 26 March 2017, pays her original ${K.pct(K.lhc(33), 0)} for another ${K.num(297)} days, about ten months, and the loading is removed on 17 January 2018. Her two years abroad neither broke the count nor shortened it.</p>
${h.mini('removal', { t: 'Months left on your loading', p: ['held', 'ld'], d: { held: 7.5, ld: 14, st: 'single', rg: 'TAS' }, c: 'Open the removal calculator' })}

<h2>What the ten years cost at each loading</h2>
<p>The total depends on the loading and on the policy carrying it. The table uses the cheapest and the median single hospital policies in Tasmania that avoid the Medicare levy surcharge, in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, with premiums rising each year by ${K.dec(rise * 100, 2)} %, the 2026 industry average.</p>
${h.table(['Loading', 'Joined at', 'Cheapest policy, first year', 'Cheapest policy, 10 years', 'Median policy, 10 years'], [0.02, 0.1, 0.2, 0.3, 0.4, 0.7].map((l) => [K.pct(l, 0), String(Math.min(65, 30 + Math.round(l / L.perYear))) + (l >= L.max ? ' or over' : ''), K.usd(cheap * l), K.usd(K.loadCost(cheap, l, Y, rise)), K.usd(K.loadCost(med, l, Y, rise))]), `Loading paid in full; the rebate is not paid on it. Single policies in Tasmania: cheapest ${K.usd2(tas.cheapest.monthly)} and median ${K.usd2(tas.median)} a month before the rebate.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The column on the right is the reason many late joiners start low. On a median policy, a ${K.pct(0.4, 0)} loading costs ${K.usd(K.loadCost(med, 0.4, Y, rise))} over the ten years; on the cheapest exempt policy, ${K.usd(K.loadCost(cheap, 0.4, Y, rise))}. Both remove the loading on the same date. Upgrading the policy once the loading has gone costs the standard price only.</p>

<h2>Couples and the ten years</h2>
<p>On a couple or family policy the loading is the average of the adults' own loadings. PrivateHealth.gov.au shows, with the case of Archie, that a person's loading is removed after their own ten years of continuous cover, even on a shared policy. When one partner's loading is removed, the average falls: a couple with ${K.pct(K.lhc(41), 0)} and ${K.pct(K.lhc(36), 0)} pay ${K.pct(K.avgLoad([K.lhc(41), K.lhc(36)]), 0)} on the policy, and once the first partner's loading has gone, ${K.pct(K.avgLoad([0, K.lhc(36)]), 0)}. A partner who joins the policy later brings their own loading and their own start date.</p>
<p>The same logic applies to a dependant with a disability who is counted as an adult on a family policy: PrivateHealth.gov.au says such a person keeps their loading when they move onto a parent's policy, and can have it removed after ten continuous years of hospital cover, like anyone else.</p>

<h2>Planning the last years</h2>
<p>Because the end date is fixed by the start of the loading plus ten years of cover, it is worth writing it down. If you joined on 1 March 2019 and never had a gap, your loading ends on 1 March 2029. A gap of 200 permitted days moves it to around mid September 2029. A gap that exhausts your days of absence wipes the count and starts a new one with a higher loading. Before cancelling in the final years, compare what you would save with what a new ten years would cost: the ${h.a('lhc-days-of-absence', 'days of absence page')} gives the loading you would come back with.</p>
${h.box('The Medicare levy surcharge does not wait ten years', `<p>The surcharge depends only on whether you hold hospital cover in the income year and on your income. Removing the loading changes nothing there. A person on ${K.usd(140000)} who cancels pays ${K.usd(K.mls({ status: 'single', you: { mlsIncome: 140000 } }).total)} a year in surcharge in ${P.incomeYear}, whatever their loading history. ${h.a('is-private-health-insurance-worth-it', 'Is private health insurance worth it')} compares the two over time.</p>`)}
<p>The full set of rules is on ${h.a('lifetime-health-cover-loading', 'the Lifetime Health Cover loading page')}, and the way couples share a loading is set out there as well.</p>
`,
  related: ['lifetime-health-cover-loading', 'lhc-days-of-absence', 'is-private-health-insurance-worth-it', 'basic-hospital-cover', 'state-tas'],
  sources: ['phio_lhc', 'ato_lhc', 'health_raf_2026', 'datagov_phi'],
});
