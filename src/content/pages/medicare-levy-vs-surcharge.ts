import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.medicareLevy, low = L.lowIncome2025;
const lev = (ti: number) => ti * L.rate;
const sur = (ti: number) => K.mls({ status: 'single', you: { mlsIncome: ti } }).total;
const rows = [60000, 100000, 110000, 130000, 170000, 250000].map((ti) => [K.usd(ti), K.usd(lev(ti)), K.usd(sur(ti)), K.usd(lev(ti) + sur(ti)), K.pct((lev(ti) + sur(ti)) / ti, 2)]);
const ex = 130000;

export default definePage({
  id: 'medicare-levy-vs-surcharge', group: 'surcharge', order: 11, slug: 'medicare-levy-vs-surcharge',
  nav: 'Medicare levy and surcharge', card: `The ${K.pct(L.rate, 0)} levy almost everyone pays, and the surcharge on top without hospital cover.`,
  title: 'Medicare Levy vs Surcharge 2026: Two Charges on One Notice',
  description: `Medicare levy vs Medicare levy surcharge in 2026-27: the ${K.pct(L.rate, 0)} levy that most taxpayers pay, the surcharge added without hospital cover, and both in AUD.`,
  h1: 'Medicare levy and Medicare levy surcharge: what each one is',
  intro: 'Type your taxable income and say whether you held hospital cover: the levy, the surcharge and the total appear on separate lines.',
  resume: `The Medicare levy and the Medicare levy surcharge share a name and a line on your notice of assessment, but they are two different charges. The Medicare levy is ${K.pct(L.rate, 0)}, paid by most Australian taxpayers whether or not they hold private health insurance; people on low incomes have it reduced or removed, and some groups, such as foreign residents and temporary residents not entitled to Medicare, can claim an exemption. The surcharge is an extra ${K.pct(P.mls.rates[1], 0)} to ${K.pct(P.mls.rates[3], 1)}, paid only by people whose income for MLS purposes is above the threshold, ${K.usd(P.mls.single[0])} for a single person in ${P.incomeYear}, and who do not hold an appropriate level of private hospital cover. Private hospital cover removes the surcharge, never the levy. At ${K.usd(ex)} of taxable income without cover, a single person pays ${K.usd(lev(ex))} of levy and ${K.usd(sur(ex))} of surcharge. The ATO adds the two and shows them as one amount.`,
  tool: 'levy',
  toolArg: { ti: ex, st: 'single', pinc: 0, ch: 1, hc: 'no' },
  faqs: [
    { q: 'Does private health insurance stop me paying the Medicare levy?', a: `No. Hospital cover only removes the surcharge. The ${K.pct(L.rate, 0)} Medicare levy is paid by most taxpayers whatever insurance they hold. It is reduced for people on low incomes and can be removed through an exemption, for instance for foreign residents or for temporary residents who are not entitled to Medicare and hold a Medicare Entitlement Statement.` },
    { q: 'Is the Medicare levy surcharge taken out of my pay?', a: 'Not automatically. The ATO says the surcharge is not covered by the tax your employer withholds. It is worked out when your return is processed and added to your tax liability, which can reduce a refund or create a bill. Knowing the figure early lets you set the money aside or compare it with a policy.' },
    { q: 'Why does my notice of assessment show one Medicare amount?', a: 'Because the ATO adds the surcharge to the levy and prints the total on one line, called Medicare levy and surcharge. To see how much of it is the surcharge, look at your M2 answer on the return or rebuild it: your tier rate, applied to taxable income and reportable fringe benefits, for each day you lacked an appropriate level of hospital cover.' },
    { q: 'Who pays no Medicare levy at all?', a: `In ${P.mls.prior.year}, a single taxpayer whose taxable income is ${K.usd(low.lower)} or less pays none, and between ${K.usd(low.lower)} and ${K.usd(low.upper)} it is reduced. For those entitled to the seniors and pensioners tax offset the lines are ${K.usd(low.saptoLower)} and ${K.usd(low.saptoUpper)}. Exemptions also exist for some medical conditions, foreign residents and people not entitled to Medicare benefits.` },
  ],
  body: (h) => `
<h2>Side by side</h2>
${h.table(['', 'Medicare levy', 'Medicare levy surcharge'], [
    ['Rate', K.pct(L.rate, 0), `${K.pct(P.mls.rates[1], 0)}, ${K.pct(P.mls.rates[2], 2)} or ${K.pct(P.mls.rates[3], 1)}`],
    ['Who pays', 'most taxpayers', `income over ${K.usd(P.mls.single[0])} single or ${K.usd(P.mls.family[0])} family, without appropriate hospital cover`],
    ['Removed by hospital cover', 'no', 'yes, for the days covered'],
    ['Low-income relief', `yes (${P.mls.prior.year} single lines ${K.usd(low.lower)} and ${K.usd(low.upper)})`, 'not needed: no surcharge under the threshold'],
    ['Removed by a levy exemption', 'yes', 'yes, if every dependant is exempt too'],
    ['On the notice of assessment', 'one line: Medicare levy and surcharge', 'same line'],
  ], `${P.incomeYear} rates and thresholds from ${h.src('ato_mls_rates', 'ato.gov.au')}; low-income lines from the ATO page on the levy reduction, ${P.mls.prior.year} figures.`, ['l', 'l', 'l'])}
<p>The surcharge has a purpose of its own: PrivateHealth.gov.au describes it as a way to encourage people on higher incomes to take out private hospital cover and, where possible, to use the private system, which reduces demand on the public one. That is why the surcharge, and only the surcharge, disappears when you hold an appropriate hospital policy.</p>

<h2>What the two cost together</h2>
<p>For a single person without dependants and without hospital cover, the table adds the levy to the ${P.incomeYear} surcharge. The levy is shown at the full rate; it is lower only for incomes far below the first row.</p>
${h.table(['Taxable income', 'Medicare levy', 'Surcharge without cover', 'Total', 'Share of taxable income'], rows, `Single, no fringe benefits or other add-backs, a full year without hospital cover, ${P.incomeYear} surcharge thresholds.`, ['r', 'r', 'r', 'r', 'r'])}
<p>Below the threshold, the total share is the levy alone. The first dollar over the threshold switches the surcharge on for the whole income, not for the part above it, so the total share jumps from ${K.pct(L.rate, 0)} to ${K.pct(L.rate + P.mls.rates[1], 0)} in a single step. It climbs again at each tier boundary, to ${K.pct(L.rate + P.mls.rates[3], 1)} at the top, where a person without cover pays three quarters of the levy again on top of it.</p>
${h.mini('levy', { t: 'With and without hospital cover', p: ['ti', 'hc'], d: { ti: 160000, hc: 'yes' }, c: 'Open the full levy calculator' })}

<h2>The low-income reduction belongs to the levy only</h2>
<p>People on low incomes do not pay the full levy. For ${P.mls.prior.year}, the latest year the ATO has published, a single taxpayer whose taxable income is ${K.usd(low.lower)} or less pays no levy at all, and between ${K.usd(low.lower)} and ${K.usd(low.upper)} the levy is reduced; the ATO works out the reduction when it assesses the return. For people entitled to the seniors and pensioners tax offset, the lines are ${K.usd(low.saptoLower)} and ${K.usd(low.saptoUpper)}. A family can also qualify for a reduction based on family taxable income. None of this touches the surcharge, which never applies at such incomes anyway. The ${P.incomeYear} low-income lines are upcoming: they were not published on ${K.day(P.retrieved_at)}, and we will enter them on the day they are.</p>

<h2>Exemptions: one door, two charges</h2>
<p>A Medicare levy exemption works for both charges. The ATO lists exemptions for certain medical conditions, for foreign residents and for people who were not entitled to Medicare benefits, and the M2 instructions treat anyone in a levy exemption category for a period as exempt from the surcharge for that period, as long as all their dependants were also covered or exempt. A temporary resident with a Medicare Entitlement Statement and no dependants therefore pays neither the levy nor the surcharge for the days on the statement. ${h.a('mls-visa-holders-expats', 'Visa holders and expats')} sets out who qualifies.</p>
${h.box('The surcharge is not withheld', `<p>Your employer withholds tax with the levy in mind, but the ATO says plainly that the surcharge is not covered by the tax your employer withholds. It is added when your return is assessed. For a person who crosses the threshold for the first time without cover, it may mean a smaller refund or a tax bill. The ${h.a('mls-thresholds', 'thresholds page')} tells you whether that applies to you this year.</p>`)}

<h2>Couples: one test is personal, the other is shared</h2>
<p>Each partner's Medicare levy is worked out on their own return, from their own taxable income. The surcharge is different: the tier comes from the couple's combined income for MLS purposes, tested against the family threshold of ${K.usd(P.mls.family[0])}, and each partner then pays the rate of that tier on their own taxable income and reportable fringe benefits. Two partners on ${K.usd(120000)} each pay the full levy on their own income, and if they hold no hospital cover they also share a family tier set by ${K.usd(240000)} of combined income. Cover for one partner only is not enough: the ATO requires an appropriate level of cover for you, your spouse and all your dependants. ${h.a('mls-couples', 'The couples page')} works through the split.</p>

<h2>Reading your notice of assessment</h2>
<p>The ATO works out both amounts from what your return says and prints them together, as Medicare levy and surcharge. If the line looks higher than ${K.pct(L.rate, 0)} of your taxable income, the difference is usually the surcharge, or a part-year of it. Rebuild it from the M2 question: the number of days you and your dependants held an appropriate level of hospital cover, your income for MLS purposes, and your tier. The ${h.a('income-for-mls-purposes', 'income for MLS purposes page')} explains the income, and ${h.a('mls-part-year-cover', 'part-year cover')} the days.</p>
`,
  related: ['mls-thresholds', 'income-for-mls-purposes', 'mls-visa-holders-expats', 'mls-part-year-cover', 'is-private-health-insurance-worth-it', 'mls-110000'],
  sources: ['phio_mls', 'ato_ml_reduction', 'ato_mls_paying', 'ato_m2', 'ato_mls_rates'],
});
