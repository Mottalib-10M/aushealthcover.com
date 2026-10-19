import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc, D = L.daysOfAbsence;
const sa = K.cell('SA', 'single').cheapest.monthly * 12;
const ab = (gap: number, cur: number) => K.tool('absence', { gap, cur, rg: 'SA' });

export default definePage({
  id: 'lhc-days-of-absence', group: 'lhc', order: 5, slug: 'lhc-days-of-absence',
  nav: 'LHC days of absence', card: `${K.num(D)} days without hospital cover in a lifetime, then the loading returns.`,
  title: `LHC Days of Absence 2026: The ${K.num(D)} Day Gap Allowance`,
  description: `LHC days of absence in 2026: ${K.num(D)} days without hospital cover in your lifetime with no change to your loading. What does not count, and what happens after.`,
  h1: `Days of absence: the ${K.num(D)} days you can go without hospital cover`,
  intro: 'Add up the days you have been without hospital cover since your base day and enter your current loading: you see how many days remain, or the loading you would rejoin with.',
  resume: `Once you have held private hospital cover on or after your Lifetime Health Cover base day, you can stop it and restart it without penalty, within a lifetime limit of ${K.num(D)} days, three years less one day. These are your days of absence. They cover the gap when you change insurer, a lean year, or a break between jobs. Some periods are not taken from them: an approved suspension of your policy, time spent overseas after you cancel cover to live abroad for at least a year, and service in the ADF. Use them up, with a total gap of ${K.num(D + 1)} days or more, and you pay a loading when you rejoin: your previous loading, plus ${K.pct(L.perYear, 0)}, plus ${K.pct(L.perYear, 0)} for every further year without cover, and your ten years towards removal start again. The Ombudsman's example of Marit shows the safe side: ${K.num(1069)} days without cover and her ${K.pct(0.04, 0)} loading did not move.`,
  tool: 'absence',
  toolArg: { gap: 1069, cur: 4, rg: 'SA' },
  faqs: [
    { q: 'Are the days of absence counted per gap or over my whole life?', a: `Over your whole life. The ${K.num(D)} days are a single allowance, not a number per break: two gaps of 600 days use ${K.num(1200)} days and exhaust it. PrivateHealth.gov.au states the limit cannot be renewed. Keep the dates of every period without hospital cover, or ask your insurer, whose clearance certificate records them.` },
    { q: 'Does suspending my policy use up days of absence?', a: `No, if your insurer agrees to the suspension. PrivateHealth.gov.au says an approved suspension, for example while you travel overseas on holiday, is not counted towards your ${K.num(D)} days. Conditions vary between insurers. A suspension does not protect you from the Medicare levy surcharge, which is still charged for the suspended days.` },
    { q: 'What happens to waiting periods after a gap in cover?', a: 'They may apply again. The days of absence only protect your Lifetime Health Cover loading. PrivateHealth.gov.au warns that a break in hospital cover can mean serving waiting periods again when you rejoin, for example before treatment of a pre-existing condition. Ask your insurer before you let a policy lapse.' },
    { q: 'I left the ADF after my base day. How many days do I have?', a: `${K.num(D)} days from discharge. Members on continuous full-time service whose care comes through the ADF are treated as holding hospital cover. PrivateHealth.gov.au gives the case of Megan, discharged on 14 October 2017, who bought cover on 7 March 2019 after ${K.num(509)} days of absence and paid no loading.` },
    { q: 'Do veterans with a Gold Card have days of absence?', a: `Yes. Holding a DVA Gold Card counts as holding hospital cover. If the card is withdrawn, the holder has ${K.num(D)} days to buy a policy. The Ombudsman's example is Patrick, whose card was withdrawn on 9 June 2017 and who bought cover on 25 May 2019, after ${K.num(715)} days, with no loading. White and orange cards do not count.` },
  ],
  body: (h) => `
<h2>A budget of days, spent across your life</h2>
<p>Think of the allowance as a bank account opened on your base day with ${K.num(D)} days in it. Every day you hold hospital cover leaves it untouched; every day without cover takes one away. It is described on ${h.src('phio_lhc', 'PrivateHealth.gov.au')} under the heading "permitted days without hospital cover", and it only exists if you held hospital cover on or after your base day. Someone who has never had cover has no allowance to spend: their loading simply grows with age.</p>
${h.table(['Days used so far', 'Loading before', 'Result if you rejoin now', 'Per year on the cheapest SA single policy'], [
  [300, 0], [1069, 4], [D, 4], [D + 1, 4], [D + 400, 4], [D + 800, 10], [D + 2000, 0],
].map(([g, c]) => { const r = ab(g, c); return [K.num(g), K.pct(c / 100, 0), r.label.startsWith('Days') ? `${r.value} left, loading stays ${K.pct(c / 100, 0)}` : `${r.value} (estimate)`, r.rows[3][1]]; }), `Cheapest single hospital policy in South Australia that avoids the surcharge, ${K.usd2(sa / 12)} a month before the rebate. Past the allowance, our estimate adds ${K.pct(L.perYear, 0)} at once and ${K.pct(L.perYear, 0)} per further full year; your insurer sets the exact figure.`, ['r', 'r', 'l', 'r'])}

<h2>Marit stays inside the limit</h2>
<p>Marit was born on 12 February 1976 and took out hospital cover on 30 August 2008, aged 32, with a ${K.pct(K.lhc(32), 0)} loading. She cancelled on 15 March 2011 and rejoined on 16 February 2014: ${K.num(1069)} days without cover. That is ${K.num(D - 1069)} days short of the limit, so she pays the same ${K.pct(K.lhc(32), 0)} she paid before. Had she waited another month, her gap would have passed ${K.num(D)} days, and she would have rejoined on a higher loading with a fresh ten year count.</p>
${h.mini('absence', { t: 'How many days do you have left?', p: ['gap', 'cur'], d: { gap: 820, cur: 6, rg: 'SA' }, c: 'Open the days of absence calculator' })}

<h2>What the allowance does not pay for</h2>
<p>Several periods without an active policy are not deducted at all. The Ombudsman lists them:</p>
<ul>
<li><strong>Approved suspensions.</strong> If your insurer agrees to suspend your hospital cover for a short period, such as an overseas holiday, those days are not taken from the ${K.num(D)}. Each insurer sets its own conditions.</li>
<li><strong>Living overseas.</strong> If you cancel after your base day to go abroad for at least one continuous year, the days outside Australia do not count. Visits home of up to ${L.overseasVisitDays} consecutive days leave you overseas; longer stays are deducted. ${h.a('lhc-overseas-returning-australians', 'Returning from overseas')} has the examples.</li>
<li><strong>ADF service and the Gold Card.</strong> Full-time ADF members whose care comes through the ADF, and people listed on a DVA Gold Card, are treated as covered. After discharge or withdrawal of the card, the ${K.num(D)} days start.</li>
</ul>

<h2>When the days run out</h2>
<p>A total gap of ${K.num(D + 1)} days or more changes three things. First, a loading applies on rejoining: the loading you had before, plus ${K.pct(L.perYear, 0)}, plus ${K.pct(L.perYear, 0)} for each further year without cover. Second, the continuity of your ten loaded years is broken, and you start the count again from the date you rejoin. Third, if your loading had already been removed after ten years, you can become liable for one again. A person who had a ${K.pct(0.1, 0)} loading and stays out ${K.num(D + 800)} days comes back on about ${ab(D + 800, 10).value}, which on the cheapest SA single policy costs ${ab(D + 800, 10).rows[3][1]} a year, for ten more years.</p>
${h.box('Change insurer without spending days', `<p>A switch between insurers only uses days if there is a gap between the two policies. Start the new policy the day the old one ends, and ask the old insurer for a clearance certificate: it must issue one within 14 days, and it carries your loading, your dates and the waiting periods already served. The new insurer uses it to apply the right loading.</p>`)}

<h2>Two people, the same gap, different results</h2>
<p>The allowance only protects people who held cover on or after their base day. Take two friends who both turn 31 in 2020 and both go without hospital cover for the whole of the next four years. The first held a policy on her base day and cancelled it a month later: her gap of about four years uses up her ${K.num(D)} days and she rejoins with about ${ab(1461, 0).value}, by our estimate of the Ombudsman's rule. The second never had cover: there is no allowance to spend, and on rejoining his loading is set by his age on the 1 July before he joins, ${K.pct(K.lhc(35), 0)} at 35. The rule rewards having started, even briefly, before the deadline.</p>

<h2>Counting your own days</h2>
<p>Add every period without hospital cover since your base day, excluding approved suspensions and qualifying time overseas. Your current and former insurers can tell you their dates; the clearance certificate is the reference. If the total is close to ${K.num(D)}, the safest move is to rejoin before it is reached, even with a Basic policy, then compare at leisure. Basic policies that also avoid the Medicare levy surcharge start at ${K.usd2(sa / 12)} a month in South Australia (${h.a('basic-hospital-cover', 'basic hospital cover')}). The loading rules in full are on ${h.a('lifetime-health-cover-loading', 'the Lifetime Health Cover loading page')}, and the ten year count on ${h.a('lhc-10-year-removal', 'the removal page')}.</p>
`,
  related: ['lifetime-health-cover-loading', 'lhc-10-year-removal', 'lhc-overseas-returning-australians', 'basic-hospital-cover', 'state-sa'],
  sources: ['phio_lhc', 'ato_lhc', 'datagov_phi'],
});
