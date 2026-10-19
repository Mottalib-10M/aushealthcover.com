import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('NT'), c = S.one, nsw = K.cell('NSW', 'single');
const a = S.vs(110000), b = S.vs(140000), gold = c.byTier.Gold;
const goldBe = S.be(gold.cheapest);
const medBe = S.be(c.median);
const ratio = nsw.cheapest.monthly / c.cheapest.monthly;

export default definePage({
  id: 'state-nt', group: 'state', order: 7, slug: 'cheapest-hospital-cover-nt',
  nav: 'Northern Territory', card: `From ${K.usd2(c.cheapest.monthly)} a month: the lowest premiums in the country.`,
  title: 'Hospital Cover NT 2026: Cheapest Policies Against the MLS',
  description: `Hospital cover in the Northern Territory in 2026: the cheapest policy that avoids the Medicare levy surcharge costs ${K.usd2(c.cheapest.monthly)} a month pre-rebate, the lowest in AU.`,
  h1: 'Hospital cover in the Northern Territory: the cheapest way out of the surcharge',
  intro: 'Territory premiums are a fraction of those in the southern states, so the sum between surcharge and cover gives a very clear answer here.',
  resume: `In the Northern Territory the cheapest open hospital policy that avoids the Medicare levy surcharge costs ${K.usd2(c.cheapest.monthly)} a month for a single person before the rebate, ${K.usd(c.cheapest.monthly * 12)} a year, in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. That is about ${K.dec(ratio, 1)} times less than the cheapest equivalent in New South Wales. The surcharge, on the other hand, is a federal tax and costs the same in Darwin as in Sydney: ${K.usd(a.mls.total)} on an income of ${K.usd(110000)}, ${K.usd(b.mls.total)} on ${K.usd(140000)}. After the rebate the cheapest Territory policy costs ${K.usd(a.premium.net)} a year at the first income and ${K.usd(b.premium.net)} at the second. Even the cheapest Gold policy, at ${K.usd2(gold.cheapest)} a month, beats the surcharge from ${goldBe === null ? 'no income under a million dollars' : K.usd(goldBe)}. The calculator above starts on the Territory; change the income, the family or the age.`,
  tool: 'cover',
  toolArg: { rg: 'NT', inc: 120000 },
  faqs: [
    { q: 'Why are hospital premiums so low in the Northern Territory?', a: `The public file gives prices, not reasons, so we do not guess. What it shows is consistent across insurers: the cheapest single policy is ${K.usd2(c.cheapest.monthly)} a month, the next two are ${K.usd2(c.runnersUp[0].monthly)} and ${K.usd2(c.runnersUp[1].monthly)}, and the median exempt policy is ${K.usd2(c.median)}. Insurers set Territory premiums separately from those of other states.` },
    { q: 'How many policies avoid the surcharge in the Northern Territory?', a: `For a single person, ${K.num(c.n)} open policies from ${c.funds} insurers in the file of ${K.day(K.PREM.release)}, counting each excess option separately. For a family the count is ${K.num(S.fam.n)}. Every hospital tier is on offer, from Basic at ${K.usd2(c.byTier.Basic.cheapest)} a month to Gold at ${K.usd2(gold.cheapest)}, all before the rebate.` },
    { q: 'Is the surcharge lower in the Territory?', a: `No. The Medicare levy surcharge is a federal tax with the same thresholds and rates everywhere: no surcharge up to ${K.usd(K.P.mls.single[0])} for a single person in ${K.P.incomeYear}, then ${K.pct(K.P.mls.rates[1], 0)} to ${K.pct(K.P.mls.rates[3], 1)}. Only the price of the cover that avoids it changes from one state to another.` },
  ],
  body: (h) => `
<h2>Every hospital tier beats the surcharge somewhere</h2>
<p>In most states the question is whether a Basic policy is cheaper than the surcharge. In the Territory the question shifts: from which income is a better policy also cheaper than the tax? The table gives, for each hospital tier, the cheapest open policy in the October 2026 file and the lowest single income at which its net cost, after the rebate, falls under the surcharge.</p>
${h.table(['Hospital tier', 'Cheapest per month', 'Insurer', 'Cheaper than the surcharge from'], S.tiers.map((t) => { const e = S.be(c.byTier[t].cheapest); return [K.tl(t), K.usd2(c.byTier[t].cheapest), c.byTier[t].fund, e === null ? 'not under $1M' : K.usd(e)]; }), 'Single person aged 35, no loading, rates of 1 April 2026.', ['l', 'r', 'l', 'r'])}
<p>The result is unusual. A single Territorian on ${K.usd(130000)} who wants more than an accident policy can buy a Silver Plus policy for ${K.usd2(c.byTier.SilverPlus.cheapest)} a month, and it still costs less after the rebate than the ${K.usd(S.vs(130000).mls.total)} surcharge. Even the median exempt policy at ${K.usd2(c.median)} wins from ${medBe === null ? 'no income under a million' : K.usd(medBe)}. In New South Wales the median exempt single policy costs ${K.usd2(nsw.median)} a month, and at that price it only beats the surcharge from ${(() => { const e = K.be({ status: 'single', region: 'NSW', oldest: 35, loading: 0, monthlyPremium: nsw.median }, 500); return e === null ? 'no income under a million dollars' : K.usd(e); })()}. In relative terms the ladder is steeper here: the cheapest Gold policy costs ${K.dec(gold.cheapest / c.cheapest.monthly, 1)} times the cheapest Basic one, against ${K.dec(nsw.byTier.Gold.cheapest / nsw.cheapest.monthly, 1)} times in NSW, but the dollars at stake are small.</p>
${h.mini('cover', { t: 'Your income in the Territory', p: ['inc', 'st'], d: { rg: 'NT', inc: 150000, st: 'single' }, c: 'Open the full calculator' })}

<h2>Families and couples</h2>
<p>For a couple, the cheapest exempt policy is ${K.usd2(S.two.cheapest.monthly)} a month, and for a family ${K.usd2(S.fam.cheapest.monthly)}, twice the single price as is usual. A single parent pays ${K.usd2(S.sp.cheapest.monthly)}. A Territory couple on a combined ${K.usd(240000)}, split ${K.usd(150000)} and ${K.usd(90000)}, would pay ${K.usd(S.vs(150000, undefined, 'couple', 90000).mls.total)} of surcharge between them without cover; the cheapest couple policy costs ${K.usd(S.vs(150000, undefined, 'couple', 90000).premium.net)} after the rebate. The ${h.a('mls-couples', 'couples page')} explains how the combined test and the separate bills work.</p>

<h2>Read the policy before you buy it</h2>
<p>The cheapest Territory policy, from ${c.cheapest.fund}, is a Basic policy with a ${K.usd(c.cheapest.excess)} excess. Basic is the lowest of the four hospital tiers, and the cheapest Basic policies tend to cover little beyond what the tier requires. That is enough to avoid the surcharge, because the tax rule looks at the excess and not the tier, but it may not be enough if you want to be treated as a private patient for planned surgery. Each policy's Private Health Information Statement lists what it covers. Naming the cheapest policy in the public file is a figure for the comparison, not a recommendation.</p>
<p>Because premiums are so low, the Lifetime Health Cover loading costs less in dollars here too. A ${K.pct(K.lhc(45), 0)} loading on the cheapest single policy adds ${K.usd(c.cheapest.monthly * 12 * K.lhc(45))} a year, against ${K.usd(nsw.cheapest.monthly * 12 * K.lhc(45))} in NSW. The rule itself is national: see ${h.a('lifetime-health-cover-loading', 'Lifetime Health Cover loading')}.</p>

<h2>Where the numbers come from</h2>
<p>The prices are those of the PrivateHealth.gov.au product file of ${K.day(K.PREM.release)} (${h.src('datagov_phi', 'data.gov.au')}): ${K.num(c.n)} open policies that avoid the surcharge for a single person in the Territory, from ${c.funds} insurers. The rebate and thresholds come from ${h.src('ato_rebate_rates', 'the ATO')}. Premiums change on 1 April each year. ${h.a('method', 'The method page')} lists the filters.</p>
`,
  related: ['state-wa', 'state-sa', 'compare-health-insurance', 'basic-hospital-cover', 'is-private-health-insurance-worth-it'],
  sources: ['datagov_phi', 'ato_mls_rates', 'ato_rebate_rates', 'ato_mls_cover'],
});
