import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, D = P.dependants;
const F1 = K.thr('family', 1);
const fam = (kids: number, a: number, b: number) => K.mls({ status: 'family', children: kids, you: { mlsIncome: a }, partner: { mlsIncome: b } });
const near = [1, 2, 3, 4].map((n) => { const m = fam(n, 130000, 82500); return [String(n), K.usd(m.thresholds[0]), K.TN[m.tier], K.usd(m.total)]; });
const ex = fam(2, 150000, 95000);
const jkThreshold = M.prior.family[0] + 2 * M.childIncrement;

export default definePage({
  id: 'mls-families', group: 'surcharge', order: 4, slug: 'mls-families',
  nav: 'MLS for families', card: `Family threshold ${K.usd(F1[0])}, plus ${K.usd(M.childIncrement)} per child after the first.`,
  title: 'MLS for Families 2026-27: Thresholds With Children Added',
  description: `MLS for families in 2026-27: ${K.usd(F1[0])} with one child, ${K.usd(M.childIncrement)} more for each extra child, who counts as a dependant and why every child must be covered.`,
  h1: 'Medicare levy surcharge for families: children, thresholds and cover',
  intro: 'Enter both parents’ incomes and the number of dependent children: the tool applies the raised family threshold and shows each parent’s share.',
  resume: `A family with dependent children is tested like a couple, on the parents' combined income for MLS purposes, but the threshold grows with the family. For ${P.incomeYear} it is ${K.usd(F1[0])} with one child and rises by ${K.usd(M.childIncrement)} for each MLS dependent child after the first, so ${K.usd(K.thr('family', 2)[0])} with two, ${K.usd(K.thr('family', 3)[0])} with three and ${K.usd(K.thr('family', 4)[0])} with four. Every boundary of the tiers moves by the same amount. A child counts while under ${D.childUnder}, or from ${D.childUnder} to 24 while studying full time at school, college or university; a foster child does not count. To avoid the surcharge, both parents and every dependent child need an appropriate level of private patient hospital cover. A family with two children and incomes of ${K.usd(150000)} and ${K.usd(95000)} is in ${K.TN[ex.tier].toLowerCase()} and pays ${K.usd(ex.total)} for a year without cover, shared between the parents in proportion to their incomes.`,
  tool: 'mls',
  toolArg: { st: 'family', inc: 150000, pinc: 95000, ch: 2 },
  faqs: [
    { q: 'Does a newborn raise the family surcharge threshold?', a: 'Yes, from birth. The ATO definition of a child for MLS purposes includes a child born or adopted during the income year, and a stepchild. A child counts as an MLS dependant while under 21, so the newborn adds a dependent child to the count and, from the second child on, adds to the family threshold. The baby also needs to be on a hospital policy.' },
    { q: 'Is a 22-year-old at university still an MLS dependant?', a: `Yes, if they study full time. A child aged 21 to 24 who is a full-time student at school, college or university remains an MLS dependant. In the year a student turns 25, they count for the part of the year before that birthday. A child who turns 21 and is not studying full time counts only for the part of the year before turning 21.` },
    { q: 'Are adult children covered on our family policy liable for the surcharge?', a: 'Not as a rule. PrivateHealth.gov.au says a person covered as a dependant on a family hospital policy is not liable to pay the surcharge, as long as they have no spouse or dependants of their own. Insurer rules on the age limit for dependants vary, and an older child may need a policy of their own.' },
    { q: 'Do foster children count towards the family threshold?', a: `No. The ATO page on family and dependants for MLS purposes, updated in August 2026, states that a foster child is not included as a dependant. Only your own child, an adopted child, a stepchild, a newborn or newly adopted child and a child within the meaning of the Family Law Act 1975 count. The ${K.usd(M.childIncrement)} increments follow that list.` },
  ],
  body: (h) => `
<h2>The family threshold by number of children</h2>
<p>The base figure is the same for a couple with no children and for a family with one child: ${K.usd(F1[0])} of combined income for MLS purposes in ${P.incomeYear}. From the second child on, each MLS dependent child adds ${K.usd(M.childIncrement)} to every boundary.</p>
${h.table(['Children', 'No surcharge up to', `Tier 1 (${K.pct(M.rates[1], 0)}) up to`, `Tier 2 (${K.pct(M.rates[2], 2)}) up to`, `Tier 3 (${K.pct(M.rates[3], 1)}) from`], [1, 2, 3, 4, 5, 6].map((n) => { const t = K.thr('family', n); return [String(n), K.usd(t[0]), K.usd(t[1]), K.usd(t[2]), K.usd(t[2] + 1)]; }), `${P.incomeYear} family thresholds, ${h.src('ato_mls_rates', 'ATO')}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The increment is modest next to the threshold, so it decides the outcome only when the family is close to a line. The table below takes parents on ${K.usd(130000)} and ${K.usd(82500)}, ${K.usd(212500)} in all, without cover, and changes only the number of children.</p>
${h.table(['Children', 'Threshold', 'Tier', 'Surcharge for the year'], near, 'Same incomes, more children: the third child takes this family below the line.', ['l', 'r', 'l', 'r'])}

<h2>Who is a dependent child</h2>
<p>The ATO definition is narrower than the one insurers use for family policies. For the surcharge, a child is your dependant if they are an Australian resident, you contributed to their maintenance, and they are:</p>
<ul>
<li>under ${D.childUnder}, or</li>
<li>from ${D.childUnder} to 24 and studying full time at school, college or university.</li>
</ul>
<p>Your child includes a child born in or outside marriage, an adopted child, a newborn or newly adopted child, your spouse's child and a child within the meaning of the Family Law Act 1975, such as a child under a surrogacy order. A foster child is not included. You maintained a child if you lived in the same house, gave them food, clothing and lodging, helped pay their living, medical or education costs, or pay child support for them. A child turning ${D.childUnder} without full-time study counts for the part of the year before the birthday; a full-time student turning 25 counts until then.</p>
${h.mini('mls', { t: 'Your family, your incomes', p: ['inc', 'pinc', 'ch'], d: { st: 'family', inc: 125000, pinc: 90000, ch: 3 }, c: 'Open the family calculator' })}

<h2>Every member must be covered</h2>
<p>Above the family threshold, a single uncovered day for any member makes the parents liable for that day. The M2 instructions give a ${M.prior.year} example. Jill and Kevin are married with three dependent children. Jill and the children are on a hospital policy all year; Kevin is added to it on 10 January 2026. Their combined income for MLS purposes is ${K.usd(220000)}, above their ${M.prior.year} family threshold of ${K.usd(jkThreshold)} (${K.usd(M.prior.family[0])} plus two increments of ${K.usd(M.childIncrement)}). Because not everyone was covered from 1 July 2025 to 9 January 2026, both Jill and Kevin are liable for those 193 days, Jill included, although she held cover the whole time. Each writes 172, the days without liability, at label A of question M2.</p>
${h.box('The policy statement does the counting', `<p>Your insurer's private health insurance statement shows, for each policy, the number of days it provided an appropriate level of private patient hospital cover. Those days go into your return. If a child was added late, or one parent sat on a separate policy for part of the year, the statements show it. The ATO then works out the surcharge, if any, and adds it to the Medicare levy on your notice of assessment.</p>`)}

<h2>Adult children and insurer rules</h2>
<p>Insurers have their own, wider notion of a dependant. Since rules passed in June 2021, a policy may cover dependants up to age ${D.policyDependantMaxAge}, though each insurer can set a lower limit. That is a policy rule, not a tax one. PrivateHealth.gov.au says that a person covered as a dependant on a family hospital policy is not liable to pay the surcharge, provided they have no spouse or dependants of their own. A 26-year-old on the family policy is thus protected from the surcharge, while no longer an MLS dependant who raises the parents' threshold.</p>

<h2>What the cheapest family policy costs</h2>
<p>A family policy in the October 2026 premium file costs, for the cheapest product of every state, exactly the same as the cheapest couple policy. In Victoria the cheapest open family policy that avoids the surcharge is ${K.usd2(K.cell('VIC', 'family').cheapest.monthly)} a month before the rebate, the median ${K.usd2(K.cell('VIC', 'family').median)}. For the family of the summary, the comparison with a surcharge of ${K.usd(ex.total)} is on the ${h.a('home', 'calculator of the home page')}; ${h.a('mls-single-parents', 'single parents')} have a page of their own.</p>

<h2>Sources</h2>
<p>Dependants and maintenance: ${h.src('ato_mls_family')} (updated 21 August 2026) and ${h.src('ato_m2')}. Thresholds: ${h.src('ato_mls_rates')}. Adult dependants on family policies: ${h.src('phio_mls', 'PrivateHealth.gov.au, Medicare Levy Surcharge')}; insurer age limits: ${h.src('phio_changes', 'PrivateHealth.gov.au, private health insurance changes')}.</p>
`,
  related: ['mls-couples', 'mls-single-parents', 'mls-thresholds', 'mls-part-year-cover', 'mls-family-230000'],
  sources: ['ato_mls_family', 'ato_m2', 'ato_mls_rates', 'phio_mls', 'phio_changes'],
});
