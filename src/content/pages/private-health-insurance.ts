import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, AD = P.ageDiscount;
const vic = K.cell('VIC', 'single'), qld = K.cell('QLD', 'couple');
const ex = K.cmp({ status: 'single', you: { mlsIncome: 118000 }, region: 'VIC', oldest: 29, loading: 0 });

export default definePage({
  id: 'private-health-insurance', group: 'decide', order: 2, slug: 'private-health-insurance',
  nav: 'Private health insurance and tax', card: 'The three government levers on a policy, explained from scratch.',
  title: 'Private Health Insurance 2026: The Tax Rules in Australia',
  description: `Private health insurance in Australia in 2026-27: what hospital, extras and ambulance cover change at tax time: surcharge, rebate, loading and key dates.`,
  h1: 'Private health insurance in Australia: what it changes at tax time',
  intro: 'New to the subject? Enter your income and state: the calculator shows what the tax system charges you without hospital cover and what the cheapest policy costs with it.',
  resume: `Private health insurance in Australia comes in two parts that the tax system treats very differently. Hospital cover pays towards treatment as a private patient in hospital; general treatment cover, often called extras, pays towards dental, optical, physiotherapy and similar services; some policies add ambulance. Only hospital cover takes you out of the Medicare levy surcharge, the extra ${K.pct(M.rates[1], 0)} to ${K.pct(M.rates[3], 1)} that a single person with an income for MLS purposes over ${K.usd(M.single[0])} pays in ${P.incomeYear} without it. The government rebate, by contrast, applies to hospital, general treatment and ambulance policies alike, from ${K.pct(K.reb(0, 40), 3)} of the premium for most people under 65 down to nothing at the top income tier. The Lifetime Health Cover loading, finally, is added by your insurer if you first buy hospital cover after the 1 July following your 31st birthday. Those three rules, the surcharge, the rebate and the loading, are the whole tax side of private health insurance.`,
  tool: 'cover',
  toolArg: { st: 'single', inc: 118000, rg: 'VIC', age: 29 },
  faqs: [
    { q: 'Do I have to buy private health insurance in Australia?', a: `No. Medicare covers residents as public patients and nobody is obliged to hold a private policy. The law only adds a cost if you do not: the Medicare levy surcharge when your income for MLS purposes is over ${K.usd(M.single[0])} single or ${K.usd(M.family[0])} family in ${P.incomeYear}, and the Lifetime Health Cover loading if you take hospital cover late.` },
    { q: 'Which kinds of policy get the government rebate?', a: 'PrivateHealth.gov.au says the rebate applies to hospital, general treatment and ambulance policies provided by Australian registered health insurers. It does not apply to Overseas Visitors Health Cover or to other types of insurance such as travel insurance. The percentage depends on your income tier and on the age of the oldest person on the policy.' },
    { q: 'What is the age-based discount for people under 30?', a: `Since 1 April 2019 insurers may offer people aged 18 to 29 a discount on hospital premiums of ${K.pct(P.lhc.perYear, 0)} for each year under 30, up to ${K.pct(AD.max, 0)} for ages 18 to 25. The discount is kept until 41, then phased out by ${K.pct(AD.phaseOutPerYear, 0)} a year. It is optional for the insurer, and our premiums do not include it.` },
    { q: 'Can adult children stay on a family policy?', a: `The law lets insurers cover single dependants aged 18 to ${P.dependants.policyDependantMaxAge}, and dependants with a disability without an age limit, but each insurer chooses its own age range. For the surcharge, a person covered as a dependant on a family hospital policy is not liable as long as they have no spouse or dependants of their own.` },
    { q: 'When do the figures for private health insurance change?', a: `Twice a year. Premiums and rebate percentages change on 1 April; the ${P.incomeYear} rebate rates run to 31 March 2027. Income thresholds for the surcharge and the rebate change on 1 July with the income year. Your tax return then settles both: the surcharge at question M2 and any rebate not already taken as a premium reduction.` },
  ],
  body: (h) => `
<h2>Three products, one tax rule that matters</h2>
<p>An Australian health insurer sells hospital cover, general treatment cover and ambulance cover, alone or combined. Since 1 April 2020 every hospital policy has been classified in one of four tiers, Gold, Silver, Bronze or Basic, with Plus versions of the lower three for policies that cover more than the minimum. The tier tells you what a policy must cover; it tells the tax office nothing. For the surcharge, the only question is whether you hold hospital cover from a registered Australian insurer with an excess of no more than ${K.usd(M.excessLimit.single)} on a policy for one person or ${K.usd(M.excessLimit.other)} on a couple or family policy.</p>
${h.table(['Type of cover', 'Avoids the surcharge', 'Gets the rebate', 'Can carry the LHC loading'], [
    ['Hospital cover within the excess limits', 'Yes', 'Yes', 'Yes'],
    ['Hospital cover above the excess limits', 'No', 'Yes', 'Yes'],
    ['General treatment (extras) only', 'No', 'Yes', 'No'],
    ['Ambulance only', 'No', 'Yes', 'No'],
    ['Overseas Visitors or Overseas Student Health Cover', 'No', 'No', 'No'],
  ], 'How each kind of policy is treated, from the PrivateHealth.gov.au pages on the surcharge, the rebate and Lifetime Health Cover.', ['l', 'l', 'l', 'l'])}

<h2>The surcharge: the cost of having no hospital cover</h2>
<p>The Medicare levy surcharge is charged by the ATO on your tax return, on top of the ${K.pct(P.medicareLevy.rate, 0)} Medicare levy most taxpayers pay. It applies for each day of the income year on which you, your spouse or a dependent child had no appropriate hospital cover while your income for MLS purposes was over the threshold. In ${P.incomeYear} the rate is ${K.pct(M.rates[1], 0)} from ${K.usd(M.single[0] + 1)} for a single person, ${K.pct(M.rates[2], 2)} from ${K.usd(M.single[1] + 1)} and ${K.pct(M.rates[3], 1)} from ${K.usd(M.single[2] + 1)}. The ${h.a('mls-thresholds', 'thresholds page')} has the family figures, and ${h.a('income-for-mls-purposes', 'income for MLS purposes')} explains why that income is larger than your taxable income.</p>
<p>A Victorian aged 29 on ${K.usd(118000)} pays ${K.usd(ex.mls.total)} of surcharge without cover. The cheapest exempt single policy in Victoria costs ${K.usd2(vic.cheapest.monthly)} a month before the rebate, ${K.usd(ex.premium.net)} a year after it, so the policy is ${ex.coverCheaper ? `${K.usd(ex.saving)} cheaper than the tax` : `${K.usd(-ex.saving)} dearer than the tax`}.</p>
${h.mini('mls', { t: 'Your surcharge without cover', p: ['st', 'inc', 'pinc'], d: { st: 'single', inc: 118000 }, c: 'Open the surcharge calculator' })}

<h2>The rebate: a government discount on the premium</h2>
<p>You can take the rebate as reduced premiums throughout the year, the insurer applying the percentage you nominate, or pay the full premium and receive a refundable tax offset when you lodge your return. Either way, the percentage depends on two things, the income tier of the policy holder (the same tiers as the surcharge) and the age of the oldest person on the policy. The ATO warns that if you claim too much rebate as a premium reduction, for instance because your income moved into a higher tier, you may have a tax liability when you lodge. The ${h.a('private-health-insurance-rebate', 'rebate page')} has the full table and ${h.a('rebate-premium-reduction-or-tax-offset', 'premium reduction or tax offset')} compares the two ways of claiming.</p>

<h2>The loading: the price of joining late</h2>
<p>If you buy hospital cover for the first time after your Lifetime Health Cover base day, normally the 1 July after your 31st birthday, the insurer adds ${K.pct(P.lhc.perYear, 0)} to the hospital premium for each year you were over 30 on the 1 July before joining, up to ${K.pct(P.lhc.max, 0)}, for ${P.lhc.removedAfterYears} continuous years. The rebate is not paid on that extra. New migrants and Australians returning from overseas have their own deadlines. The ${h.a('lifetime-health-cover-loading', 'loading page')} prices it on the cheapest policy of your state.</p>

<h2>The calendar of a policy holder</h2>
<p>Three dates organise the year. On 1 April insurers apply their new premiums and the rebate percentages are adjusted: in 2026 the average rise was ${K.dec(P.rebate.premiumRise2026 * 100, 2)} % and the rebate factor ${K.dec(P.rebate.raf2026, 3)}. On 1 July the surcharge and rebate thresholds move with the new income year. Between July and October most people lodge their return, where question M2 settles the surcharge with the help of the private health insurance statement your insurer sends. A couple policy in Queensland, for instance, starts at ${K.usd2(qld.cheapest.monthly)} a month before the rebate in the file of ${K.day(K.PREM.release)}; that figure will change on 1 April 2027.</p>

<h2>What to decide, and where to go next</h2>
<p>If your income is under the threshold, private cover is a health and budget choice with no tax at stake, apart from the loading that builds up after 31. If it is over, the cheapest exempt policy is almost always cheaper than the surcharge, and the question becomes how much more you are willing to pay for cover you would use. ${h.a('is-private-health-insurance-worth-it', 'Is private health insurance worth it')} finds your break-even income, ${h.a('compare-health-insurance', 'compare health insurance')} reads the whole policy file for your state, and ${h.a('basic-hospital-cover', 'basic hospital cover')} looks at the cheapest tier in detail.</p>
`,
  related: ['is-private-health-insurance-worth-it', 'compare-health-insurance', 'basic-hospital-cover', 'private-health-insurance-rebate', 'lifetime-health-cover-loading', 'income-for-mls-purposes'],
  sources: ['phio_mls', 'phio_rebate', 'phio_lhc', 'phio_changes', 'phio_age', 'ato_mls_rates', 'datagov_phi'],
});
