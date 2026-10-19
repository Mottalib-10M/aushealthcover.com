import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, INC = 150000;
const m = K.mls({ status: 'single', you: { mlsIncome: INC } });
const r2 = K.reb(2, 35);
const maxMonthly = m.total / (12 * (1 - r2));
const nsw = K.cell('NSW', 'single');
const fits = K.HT.filter((t) => nsw.byTier[t] && nsw.byTier[t].median <= maxMonthly).map((t) => K.tl(t));
const mixes: Array<[string, number, number]> = [
  ['All salary, no packaging', 150000, 150000],
  [`${K.usd(130000)} salary and ${K.usd(20000)} of reportable fringe benefits`, 150000, 150000],
  [`${K.usd(135000)} taxable and ${K.usd(15000)} salary sacrificed to super`, 150000, 135000],
  [`${K.usd(140000)} taxable and a ${K.usd(10000)} net rental loss`, 150000, 140000],
  [`${K.usd(125000)} taxable, ${K.usd(15000)} to super and a ${K.usd(10000)} rental loss`, 150000, 125000],
];
const ceil = (age: number, L: number) => m.total / (12 * (1 - K.reb(2, age) + L));
const toT3 = M.single[2] + 1 - INC;
const t3 = K.mls({ status: 'single', you: { mlsIncome: M.single[2] + 1 } }).total;

export default definePage({
  id: 'mls-150000', group: 'income', order: 3, slug: 'mls-150000',
  nav: 'Surcharge on $150,000', card: `Deep in tier 2: ${K.usd(m.total)} without cover, and how packaging changes it.`,
  title: 'MLS on $150,000 in 2026-27: Salary Packaging and Tier 2',
  description: `Medicare levy surcharge on $150,000 in 2026-27: ${K.usd(m.total)} without cover at tier 2, how fringe benefits, super and losses change it, and the premium cover can cost.`,
  h1: 'Medicare levy surcharge on $150,000: what packaging changes, and what it does not',
  intro: 'At $150,000 the tier is settled. The calculator shows the surcharge and the cheapest policy; open the options to remove super contributions or investment losses from the surcharge base.',
  resume: `A single income for MLS purposes of ${K.usd(INC)} in ${P.incomeYear} sits in the middle of tier 2, which runs from ${K.usd(M.single[1] + 1)} to ${K.usd(M.single[2])}. Without hospital cover for the full year, the surcharge is ${K.pct(M.rates[2], 2)} of taxable income and reportable fringe benefits, ${K.usd(m.total)} when the whole income is of that kind. How the income is made up matters here more than anywhere. Fringe benefits from salary packaging count in full, both for the tier and for the base. Super contributions and net investment losses count for the tier only, so the surcharge on the same ${K.usd(INC)} can be several hundred dollars lower. With the tier 2 rebate of ${K.pct(r2, 3)}, any hospital policy whose full premium is under about ${K.usd2(maxMonthly)} a month costs less than the full surcharge, and the cheapest exempt single policies in every state are well under that line.`,
  tool: 'cover',
  toolArg: { st: 'single', inc: INC, rg: 'NSW', age: 35 },
  faqs: [
    { q: 'Do salary packaged benefits count for the surcharge?', a: `Yes, twice. Reportable fringe benefits, the grossed-up amount shown on your income statement, are part of income for MLS purposes, which sets the tier, and part of the base the rate is charged on. So ${K.usd(20000)} of packaged benefits on top of ${K.usd(130000)} of salary gives the same ${K.usd(m.total)} surcharge as ${K.usd(INC)} of plain salary.` },
    { q: 'What is the most I can pay for cover and still beat the surcharge on $150,000?', a: `About ${K.usd2(maxMonthly)} a month before the rebate for a single person under 65 with no loading: at that premium the tier 2 rebate of ${K.pct(r2, 3)} brings the yearly cost to the ${K.usd(m.total)} surcharge. In NSW the median exempt single policy costs ${K.usd2(nsw.median)}. A loading lowers that ceiling.` },
    { q: 'How far is $150,000 from the top surcharge tier?', a: `${K.usd(toT3)}. From ${K.usd(M.single[2] + 1)} the rate becomes ${K.pct(M.rates[3], 1)}, the surcharge ${K.usd(t3)} on a full year, and the rebate stops entirely at any age. A pay rise or bonus that crosses that line raises the surcharge and the net price of any policy you already hold.` },
  ],
  body: (h) => `
<h2>Same $150,000, different surcharge</h2>
${h.table(['How the $150,000 is made up', 'Tier', 'Base charged', 'Surcharge without cover'], mixes.map(([label, inc, base]) => { const x = K.mls({ status: 'single', you: { mlsIncome: inc, base } }); return [label, K.TN[x.tier], K.usd(x.you.base), K.usd(x.total)]; }), `Single, full year without hospital cover, ${P.incomeYear}. Income for MLS purposes is ${K.usd(INC)} in every row.`, ['l', 'l', 'r', 'r'])}
<p>The ATO defines income for MLS purposes as taxable income plus reportable fringe benefits, reportable super contributions, net investment losses and any amount on which family trust distribution tax has been paid. That total picks the tier. The rate is then charged on taxable income, reportable fringe benefits and those trust amounts only. The rows above follow that rule: packaged benefits change nothing compared with salary, while super contributions and investment losses keep you in tier 2 but shrink the base. The ${h.a('mls-fringe-benefits-salary-packaging', 'salary packaging page')} goes through the income statement figures line by line.</p>
${h.mini('income', { t: 'Your own mix of income', p: ['ti', 'rfb', 'sup', 'inv'], d: { ti: 125000, rfb: 0, sup: 15000, inv: 10000 }, c: 'Open the income calculator' })}

<h2>The premium ceiling at this income</h2>
<p>Turn the question around: how expensive can a hospital policy be before the surcharge is the cheaper option? For a single person under 65 with no loading, the answer is a full premium of about ${K.usd2(maxMonthly)} a month. In New South Wales the median exempt policy of ${fits.length ? `the ${fits.join(', ')} tier${fits.length > 1 ? 's' : ''}` : 'no tier'} costs less than that, while the median Gold single policy, ${K.usd2(nsw.byTier.Gold.median)}, is far above it. In other words, at ${K.usd(INC)} the tax side pays for a mid-range policy, not for a top one.</p>
<p>That ceiling falls when the surcharge base is smaller. With ${K.usd(25000)} of the income in super contributions and losses, as in the last row of the table, the surcharge is ${K.usd(K.mls({ status: 'single', you: { mlsIncome: INC, base: 125000 } }).total)} and so is the most a policy can cost after the rebate and still win.</p>

<h2>The ceiling moves with age and loading</h2>
${h.table(['Situation', 'Rebate at tier 2', 'Loading', 'Highest monthly premium that still beats the surcharge'], [['Under 65, joined by 31', 35, 0], ['Under 65, first joined at 40', 40, K.lhc(40)], ['Under 65, first joined at 50', 50, K.lhc(50)], ['Oldest on the policy 65 to 69', 67, 0], ['Oldest on the policy 70 or over', 72, 0]].map(([l, a, L]) => [String(l), K.pct(K.reb(2, Number(a)), 3), K.pct(Number(L), 0), K.usd2(ceil(Number(a), Number(L)))]), 'Single, full year, all income charged, before the rebate.', ['l', 'r', 'r', 'r'])}
<p>Two forces pull the ceiling in opposite directions. Age raises it, because the rebate at tier 2 is ${K.pct(K.reb(2, 67), 3)} from 65 and ${K.pct(K.reb(2, 72), 3)} from 70, against ${K.pct(r2, 3)} below 65. A Lifetime Health Cover loading lowers it, because the loading is added to the full premium and the rebate is never paid on it. Someone who first takes out hospital cover at 50, with a ${K.pct(K.lhc(50), 0)} loading, can only pay about ${K.usd2(ceil(50, K.lhc(50)))} a month before the policy costs more than the surcharge. The cheapest exempt policies of the October file are still below that line in every state, but the choice of policy narrows quickly. The loading stops after ten continuous years of cover; the surcharge does not stop as long as your income stays above the threshold and you stay uncovered.</p>

<h2>Before you cross into tier 3</h2>
<p>You are ${K.usd(toT3)} from tier 3. There the surcharge rate rises to ${K.pct(M.rates[3], 1)} and the rebate disappears at every age, so the full premium becomes your price. The ${h.a('mls-170000', '$170,000 page')} shows what that does to the comparison. Back at the start of tier 2, the ${h.a('mls-125000', '$125,000 page')} explains the jump at ${K.usd(M.single[1] + 1)}. Thresholds are set for each income year: they rose on 1 July 2026, from ${K.usd(K.P.mls.prior.single[1])} to ${K.usd(K.P.mls.single[1])} for the top of tier 1, and the ${K.P.incomeYear} figures are the ones that count for this return.</p>
`,
  related: ['mls-125000', 'mls-170000', 'mls-fringe-benefits-salary-packaging', 'mls-investment-losses-super', 'income-for-mls-purposes', 'compare-health-insurance'],
  sources: ['ato_mls_rates', 'ato_mls_paying', 'ato_m2', 'ato_rebate_rates', 'datagov_phi'],
});
