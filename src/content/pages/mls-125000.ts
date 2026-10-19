import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, INC = 125000;
const s = (inc: number) => K.mls({ status: 'single', you: { mlsIncome: inc } }).total;
const edge = M.single[1];
const jump = s(edge + 1) - s(edge);
const m = K.mls({ status: 'single', you: { mlsIncome: INC } });
const cmp = (r: (typeof K.REGIONS)[number], inc = INC) => K.cmp({ status: 'single', you: { mlsIncome: inc }, region: r, oldest: 35, loading: 0 });
const vic = cmp('VIC'), vicLow = cmp('VIC', edge);
const gN = K.cell('NSW', 'single').cheapest.monthly * 12;
const maxL = Math.min(P.lhc.max, m.total / gN - (1 - K.reb(2, 35)));
const maxAge = 30 + Math.floor(maxL / P.lhc.perYear + 1e-9);
const wa = cmp('WA'), nt = cmp('NT');
const pack = K.mls({ status: 'single', you: { mlsIncome: INC, base: INC - 15000 } });

export default definePage({
  id: 'mls-125000', group: 'income', order: 2, slug: 'mls-125000',
  nav: 'Surcharge on $125,000', card: `Tier 2 just crossed: ${K.usd(m.total)} without cover, and a smaller rebate.`,
  title: 'MLS on $125,000 in 2026-27: Tier 2 and the Threshold Jump',
  description: `Medicare levy surcharge on $125,000 in 2026-27: tier 2 at ${K.pct(M.rates[2], 2)}, ${K.usd(m.total)} a year without cover, why one dollar past ${K.usd(edge)} costs more and the rebate cut.`,
  h1: 'Medicare levy surcharge on $125,000: just past the tier 2 line',
  intro: 'At $125,000 a single person has just crossed into tier 2. The calculator shows the surcharge, the smaller rebate and the cheapest policy that removes both questions.',
  resume: `A single income for MLS purposes of ${K.usd(INC)} in ${P.incomeYear} is ${K.usd(INC - edge)} above the tier 1 ceiling of ${K.usd(edge)}, so it falls in tier 2. The surcharge rate there is ${K.pct(M.rates[2], 2)}, charged on the whole of taxable income and reportable fringe benefits, not just on the part above the line: ${K.usd(m.total)} for a full year without hospital cover. That design creates a jump. At ${K.usd(edge)} the surcharge is ${K.usd(s(edge))}; one dollar more and it is ${K.usd(s(edge + 1))}, ${K.usd(jump)} extra for a single dollar of income. The rebate steps down at the same point, from ${K.pct(K.reb(1, 35), 3)} to ${K.pct(K.reb(2, 35), 3)} for people under 65, so the cheapest policy becomes dearer exactly when the surcharge rises. In Victoria the cheapest exempt single policy costs ${K.usd(vic.premium.net)} a year after the tier 2 rebate, ${K.usd(vic.saving)} less than the surcharge at this income.`,
  tool: 'cover',
  toolArg: { st: 'single', inc: INC, rg: 'VIC', age: 35 },
  faqs: [
    { q: 'Why does the surcharge jump at $123,001?', a: `Because each tier's rate applies to the whole surcharge base, not only to the slice above the threshold. At ${K.usd(edge)} you pay ${K.pct(M.rates[1], 0)}, ${K.usd(s(edge))}; at ${K.usd(edge + 1)} you pay ${K.pct(M.rates[2], 2)} on everything, ${K.usd(s(edge + 1))}. Income tax brackets work the other way, on the slice only, which is why the surcharge surprises people.` },
    { q: 'How much rebate is lost by moving from tier 1 to tier 2?', a: `For a person under 65 the rate falls from ${K.pct(K.reb(1, 35), 3)} to ${K.pct(K.reb(2, 35), 3)}, about half. On a hospital policy costing ${K.usd(2000)} a year before the rebate, that is about ${K.usd(2000 * (K.reb(1, 35) - K.reb(2, 35)))} more to pay. Older households lose the same number of points: ${K.pct(K.reb(1, 72), 3)} to ${K.pct(K.reb(2, 72), 3)} at 70 or over.` },
    { q: 'Can salary packaging lower the surcharge at $125,000?', a: `It does not lower the tier, since reportable fringe benefits count in income for MLS purposes and are part of the surcharge base. Super contributions are different: they count for the tier but the rate is not charged on them. With ${K.usd(15000)} of salary sacrificed into super, the surcharge falls to ${K.usd(pack.total)}, though you stay in tier 2.` },
  ],
  body: (h) => `
<h2>The tier boundary in dollars</h2>
${h.table(['Income for MLS purposes', 'Tier', 'Surcharge without cover', 'Rebate under 65', 'Cheapest VIC policy, net'], [118000, 121000, edge, edge + 1, 125000, 128000, 132000].map((inc) => { const c = cmp('VIC', inc); return [K.usd(inc), K.TN[c.mls.tier], K.usd(c.mls.total), K.pct(K.reb(c.mls.tier, 35), 3), K.usd(c.premium.net)]; }), `Single, full year, ${P.incomeYear} thresholds, rebate of 1 April 2026. Premium: cheapest exempt Victorian single policy in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}.`, ['l', 'l', 'r', 'r', 'r'])}
<p>Look at the two middle rows. Between ${K.usd(edge)} and ${K.usd(edge + 1)} the surcharge rises by ${K.usd(jump)} and the net price of the cheapest Victorian policy rises by ${K.usd(cmp('VIC', edge + 1).premium.net - vicLow.premium.net)}, because the rebate falls. Somebody hovering around the line who holds no cover is better off with the policy on either side of it, and the gap widens in tier 2.</p>

<h2>What sits inside $125,000</h2>
<p>The tier is set by income for MLS purposes, which is broader than taxable income: it adds reportable fringe benefits, reportable super contributions and net investment losses. The rate is then charged on a narrower base, taxable income plus reportable fringe benefits. A person with ${K.usd(110000)} of taxable income and ${K.usd(15000)} of salary sacrificed into super has ${K.usd(INC)} for the tier but is charged on ${K.usd(110000)}: ${K.usd(pack.total)} instead of ${K.usd(m.total)}. The ATO's own example of Josh follows the same logic. The ${h.a('mls-investment-losses-super', 'super and investment losses page')} goes further.</p>
${h.mini('tier', { t: 'Which tier is your income in?', p: ['st', 'inc'], d: { st: 'single', inc: edge + 1 }, c: 'Open the tier finder' })}

<h2>If your income moved during the year</h2>
<p>The tier is decided on the income of the whole year, known only when you lodge. A bonus paid in June can lift a year spent in tier 1 into tier 2 after the fact, for the surcharge and for the rebate alike. If you hold a policy and take the rebate as a premium reduction, tell your insurer your expected tier; the ATO warns that claiming too much as a premium reduction may leave a tax liability. If you hold no policy, every day of cover from now on removes a day of surcharge; the ${h.a('mls-part-year-cover', 'part-year page')} does that sum.</p>

<h2>How much loading the comparison can carry</h2>
<p>A late joiner pays a Lifetime Health Cover loading on top of the premium, with no rebate on it. At ${K.usd(INC)} the surcharge leaves room for quite a lot. On the cheapest NSW single policy, ${K.usd(gN)} a year before the rebate, cover stays cheaper than the ${K.usd(m.total)} surcharge up to a loading of about ${K.pct(maxL, 0)}, which is what someone first joining at about ${maxAge} would carry. Beyond that the surcharge is cheaper for the ten loaded years, and the choice turns on what happens after them. The ${h.a('lifetime-health-cover-loading', 'loading page')} gives the percentage for your age.</p>

<h2>Across the states at $125,000</h2>
<p>The surcharge is a federal tax and is the same in every state, ${K.usd(m.total)}. The policy is not. In Western Australia the cheapest exempt single policy costs ${K.usd(wa.premium.net)} a year after the tier 2 rebate, leaving a margin of ${K.usd(wa.saving)}; in the Northern Territory it is ${K.usd(nt.premium.net)}. Residents of the ACT buy New South Wales policies. The ${h.a('compare-health-insurance', 'comparison page')} ranks every state for any hospital tier.</p>

<h2>Neighbouring incomes</h2>
<p>At ${K.usd(110000)} the surcharge is the ${K.pct(M.rates[1], 0)} of tier 1 and the margin over the cheapest policy is thin; see ${h.a('mls-110000', 'the $110,000 page')}. At ${K.usd(150000)} you are deep in tier 2, where the surcharge has grown but the rebate has not moved; see ${h.a('mls-150000', 'the $150,000 page')}.</p>
`,
  related: ['mls-110000', 'mls-150000', 'mls-thresholds', 'income-for-mls-purposes', 'mls-investment-losses-super', 'private-health-insurance-rebate'],
  sources: ['ato_mls_rates', 'ato_mls_paying', 'ato_rebate_rates', 'ato_rebate_eligibility', 'datagov_phi'],
});
