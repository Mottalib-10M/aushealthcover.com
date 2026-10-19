import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, INC = 110000;
const m = K.mls({ status: 'single', you: { mlsIncome: INC } });
const row = (r: (typeof K.REGIONS)[number]) => K.cmp({ status: 'single', you: { mlsIncome: INC }, region: r, oldest: 35, loading: 0 });
const nsw = row('NSW'), qld = row('QLD'), nt = row('NT');
const over = INC - M.single[0];
const half = K.mls({ status: 'single', you: { mlsIncome: INC }, daysWithout: K.days(6) });
const g = K.cell('NSW', 'single').cheapest.monthly * 12;
const lost = g * (K.reb(0, 35) - K.reb(1, 35));
const older = K.cmp({ status: 'single', you: { mlsIncome: INC }, region: 'NSW', oldest: 68, loading: 0 });
const loaded = K.cmp({ status: 'single', you: { mlsIncome: INC }, region: 'NSW', oldest: 40, loading: K.lhc(40) });

export default definePage({
  id: 'mls-110000', group: 'income', order: 1, slug: 'mls-110000',
  nav: 'Surcharge on $110,000', card: `Tier 1: ${K.usd(m.total)} a year without cover, against the cheapest policy.`,
  title: 'MLS on $110,000 in 2026-27: Tier 1 Surcharge or Basic Cover',
  description: `Medicare levy surcharge on $110,000 in 2026-27: tier 1, ${K.usd(m.total)} a year without hospital cover, set against the cheapest exempt policy in each state after rebate.`,
  h1: 'Medicare levy surcharge on $110,000: tier 1, just over the line',
  intro: 'A single income of $110,000 sits just above the 2026-27 threshold. The calculator compares the 1 % surcharge with the cheapest policy for your state, age and loading.',
  resume: `A single person whose income for MLS purposes is ${K.usd(INC)} in ${P.incomeYear} is ${K.usd(over)} over the threshold of ${K.usd(M.single[0])}, which puts them in tier 1. Without an appropriate level of hospital cover for the whole year, the surcharge is ${K.pct(M.rates[1], 0)} of taxable income and reportable fringe benefits: ${K.usd(m.total)} if all ${K.usd(INC)} is of that kind. Crossing the threshold also cuts the rebate on any policy you hold, from ${K.pct(K.reb(0, 35), 3)} to ${K.pct(K.reb(1, 35), 3)} for people under 65. Even so, the cheapest exempt single policy costs less than the surcharge in every state in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, though only just in some: in New South Wales ${K.usd(nsw.premium.net)} a year after the rebate, ${K.usd(nsw.saving)} under the surcharge; in the Northern Territory ${K.usd(nt.premium.net)}. A loading from a late start can tip the balance the other way at this income.`,
  tool: 'cover',
  toolArg: { st: 'single', inc: INC, rg: 'NSW', age: 35 },
  faqs: [
    { q: 'How much Medicare levy surcharge is due on $110,000?', a: `${K.usd(m.total)} for a full year without hospital cover in ${P.incomeYear}, if the whole ${K.usd(INC)} is taxable income and reportable fringe benefits. The tier 1 rate is ${K.pct(M.rates[1], 0)}. If part of your income for MLS purposes is super contributions or investment losses, those count for the tier but the rate is charged only on the rest.` },
    { q: 'Why does my rebate fall when I earn $110,000?', a: `Because the rebate uses the same income tiers as the surcharge. At ${K.usd(INC)} you are in tier 1, where a person under 65 receives ${K.pct(K.reb(1, 35), 3)} instead of ${K.pct(K.reb(0, 35), 3)}. Tell your insurer: the ATO warns that claiming too much rebate as a premium reduction can leave you with a tax liability.` },
    { q: 'Is the surcharge ever cheaper than cover on $110,000?', a: `Yes, when the policy is dearer than the cheapest one or carries a loading. Someone who joins at 40 has a ${K.pct(K.lhc(40), 0)} loading; the cheapest NSW policy then costs ${K.usd(loaded.premium.net)} a year against a surcharge of ${K.usd(loaded.mls.total)}. The loading ends after ten years; the surcharge recurs every year you stay above the threshold uncovered.` },
  ],
  body: (h) => `
<h2>State by state at $110,000</h2>
${h.table(['State or territory', 'Surcharge without cover', 'Cheapest policy, full premium', 'After the tier 1 rebate', 'Difference'], K.REGIONS.map((r) => { const c = row(r); return [K.RS[r], K.usd(c.mls.total), K.usd(c.premium.gross), K.usd(c.premium.net), c.coverCheaper ? `cover ${K.usd(c.saving)} cheaper` : `surcharge ${K.usd(-c.saving)} cheaper`]; }), `Single, aged 35, no loading, full year, ${P.incomeYear}. Premiums: PrivateHealth.gov.au file of ${K.day(K.PREM.release)}.`, ['l', 'r', 'r', 'r', 'l'])}
<p>The surcharge is the same everywhere, ${K.usd(m.total)}, because it is a federal tax. Premiums are not. In the east the margin is thin: in Queensland the cheapest exempt policy saves ${K.usd(qld.saving)} a year, which a modest premium rise on 1 April could erase. In Western Australia and the Northern Territory the gap is wide.</p>

<h2>Five thousand dollars over the line</h2>
<p>At this income the question people ask is whether they can get back under ${K.usd(M.single[0])}. Income for MLS purposes is taxable income plus reportable fringe benefits, reportable super contributions and net investment losses. Salary sacrificing into super does not help, since the sacrificed amount comes back in as a reportable super contribution. Deductions you are entitled to do lower taxable income, and so the income tested. The ${h.a('income-for-mls-purposes', 'income for MLS purposes page')} lists every item, and the ${h.a('mls-fringe-benefits-salary-packaging', 'salary packaging page')} covers the fringe benefits case.</p>
${h.mini('income', { t: 'Rebuild your income for MLS purposes', p: ['ti', 'rfb', 'sup'], d: { ti: 98000, rfb: 0, sup: 12000 }, c: 'Open the income calculator' })}

<h2>If you already hold cover: the rebate step</h2>
<p>For someone who already has hospital cover, crossing ${K.usd(M.single[0])} costs nothing in surcharge but something in rebate. On the cheapest NSW single policy, ${K.usd(g)} a year before the rebate, the fall from ${K.pct(K.reb(0, 35), 3)} to ${K.pct(K.reb(1, 35), 3)} means about ${K.usd(lost)} more to pay. On a policy three times dearer, three times as much. The rebate entitlement is settled on your tax return from your actual income for the year, so a pay rise in March can still move you into tier 1 for the whole period from 1 July. Update your income tier with your insurer when you expect to cross the line: it avoids a bill when you lodge.</p>

<h2>Age changes the rebate, not the surcharge</h2>
<p>The surcharge at ${K.usd(INC)} is the same at 30 or at 70. The rebate is not: at tier 1 it is ${K.pct(K.reb(1, 35), 3)} under 65, ${K.pct(K.reb(1, 67), 3)} from 65 to 69 and ${K.pct(K.reb(1, 72), 3)} from 70, based on the oldest person on the policy. A single person aged 68 in NSW would pay ${K.usd(older.premium.net)} for the cheapest policy after the rebate, against the same ${K.usd(older.mls.total)} of surcharge. For a couple, an income of ${K.usd(INC)} on its own is far below the family threshold of ${K.usd(M.family[0])}: the surcharge only applies if the combined income is over that line, which is the subject of the ${h.a('mls-couples', 'couples page')}.</p>

<h2>Joining part way through the year</h2>
<p>The surcharge is charged by the day. Someone at ${K.usd(INC)} who takes out hospital cover on 1 January pays about ${K.usd(half.total)} for the six months without it, not ${K.usd(m.total)}. What has already passed cannot be undone, but every month of cover from now on replaces a month of surcharge. The ${h.a('mls-part-year-cover', 'part-year page')} compares joining now with staying uncovered to 30 June.</p>

<h2>What changes next year</h2>
<p>Thresholds are indexed each 1 July. The ${P.incomeYear} line of ${K.usd(M.single[0])} was ${K.usd(M.prior.single[0])} in ${M.prior.year}, so an income that does not rise can fall back under the threshold in a later year. Premiums and rebate rates change on 1 April. A comparison made at ${K.usd(INC)} today is worth redoing each year, especially here, where the gap between the two options is a few dollars a week.</p>
`,
  related: ['mls-125000', 'mls-thresholds', 'income-for-mls-purposes', 'mls-part-year-cover', 'basic-hospital-cover', 'private-health-insurance-rebate'],
  sources: ['ato_mls_rates', 'ato_rebate_rates', 'ato_rebate_eligibility', 'datagov_phi'],
});
