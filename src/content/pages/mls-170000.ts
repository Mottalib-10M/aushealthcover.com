import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mls, INC = 170000;
const m = K.mls({ status: 'single', you: { mlsIncome: INC } });
const ceilMonthly = m.total / 12;
const y = (x: number) => x * 12;
const nsw = K.cell('NSW', 'single');
const tiersUnder = K.HT.filter((t) => nsw.byTier[t] && nsw.byTier[t].median <= ceilMonthly).map((t) => K.tl(t));
const below = K.mls({ status: 'single', you: { mlsIncome: M.single[2] } }).total;
const loaded = K.cmp({ status: 'single', you: { mlsIncome: INC }, region: 'NSW', oldest: 45, loading: K.lhc(45), monthlyPremium: nsw.median });
const extrasEx = 1200;
const goldDearer = K.REGIONS.filter((r) => K.cell(r, 'single').byTier.Gold && y(K.cell(r, 'single').byTier.Gold.median) >= m.total).length;
const medCheaper = K.REGIONS.filter((r) => y(K.cell(r, 'single').median) < m.total).length;

export default definePage({
  id: 'mls-170000', group: 'income', order: 4, slug: 'mls-170000',
  nav: 'Surcharge on $170,000', card: `Tier 3: ${K.usd(m.total)} without cover and no rebate at any age.`,
  title: 'MLS on $170,000 in 2026-27: Tier 3 Surcharge, Zero Rebate',
  description: `Medicare levy surcharge on $170,000 in 2026-27: tier 3 at ${K.pct(M.rates[3], 1)}, ${K.usd(m.total)} a year without cover, no rebate on any policy, and which premiums still cost less.`,
  h1: 'Medicare levy surcharge on $170,000: the top tier, with no rebate',
  intro: 'At $170,000 a single person is in tier 3. There is no rebate left, so the full premium is the price: the calculator sets it against the 1.5 % surcharge.',
  resume: `A single income for MLS purposes of ${K.usd(INC)} in ${P.incomeYear} is above ${K.usd(M.single[2] + 1)}, the start of tier 3. Two things happen there. The surcharge reaches its highest rate, ${K.pct(M.rates[3], 1)} of taxable income and reportable fringe benefits, ${K.usd(m.total)} for a full year without hospital cover. And the private health insurance rebate drops to zero, whatever your age: the ATO only pays it when income for surcharge purposes is below the tier 3 threshold. The comparison becomes simple, because the policy costs exactly its full premium, plus any Lifetime Health Cover loading. At this income any single policy with a full premium under ${K.usd2(ceilMonthly)} a month costs less than the surcharge. In New South Wales that covers the median exempt policy, ${K.usd2(nsw.median)}, and the median policy of the ${tiersUnder.join(', ')} tiers in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}.`,
  tool: 'cover',
  toolArg: { st: 'single', inc: INC, rg: 'NSW', age: 35 },
  faqs: [
    { q: 'Is there any private health insurance rebate at $170,000?', a: `No. A single person whose income for surcharge purposes is ${K.usd(M.single[2] + 1)} or more is in tier 3, where the rebate is 0 % at every age, for hospital, general treatment and ambulance policies alike. If you have been taking the rebate as a premium reduction, ask your insurer to remove it, or expect to repay it when you lodge.` },
    { q: 'What premium beats a tier 3 surcharge?', a: `Any policy whose full yearly premium, plus loading, is below the surcharge. At ${K.usd(INC)} that means under ${K.usd(m.total)} a year, or ${K.usd2(ceilMonthly)} a month, for a single person. With no rebate in tier 3, the premium on the quote is the price, which makes the comparison easy to do yourself from any policy statement.` },
    { q: 'Does cover still win at $170,000 with a late-joining loading?', a: `Not always. A person who first joins at 45 carries a ${K.pct(K.lhc(45), 0)} loading. On the median NSW single policy that gives ${K.usd(loaded.premium.net)} a year against a ${K.usd(loaded.mls.total)} surcharge. On the cheapest exempt policy, cover still wins by a wide margin.` },
  ],
  body: (h) => `
<h2>The full premium is the price</h2>
<p>Below tier 3, every comparison between the surcharge and a policy has to take the rebate into account, and the rebate itself changes with income and age. In tier 3 it does not exist. The ATO's eligibility page sets the condition plainly: to receive the rebate, your income for surcharge purposes must be less than the tier 3 threshold. For a single person in ${P.incomeYear} that threshold is ${K.usd(M.single[2] + 1)}. So at ${K.usd(INC)} a hospital policy costs you its full premium, plus any loading, and nothing else enters the sum.</p>
${h.table(['State or territory', 'Surcharge without cover', 'Cheapest exempt policy a year', 'Median exempt policy a year', 'Median Gold a year'], K.REGIONS.map((r) => { const c = K.cell(r, 'single'); const fmt = (v: number) => `${K.usd(y(v))}${y(v) < m.total ? '' : ' (dearer)'}`; return [K.RS[r], K.usd(m.total), fmt(c.cheapest.monthly), fmt(c.median), c.byTier.Gold ? fmt(c.byTier.Gold.median) : 'none']; }), `Single, aged 35, no loading, tier 3, no rebate. "Dearer" marks a premium above the surcharge. PrivateHealth.gov.au file of ${K.day(K.PREM.release)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The pattern is clear from the table: at ${K.usd(INC)}, the median exempt policy costs less than the surcharge in ${medCheaper} of the ${K.REGIONS.length} regions, while a median Gold policy costs more in ${goldDearer} of them. The tax pays for mid-range cover at this income, not for the top tier.</p>
${h.mini('cover', { t: 'Test your own premium at tier 3', p: ['inc', 'prem', 'lhc'], d: { inc: INC, prem: 210, lhc: 0 }, c: 'Open the cover or surcharge calculator' })}

<h2>Extras lose their rebate too</h2>
<p>The rebate applies to hospital, general treatment and ambulance policies, so its end in tier 3 is felt on extras as well. An extras policy costing ${K.usd(extrasEx)} a year, which got ${K.usd(extrasEx * K.reb(2, 35))} of rebate in tier 2, gets nothing here. Extras do not remove the surcharge in any case: only hospital cover does.</p>

<h2>Getting back under the line</h2>
<p>You are ${K.usd(INC - M.single[2])} above the tier 2 ceiling of ${K.usd(M.single[2])}, where the surcharge would be ${K.usd(below)} and the rebate ${K.pct(K.reb(2, 35), 3)}. Salary sacrifice into super does not lower your tier, because reportable super contributions count in income for MLS purposes; it does lower the base the rate is charged on. Deductions you are entitled to lower taxable income, and so both. The ${h.a('income-for-mls-purposes', 'income for MLS purposes page')} has the components, and the ${h.a('mls-150000', '$150,000 page')} shows how the mix of income changes the bill in tier 2.</p>

<h2>Age brings no rebate here</h2>
<p>Below tier 3, people aged 65 and over receive a higher rebate than younger ones, up to ${K.pct(K.reb(0, 72), 3)} at the base tier from age 70. In tier 3 every age band gets 0 %. The proposal before Parliament to move the over 65 rates down to the under 65 ones from 1 April 2027 would therefore change nothing at this income: the tier 3 rebate is already zero in every row. The surcharge, likewise, does not depend on age. A retiree whose taxable income is ${K.usd(INC)} faces the same ${K.usd(m.total)} as a salaried worker on the same income. The ${h.a('rebate-over-65', 'over 65 page')} covers the lower tiers, where the proposal does matter.</p>

<h2>Couples at this income</h2>
<p>For a couple, ${K.usd(INC)} on one side is not tier 3 unless the combined income is over ${K.usd(M.family[2])}. With a partner earning ${K.usd(60000)}, the couple's ${K.usd(INC + 60000)} is in ${K.TN[K.tier(INC + 60000, 'couple')].toLowerCase()} of the family scale, with a rebate of ${K.pct(K.reb(K.tier(INC + 60000, 'couple'), 35), 3)}. The ${h.a('mls-family-230000', 'family $230,000 page')} works through that case with children.</p>
`,
  related: ['mls-150000', 'mls-thresholds', 'income-for-mls-purposes', 'private-health-insurance-rebate', 'compare-health-insurance', 'mls-family-230000'],
  sources: ['ato_mls_rates', 'ato_rebate_rates', 'ato_rebate_eligibility', 'phio_rebate', 'datagov_phi'],
});
