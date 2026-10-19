import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc, AD = P.ageDiscount;
const vic = K.cell('VIC', 'single').cheapest.monthly * 12;
const reb = K.reb(0, 31);
const mls115 = K.mls({ status: 'single', you: { mlsIncome: 115000 } }).total;
const late = (y: number) => K.loadCost(vic, K.lhc(L.freeUntilAge + y));

export default definePage({
  id: 'lhc-base-day-turning-31', group: 'lhc', order: 2, slug: 'lhc-base-day-turning-31',
  nav: 'LHC base day at 31', card: 'Your deadline is the 1 July after your 31st birthday. What a delay costs.',
  title: 'LHC Base Day 2026: Turning 31 and Your Hospital Cover Date',
  description: `LHC base day in 2026: the 1 July after your 31st birthday is the deadline to take hospital cover with no Lifetime Health Cover loading. What a delay costs.`,
  h1: 'Your Lifetime Health Cover base day: the deadline that follows your 31st birthday',
  intro: 'Enter your age on 1 July 2026 and how long you would wait: the calculator adds the loading you would carry for ten years and the surcharge paid in the meantime.',
  resume: `Your Lifetime Health Cover base day is, for most people, the 1 July following your 31st birthday. Hold private hospital cover on that day and keep it, and you will never pay a loading. Miss it, and the first policy you buy later carries ${K.pct(L.perYear, 0)} extra for every year you were over 30 on the 1 July before you joined, for ten years. If you turn 31 in March 2027, your base day is 1 July 2027; if you turned 31 in September 2026, it is also 1 July 2027. Someone born in May 1995 turned 31 in May 2026 and reached their base day on 1 July 2026: buying in August 2026 already costs ${K.pct(K.lhc(31), 0)}. On the cheapest single policy in Victoria, ${K.usd(vic)} a year before the rebate, each ${K.pct(L.perYear, 0)} of loading adds about ${K.usd(vic * L.perYear)} a year. Under 31 there is no loading at all, and some insurers give younger people an age-based discount.`,
  tool: 'wait',
  toolArg: { age: 31, yrs: 3, inc: 115000, rg: 'VIC' },
  faqs: [
    { q: 'When exactly is my Lifetime Health Cover base day?', a: `For most people, the 1 July that follows the 31st birthday. A person who turns 31 on 2 July has almost a full year; one who turns 31 on 30 June has one day. Exceptions move the date for new migrants and for Australians who were overseas on that 1 July. The base day is never earlier than 1 July 2000, when the scheme began.` },
    { q: 'I had cover on my 31st birthday but cancelled before 1 July. Is that enough?', a: 'No. What counts is holding hospital cover on the base day itself. PrivateHealth.gov.au gives the case of Chloe, who turned 31 in January 2019, held cover on her birthday, cancelled in March and took out a new policy in September. Her base day was 1 July 2019, she had no cover on it, and she pays a 2 % loading.' },
    { q: 'Does the loading start the day after my base day or a year later?', a: `At once. Join the day after your base day and you were 31 on the 1 July before joining, so the loading is ${K.pct(K.lhc(31), 0)}. Each further 1 July without cover adds ${K.pct(L.perYear, 0)}: someone who was 32 on the 1 July before joining pays ${K.pct(K.lhc(32), 0)}, and someone who was 35 pays ${K.pct(K.lhc(35), 0)}. The loading then stays fixed for the ten loaded years.` },
    { q: 'Can I keep an age-based discount if I join before 30?', a: `Insurers may offer up to ${K.pct(AD.max, 0)} off hospital premiums to people who join between 18 and 29, ${K.pct(L.perYear, 0)} for each year under 30. The discount is kept until 41, then reduced by ${K.pct(AD.phaseOutPerYear, 0)} a year. It is optional for the insurer, and dependants on a family policy cannot receive it.` },
  ],
  body: (h) => `
<h2>Finding your own date</h2>
<p>The base day depends only on your date of birth, unless one of the special cases below applies. Take the date of your 31st birthday, then go forward to the next 1 July. The examples cover the people turning 31 around now.</p>
${h.table(['Date of birth', '31st birthday', 'LHC base day', 'Loading if you join after it, before the next 1 July'], [
  ['15 March 1995', '15 March 2026', '1 July 2026', K.pct(K.lhc(31), 0)],
  ['2 July 1995', '2 July 2026', '1 July 2027', K.pct(K.lhc(31), 0)],
  ['30 June 1996', '30 June 2027', '1 July 2027', K.pct(K.lhc(31), 0)],
], 'The 1 July that follows the 31st birthday.', ['l', 'l', 'l', 'r'])}
<p>PrivateHealth.gov.au words the rule as the later of 1 July 2000 or the 1 July following your 31st birthday. The ATO puts it from the other side: you do not pay the loading if you are under 31, or if you hold an appropriate level of private patient hospital cover before your base day (${h.src('ato_lhc', 'ATO')}). Only private hospital cover from an Australian registered insurer counts. Extras cover, Overseas Visitors Health Cover, Overseas Student Health Cover and foreign insurance do not.</p>

<h2>What one year of hesitation costs</h2>
<p>The loading is easy to underrate because it starts small. At ${K.pct(K.lhc(31), 0)}, on the cheapest exempt single policy in Victoria, it adds ${K.usd(vic * K.lhc(31))} a year. But it applies for ten years, and it grows with every 1 July you let pass.</p>
${h.table(['Years after the base day', 'Loading', 'Extra per year', 'Extra over the 10 loaded years'], [0, 1, 2, 3, 5, 9].map((y) => [y === 0 ? 'under one' : String(y), K.pct(K.lhc(L.baseAge + y), 0), K.usd(vic * K.lhc(L.baseAge + y)), K.usd(late(y + 1))]), `Cheapest single hospital policy in Victoria that avoids the surcharge, ${K.usd2(vic / 12)} a month before the rebate, PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. Premium held flat.`, ['l', 'r', 'r', 'r'])}
<p>Those figures are on the cheapest policy available. On a policy three times the price, every figure triples. The rebate does not soften it, because the rebate is worked out on the premium without the loading.</p>
${h.mini('wait', { t: 'Waiting from your base day', p: ['yrs', 'inc'], d: { age: 31, yrs: 5, inc: 95000 }, c: 'Open the waiting cost calculator' })}

<h2>Below the surcharge threshold, the loading is the only stick</h2>
<p>For someone on ${K.usd(115000)}, waiting also means the Medicare levy surcharge: ${K.usd(mls115)} a year at the ${P.incomeYear} tier 1 rate, against ${K.usd(vic * (1 - K.reb(1, 31)))} for the cheapest Victorian policy after the tier 1 rebate, so the surcharge is ${mls115 > vic * (1 - K.reb(1, 31)) ? 'the dearer option even before the loading is counted' : 'cheaper for now, until the loading is counted'}. Below ${K.usd(P.mls.single[0])} there is no surcharge, and the decision rests on the loading and on what you want the cover for. A 31 year old at the base tier pays ${K.usd(vic * (1 - reb))} a year for that policy after the ${K.pct(reb, 3)} rebate. ${h.a('is-private-health-insurance-worth-it', 'Is private health insurance worth it')} weighs the two sides at each income.</p>

<h2>Three common mistakes</h2>
<p>The first is counting from the birthday instead of from the 1 July after it. Turning 31 does not start the loading; the following 1 July does, and that date can be almost a year away. The second is thinking that any policy will do. A policy with extras only, an insurance policy from another country, or Overseas Visitors Health Cover kept from before permanent residence does not count as hospital cover for the loading. The third is cancelling soon after the base day. Holding cover on the base day protects you, but a later gap counts against your lifetime allowance of ${K.num(L.daysOfAbsence)} days, and once that is used a loading returns on rejoining.</p>
<p>A fourth, less common, is believing that a loading is permanent. It is removed after ten years of continuous hospital cover, so a person who joins at 33 with a ${K.pct(K.lhc(33), 0)} loading pays it until about 43 and then pays the same premium as everyone else. The ${h.a('lhc-10-year-removal', 'ten year removal page')} counts down the months.</p>

<h2>Young people and the age-based discount</h2>
<p>Since 1 April 2019, insurers may offer people aged 18 to 29 a discount on hospital premiums: ${K.pct(L.perYear, 0)} for each year under 30, up to ${K.pct(AD.max, 0)} for those who join between 18 and 25 (${h.src('phio_age', 'PrivateHealth.gov.au')}). The discount stays until 41, then falls by ${K.pct(AD.phaseOutPerYear, 0)} each year. It is the mirror image of the loading, but voluntary: an insurer can offer it on some products and not others, and a person covered as a dependant on a family policy cannot have it. Our premiums are the full prices of the file, before any such discount.</p>
${h.box('Dependants on a parent\'s policy', `<p>PrivateHealth.gov.au states that dependants who hold hospital cover on their base day avoid the loading. If you are still on your parents' policy on your base day, you meet the deadline; the question then is to take a policy of your own without a gap of more than your permitted days. The ${h.a('lhc-days-of-absence', 'days of absence page')} explains the allowance.</p>`)}

<h2>When the date moves</h2>
<p>Two groups have a different base day. New migrants have until the later of their usual base day and the first anniversary of their full Medicare registration (${h.a('lhc-new-migrants', 'new migrants')}). Australian citizens and permanent residents who were overseas on their base day have until the first anniversary of their return (${h.a('lhc-overseas-returning-australians', 'returning from overseas')}). Members of the ADF on continuous full-time service whose care is provided through the ADF, and people listed on a DVA Gold Card, are treated as holding hospital cover. The full rule is on ${h.a('lifetime-health-cover-loading', 'the Lifetime Health Cover loading page')}.</p>
`,
  related: ['lifetime-health-cover-loading', 'lhc-new-migrants', 'lhc-days-of-absence', 'is-private-health-insurance-worth-it', 'basic-hospital-cover'],
  sources: ['phio_lhc', 'ato_lhc', 'phio_age', 'datagov_phi'],
});
