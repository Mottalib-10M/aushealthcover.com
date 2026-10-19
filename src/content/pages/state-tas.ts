import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('TAS'), c = S.one, P = K.P;
const ru = c.runnersUp[0];
const young = (m: number, d: number) => m * (1 - d);
const r28 = S.vs(115000, undefined, 'single', undefined, 28);
const gold = c.byTier.Gold;

export default definePage({
  id: 'state-tas', group: 'state', order: 6, slug: 'cheapest-hospital-cover-tas',
  nav: 'Tasmania', card: `From ${K.usd2(c.cheapest.monthly)} a month; the cheapest policy has no age-based discount.`,
  title: 'Hospital Cover Tasmania 2026: Cheapest vs the MLS by Age',
  description: `Hospital cover in Tasmania for 2026: the cheapest policy avoiding the surcharge costs ${K.usd2(c.cheapest.monthly)} a month, but under 30 a discounted policy can cost less. See both.`,
  h1: 'Hospital cover in Tasmania: the cheapest policy depends on your age',
  intro: 'In Tasmania the lowest list price and the lowest price you can pay are not always the same policy. Your age decides.',
  resume: `The cheapest open hospital policy that avoids the Medicare levy surcharge in Tasmania is ${c.cheapest.product} from ${c.cheapest.fund}, at ${K.usd2(c.cheapest.monthly)} a month for one person before the rebate in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. Unlike the cheapest policies of most other states, it offers no age-based discount. The next one, from ${ru.fund} at ${K.usd2(ru.monthly)}, does: insurers may take up to ${K.pct(P.ageDiscount.max, 0)} off the hospital premium of someone who joined between 18 and 25, which would bring it to ${K.usd2(young(ru.monthly, P.ageDiscount.max))}. The surcharge does not care about age: a 28-year-old on ${K.usd(115000)} without cover pays ${K.usd(r28.mls.total)}, exactly what a 50-year-old on the same income pays. The calculator above uses list prices; this page shows where a discount changes the ranking, and the price of every hospital tier in the state.`,
  tool: 'cover',
  toolArg: { rg: 'TAS', inc: 115000, age: 28 },
  faqs: [
    { q: 'What is the age-based discount on hospital cover?', a: `Insurers may offer people aged 18 to 29 a discount of ${K.pct(P.lhc.perYear, 0)} for each year under 30 at the time they join, up to ${K.pct(P.ageDiscount.max, 0)} for ages 18 to 25. It is kept until 41, then falls by ${K.pct(P.ageDiscount.phaseOutPerYear, 0)} a year. It is optional for the insurer, which is why some policies have it and some do not.` },
    { q: 'Does the cheapest Tasmanian policy cover more than accidents?', a: `Its name in the file is "${c.cheapest.product}", which describes what it is built for. It is a Basic tier policy with a ${K.usd(c.cheapest.excess)} excess, enough to avoid the surcharge. What it pays for is listed in its Private Health Information Statement; read it before relying on the policy for planned treatment.` },
    { q: 'How much does Gold hospital cover cost in Tasmania?', a: `The cheapest Gold policy for one person costs ${K.usd2(gold.cheapest)} a month before the rebate, from ${gold.fund}, and the median Gold policy ${K.usd2(gold.median)}. For a family, the cheapest Gold policy is ${K.usd2(S.fam.byTier.Gold.cheapest)}. At those prices Gold costs more than the surcharge for most single people under tier 3.` },
  ],
  body: (h) => `
<h2>List price against what a young member pays</h2>
<p>The table applies the largest allowed discount by joining age to the three cheapest single policies of the state. It is the maximum an insurer may offer, not a promise: check the policy, since a discount is attached to the product.</p>
${h.table(['Policy', 'Discount offered', 'List price', 'Joined at 25 or younger', 'Joined at 27', 'Joined at 29'], [c.cheapest, ...c.runnersUp].map((p) => [`${p.fund}, ${p.product}`, p.ageDiscount ? 'yes' : 'no', K.usd2(p.monthly), K.usd2(p.ageDiscount ? young(p.monthly, P.ageDiscount.max) : p.monthly), K.usd2(p.ageDiscount ? young(p.monthly, P.ageDiscount.byAge['27']) : p.monthly), K.usd2(p.ageDiscount ? young(p.monthly, P.ageDiscount.byAge['29']) : p.monthly)]), 'Monthly premium before the rebate, single cover, Tasmania. Discount rates from PrivateHealth.gov.au.', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>For someone who joins at 25 or younger, the second policy on list price becomes the cheapest by a few dollars a month. At 29 the discount is only ${K.pct(P.ageDiscount.byAge['29'], 0)} and the ranking barely moves. The rebate is then worked out on the premium you actually pay. Our calculator sticks to list prices, the figure the file publishes; if you hold a discount, type your own premium in the folded options.</p>
${h.mini('cover', { t: 'Your own Tasmanian premium against the surcharge', p: ['inc', 'prem'], d: { rg: 'TAS', inc: 115000, prem: 93 }, c: 'Open the full calculator' })}

<h2>Why young high earners face the question early</h2>
<p>The surcharge threshold applies from the first dollar over ${K.usd(P.mls.single[0])}, whatever your age. A Tasmanian in their late twenties on ${K.usd(115000)} is in tier 1 and would pay ${K.usd(r28.mls.total)} without cover. The cheapest exempt policy costs ${K.usd(r28.premium.net)} after the ${K.pct(r28.premium.rebatePct, 3)} rebate. Holding hospital cover before the 1 July after your 31st birthday also avoids the Lifetime Health Cover loading for life, as long as you keep it: the ${h.a('lhc-base-day-turning-31', 'base day page')} explains the date.</p>

<h2>Couples, dependants and the age of 41</h2>
<p>On a couple or family policy the discount is averaged between the two adults, as the Lifetime Health Cover loading is: one partner with ${K.pct(0.1, 0)} and the other with ${K.pct(0.06, 0)} give ${K.pct(0.08, 0)} on the policy, the Ombudsman's own example. A young adult covered as a dependant on a parent's family policy gets no discount; they can have their own policy with a discount or be a dependant, not both. Once granted, the discount stays until the member turns 41, then shrinks by ${K.pct(P.ageDiscount.phaseOutPerYear, 0)} a year until it reaches zero. If you switch policy or insurer, ask first whether your discount moves with you: insurers decide whether to honour it on transfer.</p>
<p>For a Tasmanian couple the cheapest exempt policy on list price is ${K.usd2(S.two.cheapest.monthly)} a month, and for a family ${K.usd2(S.fam.cheapest.monthly)}; a single parent pays ${K.usd2(S.sp.cheapest.monthly)}. A couple on a combined ${K.usd(250000)}, ${K.usd(160000)} and ${K.usd(90000)}, would pay ${K.usd(S.vs(160000, undefined, 'couple', 90000).mls.total)} of surcharge between them without cover, against ${K.usd(S.vs(160000, undefined, 'couple', 90000).premium.net)} a year for that couple policy after the rebate.</p>
<h2>Every tier at its cheapest in Tasmania</h2>
${h.table(['Tier', 'Cheapest from', 'Cheapest per month', 'Median per month', 'Policies'], S.tierRows('single'), 'Single cover, open insurers, excess within the surcharge limits.', ['l', 'l', 'r', 'r', 'r'])}
<p>The pattern of the other states holds here: the "Plus" tiers have many more policies than the plain ones, and their cheapest entries can undercut the plain tier below them. The state has ${K.num(c.n)} open single policies from ${c.funds} insurers in the file, about the same choice as the mainland.</p>
<p>Prices: PrivateHealth.gov.au file of ${K.day(K.PREM.release)} (${h.src('datagov_phi', 'data.gov.au')}). Discounts: ${h.src('phio_age')}. Thresholds and rebate: ${h.src('ato_mls_rates', 'ATO')}. Naming a policy here reports a price, it is not a recommendation. ${h.a('method', 'How the figures are built')}.</p>
`,
  related: ['state-vic', 'lhc-base-day-turning-31', 'basic-hospital-cover', 'compare-health-insurance', 'mls-110000'],
  sources: ['datagov_phi', 'phio_age', 'ato_mls_rates', 'ato_rebate_rates'],
});
