import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('WA'), c = S.one, nsw = K.cell('NSW', 'single');
const cheaper = 1 - c.cheapest.monthly / nsw.cheapest.monthly;
const incomes = [106000, 115000, 125000, 145000, 170000];
const r140 = S.vs(140000), r140m = S.vs(140000, c.median);

export default definePage({
  id: 'state-wa', group: 'state', order: 5, slug: 'cheapest-hospital-cover-wa',
  nav: 'Western Australia', card: `From ${K.usd2(c.cheapest.monthly)} a month, about ${K.pct(cheaper, 0)} below NSW.`,
  title: 'Hospital Cover WA 2026: Cheapest Policies vs the Surcharge',
  description: `Hospital cover in Western Australia in 2026: the cheapest policy that avoids the Medicare levy surcharge is ${K.usd2(c.cheapest.monthly)} a month pre-rebate. Your income vs the cost.`,
  h1: 'Hospital cover in Western Australia: what the surcharge buys instead',
  intro: 'Perth premiums sit well below the east coast. Enter your income to see how far the cheapest exempt policy undercuts the surcharge.',
  resume: `A single Western Australian who earns over ${K.usd(K.P.mls.single[0])} of income for MLS purposes in ${K.P.incomeYear} and holds no hospital cover pays the Medicare levy surcharge. The cheapest open policy that removes it costs ${K.usd2(c.cheapest.monthly)} a month before the rebate in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, about ${K.pct(cheaper, 0)} less than the cheapest one in New South Wales. The next two policies, from ${c.runnersUp[0].fund} and ${c.runnersUp[1].fund}, are within cents of it. On ${K.usd(140000)} the surcharge is ${K.usd(r140.mls.total)}, while the cheapest policy costs ${K.usd(r140.premium.net)} after the ${K.pct(r140.premium.rebatePct, 3)} rebate, and a policy at the median price of ${K.usd2(c.median)} a month costs ${K.usd(r140m.premium.net)}. The table below runs the same sum at five incomes, and the calculator above lets you set your own family, age and loading.`,
  tool: 'cover',
  toolArg: { rg: 'WA', inc: 140000 },
  faqs: [
    { q: 'What is the cheapest hospital cover in WA that avoids the surcharge?', a: `In the file of ${K.day(K.PREM.release)}, a Basic policy from ${c.cheapest.fund} at ${K.usd2(c.cheapest.monthly)} a month for one person, with a ${K.usd(c.cheapest.excess)} excess. It avoids the surcharge because the excess is within the ${K.usd(K.P.mls.excessLimit.single)} limit. We report it as the lowest price in the public data, not as advice to buy it.` },
    { q: 'Is a median-priced policy in Western Australia cheaper than the surcharge?', a: `It depends on income. At ${K.usd2(c.median)} a month, a single person aged 35 without loading finds it cheaper than the surcharge from ${(() => { const e = S.be(c.median); return e === null ? 'no income under a million dollars' : K.usd(e); })()}. Under that, the surcharge costs less than a mid-priced policy, though not less than the cheapest one.` },
    { q: 'Do families in WA pay twice the single premium?', a: `For the cheapest policies, yes or very nearly: ${K.usd2(S.fam.cheapest.monthly)} a month for a family against ${K.usd2(c.cheapest.monthly)} for one person. A single parent policy costs ${K.usd2(S.sp.cheapest.monthly)}. The family surcharge threshold is also doubled, ${K.usd(K.P.mls.family[0])} of combined income, plus ${K.usd(K.P.mls.childIncrement)} per child after the first.` },
  ],
  body: (h) => `
<h2>Five incomes, one state</h2>
${h.table(['Income for MLS purposes', 'Surcharge, full year', 'Cheapest policy, net', 'Median policy, net', 'Cheapest saves'], incomes.map((i) => { const x = S.vs(i), m = S.vs(i, c.median); return [K.usd(i), K.usd(x.mls.total), K.usd(x.premium.net), K.usd(m.premium.net), K.usd(x.saving)]; }), `Single person in Western Australia, aged 35, no Lifetime Health Cover loading, ${K.P.incomeYear} thresholds, rebate of 1 April 2026.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The left column moves through the tiers: ${K.usd(106000)} is just inside tier 1, ${K.usd(125000)} in tier 2, ${K.usd(170000)} in tier 3 where there is no rebate. Two effects pull in opposite directions as income rises. The surcharge grows, both because the rate climbs from ${K.pct(K.P.mls.rates[1], 0)} to ${K.pct(K.P.mls.rates[3], 1)} and because it is a percentage of a larger income. The net premium grows too, because the rebate falls from ${K.pct(K.reb(1, 35), 3)} to nothing. In Western Australia the first effect wins at every income in the table for the cheapest policy, which is why its saving column only rises.</p>
${h.mini('breakeven', { t: 'Income from which cover is cheaper in WA', p: ['st', 'age'], d: { rg: 'WA', st: 'single', age: 35 }, c: 'Open the break-even calculator' })}

<h2>The price ladder, tier by tier</h2>
<p>The cheapest policy is a Basic one. If you want more, here is what each tier costs at its cheapest and at its median in the state, single cover, before the rebate.</p>
${h.table(['Tier', 'Cheapest from', 'Cheapest per month', 'Median per month', 'Policies'], S.tierRows('single'), 'Open policies with an excess that avoids the surcharge.', ['l', 'l', 'r', 'r', 'r'])}
<p>Two oddities stand out. Bronze Plus is cheaper at its lowest than plain Bronze, and Silver Plus cheaper than plain Silver, because the "Plus" tiers hold far more policies and some of them are priced aggressively. The tier name says what a policy must cover at least, not what it costs, so it is worth comparing across tiers rather than within one.</p>

<h2>What this means for a Perth household</h2>
<p>For most single people over the threshold, the cheapest exempt policy costs less than the surcharge in WA, as it does in every state. What is particular here is the margin. On ${K.usd(140000)}, the cheapest policy undercuts the surcharge by ${K.usd(r140.saving)}, enough to move up to a Bronze Plus policy at ${K.usd2(c.byTier.BronzePlus.cheapest)} a month and still pay less than the tax. Someone who joins late with a Lifetime Health Cover loading pays more, since the loading is added after the rebate: ${h.a('lifetime-health-cover-loading', 'the loading page')} has the figures.</p>
<h2>Couples, single parents and older members</h2>
<p>The couple and family cells follow the same pattern at double the price: ${K.usd2(S.two.cheapest.monthly)} a month for the cheapest couple policy and ${K.usd2(S.fam.cheapest.monthly)} for a family, while a single parent pays ${K.usd2(S.sp.cheapest.monthly)}, a little over one and a half times the single price. A Perth couple on ${K.usd(130000)} and ${K.usd(100000)} has a combined ${K.usd(230000)}, inside family tier 1, and would pay ${K.usd(S.vs(130000, undefined, 'couple', 100000).mls.total)} of surcharge between them without cover, against ${K.usd(S.vs(130000, undefined, 'couple', 100000).premium.net)} for the cheapest couple policy after the rebate. For members aged 65 or more the rebate is higher, ${K.pct(K.reb(1, 67), 3)} at tier 1 between 65 and 69, so the net premium falls further; ${h.a('rebate-over-65', 'the page for over 65s')} covers the bill that would change this from April 2027.</p>
<p>All prices come from the file of ${K.day(K.PREM.release)} on ${h.src('datagov_phi', 'data.gov.au')}: ${K.num(c.n)} open single policies in WA from ${c.funds} insurers. Naming the cheapest policy is a figure, not a recommendation; check its Private Health Information Statement for what it covers. Thresholds and rebate: ${h.src('ato_mls_rates', 'ATO')}.</p>
`,
  related: ['state-nt', 'state-sa', 'compare-health-insurance', 'mls-125000', 'basic-hospital-cover'],
  sources: ['datagov_phi', 'ato_mls_rates', 'ato_rebate_rates', 'ato_mls_cover'],
});
