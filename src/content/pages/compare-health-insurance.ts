import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, PR = K.PREM;
const vic = K.cell('VIC', 'single'), vicF = K.cell('VIC', 'family');
const tiers = K.HT.filter((t) => vic.byTier[t]);
const spread = (t: string) => vic.byTier[t].median / vic.byTier[t].cheapest - 1;
const sumN = K.REGIONS.reduce((a, r) => a + K.cell(r, 'single').n, 0);
const gold = vic.byTier.Gold, basic = vic.byTier.Basic;

export default definePage({
  id: 'compare-health-insurance', group: 'decide', order: 3, slug: 'compare-health-insurance',
  nav: 'Compare health insurance', card: 'Every open hospital policy that avoids the surcharge, by state and tier.',
  title: 'Compare Health Insurance 2026: Every Exempt Policy by State',
  description: `Compare health insurance in 2026 from the PrivateHealth.gov.au file: cheapest and median hospital premium by state and tier, no quote form, no partner list.`,
  h1: 'Compare health insurance from the public file, not from a quote form',
  intro: 'Choose a household and the lowest hospital tier you would accept: the table ranks every state by its cheapest open policy that avoids the surcharge.',
  resume: `Comparing health insurance in Australia does not require a quote form. The Private Health Insurance Ombudsman publishes every policy on sale, with its premium in each state, its hospital tier and its excess, and releases the whole file each month on data.gov.au. In the release of ${K.day(PR.release)} we count ${K.num(vic.n)} open single policies in Victoria that avoid the Medicare levy surcharge, sold by ${vic.funds} insurers, and ${K.num(sumN)} such state and policy combinations across the country. Inside one state and one tier the spread is wide: a Victorian single Gold policy costs from ${K.usd2(gold.cheapest)} a month before the rebate, while the median Gold policy costs ${K.usd2(gold.median)}. Comparison sites show the policies of insurers they have agreements with. The table on this page shows the cheapest of all of them, for each state and tier, and stops there. It is a starting point for your own reading of each policy statement, not a recommendation of any insurer.`,
  tool: 'states',
  toolArg: { st: 'single', ht: 'any' },
  faqs: [
    { q: 'Where does the policy data on this page come from?', a: `From the PrivateHealth.gov.au product file that the Private Health Insurance Ombudsman publishes on data.gov.au under a Creative Commons Attribution 3.0 Australia licence. We read the release of ${K.day(PR.release)}, ${K.num(PR.productsInFile)} product lines, and keep the hospital policies open to the public whose excess avoids the surcharge. The script that builds our table can be run again on each monthly release.` },
    { q: 'Why are restricted funds left out of the comparison?', a: `Restricted funds are open only to a defined group of members, such as the staff of one employer or one profession, so most readers cannot buy their policies. The file lists ${PR.restrictedFunds} of them. If you belong to one, ask it for its premium and type it into the cover calculator as your own premium: the comparison with the surcharge works the same way for any policy.` },
    { q: 'How should two hospital policies in the same tier be compared?', a: 'Start with the Private Health Information Statement of each policy, which PrivateHealth.gov.au publishes in a standard format for every insurer. A tier only sets the minimum categories of treatment; Plus policies cover more. Then compare the excess, which must stay within the surcharge limits, and finally the premium after your own rebate percentage.' },
    { q: 'Do the premiums here include the rebate or any discount?', a: `No. They are the full monthly premiums of the file, before the government rebate and before any age-based discount an insurer may give people under 30. Your own price is lower by the rebate of your tier, ${K.pct(K.reb(0, 40), 3)} at the base tier for most people under 65, and higher by any Lifetime Health Cover loading.` },
  ],
  body: (h) => `
<h2>What the public file contains</h2>
<p>The Ombudsman publishes the details of every policy on sale on PrivateHealth.gov.au and, in bulk, on ${h.src('datagov_phi', 'data.gov.au')}. For each policy the file gives the insurer, the policy name, the states where it is sold, the kind of cover (single, couple, single parent, family), the hospital tier, the excess and the monthly premium. That is enough to answer the one question most comparison services avoid putting in a table: what is the cheapest policy that does a given job, in a given state, for a given household?</p>
<p>We apply three filters. We keep hospital and combined policies with an excess of no more than ${K.usd(M.excessLimit.single)} per person and ${K.usd(M.excessLimit.other)} per policy, because only those avoid the surcharge. We drop the ${PR.restrictedFunds} restricted funds, corporate products and policies sold only together with another one, because most readers cannot buy them. And we keep the rest, every insurer, with no ranking by commission. The ${h.a('method', 'method page')} gives the counts at each step.</p>

<h2>Victoria, single cover: the spread inside each tier</h2>
${h.table(['Hospital tier', 'Policies', 'Cheapest a month', 'Median a month', 'Median above cheapest'], tiers.map((t) => [K.tl(t), String(vic.byTier[t].n), K.usd2(vic.byTier[t].cheapest), K.usd2(vic.byTier[t].median), K.pct(spread(t), 0)]), `Open single hospital policies that avoid the surcharge, Victoria, before the rebate. PrivateHealth.gov.au file of ${K.day(PR.release)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two patterns come out of the table. The first is that the tier is not a price band: some Plus policies of a lower tier cost more than the cheapest policy of the tier above, because Plus policies add categories of treatment beyond the minimum. The second is that the gap between the cheapest and the median policy grows as you move up. At the Basic tier the median is ${K.pct(spread('Basic'), 0)} above the cheapest; at Gold it is ${K.pct(spread('Gold'), 0)} above. Two Gold policies are not the same product, since they differ in the hospitals the insurer has agreements with, the extras bundled with them and the gap arrangements, none of which the file prices.</p>
${h.mini('states', { t: 'Cheapest Silver or better, family cover', p: ['st', 'ht'], d: { st: 'family', ht: 'Silver' }, c: 'Open the state comparison' })}

<h2>The same comparison for a family</h2>
<p>A family policy in Victoria starts at ${K.usd2(vicF.cheapest.monthly)} a month before the rebate, with a median of ${K.usd2(vicF.median)} across ${K.num(vicF.n)} open policies. Family premiums are about twice single ones for the same policy, and the rebate is the same percentage, so the comparison with the surcharge depends on the combined income. A family whose income for MLS purposes is over ${K.usd(M.family[0])} must cover both partners and every dependent child to avoid the surcharge; one person left out and the household pays it. The ${h.a('mls-families', 'families page')} works through the thresholds with children.</p>

<h2>What a comparison should check, in order</h2>
<ol>
<li><strong>Does it remove the surcharge?</strong> Hospital cover, a registered Australian insurer, an excess within the limits. Extras only, Overseas Visitors Health Cover and foreign insurers do not count.</li>
<li><strong>What does it cover?</strong> Read the Private Health Information Statement. A Basic policy can cost less than half the price of a Gold one because it covers far less; ${h.a('basic-hospital-cover', 'the Basic cover page')} looks at what that means.</li>
<li><strong>What does it cost you?</strong> The full premium, minus your rebate percentage, plus your Lifetime Health Cover loading if you have one. The cover calculator on ${h.a('home', 'the home page')} does that sum with your own premium.</li>
<li><strong>How does it compare with not buying?</strong> Above the threshold, set that net cost against the surcharge. Below it, there is no tax at stake, and the only penalty for waiting is the loading that builds up after your base day.</li>
</ol>

<h2>Why we name the cheapest policy and nothing else</h2>
<p>The surcharge comparison needs a price, and the honest price to use is the lowest one any reader could actually pay. So the calculators name the cheapest open policy of the file for each state and household, ${basic.fund} at ${K.usd2(basic.cheapest)} for a Basic single policy in Victoria at the time of writing. Naming it is not an endorsement. We have no agreement with any insurer, receive no referral fee and do not collect your details, and the policy that is cheapest this month may not be next month: premiums change every 1 April and the file is republished every month. Check the date of the release at the foot of each table before you rely on a premium, and read the policy statement on PrivateHealth.gov.au before you buy anything.</p>
`,
  related: ['basic-hospital-cover', 'is-private-health-insurance-worth-it', 'private-health-insurance', 'mls-hospital-cover-excess', 'state-vic', 'mls-families'],
  sources: ['datagov_phi', 'phio_changes', 'phio_mls', 'ato_mls_cover'],
});
