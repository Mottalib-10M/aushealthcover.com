import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc;
const nsw = K.cell('NSW', 'single').cheapest.monthly * 12;
const at40 = K.lhc(40), at45 = K.lhc(45);

export default definePage({
  id: 'lifetime-health-cover-loading', group: 'lhc', order: 1, slug: 'lifetime-health-cover-loading',
  nav: 'Lifetime Health Cover loading', card: `${K.pct(L.perYear, 0)} a year over 30, ${K.pct(L.max, 0)} at most, gone after ${L.removedAfterYears} years.`,
  title: 'Lifetime Health Cover Loading 2026: Your LHC % and Its Cost',
  description: `Lifetime Health Cover loading in 2026: ${K.pct(L.perYear, 0)} for each year over 30 at the 1 July before you join, ${K.pct(L.max, 0)} cap, removed after ${L.removedAfterYears} years. See it in AU dollars.`,
  h1: 'Lifetime Health Cover loading: your percentage and what it costs',
  intro: 'Enter your age on the 1 July before you take out hospital cover: the loading, and its price on the cheapest policy of your state, appear at once.',
  resume: `The Lifetime Health Cover loading is an extra ${K.pct(L.perYear, 0)} on the hospital part of your premium for every year you were over 30 on the 1 July before you first took out hospital cover. Someone who joins at 40 pays ${K.pct(at40, 0)} more than a person who joined by the deadline, someone who joins at 45 pays ${K.pct(at45, 0)}, and the figure stops at ${K.pct(L.max, 0)} however late you start. Your deadline is your LHC base day, the 1 July after your ${L.baseAge}st birthday. The loading is not permanent: it is removed once you have held hospital cover for ${L.removedAfterYears} continuous years, and you may spend up to ${K.num(L.daysOfAbsence)} days without cover over your life without it growing. It applies to hospital cover only, never to extras, and the government rebate is not paid on it. On the cheapest single policy in New South Wales, ${K.usd(nsw)} a year before the rebate, a ${K.pct(at40, 0)} loading adds ${K.usd(nsw * at40)} a year, about ${K.usd(K.loadCost(nsw, at40))} over the ten loaded years at today's premium.`,
  tool: 'lhc',
  toolArg: { age: 40, page: 0, rg: 'NSW' },
  faqs: [
    { q: 'How is the Lifetime Health Cover loading worked out?', a: `Take your age on the 1 July before the day you first buy hospital cover, subtract 30, and multiply by ${K.pct(L.perYear, 0)}. A person aged 39 on that 1 July has a loading of ${K.pct(K.lhc(39), 0)}, which is the example PrivateHealth.gov.au gives. The result is capped at ${K.pct(L.max, 0)}, reached at age 65. Your insurer applies it to the hospital part of every premium.` },
    { q: 'Is the LHC loading charged on extras cover?', a: 'No. The loading falls only on hospital cover, the part of a policy that pays for treatment as a private patient in hospital. Extras such as dental, optical or physiotherapy are not loaded, and holding extras alone does not stop a loading from building up. On a combined policy, the insurer splits the premium and loads only the hospital share.' },
    { q: 'Does the private health insurance rebate apply to the loading?', a: `No. The rebate is a percentage of the base premium only. If your hospital premium is ${K.usd(2000)} and your loading is ${K.pct(0.1, 0)}, you pay ${K.usd(200)} of loading in full and the rebate is worked out on the ${K.usd(2000)} alone. The ATO gives the same example with a ${K.usd(200)} loading on which no rebate is paid.` },
    { q: 'How do I get rid of a Lifetime Health Cover loading?', a: `Keep hospital cover for ${L.removedAfterYears} continuous years after the loading starts. Switching insurer or product keeps the count running when the cover is continuous; permitted gaps do not break it but do not count towards it. After those ten years the loading drops to zero. If you later cancel and stay uncovered beyond your ${K.num(L.daysOfAbsence)} permitted days, a new loading can apply when you come back.` },
    { q: 'Who never pays a Lifetime Health Cover loading?', a: `Anyone who takes out hospital cover by their LHC base day and keeps it, people born on or before 1 July 1934, and anyone treated as holding hospital cover, such as a veteran listed on a DVA Gold Card or an ADF member on continuous full-time service. New migrants have until the later of their base day and the first anniversary of full Medicare registration.` },
  ],
  body: (h) => `
<h2>The rule in four lines</h2>
<p>PrivateHealth.gov.au, the Ombudsman's consumer site, sets out the rule in a few sentences, and the ATO repeats it on its page about the loading. Read together, they come to this:</p>
<ul>
<li>The <strong>base day</strong> is the 1 July after your ${L.baseAge}st birthday. Take out hospital cover before it and you never pay a loading.</li>
<li>Every year you were over 30 on the 1 July before joining adds <strong>${K.pct(L.perYear, 0)}</strong>.</li>
<li>The loading cannot exceed <strong>${K.pct(L.max, 0)}</strong>.</li>
<li>It is <strong>removed after ${L.removedAfterYears} years</strong> of continuous hospital cover, and you can be without cover for <strong>${K.num(L.daysOfAbsence)} days</strong> in your life without penalty.</li>
</ul>
<p>The point that catches people is the date that counts. It is not your age on the day you sign, but your age on the 1 July before it. A person who turns 41 in August and joins in September is loaded on age 40, so ${K.pct(at40, 0)}, not ${K.pct(K.lhc(41), 0)}. Joining before your next 1 July therefore stops the meter for a full year.</p>
${h.table(['Age on the 1 July before joining', 'Loading', 'Extra per year on the cheapest NSW single policy'], [31, 35, 40, 45, 50, 55, 60, 65].map((a) => [String(a), K.pct(K.lhc(a), 0), K.usd(nsw * K.lhc(a))]), `Loading by age and its price on the cheapest exempt single policy in NSW and the ACT (${K.usd2(nsw / 12)} a month before rebate, PrivateHealth.gov.au file of ${K.PREM.release}).`, ['l', 'r', 'r'])}

<h2>What the percentage costs in dollars</h2>
<p>A percentage tells you little until you put a premium under it. The cheapest hospital policy that avoids the Medicare levy surcharge for a single person in New South Wales costs ${K.usd(nsw)} a year before the rebate in the October 2026 data. On that premium a ${K.pct(at45, 0)} loading, the figure for someone joining at 45, adds ${K.usd(nsw * at45)} a year. Over the ten loaded years it comes to about ${K.usd(K.loadCost(nsw, at45))} at today's price, and more in practice, since premiums rose ${K.dec(P.rebate.premiumRise2026 * 100, 2)} % on average on 1 April 2026.</p>
<p>The loading follows the policy you choose. On a Gold hospital policy at three or four times the price of a Basic one, the same percentage costs three or four times as much. That is one reason late joiners often start with a cheap policy that is enough to avoid the surcharge, then move up once the ten years have passed. Moving up does not restart the count.</p>
${h.mini('lhc', { t: 'Your loading on a couple policy', p: ['age', 'page'], d: { age: 44, page: 33 }, c: 'Open the full loading calculator' })}

<h2>Couples and families: the loading is averaged</h2>
<p>On a policy that covers two adults, the insurer averages the two loadings. PrivateHealth.gov.au gives the case of Lukas, who joins at 41 with a loading of ${K.pct(K.lhc(41), 0)}, and his partner Noor, who has held cover since her twenties and has none. Their couple policy carries ${K.pct(K.avgLoad([K.lhc(41), 0]), 0)}.lhc(41), 0)}. The same averaging covers every adult on the policy. PrivateHealth.gov.au gives the case of Lucy, a dependant with a disability who joins her parents' family cover at 33 with her own ${K.pct(K.lhc(33), 0)}: spread across three adults, the family policy carries ${K.pct(K.avgLoad([K.lhc(33), 0, 0]), 0)}.</p>

<h2>Gaps: the ${K.num(L.daysOfAbsence)} days</h2>
<p>Once you hold hospital cover after your base day, you can drop it for up to ${K.num(L.daysOfAbsence)} days in total across your life, roughly three years, without any change. If you cancel to live overseas for at least a year, the days abroad do not count towards them, and neither do days on a suspension your insurer approves. Past the allowance, the loading resumes: ${K.pct(L.perYear, 0)} on top of what you had, plus ${K.pct(L.perYear, 0)} for every further year without cover. The details are on ${h.a('lhc-days-of-absence', 'the days of absence page')}.</p>
${h.box('What the loading is not', `<p>It is not a tax and not the Medicare levy surcharge. The surcharge is charged by the ATO on your tax return each year you earn over the threshold without hospital cover. The loading is charged by your insurer inside your premium, once you do take cover. They pull in the same direction: one is a reason to join, the other a reason to join early. The page ${h.a('is-private-health-insurance-worth-it', 'is private health insurance worth it')} weighs them together.</p>`)}

<h2>Exceptions that change your base day</h2>
<p>New arrivals in Australia are given time. If you were not eligible for full Medicare cover on your base day, you have until the later of that day and the first anniversary of your full Medicare registration to take out hospital cover without a loading; the ${h.a('lhc-new-migrants', 'new migrants page')} has the dates. Australian citizens and permanent residents who were overseas on their base day have until the first anniversary of their return, and short trips home of up to ${L.overseasVisitDays} days do not end their time abroad (see ${h.a('lhc-overseas-returning-australians', 'returning from overseas')}). People born on or before 1 July 1934 are exempt altogether.</p>
<p>Your insurer is the one that applies the loading, from the information you give and from a transfer certificate when you switch funds. When you switch, your former insurer must give you a clearance certificate within 14 days, and that document carries your loading and your dates. If you think your percentage is wrong, ask the insurer which dates it used and compare them with ${h.src('phio_lhc', 'the Ombudsman rules')}.</p>

<h2>How the figures on this page are built</h2>
<p>The rule comes from ${h.src('phio_lhc')} and ${h.src('ato_lhc')}, both read on ${K.day(P.retrieved_at)}. The premiums come from the PrivateHealth.gov.au product file of ${K.day(K.PREM.release)}, published on ${h.src('datagov_phi', 'data.gov.au')} under a Creative Commons licence: we keep the open hospital policies whose excess stays within the surcharge limits and take the cheapest one per state and cover type. ${h.a('method', 'The method page')} lists every filter.</p>
`,
  related: ['lhc-base-day-turning-31', 'lhc-days-of-absence', 'lhc-10-year-removal', 'lhc-new-migrants', 'private-health-insurance-rebate', 'is-private-health-insurance-worth-it'],
  sources: ['phio_lhc', 'ato_lhc', 'phio_age', 'datagov_phi'],
});
