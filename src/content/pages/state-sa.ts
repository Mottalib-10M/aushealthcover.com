import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('SA'), c = S.one, two = S.two, P = K.P;
const ages = [40, 67, 72];
const coupleAt = (age: number, monthly?: number) => S.vs(130000, monthly, 'couple', 100000, age);
const silver = two.byTier.SilverPlus;
const prop = (age: number, gross: number) => gross * (K.reb(1, age) - K.reb(1, age, 'proposal2027'));

export default definePage({
  id: 'state-sa', group: 'state', order: 4, slug: 'cheapest-hospital-cover-sa',
  nav: 'South Australia', card: `From ${K.usd2(c.cheapest.monthly)} a month single, ${K.usd2(two.cheapest.monthly)} for a couple.`,
  title: 'Hospital Cover SA 2026: Cheapest Policies and the Rebate',
  description: `Hospital cover in South Australia for 2026: cheapest exempt policy ${K.usd2(c.cheapest.monthly)} a month single, ${K.usd2(two.cheapest.monthly)} couple, and how the oldest member's age moves the rebate.`,
  h1: 'Hospital cover in South Australia: the price after the rebate, by age',
  intro: 'The rebate grows with the age of the oldest person on the policy. For an Adelaide couple in their late sixties, that changes the sum.',
  resume: `South Australia has the third lowest premiums for the cheapest hospital cover that avoids the Medicare levy surcharge, after the Northern Territory and Western Australia: ${K.usd2(c.cheapest.monthly)} a month for one person and ${K.usd2(two.cheapest.monthly)} for a couple before the rebate, in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. What you pay after the rebate depends on two things, the income tier and the age of the oldest person covered. A couple on a combined ${K.usd(230000)} sits in family tier 1, where the rebate is ${K.pct(K.reb(1, 40), 3)} if both are under 65, ${K.pct(K.reb(1, 67), 3)} between 65 and 69 and ${K.pct(K.reb(1, 72), 3)} from 70. On the cheapest couple policy that is ${K.usd(coupleAt(40).premium.net)}, ${K.usd(coupleAt(67).premium.net)} or ${K.usd(coupleAt(72).premium.net)} a year, against a surcharge of ${K.usd(coupleAt(40).mls.total)} for the couple without cover. A bill before Parliament would remove the higher rates for older members from April 2027.`,
  tool: 'cover',
  toolArg: { rg: 'SA', st: 'couple', inc: 130000, pinc: 100000, age: 67 },
  faqs: [
    { q: 'How does age change the private health insurance rebate in South Australia?', a: `The same way as everywhere: the rebate depends on the age of the oldest person on the policy. At the base tier it is ${K.pct(K.reb(0, 40), 3)} under 65, ${K.pct(K.reb(0, 67), 3)} from 65 to 69 and ${K.pct(K.reb(0, 72), 3)} from 70, for 1 April 2026 to 31 March 2027. South Australia only changes the premium the percentage is applied to.` },
    { q: 'What does the cheapest couple policy cost in Adelaide?', a: `The cheapest open couple policy that avoids the surcharge in South Australia costs ${K.usd2(two.cheapest.monthly)} a month before the rebate, from ${two.cheapest.fund}, in the file of ${K.day(K.PREM.release)}. The median couple policy costs ${K.usd2(two.median)}. Both prices are the published base premiums, without any age-based discount an insurer may give.` },
    { q: 'Will older South Australians lose part of their rebate in 2027?', a: `Only if Parliament passes the bill introduced on ${K.day(P.rebate.proposal2027.billIntroduced)}. It would give people aged 65 and over the under-65 rates from 1 April 2027. On a Silver Plus couple policy at ${K.usd2(silver.cheapest)} a month, a couple aged 67 in tier 1 would lose about ${K.usd(prop(67, silver.cheapest * 12))} a year. It is not law.` },
  ],
  body: (h) => `
<h2>One couple, three ages</h2>
<p>Take an Adelaide couple, one partner on ${K.usd(130000)} and the other on ${K.usd(100000)}. Their combined income of ${K.usd(230000)} is over the family threshold of ${K.usd(P.mls.family[0])}, so without hospital cover each of them pays the tier 1 rate on their own income. The table compares that with two policies: the cheapest exempt couple policy and the cheapest Silver Plus one, for three ages of the older partner.</p>
${h.table(['Older partner', 'Rebate', 'Surcharge without cover', 'Cheapest policy, net', 'Silver Plus, net'], ages.map((a) => { const x = coupleAt(a), y = coupleAt(a, silver.cheapest); return [`${a}`, K.pct(x.premium.rebatePct, 3), K.usd(x.mls.total), K.usd(x.premium.net), K.usd(y.premium.net)]; }), `Couple policy in South Australia, no Lifetime Health Cover loading, rebate of 1 April 2026 to 31 March 2027.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The surcharge column does not move with age: it is a tax on income, not on the policy. The net premium falls as the rebate rises. For this couple the cheapest policy costs less than the surcharge at every age. The Silver Plus policy, which covers far more, is ${coupleAt(40, silver.cheapest).coverCheaper ? 'also cheaper than the surcharge' : 'dearer than the surcharge'} at 40 and ${coupleAt(72, silver.cheapest).coverCheaper ? 'cheaper' : 'still dearer'} at 72. A loading on either partner would add to every net figure, since the rebate is never paid on the loading.</p>
${h.mini('retiree', { t: 'What the 2027 proposal would cost your policy', p: ['age', 'gp'], d: { age: 67, gp: Math.round(silver.cheapest * 12) }, c: 'Open the over 65 calculator' })}

<h2>Choice in South Australia</h2>
<p>The file holds ${K.num(c.n)} open single policies and ${K.num(two.n)} couple policies that avoid the surcharge in the state, from ${c.funds} insurers. For one person, the three cheapest are close together: ${c.cheapest.fund} at ${K.usd2(c.cheapest.monthly)}, ${c.runnersUp[0].fund} at ${K.usd2(c.runnersUp[0].monthly)} and ${c.runnersUp[1].fund} at ${K.usd2(c.runnersUp[1].monthly)}, all Basic tier. The median single policy, ${K.usd2(c.median)}, is ${K.dec(c.median / c.cheapest.monthly, 1)} times the cheapest. For couples the tiers line up like this:</p>
${h.table(['Tier', 'Cheapest from', 'Cheapest per month', 'Median per month', 'Policies'], S.tierRows('couple'), 'Couple cover in South Australia, before the rebate.', ['l', 'l', 'r', 'r', 'r'])}

<h2>The excess limit on a couple policy</h2>
<p>A couple or family policy avoids the surcharge if its excess is ${K.usd(P.mls.excessLimit.other)} or less for the policy; a single policy needs ${K.usd(P.mls.excessLimit.single)} or less. The cheapest South Australian couple policy has an excess of ${K.usd(two.cheapest.excess)} per person and ${K.usd(two.cheapest.excessPolicy)} per policy, inside the limit. A higher excess lowers the premium but takes the policy out of the surcharge exemption, so a couple who picks a ${K.usd(2000)} excess to save money would pay both the premium and the surcharge. Our premium file leaves out every policy above the limits for that reason, and ${h.a('mls-hospital-cover-excess', 'the excess page')} explains the rule.</p>
<p>Gaps in the year count too. If the couple only takes out cover in January, each partner still owes the surcharge for the days from 1 July without it. The ${h.a('mls-part-year-cover', 'part-year page')} computes that share.</p>
<h2>Single parents</h2>
<p>A single parent is tested against the family threshold with their own income only, ${K.usd(P.mls.family[0])} with one child and ${K.usd(K.thr('singleParent', 2)[0])} with two. Many single parents are therefore under the threshold and owe no surcharge at all. Above it, the cheapest exempt single parent policy in South Australia costs ${K.usd2(S.sp.cheapest.monthly)} a month before the rebate. The ${h.a('mls-single-parents', 'single parents page')} has the detail.</p>
<p>Sources: PrivateHealth.gov.au file of ${K.day(K.PREM.release)} (${h.src('datagov_phi', 'data.gov.au')}), rebate rates on ${h.src('ato_rebate_rates', 'ato.gov.au')}, the ${h.src('aph_bill_2027', 'bill before Parliament')}. Naming a policy reports a price, not a recommendation. ${h.a('method', 'How the figures are built')}.</p>
`,
  related: ['rebate-over-65', 'state-wa', 'state-vic', 'mls-couples', 'private-health-insurance-rebate'],
  sources: ['datagov_phi', 'ato_rebate_rates', 'ato_mls_rates', 'aph_bill_2027'],
});
