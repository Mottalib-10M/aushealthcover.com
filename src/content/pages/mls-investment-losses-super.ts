import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const josh = K.mls({ status: 'single', you: { mlsIncome: 127000, base: 110000 } });
// Negative gearing: salary 140,000, net rental loss 25,000, so taxable income 115,000
const salary = 140000, loss = 25000, taxable = salary - loss;
const geared = K.mls({ status: 'single', you: { mlsIncome: taxable + loss, base: taxable } });
const ifIgnored = K.mls({ status: 'single', you: { mlsIncome: taxable, base: taxable } });
// Deductible personal super contribution of 12,000 on a 112,000 salary
const sal2 = 112000, sup = 12000;
const sm = K.mls({ status: 'single', you: { mlsIncome: sal2, base: sal2 - sup } });
const sm0 = K.mls({ status: 'single', you: { mlsIncome: sal2, base: sal2 } });
const grid = [0, 10000, 20000, 30000, 40000].map((l) => { const m = K.mls({ status: 'single', you: { mlsIncome: 100000 + l, base: 100000 } }); return [K.usd(l), K.usd(100000 + l), K.TN[m.tier], K.pct(m.rate, 2), K.usd(m.total)]; });

export default definePage({
  id: 'mls-investment-losses-super', group: 'surcharge', order: 9, slug: 'mls-investment-losses-super',
  nav: 'Investment losses and super', card: 'Added back to set the tier, never charged at the rate.',
  title: 'Investment Losses, Super and the MLS 2026: Tier Add-Backs',
  description: `Rental losses, share losses and super contributions are added back to set your 2026-27 Medicare levy surcharge tier, but the rate is never charged on them.`,
  h1: 'Investment losses and super contributions in the surcharge test',
  intro: 'Enter your taxable income, then your net investment losses and reportable super contributions: you see the tier they put you in and the surcharge that follows.',
  resume: `Negative gearing and extra super contributions both lower your taxable income, and the ATO undoes both for the Medicare levy surcharge test. Your net rental property loss, your net financial investment loss, your reportable employer super contributions and your deductible personal super contributions are all added back to taxable income to give your income for MLS purposes, the figure compared with the ${K.usd(P.mls.single[0])} single threshold for ${P.incomeYear}. They stop there. The surcharge rate itself is charged only on taxable income, reportable fringe benefits and any amount taxed as a family trust distribution. The ATO example of Josh shows both halves: ${K.usd(90000)} of taxable income, ${K.usd(20000)} of fringe benefits and ${K.usd(17000)} of net investment losses give ${K.usd(127000)}, tier 2, but the ${K.pct(josh.rate, 2)} rate falls on ${K.usd(110000)} only, ${K.usd(josh.total)}. Add-backs can raise your tier, and therefore your rate, without ever being taxed themselves.`,
  tool: 'income',
  toolArg: { ti: taxable, rfb: 0, sup: 0, inv: loss, st: 'single', pinc: 0, ch: 1 },
  faqs: [
    { q: 'Are rental property losses added back for the Medicare levy surcharge?', a: `Yes. Your net rental property loss, the amount by which rental deductions exceeded rental income, is added to taxable income to work out income for MLS purposes. It can push you over the ${K.usd(P.mls.single[0])} threshold or into a higher tier. The surcharge rate is then charged on taxable income and reportable fringe benefits, so the loss itself is not charged.` },
    { q: 'Do super contributions count towards the surcharge threshold?', a: 'Reportable super contributions do: the total of your reportable employer super contributions and your deductible personal super contributions. Both are added to taxable income when the ATO works out income for MLS purposes. They are not part of the amount the surcharge rate is charged on, so they change your tier but are never charged at the rate.' },
    { q: 'Do share trading losses count the same way as rental losses?', a: 'A net financial investment loss, where your financial investment deductions exceed your financial investment income, is added back in the same way as a rental loss. The ATO adds the two together as total net investment losses. On the tax return the M2 worksheet takes them from questions IT5 and IT6 of the income tests section.' },
    { q: 'Is a first home super saver release counted in income for MLS purposes?', a: 'No. The ATO excludes any assessable first home super saver released amount from the taxable income used to work out income for MLS purposes. A release under that scheme therefore does not raise your surcharge tier, even though it is assessable income for income tax in the year you receive it.' },
  ],
  body: (h) => `
<h2>Two tests, one tax</h2>
<p>The surcharge is easiest to understand as two separate questions asked of two different incomes. The first question is which tier you are in, and it uses <strong>income for MLS purposes</strong>, which starts from taxable income and adds back reportable fringe benefits, reportable super contributions, net investment losses and amounts taxed as family trust distributions. The second question is how much you pay, and it uses a narrower base: taxable income, reportable fringe benefits and family trust distribution amounts. Investment losses and super contributions appear in the first list and not in the second. That gap is the whole subject of this page.</p>
${h.table(['Item', 'Counts for the tier', 'Charged at the rate'], [
    ['Taxable income', 'yes', 'yes'],
    ['Reportable fringe benefits', 'yes', 'yes'],
    ['Amount taxed as a family trust distribution', 'yes', 'yes'],
    ['Net rental property loss', 'yes', 'no'],
    ['Net financial investment loss', 'yes', 'no'],
    ['Reportable employer super contributions', 'yes', 'no'],
    ['Deductible personal super contributions', 'yes', 'no'],
    ['First home super saver released amount', 'no', 'no'],
  ], `What each item does in the ${P.incomeYear} surcharge test, from ${h.src('ato_m2', 'the M2 instructions')} and the ATO page on income for MLS purposes.`, ['l', 'l', 'l'])}

<h2>Negative gearing: the loss comes back for the tier</h2>
<p>Take a single person earning a salary of ${K.usd(salary)} who owns a rental property with a net loss of ${K.usd(loss)}. Their taxable income is ${K.usd(taxable)}, and on that figure alone they would be in ${K.TN[ifIgnored.tier].toLowerCase()}, paying ${K.usd(ifIgnored.total)} without cover. The ATO adds the loss back: income for MLS purposes is ${K.usd(taxable + loss)}, which is ${K.TN[geared.tier].toLowerCase()}. The rate of that tier, ${K.pct(geared.rate, 2)}, is then charged on the taxable income of ${K.usd(taxable)}, not on ${K.usd(taxable + loss)}. The surcharge without hospital cover is ${K.usd(geared.total)}, ${K.usd(geared.total - ifIgnored.total)} more than the taxable income alone would suggest, entirely because of the higher tier.</p>
${h.mini('income', { t: 'Your rental or share loss and the tier', p: ['ti', 'inv'], d: { ti: 98000, inv: 15000 }, c: 'Open the full income calculator' })}

<h2>Super contributions: same logic, smaller amounts</h2>
<p>A deductible personal super contribution lowers taxable income in the same way. A person on ${K.usd(sal2)} who claims a deduction for a ${K.usd(sup)} personal contribution has a taxable income of ${K.usd(sal2 - sup)}, under the threshold. The ATO adds the contribution back, so income for MLS purposes stays at ${K.usd(sal2)}, ${K.TN[sm.tier].toLowerCase()}. The ${K.pct(sm.rate, 2)} rate is then charged on the taxable income of ${K.usd(sal2 - sup)}, ${K.usd(sm.total)} without cover, against ${K.usd(sm0.total)} if the same ${K.usd(sal2)} had all been taxable income. The contribution has not removed the surcharge, but it has lowered the amount it is charged on.</p>
<p>Reportable employer super contributions, the amount your income statement reports under that name, are treated the same way. The M2 worksheet takes them from question IT2, label T, and deductible personal contributions from question D12, label H, of the supplementary return.</p>

<h2>Where the losses push you over a line</h2>
<p>The effect is sharpest just below a threshold. The table keeps taxable income at ${K.usd(100000)} for a single person and raises the add-backs, losses or super, from nothing.</p>
${h.table(['Add-backs', 'Income for MLS purposes', 'Tier', 'Rate', 'Surcharge without cover'], grid, `Taxable income ${K.usd(100000)}, no fringe benefits, full year without cover, ${P.incomeYear} thresholds.`, ['r', 'r', 'l', 'r', 'r'])}
<p>The charged amount never moves: it is always the same ${K.usd(100000)}. Only the rate climbs, from nothing to ${K.pct(P.mls.rates[1], 0)} and then ${K.pct(P.mls.rates[2], 2)}, as the add-backs grow. For an investor whose losses vary from year to year, the tier can change even when salary does not.</p>

<h2>Couples: each partner's add-backs join the family total</h2>
<p>For a couple or family, the tier comes from the combined income for MLS purposes of both partners, so one partner's rental loss raises the household's figure against the ${K.usd(P.mls.family[0])} family threshold. Each partner then pays the rate on their own taxable income and fringe benefits. A spouse with a large negatively geared property and a small salary can therefore move the other partner into the surcharge. ${h.a('mls-couples', 'The couples page')} shows the split.</p>
${h.box('The same income test sets your rebate', `<p>The private health insurance rebate uses the same income for surcharge purposes, with the same add-backs. A rental loss that moves you from the base tier to tier 1 also lowers your rebate, from ${K.pct(K.reb(0, 40), 3)} to ${K.pct(K.reb(1, 40), 3)} under 65. See ${h.a('private-health-insurance-rebate', 'the rebate page')}.</p>`)}

<h2>What the add-backs do not include</h2>
<p>Only the items on the ATO list are added back, and one amount is expressly taken out: an assessable first home super saver released amount does not count in the taxable income used for the test. If you had exempt foreign employment income and a taxable income of at least one dollar, the ATO asks you to add that income to taxable income on the worksheet. The ${h.a('income-for-mls-purposes', 'income for MLS purposes page')} has the full worksheet, and ${h.a('method', 'the method page')} explains which items our calculator models.</p>
`,
  related: ['income-for-mls-purposes', 'mls-fringe-benefits-salary-packaging', 'mls-thresholds', 'mls-couples', 'private-health-insurance-rebate', 'mls-125000'],
  sources: ['ato_m2', 'ato_mls_rates', 'ato_mls_paying'],
});
