import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls;
const S = K.thr('single'), F = K.thr('family', 1);
const tom = K.mls({ status: 'single', you: { mlsIncome: 117000, base: 117000 } });
const josh = K.mls({ status: 'single', you: { mlsIncome: 127000, base: 110000 } });
const joshPrior = (90000 + 20000) * M.rates[2];
/** A worker on 100,000 taxable income who salary-sacrifices 10,000 into super. */
const sac = K.mls({ status: 'single', you: { mlsIncome: 100000 + 10000, base: 100000 } });
/** A landlord: 98,000 taxable income after a 12,000 net rental loss. */
const land = K.mls({ status: 'single', you: { mlsIncome: 98000 + 12000, base: 98000 } });

export default definePage({
  id: 'income-for-mls-purposes', group: 'surcharge', order: 2, slug: 'income-for-mls-purposes',
  nav: 'Income for MLS purposes', card: 'Taxable income plus fringe benefits, super contributions and investment losses.',
  title: 'Income for MLS Purposes 2026-27: What the ATO Adds Back',
  description: `Income for MLS purposes in 2026-27: taxable income plus fringe benefits, super and investment losses, tested against ${K.usd(S[0])} single or ${K.usd(F[0])} family.`,
  h1: 'Income for MLS purposes: the figure that sets your tier',
  intro: 'Split your income into its parts: the tool adds back what the ATO adds back and shows which part the surcharge is charged on.',
  resume: `Income for MLS purposes is not your taxable income. The ATO starts from taxable income, leaves out any assessable first home super saver released amount, and adds four things if they apply to you: reportable fringe benefits from your income statement, reportable super contributions (employer contributions made under salary sacrifice plus personal contributions you claimed as a deduction), your total net investment loss from shares and rental property, and any amount on which family trust distribution tax was paid. For a couple, both partners' totals are added together. That sum decides your tier against the ${P.incomeYear} thresholds of ${K.usd(S[0])} single and ${K.usd(F[0])} family. The rate of the tier is then charged on a narrower base: taxable income, reportable fringe benefits and family trust amounts only. Super contributions and investment losses can push you into a tier without being charged themselves. The ATO case of Josh shows it: ${K.usd(127000)} of income for MLS purposes, but a surcharge worked out on ${K.usd(110000)}.`,
  tool: 'income',
  toolArg: { ti: 98000, rfb: 12000, sup: 0, inv: 0, st: 'single' },
  faqs: [
    { q: 'Is salary sacrifice into super counted for the Medicare levy surcharge?', a: `Yes, for the tier. Salary sacrificed contributions are reportable employer super contributions, and the ATO adds them back to income for MLS purposes. They do not enter the base the rate is charged on. Someone on ${K.usd(100000)} of taxable income who sacrifices ${K.usd(10000)} is tested on ${K.usd(110000)}, so is above the single threshold, and pays ${K.usd(sac.total)} without cover.` },
    { q: 'Does a negative gearing loss reduce income for MLS purposes?', a: `No. A net rental property loss lowers your taxable income, but the ATO adds it back when it works out income for MLS purposes, together with any net financial investment loss. A landlord with ${K.usd(98000)} of taxable income after a ${K.usd(12000)} rental loss is tested on ${K.usd(110000)}, above the ${P.incomeYear} single threshold of ${K.usd(S[0])}.` },
    { q: 'Are reportable fringe benefits charged by the surcharge or only counted?', a: 'Both. Reportable fringe benefits are the one add-back that also forms part of the base the surcharge rate falls on, together with taxable income. The ATO example of Tom, who has a taxable income and a fringe benefits amount, charges the tier 1 rate on the sum of the two. Use the grossed-up figure printed on your income statement.' },
    { q: 'Does foreign income count for the surcharge?', a: 'Exempt foreign employment income does. The M2 instructions say to add it to taxable income when working out income for MLS purposes, provided your taxable income is $1 or more. Foreign income that is already assessable is part of taxable income anyway. Overseas cover held with a foreign fund still does not count as private patient hospital cover.' },
    { q: 'What extra amount does a spouse bring into the family total?', a: 'Besides their own taxable income and add-backs, a spouse brings any share of the net income of a trust on which the trustee must pay tax and which is not already in their taxable income. The ATO worksheet keeps it in a separate row of the spouse column. Your two column totals, added together, give the combined income for MLS purposes.' },
  ],
  body: (h) => `
<h2>The ATO worksheet, row by row</h2>
<p>The paper return instructions for question M2 include a worksheet with a column for you and one for your spouse. It is the clearest statement of what the ATO counts. We follow its rows, and mark which ones also go into the base the surcharge is charged on.</p>
${h.table(['Row', 'Item', 'Counts for the tier', 'Charged at the rate'], [
    ['a', 'Taxable income, without any assessable first home super saver released amount', 'yes', 'yes'],
    ['b', 'Total reportable fringe benefits', 'yes', 'yes'],
    ['c', 'Amount on which family trust distribution tax has been paid', 'yes', 'yes'],
    ['d', 'Net financial investment loss', 'yes', 'no'],
    ['e', 'Net rental property loss', 'yes', 'no'],
    ['f', 'Reportable employer super contributions', 'yes', 'no'],
    ['g', 'Deductible personal super contributions', 'yes', 'no'],
    ['h', "Spouse's share of trust net income taxed to the trustee (spouse column only)", 'yes', 'no'],
  ], `Worksheet 1 of the ${h.src('ato_m2', 'M2 instructions')}; the rate base from ${h.src('ato_mls_paying', 'Paying the Medicare levy surcharge')}.`, ['l', 'l', 'l', 'l'])}
<p>Row j adds the column up. For a single person, that is the income for MLS purposes. With a spouse, the two row j figures added together give the combined income tested against the family threshold of ${K.usd(F[0])}. Exempt foreign employment income goes into row a when your taxable income is at least $1.</p>

<h2>Two ATO examples, two years</h2>
<p><strong>Tom, ${P.incomeYear}.</strong> Tom is 35, single, without cover. His taxable income is ${K.usd(90000)} and his reportable fringe benefits ${K.usd(27000)}, so his income for MLS purposes is ${K.usd(117000)}. That is ${K.TN[tom.tier].toLowerCase()}, and the ${K.pct(tom.rate, 0)} rate falls on the whole ${K.usd(117000)}: ${K.usd(tom.total)}. Here the two bases coincide, because Tom has nothing that counts for the tier only.</p>
<p><strong>Josh, ${M.prior.year}.</strong> Josh is also 35, single, without cover. His taxable income is ${K.usd(90000)}, his reportable fringe benefits ${K.usd(20000)} and his net investment losses ${K.usd(17000)}. His income for MLS purposes is ${K.usd(127000)}, tier 2 at ${K.pct(M.rates[2], 2)}, but the rate is applied to ${K.usd(110000)} only: ${K.usd(joshPrior)}. The ${K.usd(17000)} of losses pushed him up a tier without being charged. Under the ${P.incomeYear} thresholds the same figures still land in ${K.TN[josh.tier].toLowerCase()} and give ${K.usd(josh.total)}.</p>
${h.mini('income', { t: 'Add back your own super and losses', p: ['ti', 'sup', 'inv'], d: { ti: 96000, sup: 8000, inv: 6000 }, c: 'Open the income builder' })}

<h2>Where people get caught</h2>
<p>Most surprises come from add-backs that lower taxable income in one place and reappear here.</p>
<ul>
<li><strong>Salary sacrifice.</strong> Sacrificing pay into super reduces taxable income but reappears as a reportable employer contribution. On ${K.usd(100000)} of taxable income with ${K.usd(10000)} sacrificed, the test income is ${K.usd(110000)}: above ${K.usd(S[0])}, a surcharge of ${K.usd(sac.total)} without cover.</li>
<li><strong>Personal deductible contributions.</strong> The same applies to a contribution you make yourself and claim as a deduction in your return.</li>
<li><strong>Negative gearing.</strong> A rental loss that brings taxable income down to ${K.usd(98000)} is added back: ${K.usd(12000)} of loss gives a test income of ${K.usd(110000)} and a surcharge of ${K.usd(land.total)}, charged on the ${K.usd(98000)}.</li>
<li><strong>Salary packaging.</strong> Fringe benefits count twice over, for the tier and for the base. The ${h.a('mls-fringe-benefits-salary-packaging', 'salary packaging page')} works through common packages.</li>
</ul>
<p>What does not appear in the worksheet is not added. A first home super saver amount released to you is taken out of taxable income for this purpose.</p>

${h.box('A couple adds two columns, then splits the bill', `<p>The combined figure only sets the tier. Each partner is then charged on their own taxable income and fringe benefits, for their own days without cover. A partner whose own income for MLS purposes is ${K.usd(M.spouseOwnIncomeFloor.value)} or less is not liable when the couple was together all year (${M.spouseOwnIncomeFloor.year} figure; the ${P.incomeYear} one is not yet published). The ${h.a('mls-couples', 'couples page')} has the details.</p>`)}

<h2>The same figure sets your rebate</h2>
<p>The ATO uses the same sum, under the name income for surcharge purposes, to set your private health insurance rebate. An add-back that moves you from tier 1 to tier 2 raises the surcharge rate from ${K.pct(M.rates[1], 0)} to ${K.pct(M.rates[2], 2)} and cuts the rebate for people under 65 from ${K.pct(K.reb(1, 40), 3)} to ${K.pct(K.reb(2, 40), 3)} of the premium. If you take the rebate as a reduced premium, you tell your insurer which tier you expect to be in; claim too much and you may have a tax liability when you lodge, so the ATO asks you to tell the insurer when your income moves to another tier. ${h.a('private-health-insurance-rebate', 'The rebate page')} explains the reconciliation.</p>

<h2>Sources</h2>
<p>The definition is on ${h.src('ato_mls_rates', 'the ATO page on income for MLS purposes, thresholds and rates')}, updated 22 June 2026, and in the worksheet of ${h.src('ato_m2')}. The Tom example is the ATO's ${P.incomeYear} example; Josh is the ${M.prior.year} example of the M2 instructions. ${h.a('method', 'Our method')} shows how the calculator splits the two bases.</p>
`,
  related: ['mls-thresholds', 'mls-fringe-benefits-salary-packaging', 'mls-investment-losses-super', 'mls-couples', 'private-health-insurance-rebate'],
  sources: ['ato_mls_rates', 'ato_m2', 'ato_mls_paying', 'ato_rebate_eligibility'],
});
