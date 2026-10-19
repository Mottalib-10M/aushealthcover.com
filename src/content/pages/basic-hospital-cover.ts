import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, PR = K.PREM;
const B = (r: (typeof K.REGIONS)[number], s: 'single' | 'family' = 'single') => K.cell(r, s).byTier.Basic;
const BP = (r: (typeof K.REGIONS)[number]) => K.cell(r, 'single').byTier.BasicPlus;
const nsw = K.cell('NSW', 'single'), sa = K.cell('SA', 'single');
const ratio = nsw.byTier.Gold.median / nsw.byTier.Basic.median;
const accident = K.REGIONS.filter((r) => /accident/i.test(K.cell(r, 'single').cheapest.product) || K.cell(r, 'single').runnersUp.some((p) => /accident/i.test(p.product))).length;
const c120 = K.cmp({ status: 'single', you: { mlsIncome: 120000 }, region: 'SA', oldest: 33, loading: K.lhc(33) });

export default definePage({
  id: 'basic-hospital-cover', group: 'decide', order: 4, slug: 'basic-hospital-cover',
  nav: 'Basic hospital cover', card: 'The cheapest tier that removes the surcharge, and what it leaves out.',
  title: 'Basic Hospital Cover 2026: Cheapest Tier That Avoids the MLS',
  description: `Basic hospital cover in 2026: the lowest tier, enough to avoid the Medicare levy surcharge. Cheapest Basic premium by state, and what the tier leaves out.`,
  h1: 'Basic hospital cover: the cheapest way to avoid the surcharge, and its limits',
  intro: 'Choose your household and the lowest tier you would accept: the table shows, state by state, what that tier costs at its cheapest before the rebate.',
  resume: `Basic is the lowest of the four tiers into which every Australian hospital policy has been classified since 1 April 2020, below Bronze, Silver and Gold. For the Medicare levy surcharge the tier does not matter: a Basic policy from a registered insurer with an excess of no more than ${K.usd(M.excessLimit.single)} for one person or ${K.usd(M.excessLimit.other)} for a couple or family is an appropriate level of hospital cover, exactly like a Gold one. That is why the cheapest policy that removes the surcharge is a Basic policy in every state in the PrivateHealth.gov.au file of ${K.day(PR.release)}: from ${K.usd2(B('NT').cheapest)} a month for a single person in the Northern Territory to ${K.usd2(B('QLD').cheapest)} in Queensland, before the rebate. The trade-off is cover. A tier sets the minimum categories of hospital treatment a policy must include, and Basic sets the fewest; several of the cheapest Basic policies carry the word "accident" in their name. In New South Wales the median Gold single policy costs ${K.dec(ratio, 1)} times the median Basic one.`,
  tool: 'states',
  toolArg: { st: 'single', ht: 'any' },
  faqs: [
    { q: 'Does a Basic hospital policy really avoid the Medicare levy surcharge?', a: `Yes, provided it is hospital cover from a registered Australian insurer and its excess is within the limits: ${K.usd(M.excessLimit.single)} a year on a policy for one person, ${K.usd(M.excessLimit.other)} on a couple or family policy. The ATO and PrivateHealth.gov.au set no tier condition. Extras only cover and Overseas Visitors Health Cover do not count, whatever their price.` },
    { q: 'What is the difference between Basic and Basic Plus?', a: `A Basic Plus policy covers everything a Basic policy must cover plus some extra categories of treatment chosen by the insurer. In NSW the cheapest Basic Plus single policy costs ${K.usd2(BP('NSW').cheapest)} a month against ${K.usd2(B('NSW').cheapest)} for Basic. Which extra categories you get differs from one Plus policy to the next, so read the statement.` },
    { q: 'Does Basic cover protect me from the Lifetime Health Cover loading?', a: 'Yes. For Lifetime Health Cover, any private hospital cover with an Australian registered insurer counts, whatever its tier. Holding a Basic policy from your base day, and keeping it, means no loading when you later move to a higher tier, and switching tier or insurer does not restart the count. Extras only cover does not count.' },
    { q: 'Is the rebate paid on Basic hospital cover?', a: `Yes, at the same percentage as on any other hospital policy: ${K.pct(K.reb(0, 40), 3)} at the base income tier when everyone is under 65, ${K.pct(K.reb(1, 40), 3)} at tier 1, ${K.pct(K.reb(2, 40), 3)} at tier 2 and nothing at tier 3. On a cheap policy the rebate is small in dollars, but so is the premium.` },
  ],
  body: (h) => `
<h2>Four tiers, one test for the tax office</h2>
<p>Hospital policies have been sold in four tiers since the reform that became mandatory on 1 April 2020: Gold, Silver, Bronze and Basic, with Plus versions of the lower three. PrivateHealth.gov.au explains that each tier is built on minimum standard clinical categories of treatment, such as "bone, joint and muscle" or "heart and vascular system", and that a policy covering a category must cover everything listed in it. Gold sets the longest list of categories; Basic the shortest. A Plus policy adds categories above the minimum of its tier.</p>
<p>None of that changes the surcharge. The ATO asks whether you held private patient hospital cover with an excess within the limits on each day of the year; the tier is not part of the test. So for someone whose only aim is to stop paying the surcharge, Basic does the job at the lowest price.</p>

<h2>The cheapest Basic policy in each state</h2>
${h.table(['State or territory', 'Basic policies', 'Cheapest Basic, single', 'Insurer', 'Cheapest Basic, family', 'Cheapest Basic Plus, single'], K.REGIONS.map((r) => [K.RS[r], String(B(r).n), K.usd2(B(r).cheapest), B(r).fund, K.usd2(B(r, 'family').cheapest), BP(r) ? K.usd2(BP(r).cheapest) : 'none']), `Monthly premium before the rebate, open insurers, excess within the surcharge limits. PrivateHealth.gov.au file of ${K.day(PR.release)}; the ACT buys the NSW policies.`, ['l', 'r', 'r', 'l', 'r', 'r'])}
<p>The Northern Territory stands out, with Basic premiums well under half those of the eastern states. Western Australia comes next. Elsewhere the cheapest Basic single policy sits close to ${K.usd(100)} a month. In ${accident} of the ${K.REGIONS.length} regions the cheapest three Basic policies include one with "accident" in its name, which tells you what the insurer is selling: cover centred on treatment after an accident, plus the minimum the tier requires.</p>
${h.mini('cover', { t: 'Basic cover against your surcharge', p: ['inc', 'rg'], d: { inc: 120000, rg: 'SA' }, c: 'Open the cover or surcharge calculator' })}

<h2>What the low price buys, and what it does not</h2>
<p>A Basic policy removes the surcharge, counts as hospital cover for Lifetime Health Cover and receives the rebate. Those are its three tax effects, and above the threshold they often make it cheaper than paying the surcharge. A South Australian aged 33 on ${K.usd(120000)} pays ${K.usd(c120.mls.total)} of surcharge without cover; even with the ${K.pct(K.lhc(33), 0)} loading of a late start, the cheapest Basic policy costs ${K.usd(c120.premium.net)} after the rebate.</p>
<p>What it does not buy is broad hospital cover. If you need a hospital treatment outside the policy's categories, the policy pays no benefit for it, and the choice left is a public hospital under Medicare or paying as a private patient yourself. Before you choose Basic for the tax, read its Private Health Information Statement, which every insurer must send at least once a year and which PrivateHealth.gov.au publishes for every policy in a standard format. Compare it with a Bronze or Silver statement and decide whether the difference, in South Australia ${K.usd2(sa.byTier.Silver.cheapest - sa.byTier.Basic.cheapest)} a month between the cheapest Silver and the cheapest Basic single policy, is worth paying.</p>

<h2>Basic cover for a couple or a family</h2>
<p>The same logic applies to households, with one extra condition: to avoid the surcharge above the family threshold of ${K.usd(M.family[0])}, the policy must cover you, your partner and every dependent child. A family Basic policy costs about twice a single one; in New South Wales the cheapest starts at ${K.usd2(B('NSW', 'family').cheapest)} a month before the rebate. Because both partners pay the surcharge on their own income once the household is over the line, a family on a combined income just above the threshold often finds that a family Basic policy costs less than the two surcharges together. The ${h.a('mls-families', 'families page')} runs that comparison with children counted.</p>

<h2>The excess is the other trap</h2>
<p>Many of the cheapest hospital policies come with the highest excess the surcharge rules allow, often ${K.usd(M.excessLimit.single)} for a single person. One with a higher excess may be cheaper still but does not avoid the surcharge: the limit is ${K.usd(M.excessLimit.single)} for a single policy and ${K.usd(M.excessLimit.other)} for a couple or family policy, for all claims in a year. The ${h.a('mls-hospital-cover-excess', 'excess page')} checks your policy against those limits.</p>

<h2>Starting with Basic, moving up later</h2>
<p>A common path for people who join for tax reasons is to start on a Basic policy by their base day, avoid both the surcharge and the loading, and move to a higher tier when their needs change. Moving tier with the same or another insurer keeps your Lifetime Health Cover history, provided the cover is continuous. The ${h.a('lhc-base-day-turning-31', 'turning 31 page')} has the deadline, and ${h.a('compare-health-insurance', 'compare health insurance')} shows how the price climbs from tier to tier in each state.</p>
`,
  related: ['compare-health-insurance', 'is-private-health-insurance-worth-it', 'mls-hospital-cover-excess', 'lhc-base-day-turning-31', 'private-health-insurance', 'state-nt'],
  sources: ['phio_changes', 'ato_mls_cover', 'phio_mls', 'phio_lhc', 'datagov_phi'],
});
