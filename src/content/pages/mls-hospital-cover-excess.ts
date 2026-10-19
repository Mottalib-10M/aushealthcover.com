import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, X = P.mls.excessLimit;
const one = K.usd(X.single), many = K.usd(X.other);
const nsw = K.cell('NSW', 'single'), nswC = K.cell('NSW', 'couple');
const at750 = K.cell('NSW', 'single').cheapest.excess === X.single;
const inc = 140000;
const s = K.mls({ status: 'single', you: { mlsIncome: inc } });

export default definePage({
  id: 'mls-hospital-cover-excess', group: 'surcharge', order: 7, slug: 'mls-hospital-cover-excess',
  nav: 'Excess limits for the surcharge', card: `${one} for one person, ${many} for a couple or family. Above that, the policy does not count.`,
  title: 'Hospital Cover Excess for the MLS 2026: Limits in AUD',
  description: `Hospital cover excess limits that avoid the Medicare levy surcharge in 2026: ${one} on a policy for one person, ${many} on any other. Test your own excess here.`,
  h1: 'Hospital cover excess and the surcharge: the two limits that decide',
  intro: `Pick who the policy covers and type its yearly excess: the answer says at once whether the policy is an appropriate level of cover for the surcharge.`,
  resume: `A hospital policy only protects you from the Medicare levy surcharge if its excess stays within a limit: ${one} or less on a policy that covers one person, ${many} or less on every other policy, couples and families included. The ATO calls a policy within those limits an appropriate level of private patient hospital cover. The excess is the amount you pay before your insurer pays for a claim, and PrivateHealth.gov.au adds that the limit is a yearly total: if you are admitted several times in the same year, the excess you pay across those stays cannot go beyond ${one} or ${many}. The tier of the policy does not matter, nor the price, nor whether it comes with extras. A single person with an income for MLS purposes of ${K.usd(inc)} who holds a policy with a higher excess is treated as having no cover and owes ${K.usd(s.total)} of surcharge for ${P.incomeYear}. The calculator above tells you which side of the line your policy sits on.`,
  tool: 'excess',
  toolArg: { who: 'one', xs: X.single },
  faqs: [
    { q: 'What is the maximum excess to avoid the Medicare levy surcharge?', a: `${one} a year on a hospital policy that covers only one person and ${many} a year on any other policy, such as a couple, single parent or family policy. Those limits come from the ATO's definition of an appropriate level of private patient hospital cover. A policy with a higher excess still pays hospital benefits, but for the surcharge it counts as no cover at all.` },
    { q: 'Does the excess limit apply per claim or per year?', a: `Per year. PrivateHealth.gov.au explains that when several hospital claims are made in the same year, the excess you pay in total cannot exceed ${one} for a single or ${many} for a couple or family. A policy that charges its excess on every admission without a yearly cap above those amounts would not meet the rule.` },
    { q: 'Is a co-payment the same as an excess for the surcharge?', a: `The ATO and PrivateHealth.gov.au set the limit on the excess, the amount you pay before your insurer pays for a claim. Some policies also charge a daily co-payment during a stay. The rules we read do not fold co-payments into the limit, so ask your insurer, who is the one that confirms whether a policy is an appropriate level of cover for the surcharge.` },
    { q: 'My policy had a high excess before 2000. Do I pay the surcharge?', a: 'Possibly not. PrivateHealth.gov.au says a person who bought a hospital policy with a higher excess than the limits of the time, on or before 24 May 2000, stays exempt from the surcharge while keeping continuous membership of that same hospital policy. Changing to another product ends that protection, and the current limits then apply.' },
    { q: 'Who confirms whether my policy meets the excess limits?', a: 'Your registered health insurer. The ATO tells taxpayers who are unsure whether their cover is at the appropriate level to ask their insurer, and you can ask the insurer for a statement of the days you and your dependants held an appropriate level of cover. Your Private Health Information Statement for the policy also shows its excess, which you can type into the calculator above.' },
  ],
  body: (h) => `
<h2>Two numbers, and what they apply to</h2>
<p>The rule is short. The ATO defines an appropriate level of private patient hospital cover as cover that a registered health insurer provides for hospital treatment in Australia, with an excess of ${one} or less on a policy covering only one person, or ${many} or less on all other policies. Everything else in this page follows from those two sentences.</p>
${h.table(['Policy type', 'Largest excess that still avoids the surcharge', 'Who it covers'], [
    ['Single', one, 'one adult'],
    ['Couple', many, 'two adults'],
    ['Single parent', many, 'one adult and dependent children'],
    ['Family', many, 'two adults and dependent children'],
  ], `Excess limits for the Medicare levy surcharge, read on ${h.src('ato_mls_cover', 'ato.gov.au')} and PrivateHealth.gov.au on ${K.day(P.retrieved_at)}.`, ['l', 'r', 'l'])}
<p>Notice what the limit is attached to: the number of people on the policy, not your marital status. A person in a couple who holds a policy in their own name only is on a single policy, so the lower ${one} limit applies to it. And the surcharge test then asks whether your spouse and your dependants were covered too. The family side of that question is on ${h.a('mls-couples', 'the couples page')}.</p>

<h2>What the excess is, and what it is not</h2>
<p>The excess is the amount you agree to pay yourself before the insurer pays for a hospital claim. Raising it lowers the premium, which is why policies with an excess at the top of the allowed range are among the cheapest that do the tax job. In the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, the cheapest single policy that avoids the surcharge in New South Wales and the ACT, ${nsw.cheapest.fund}'s ${nsw.cheapest.product}, carries an excess of ${K.usd(nsw.cheapest.excess)}${at750 ? ', exactly the limit' : ''}. The cheapest couple policy in the same state has a per-person excess of ${K.usd(nswC.cheapest.excess)} and a policy maximum of ${K.usd(nswC.cheapest.excessPolicy)}.</p>
<p>The limit is about the excess alone. It says nothing about which treatments the policy covers. A Basic policy that covers very little passes the test as well as a Gold one, provided the excess is low enough. It also says nothing about extras: a dental or optical policy with no excess at all does not avoid the surcharge, because extras cover is not hospital cover. Travel insurance and cover from an overseas fund are not hospital cover for the surcharge either.</p>
${h.mini('excess', { t: 'A couple policy with a large excess', p: ['who', 'xs'], d: { who: 'more', xs: 2000 }, c: 'Check another excess' })}

<h2>Why a few hundred dollars of excess can cost you the surcharge</h2>
<p>Insurers sell policies with excesses above the limits, and they can make sense for someone below the income threshold who wants cheap cover for a large hospital bill. For anyone above the threshold, the arithmetic changes. Take a single person with an income for MLS purposes of ${K.usd(inc)}. On a policy with an excess within ${one}, there is no surcharge. Move to a policy with a higher excess and the ATO treats the year as uncovered: the surcharge is ${K.pct(s.rate, 2)} of taxable income and reportable fringe benefits, ${K.usd(s.total)} for the full year in ${P.incomeYear}. The premium you saved by choosing the higher excess has to beat that figure, which it rarely does at the bottom of the market.</p>
<p>The same reasoning applies in reverse when you compare quotes. Two policies a few dollars apart may sit on different sides of the line. Check the excess first, then the price. The ${h.a('basic-hospital-cover', 'basic hospital cover page')} lists the cheapest policies within the limits in each state.</p>

<h2>The yearly cap</h2>
<p>PrivateHealth.gov.au spells out a detail the ATO page leaves implicit: the limits are yearly totals. If you are admitted to hospital twice in a year, the excess you pay across both stays cannot exceed ${one} on a single policy or ${many} on a couple or family policy. Policies built that way show an excess per admission and a maximum per year in their Private Health Information Statement. It is the yearly maximum that you compare with the limit.</p>
${h.box('A protection from 2000 for long-standing members', `<p>A small group of members keep an older right. PrivateHealth.gov.au states that a high-income earner who bought a hospital policy with an excess above the limits of the time on or before 24 May 2000 stays exempt from the surcharge while keeping continuous membership of that same hospital policy. Moving to another product ends it.</p>`)}

<h2>How the limits have moved</h2>
<p>The current limits have applied since 1 April 2019, as part of the reforms that also created the Gold, Silver, Bronze and Basic tiers. Before that date the maximum excess that avoided the surcharge was lower. A policy that was within the old limits is within the new ones; the change only opened the door to policies with a larger excess.</p>

<h2>Checking your own policy</h2>
<p>Three documents tell you where you stand. The Private Health Information Statement of the policy gives its excess and its tier. A statement from your insurer, which the ATO says you can ask for, gives the number of days you and your dependants held an appropriate level of cover, which is the figure your tax return needs. And if you are unsure, the ATO's advice is to ask your registered health insurer, which knows how its own excess works. Our calculator only checks the number you type against the two limits; it cannot read the conditions of a policy.</p>
<p>If your policy falls outside the limits for part of the year, for instance because you changed product in March, the surcharge counts the days without appropriate cover. ${h.a('mls-part-year-cover', 'Part-year cover')} works that out, and ${h.a('method', 'the method page')} explains how the premiums in our tables are filtered on these same limits.</p>
`,
  related: ['basic-hospital-cover', 'mls-part-year-cover', 'mls-thresholds', 'mls-couples', 'private-health-insurance', 'compare-health-insurance'],
  sources: ['ato_mls_cover', 'phio_mls', 'phio_changes', 'ato_m2'],
});
