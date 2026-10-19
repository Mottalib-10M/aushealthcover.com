import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls;
const S = K.thr('single'), F = K.thr('family', 1);
const prS = M.prior.single, prF = M.prior.family;
const rise = (a: number, b: number) => K.usd(a - b);
const at = (inc: number) => K.mls({ status: 'single', you: { mlsIncome: inc } }).total;
const jump1 = at(S[1] + 1) - at(S[1]);
const jump2 = at(S[2] + 1) - at(S[2]);
const kidsRows = [1, 2, 3, 4, 5].map((n) => { const t = K.thr('family', n); return [String(n), K.usd(t[0]), K.usd(t[1]), K.usd(t[2])]; });

export default definePage({
  id: 'mls-thresholds', group: 'surcharge', order: 1, slug: 'mls-thresholds',
  nav: 'MLS thresholds 2026-27', card: `${K.usd(S[0])} single, ${K.usd(F[0])} family, then three tiers up to ${K.pct(M.rates[3], 1)}.`,
  title: 'MLS Thresholds 2026-27: Single, Family and the Three Tiers',
  description: `MLS thresholds for 2026-27: ${K.usd(S[0])} single and ${K.usd(F[0])} family, plus ${K.usd(M.childIncrement)} per extra child, with the tier 1 to 3 rates and how they compare with 2025-26.`,
  h1: 'MLS thresholds 2026-27: where each tier starts and what it costs',
  intro: 'Type your income for MLS purposes and your situation: the tier, the surcharge rate and the rebate that go with it appear at once.',
  resume: `For the ${P.incomeYear} income year, which runs from 1 July 2026 to 30 June 2027, the Medicare levy surcharge starts above ${K.usd(S[0])} of income for MLS purposes for a single person and above ${K.usd(F[0])} for a couple, a family or a single parent, the family figure rising by ${K.usd(M.childIncrement)} for each dependent child after the first. Above the base tier come three bands: tier 1 to ${K.usd(S[1])} single or ${K.usd(F[1])} family at ${K.pct(M.rates[1], 0)}, tier 2 to ${K.usd(S[2])} or ${K.usd(F[2])} at ${K.pct(M.rates[2], 2)}, and tier 3 beyond at ${K.pct(M.rates[3], 1)}. Each boundary is inclusive: ${K.usd(S[0])} exactly is still the base tier. The thresholds rose by ${rise(S[0], prS[0])} for singles and ${rise(F[0], prF[0])} for families compared with ${M.prior.year}, while the rates did not move. The same tiers also set your private health insurance rebate, so one number on your tax return decides both. The rates apply only if you, your spouse or a dependant spent days without an appropriate level of private patient hospital cover.`,
  tool: 'tier',
  toolArg: { st: 'single', inc: 118000 },
  faqs: [
    { q: 'Are the MLS thresholds the same as the rebate income tiers?', a: `Yes. The ATO uses one set of income tiers for both. The base tier, tier 1, tier 2 and tier 3 that set your surcharge rate also set the percentage of your private health insurance rebate. At tier 3, above ${K.usd(S[2])} single or ${K.usd(F[2])} family, the surcharge is at its highest and the rebate falls to zero at every age.` },
    { q: 'Did the MLS thresholds go up for 2026-27?', a: `Yes. The single base threshold moved from ${K.usd(prS[0])} in ${M.prior.year} to ${K.usd(S[0])}, and the family one from ${K.usd(prF[0])} to ${K.usd(F[0])}. Every tier boundary rose by a similar step. The rates of ${K.pct(M.rates[1], 0)}, ${K.pct(M.rates[2], 2)} and ${K.pct(M.rates[3], 1)} stayed exactly as they were, and so did the ${K.usd(M.childIncrement)} added for each child after the first.` },
    { q: 'Which threshold applies to a single parent?', a: `The family one. PrivateHealth.gov.au states that single parents and couples, de facto couples included, are subject to the family tiers. A single parent with one dependent child is therefore tested against ${K.usd(F[0])} for ${P.incomeYear}, and the line moves up by ${K.usd(M.childIncrement)} for each further child. The test uses the parent's own income, as there is no spouse to add.` },
    { q: 'What happens if my income is exactly on a threshold?', a: `You stay in the lower tier. The ATO prints the boundaries as "or less" for the base tier and as ranges starting one dollar higher for the next tier. A single person on exactly ${K.usd(S[0])} pays no surcharge, while one dollar more moves the whole base into tier 1 at ${K.pct(M.rates[1], 0)}, because the rate falls on the full income, not on the excess.` },
    { q: 'When will the 2027-28 thresholds be published?', a: `They are upcoming. On ${K.day(P.retrieved_at)} the ATO page shows thresholds for ${P.incomeYear} and earlier years only. The current table was put online on 22 June 2026, a few days before its income year began on 1 July. This page will take the 2027-28 figures on the day the ATO publishes them; until then, any figure quoted elsewhere is an estimate.` },
  ],
  body: (h) => `
<h2>The ${P.incomeYear} table</h2>
<p>The ATO publishes the thresholds as a single table with two rows, one for singles and one for families, and four columns. We reproduce it with the rebate percentage for people under 65 next to it, since the tiers are shared.</p>
${h.table(['Tier', 'Single', 'Family (one child or none)', 'Surcharge', 'Rebate, under 65'], [
    [K.TN[0], `${K.usd(S[0])} or less`, `${K.usd(F[0])} or less`, K.pct(M.rates[0], 0), K.pct(K.reb(0, 40), 3)],
    [K.TN[1], `${K.usd(S[0] + 1)} to ${K.usd(S[1])}`, `${K.usd(F[0] + 1)} to ${K.usd(F[1])}`, K.pct(M.rates[1], 0), K.pct(K.reb(1, 40), 3)],
    [K.TN[2], `${K.usd(S[1] + 1)} to ${K.usd(S[2])}`, `${K.usd(F[1] + 1)} to ${K.usd(F[2])}`, K.pct(M.rates[2], 2), K.pct(K.reb(2, 40), 3)],
    [K.TN[3], `${K.usd(S[2] + 1)} or more`, `${K.usd(F[2] + 1)} or more`, K.pct(M.rates[3], 1), K.pct(K.reb(3, 40), 3)],
  ], `${P.incomeYear} thresholds and rates, read on ${h.src('ato_mls_rates', 'ato.gov.au')} (page updated 22 June 2026). Rebate from 1 April 2026.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A couple without children uses the family row, exactly like a couple with one child. The column is the same; only the increment for a second, third or later child changes it.</p>

<h2>What changed from ${M.prior.year}</h2>
<p>Every boundary moved up for ${P.incomeYear}. For a single person the base threshold went from ${K.usd(prS[0])} to ${K.usd(S[0])}, the top of tier 1 from ${K.usd(prS[1])} to ${K.usd(S[1])} and the top of tier 2 from ${K.usd(prS[2])} to ${K.usd(S[2])}. The family boundaries moved from ${K.usd(prF[0])}, ${K.usd(prF[1])} and ${K.usd(prF[2])} to ${K.usd(F[0])}, ${K.usd(F[1])} and ${K.usd(F[2])}. Someone whose income stays flat can therefore drop a tier this year without doing anything: a single person on ${K.usd(120000)} was in tier 2 under the ${M.prior.year} table and is in tier 1 under the new one.</p>
${h.table(['Boundary', M.prior.year, P.incomeYear, 'Rise'], [
    ['Single, top of base tier', K.usd(prS[0]), K.usd(S[0]), rise(S[0], prS[0])],
    ['Single, top of tier 1', K.usd(prS[1]), K.usd(S[1]), rise(S[1], prS[1])],
    ['Single, top of tier 2', K.usd(prS[2]), K.usd(S[2]), rise(S[2], prS[2])],
    ['Family, top of base tier', K.usd(prF[0]), K.usd(F[0]), rise(F[0], prF[0])],
    ['Family, top of tier 1', K.usd(prF[1]), K.usd(F[1]), rise(F[1], prF[1])],
    ['Family, top of tier 2', K.usd(prF[2]), K.usd(F[2]), rise(F[2], prF[2])],
  ], 'Both years from the same ATO page.', ['l', 'r', 'r', 'r'])}
<p>Which table applies is set by the income year, not by the date you lodge. A return lodged in October 2026 is for ${M.prior.year} and uses the old figures; the new thresholds show up on the return you lodge after 30 June 2027. Several insurer and comparison pages still printed the ${M.prior.year} figures well into the new year, which is why it pays to check the year in the heading of any table you read.</p>

<h2>Each tier is a step, not a slope</h2>
<p>The surcharge is not charged on the slice of income above a threshold, as income tax is. Once you are in a tier, its rate falls on your whole taxable income and reportable fringe benefits. Crossing a boundary therefore makes the bill jump. At ${K.usd(S[1])} a single person without cover pays ${K.usd(at(S[1]))}; one dollar more and the figure is ${K.usd(at(S[1] + 1))}, a jump of ${K.usd(jump1)}. At the top of tier 2 the jump to tier 3 is ${K.usd(jump2)}. The first step, from nothing to tier 1, is the largest of all: ${K.usd(at(S[0] + 1))} appears the moment income passes ${K.usd(S[0])}.</p>
${h.mini('tier', { t: 'Which tier is your family in?', p: ['st', 'inc', 'ch'], d: { st: 'family', inc: 250000, ch: 3 }, c: 'Open the tier finder' })}
<p>That step shape matters for anyone near a boundary. A salary sacrifice into super does not help, since reportable super contributions are added back into income for MLS purposes. A deduction that lowers taxable income does lower it. ${h.a('income-for-mls-purposes', 'Income for MLS purposes')} lists what is added back and what is not.</p>

<h2>More children, higher family threshold</h2>
<p>The family row rises by ${K.usd(M.childIncrement)} for each MLS dependent child after the first. A child counts while under 21, or from 21 to 24 while studying full time; a foster child does not count. The increase applies to all three boundaries at once.</p>
${h.table(['Dependent children', 'Top of base tier', 'Top of tier 1', 'Top of tier 2'], kidsRows, `Family thresholds for ${P.incomeYear} by number of MLS dependent children.`, ['l', 'r', 'r', 'r'])}
<p>The ${h.a('mls-families', 'families page')} shows who counts as a dependent child and what happens in the year a child turns 21 or leaves full-time study.</p>

${h.box('Thresholds decide the rate, cover decides whether you pay', `<p>Being above a threshold does not by itself mean you owe anything. The surcharge applies only for days on which you, your spouse or one of your dependants lacked an appropriate level of private patient hospital cover. Hospital cover from a registered insurer with an excess of ${K.usd(M.excessLimit.single)} or less for one person, or ${K.usd(M.excessLimit.other)} or less on any other policy, removes it at any income. ${h.a('mls-hospital-cover-excess', 'The excess page')} covers the details.</p>`)}

<h2>How the ATO applies the table</h2>
<p>You do not pick a tier on your return. You report your income test items and, at question M2, the number of days for which you do not have to pay the surcharge; your insurer's private health insurance statement gives the days of cover. The ATO then works out the tier, adds any surcharge to the Medicare levy and shows both as one line, Medicare levy and surcharge, on your notice of assessment. Nothing is withheld from your pay for it during the year.</p>

<h2>Where these figures come from</h2>
<p>Every number on this page is read from ${h.src('ato_mls_rates')}, which carries the ${P.incomeYear} and ${M.prior.year} tables, and is cross-checked against ${h.src('phio_mls', 'the PrivateHealth.gov.au surcharge page')}, which prints the same figures for both years. The rebate column comes from ${h.src('ato_rebate_rates')}. ${h.a('method', 'Our method page')} explains how the calculators apply them.</p>
`,
  related: ['income-for-mls-purposes', 'mls-couples', 'mls-families', 'mls-single-parents', 'private-health-insurance-rebate', 'medicare-levy-vs-surcharge'],
  sources: ['ato_mls_rates', 'phio_mls', 'ato_rebate_rates', 'ato_mls_family'],
});
