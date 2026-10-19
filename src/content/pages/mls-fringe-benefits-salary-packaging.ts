import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const tom = K.mls({ status: 'single', you: { mlsIncome: 117000, base: 117000 } });
const ti = 95000;
const rows = [0, 10000, 20000, 30000, 45000, 70000].map((rfb) => { const m = K.mls({ status: 'single', you: { mlsIncome: ti + rfb, base: ti + rfb } }); return [K.usd(rfb), K.usd(ti + rfb), K.TN[m.tier], K.usd(m.total)]; });
const noRfb = K.mls({ status: 'single', you: { mlsIncome: ti, base: ti } });
const withRfb = K.mls({ status: 'single', you: { mlsIncome: ti + 20000, base: ti + 20000 } });
const reb = (inc: number) => K.reb(K.tier(inc, 'single'), 40);

export default definePage({
  id: 'mls-fringe-benefits-salary-packaging', group: 'surcharge', order: 8, slug: 'mls-fringe-benefits-salary-packaging',
  nav: 'Fringe benefits and salary packaging', card: 'Reportable fringe benefits raise the tier and are charged at its rate.',
  title: 'Fringe Benefits and the MLS 2026: Salary Packaging Costs',
  description: `Reportable fringe benefits count twice for the 2026-27 Medicare levy surcharge: in the income that sets your tier and in the amount the rate falls on. Test it.`,
  h1: 'Reportable fringe benefits and the Medicare levy surcharge',
  intro: 'Type your taxable income and the reportable fringe benefits amount from your income statement: the tier and the surcharge without cover follow.',
  resume: `Salary packaging lowers your taxable income, but it does not lower the income the ATO uses for the Medicare levy surcharge. Your reportable fringe benefits, the grossed-up amount shown on your income statement, are added back in full when the ATO works out your income for MLS purposes, so they can lift you over the ${K.usd(P.mls.single[0])} single threshold for ${P.incomeYear} or into a higher tier. They then count a second time: the surcharge rate is charged on taxable income plus reportable fringe benefits, not on taxable income alone. The ATO's own example for ${P.incomeYear} is Tom, a single 35-year-old with ${K.usd(90000)} of taxable income and ${K.usd(27000)} of reportable fringe benefits. His taxable income alone would be under the threshold, yet his income for MLS purposes is ${K.usd(117000)}, tier 1, and he owes ${K.usd(tom.total)} without hospital cover. The calculator above repeats that sum with your figures.`,
  tool: 'income',
  toolArg: { ti: 90000, rfb: 27000, sup: 0, inv: 0, st: 'single', pinc: 0, ch: 1 },
  faqs: [
    { q: 'Do reportable fringe benefits count for the Medicare levy surcharge?', a: `Yes, twice. They are part of your income for MLS purposes, which decides whether you pass the threshold and which tier applies, and the surcharge rate is then charged on your taxable income plus your total reportable fringe benefits. A packaged benefit therefore raises both the tier and the amount the rate is applied to.` },
    { q: 'Where do I find my reportable fringe benefits amount?', a: 'On the income statement or payment summary from your employer. On the tax return it goes in the income tests section, and the M2 worksheet takes the total from question IT1, labels N and W. If you have more than one employer with packaged benefits, the amounts are added. Use the grossed-up figure your employer reports, not the cash value of the benefit.' },
    { q: 'Can salary packaging push me into the surcharge?', a: `It can. Take ${K.usd(ti)} of taxable income and no packaged benefits: that is under the ${K.usd(P.mls.single[0])} threshold, so no surcharge. Add ${K.usd(20000)} of reportable fringe benefits and your income for MLS purposes becomes ${K.usd(ti + 20000)}, which is ${K.TN[withRfb.tier].toLowerCase()}, and the surcharge without hospital cover is ${K.usd(withRfb.total)} for ${P.incomeYear}.` },
    { q: 'My employer pays my health insurance. Who gets the rebate?', a: 'You do, through a reduced premium, and it is your own income for surcharge purposes that decides the rebate percentage. The ATO gives the case of Belinda, whose employer pays her premiums under a salary sacrifice arrangement: when a promotion moved her into tier 3 and nobody told the insurer, she had a tax liability at the end of the year for the excess rebate received.' },
    { q: 'Does a partner on a packaged salary change our family tier?', a: `Yes. For a couple, the tier comes from combined income for MLS purposes, and each partner's reportable fringe benefits are part of their own figure. Each partner then pays the rate on their own taxable income and fringe benefits. A partner with packaged benefits can therefore move the whole household above the ${K.usd(P.mls.family[0])} family threshold.` },
  ],
  body: (h) => `
<h2>Why packaged income comes back for the surcharge</h2>
<p>Income tax and the Medicare levy surcharge do not look at the same number. Income tax starts from taxable income, which a salary packaging arrangement reduces. The surcharge starts from a wider figure, income for MLS purposes, which the ATO builds by adding several amounts back to taxable income. Reportable fringe benefits are one of them. The others are reportable super contributions, net investment losses and amounts on which family trust distribution tax has been paid, and the ${h.a('income-for-mls-purposes', 'income for MLS purposes page')} goes through each line of the worksheet.</p>
<p>The reason a fringe benefit matters more than the other add-backs is the second step. Once the tier is known, the ATO applies its rate to taxable income, total reportable fringe benefits and any amount taxed as a family trust distribution. Super contributions and investment losses are left out of that base. Fringe benefits are not. A packaged benefit is therefore treated, for the surcharge, almost exactly like salary.</p>

<h2>How fringe benefits move the tier</h2>
<p>The table holds taxable income at ${K.usd(ti)} for a single person without hospital cover and raises the reportable fringe benefits amount. Every figure comes from the ${P.incomeYear} thresholds read on ${h.src('ato_mls_rates', 'ato.gov.au')}.</p>
${h.table(['Reportable fringe benefits', 'Income for MLS purposes', 'Tier', 'Surcharge without cover'], rows, `Single person, taxable income ${K.usd(ti)}, no super contributions or investment losses, full year without hospital cover, ${P.incomeYear}.`, ['r', 'r', 'l', 'r'])}
<p>With no packaged benefits, this person is ${K.usd(P.mls.single[0] - ti)} under the threshold and owes ${K.usd(noRfb.total)}. A packaging arrangement that reports ${K.usd(20000)} of benefits takes the same person to ${K.usd(withRfb.total)} of surcharge if they hold no hospital cover. The surcharge is then charged on the whole of the taxable income plus the benefits, not only on the part above the threshold.</p>
${h.mini('income', { t: 'Your packaged benefits and the surcharge', p: ['ti', 'rfb'], d: { ti: 100000, rfb: 15000 }, c: 'Open the full income calculator' })}

<h2>The grossed-up figure, not the cash value</h2>
<p>The amount that counts is the reportable fringe benefits amount your employer reports, the grossed-up figure, not what the benefit would cost you in cash. The M2 instructions of the tax return take it from question IT1, labels N and W, where the reportable amounts from your income statements are recorded. If you had two employers that packaged benefits during the year, add both.</p>

<h2>When the employer also pays the premium</h2>
<p>Some packages include private health insurance itself. The ATO is clear that whoever pays the premium, each adult on the policy is income tested for the rebate, and an employee whose employer pays the premium generally receives the rebate as a reduced premium. The test uses the same income for surcharge purposes, fringe benefits included, so a packaged policy can lower your rebate percentage. In ${P.incomeYear}, a single person under 65 with ${K.usd(ti)} of income for surcharge purposes receives ${K.pct(reb(ti), 3)}; at ${K.usd(ti + 20000)} the rebate falls to ${K.pct(reb(ti + 20000), 3)}.</p>
${h.box('The Belinda example', `<p>The ATO describes Belinda, single, whose employer pays her hospital cover under a salary sacrifice arrangement. Her employer paid reduced premiums based on her tier 2 income. A promotion during the year took her income for surcharge purposes into tier 3, where no rebate is paid, and she did not tell her insurer. At tax time she had a liability for the excess private health insurance reduction she had received. If your package changes, tell the insurer, or set aside the difference.</p>`)}

<h2>Couples on packaged salaries</h2>
<p>For a couple or a family, the tier comes from the combined income for MLS purposes of both partners, and each one adds their own fringe benefits to it. Each partner then pays the rate of the household tier on their own taxable income and reportable fringe benefits, for the days they lacked cover. A packaged salary on one side can therefore move both partners into the surcharge even when the other partner's income is modest. ${h.a('mls-couples', 'The couples page')} has the full calculation.</p>

<h2>What packaging cannot do</h2>
<p>Salary packaging does not create an exemption from the surcharge, and no amount of restructuring a package changes the test: an income over the threshold without an appropriate level of hospital cover leads to the surcharge for the days concerned. The only ways out are a policy that avoids it, an exemption category, or an income for MLS purposes at or under the threshold. The ${h.a('is-private-health-insurance-worth-it', 'cover or surcharge comparison')} shows which of the first two costs less for you.</p>
`,
  related: ['income-for-mls-purposes', 'mls-investment-losses-super', 'mls-thresholds', 'mls-couples', 'private-health-insurance-rebate', 'is-private-health-insurance-worth-it'],
  sources: ['ato_mls_rates', 'ato_mls_paying', 'ato_m2', 'ato_rebate_eligibility'],
});
