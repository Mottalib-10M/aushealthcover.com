import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('VIC'), c = S.one, P = K.P;
const INC = 135000;
const base = S.vs(INC);
const step = (t: string) => S.vs(INC, c.byTier[t].cheapest);
const gold = c.byTier.Gold;

export default definePage({
  id: 'state-vic', group: 'state', order: 2, slug: 'cheapest-hospital-cover-vic',
  nav: 'Victoria', card: `From ${K.usd2(c.cheapest.monthly)} a month; Gold from ${K.usd2(gold.cheapest)}.`,
  title: 'Hospital Cover Victoria 2026: Basic to Gold vs the MLS',
  description: `Hospital cover in Victoria for 2026: from ${K.usd2(c.cheapest.monthly)} a month for the cheapest policy that avoids the surcharge to ${K.usd2(gold.cheapest)} for Gold. What each tier costs net.`,
  h1: 'Hospital cover in Victoria: what each step up from Basic costs',
  intro: 'The surcharge you avoid is a fixed sum for your income. Here is how far it goes at each hospital tier in Victoria.',
  resume: `A single Victorian on ${K.usd(INC)} of income for MLS purposes is in tier 2 for ${P.incomeYear} and would pay ${K.usd(base.mls.total)} of Medicare levy surcharge without hospital cover. The cheapest open policy that avoids it costs ${K.usd2(c.cheapest.monthly)} a month before the rebate in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}, so ${K.usd(base.premium.net)} a year after the ${K.pct(base.premium.rebatePct, 3)} rebate. That leaves ${K.usd(base.saving)} of the surcharge unspent, and the question becomes how much better a policy that money buys. The cheapest Bronze Plus policy costs ${K.usd(step('BronzePlus').premium.net)} net, the cheapest Silver Plus ${K.usd(step('SilverPlus').premium.net)} and the cheapest Gold ${K.usd(step('Gold').premium.net)}. The table below gives each tier at its cheapest and at its median price, and the full calculator above takes your own income and premium.`,
  tool: 'cover',
  toolArg: { rg: 'VIC', inc: INC },
  faqs: [
    { q: 'Which hospital tier can I get in Victoria for the price of the surcharge?', a: `At ${K.usd(INC)} the surcharge is ${K.usd(base.mls.total)}. Every tier whose cheapest Victorian policy costs less than that after the rebate is affordable for the same money: ${S.tiers.filter((t) => step(t).coverCheaper).map((t) => K.tl(t)).join(', ')}. The answer moves with your income, since both the surcharge and the rebate depend on it.` },
    { q: 'Why is Silver Plus sometimes cheaper than Silver in Victoria?', a: `Because tier names set a minimum list of covered treatments, not a price. Victoria has ${c.byTier.SilverPlus.n} open Silver Plus single policies and only ${c.byTier.Silver.n} plain Silver ones, so the cheapest Silver Plus at ${K.usd2(c.byTier.SilverPlus.cheapest)} undercuts the cheapest Silver at ${K.usd2(c.byTier.Silver.cheapest)} a month. Compare policies across tiers, not only within one.` },
    { q: 'How many hospital policies avoid the surcharge in Victoria?', a: `${K.num(c.n)} open single policies from ${c.funds} insurers, ${K.num(S.two.n)} couple policies and ${K.num(S.fam.n)} family policies in the file of ${K.day(K.PREM.release)}. Each excess option of a product is counted as a policy. Restricted funds, corporate products and policies with an excess above the limits are left out.` },
  ],
  body: (h) => `
<h2>The ladder from Basic to Gold</h2>
${h.table(['Tier', 'Cheapest per month', 'Net per year at ' + K.usd(INC), 'Against the surcharge', 'Median per month', 'Policies'], S.tiers.map((t) => { const x = step(t); return [K.tl(t), K.usd2(c.byTier[t].cheapest), K.usd(x.premium.net), x.coverCheaper ? `${K.usd(x.saving)} cheaper` : `${K.usd(-x.saving)} dearer`, K.usd2(c.byTier[t].median), String(c.byTier[t].n)]; }), `Single cover in Victoria, aged 35, no loading, ${K.pct(base.premium.rebatePct, 3)} rebate (tier 2). Surcharge without cover: ${K.usd(base.mls.total)}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Read the fourth column as the extra you would pay, or keep, compared with paying the surcharge and holding no cover. At this income the four lower rungs, Basic to Bronze Plus, cost less than the tax at their cheapest. Silver and Silver Plus cost a few hundred dollars more, and Gold over a thousand more; the median Gold policy at ${K.usd2(gold.median)} a month costs about ${K.dec(gold.median / gold.cheapest, 1)} times its cheapest one. The cheapest Gold single policy in the state comes from ${gold.fund}.</p>
${h.mini('cover', { t: 'Test a Victorian premium', p: ['inc', 'prem'], d: { rg: 'VIC', inc: INC, prem: 170 }, c: 'Open the full calculator' })}

<h2>Where the money goes at other incomes</h2>
<p>The same ladder looks different on either side of ${K.usd(INC)}. Just over the threshold, at ${K.usd(106000)}, the surcharge is only ${K.usd(S.vs(106000).mls.total)} while the rebate is higher, ${K.pct(K.reb(1, 35), 3)}, so the cheapest policy costs ${K.usd(S.vs(106000).premium.net)} and the margin above it is thin. In tier 3, at ${K.usd(180000)}, the surcharge reaches ${K.usd(S.vs(180000).mls.total)} and there is no rebate at all: the cheapest Gold policy then costs ${K.usd(S.vs(180000, gold.cheapest).premium.net)}, ${S.vs(180000, gold.cheapest).coverCheaper ? 'less' : 'more'} than the surcharge. The ${h.a('mls-170000', 'page for $170,000')} looks at the top tier in detail.</p>
<p>A loading changes every row. The Lifetime Health Cover loading is a percentage added to the hospital premium, and it is the same percentage on a Basic as on a Gold policy, so in dollars it is three times larger on Gold. Someone joining at 45 with a ${K.pct(K.lhc(45), 0)} loading would add ${K.usd(gold.cheapest * 12 * K.lhc(45))} a year to the cheapest Gold policy and ${K.usd(c.cheapest.monthly * 12 * K.lhc(45))} to the cheapest Basic one. See ${h.a('lifetime-health-cover-loading', 'the loading page')}.</p>

<h2>How to use the ladder</h2>
<p>Start from the surcharge you would pay, since it is money you spend either way once you are over the threshold. Subtract the net cost of the cheapest policy: what is left is the budget for better cover that costs you nothing extra compared with doing nothing. At ${K.usd(INC)} that budget is ${K.usd(base.saving)} a year, about ${K.usd(base.saving / 12)} a month, enough to reach the cheapest Bronze Plus policy in the table with room to spare. Beyond that, each step up is paid for by you, not by the tax you avoid. Two cautions apply. A tier name sets the floor of what a policy covers, so read the Private Health Information Statement of each candidate. And waiting periods, which the Ombudsman warns may apply again after a break in cover, are not modelled here.</p>
<h2>Couples and families in Victoria</h2>
<p>For two people the cheapest exempt policy is ${K.usd2(S.two.cheapest.monthly)} a month and the cheapest Gold ${K.usd2(S.two.byTier.Gold.cheapest)}; for a family, ${K.usd2(S.fam.cheapest.monthly)} and ${K.usd2(S.fam.byTier.Gold.cheapest)}. Their surcharge is tested on the combined income against the family threshold, so the ladder above applies with the household sum in place of a single income.</p>
<p>Sources: PrivateHealth.gov.au file of ${K.day(K.PREM.release)} (${h.src('datagov_phi', 'data.gov.au')}); tiers: ${h.src('phio_changes', 'PrivateHealth.gov.au')}; thresholds and rebate: ${h.src('ato_mls_rates', 'ATO')}. Naming a policy reports a price, not a recommendation. ${h.a('method', 'How the figures are built')}.</p>
`,
  related: ['state-nsw', 'state-tas', 'basic-hospital-cover', 'compare-health-insurance', 'mls-150000'],
  sources: ['datagov_phi', 'phio_changes', 'ato_mls_rates', 'ato_rebate_rates'],
});
