import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, D = P.daysInYear;
const inc = 135000;
const full = K.mls({ status: 'single', you: { mlsIncome: inc } });
const part = (ex: number) => K.mls({ status: 'single', you: { mlsIncome: inc }, daysWithout: D - ex });
const rows = [0, 92, 183, 274, D].map((ex) => [String(ex), String(D - ex), K.usd(part(ex).total)]);

export default definePage({
  id: 'mls-visa-holders-expats', group: 'surcharge', order: 10, slug: 'mls-visa-holders-expats',
  nav: 'Visa holders and expats', card: 'A Medicare levy exemption also removes the surcharge, if every dependant is exempt.',
  title: 'MLS for Visa Holders and Expats 2026: Exempt Days in AUD',
  description: `Medicare levy surcharge for visa holders and expats in 2026-27: a levy exemption also removes the surcharge for those days, if your dependants are exempt too.`,
  h1: 'Medicare levy surcharge for visa holders, expats and foreign residents',
  intro: 'Enter the days of 2026-27 for which you hold a Medicare levy exemption and your income: the surcharge is charged on the other days only.',
  resume: `Temporary residents who are not entitled to Medicare and foreign residents for tax purposes usually pay no Medicare levy surcharge, but not because of their visa. They pay none because they qualify for a Medicare levy exemption, and the ATO's rule is that a person in a Medicare levy exemption category for a period is also exempt from the surcharge for that period. The condition that catches people is the family one: the exemption only works if you have no dependants for the period, or if all your dependants, your spouse included, are in an exemption category too. A temporary resident shows the period with a Medicare Entitlement Statement from Services Australia. Overseas Visitors Health Cover and Overseas Student Health Cover do not count as hospital cover for the surcharge, and neither does a policy from an overseas insurer. For a single person with ${K.usd(inc)} of income for MLS purposes and no exemption, the ${P.incomeYear} surcharge is ${K.usd(full.total)} for the full year; the calculator above removes your exempt days.`,
  tool: 'visa',
  toolArg: { ex: 200, inc, st: 'single', pinc: 0, ch: 1 },
  faqs: [
    { q: 'Do temporary visa holders pay the Medicare levy surcharge?', a: 'Not for the days they are in a Medicare levy exemption category. A temporary resident who was not entitled to Medicare benefits can claim a full levy exemption with a Medicare Entitlement Statement, and that exemption also covers the surcharge, provided they had no dependants or every dependant, the spouse included, was exempt as well. Holding a visa alone does not exempt anyone.' },
    { q: 'Does Overseas Visitors Health Cover avoid the surcharge?', a: 'No. PrivateHealth.gov.au lists Overseas Visitors Cover and Overseas Student Health Cover among the policies that do not provide an exemption, and the ATO says they are not complying policies and earn no rebate. A visitor with OVHC who is not otherwise exempt answers No at label E of question M2 and records the days for which they are exempt.' },
    { q: 'How long does a Medicare Entitlement Statement take?', a: 'Up to eight weeks, according to the ATO. Applications open on 1 July and are made online through myGov. The ATO asks you to wait until you receive the statement before you lodge your tax return, so apply as soon as the income year ends. The statement shows the period in the year for which you were not entitled to Medicare benefits.' },
    { q: 'I am covered by a reciprocal health care agreement. Can I avoid the surcharge?', a: 'PrivateHealth.gov.au says yes, by buying an approved hospital policy from a registered Australian insurer. It warns that for people with reciprocal Medicare benefits such a policy provides limited benefits for hospital treatment, and that you would face significant costs as a private patient. You may prefer to compare the surcharge with the premium before buying.' },
    { q: 'Does an expat who is a foreign resident for tax pay the surcharge?', a: 'A foreign resident for tax purposes for the full year can claim a full exemption from the Medicare levy, which also removes the surcharge. For part of a year, the levy exemption applies to that period if you had no dependants or all your dependants were in an exemption category. The days you were an Australian resident are tested in the usual way.' },
  ],
  body: (h) => `
<h2>The exemption comes from the levy, not from the visa</h2>
<p>There is no surcharge rule written for visa holders or for Australians abroad. There are two general rules that meet. The first is in the M2 instructions of the tax return: you are exempt from the surcharge for any period in which you and all your dependants either held an appropriate level of private patient hospital cover or were in a Medicare levy exemption category. The second is the list of those categories, on the ATO's Medicare levy exemption pages. Two of them matter here.</p>
<ul>
<li><strong>Not entitled to Medicare benefits.</strong> A temporary resident for Medicare purposes who has a Medicare Entitlement Statement for a period can claim a full levy exemption for it, known as category 3 on the return.</li>
<li><strong>Foreign resident for tax purposes.</strong> A foreign resident for the full year can claim a full levy exemption, known as category 2; for part of a year, the exemption covers that period.</li>
</ul>
<p>Both carry the same proviso: you had no dependants during the period, or all your dependants, including your spouse, were in a Medicare levy exemption category for it. The ATO's guidance for overseas visitors states the consequence in a line: if you qualify for a Medicare levy exemption, you are also exempt from paying the Medicare levy surcharge.</p>

<h2>Priya and Jed: the spouse decides</h2>
<p>The ATO gives two examples for ${P.mls.prior.year}. Priya held a Temporary Skill Shortage visa, subclass 482, had no dependants and was not entitled to Medicare benefits. With a Medicare Entitlement Statement for the full year she claims a full exemption for all ${D} days. Jed held the same visa and was not entitled to Medicare either, but his spouse was. Because his spouse was not in an exemption category, Jed cannot claim the exemption, despite his statement. For the surcharge, that means Jed's days are tested like a resident's: if his income for MLS purposes, combined with his spouse's, is above the family threshold and they hold no appropriate hospital cover, the surcharge applies.</p>
${h.box('Before you lodge', `<p>Applications for a Medicare Entitlement Statement open on 1 July and are made online through myGov. The ATO warns that processing can take up to eight weeks and that you must wait for the statement before lodging your return. Keep a copy: it is the evidence for the exempt period.</p>`)}

<h2>What does not count as cover</h2>
<p>Many temporary residents hold health insurance because their visa requires it, and assume it settles the surcharge question. It does not. PrivateHealth.gov.au lists the policies that do not provide an exemption from the surcharge: general treatment cover without hospital cover, Overseas Visitors Health Cover, Overseas Student Health Cover, and cover held with non-registered insurers such as international ones. The ATO adds that travel insurance is not private patient hospital cover, and that cover from an overseas fund is not either. Visitors with OVHC or OSHC answer No at label E of question M2 and record at label A the number of days they are exempt.</p>
${h.table(['Policy held', 'Avoids the surcharge', 'Rebate'], [
    ['OVHC or OSHC from an Australian insurer', 'no', 'no'],
    ['Policy from an overseas insurer', 'no', 'no'],
    ['Complying hospital policy, not eligible for Medicare', 'see the exemption rules', 'no'],
    ['Complying hospital policy, eligible for Medicare', `yes, if the excess is within ${K.usd(P.mls.excessLimit.single)} or ${K.usd(P.mls.excessLimit.other)}`, 'yes'],
  ], `From the ATO guide for overseas visitors by policy type and PrivateHealth.gov.au, read on ${K.day(P.retrieved_at)}.`, ['l', 'l', 'l'])}
<p>A visitor who is not eligible for Medicare may still buy a complying policy from an Australian insurer. It earns no rebate, and the ATO asks such visitors to delete any pre-filled private health insurance details before they lodge in myTax, answer No to the cover question, and give the number of days they do not have to pay the surcharge, usually ${D}.</p>

<h2>Exempt for part of the year</h2>
<p>Arrivals, departures and changes of visa rarely fall on 1 July. The surcharge is charged per day, so only the days outside the exemption, without appropriate hospital cover, are charged. For a single person with ${K.usd(inc)} of income for MLS purposes in ${P.incomeYear}, the table shows the surcharge by number of exempt days.</p>
${h.table(['Exempt days', 'Days charged', 'Surcharge'], rows, `Single, no dependants, ${K.TN[full.tier].toLowerCase()} rate of ${K.pct(full.rate, 2)}, no hospital cover on the charged days.`, ['r', 'r', 'r'])}
${h.mini('visa', { t: 'Your exempt days and your income', p: ['ex', 'inc'], d: { ex: 120, inc: 150000 }, c: 'Open the full visa calculator' })}

<h2>Reciprocal agreements: a policy that does the tax job only</h2>
<p>Visitors from a country with a reciprocal health care agreement have reciprocal Medicare benefits, and PrivateHealth.gov.au answers their question directly: such a visitor who earns over the threshold can avoid the surcharge by buying an approved hospital policy. It adds a frank warning: for people with reciprocal benefits, that policy will provide limited benefits for hospital treatment, and large costs follow an admission as a private patient. The comparison on ${h.a('is-private-health-insurance-worth-it', 'is private health insurance worth it')} tells you whether the premium or the surcharge costs less.</p>

<h2>Australians abroad and coming home</h2>
<p>An Australian who becomes a foreign resident for tax purposes while working overseas can claim the levy exemption for that period, on the same family condition. On return, the residency days are tested normally, and the Lifetime Health Cover rules give returning Australians extra time before a loading applies: ${h.a('lhc-overseas-returning-australians', 'returning from overseas')} has the dates. Cancelling an Australian hospital policy before leaving can bring the surcharge for the days you remain a resident without cover, which the ATO suggests weighing against the premium you save.</p>
`,
  related: ['lhc-new-migrants', 'lhc-overseas-returning-australians', 'mls-part-year-cover', 'mls-hospital-cover-excess', 'medicare-levy-vs-surcharge', 'mls-thresholds'],
  sources: ['ato_not_entitled', 'ato_foreign_res', 'ato_overseas', 'ato_m2', 'phio_mls'],
});
