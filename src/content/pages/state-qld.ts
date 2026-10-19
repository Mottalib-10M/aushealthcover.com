import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { st } from './_state';

const S = st('QLD'), c = S.one, P = K.P;
const INC = 125000;
const ages = [31, 35, 40, 45, 50, 55, 60];
const at = (age: number) => S.vs(INC, undefined, 'single', undefined, age, K.lhc(age));
const beAt = (age: number) => S.be(c.cheapest.monthly, age, K.lhc(age));
const late = at(55);

export default definePage({
  id: 'state-qld', group: 'state', order: 3, slug: 'cheapest-hospital-cover-qld',
  nav: 'Queensland', card: `From ${K.usd2(c.cheapest.monthly)} a month; what a late start adds.`,
  title: 'Hospital Cover Queensland 2026: Cheapest vs MLS by Loading',
  description: `Hospital cover in Queensland for 2026: the cheapest policy avoiding the surcharge is ${K.usd2(c.cheapest.monthly)} a month pre-rebate. See how a late-joiner loading changes the sum.`,
  h1: 'Hospital cover in Queensland: when a late start changes the answer',
  intro: 'Joining hospital cover late adds a loading to the premium but not to the surcharge. Enter your age to see where the balance tips in Queensland.',
  resume: `The cheapest open hospital policy that avoids the Medicare levy surcharge in Queensland costs ${K.usd2(c.cheapest.monthly)} a month for one person before the rebate, from ${c.cheapest.fund}, in the PrivateHealth.gov.au file of ${K.day(K.PREM.release)}. For a single person who has held cover since their early thirties, it costs ${K.usd(at(31).premium.net)} a year after the rebate on an income of ${K.usd(INC)}, against a surcharge of ${K.usd(at(31).mls.total)}. Someone who first joins at 55 carries a Lifetime Health Cover loading of ${K.pct(K.lhc(55), 0)}, charged on top of the premium and not covered by the rebate: the same policy then costs ${K.usd(late.premium.net)}, ${late.coverCheaper ? 'still less than' : 'more than'} the surcharge. The loading lasts ten years of continuous cover. This page gives, age by age, the net cost of the cheapest Queensland policy and the income from which it beats the surcharge.`,
  tool: 'cover',
  toolArg: { rg: 'QLD', inc: INC, age: 45, lhc: 30 },
  faqs: [
    { q: 'Does a Lifetime Health Cover loading make the surcharge cheaper than cover?', a: `It can, at moderate incomes and late joining ages. In Queensland, at ${K.usd(INC)}, the cheapest policy with a ${K.pct(K.lhc(60), 0)} loading, the figure for joining at 60, costs ${K.usd(at(60).premium.net)} against a surcharge of ${K.usd(at(60).mls.total)}. Paying the surcharge instead does not make the loading go away: it keeps rising each year you wait, up to ${K.pct(P.lhc.max, 0)}.` },
    { q: 'What is the cheapest exempt hospital policy in Queensland?', a: `In the file of ${K.day(K.PREM.release)}, "${c.cheapest.product}" from ${c.cheapest.fund}, at ${K.usd2(c.cheapest.monthly)} a month for one person before the rebate. The next two are ${c.runnersUp[0].fund} at ${K.usd2(c.runnersUp[0].monthly)} and ${c.runnersUp[1].fund} at ${K.usd2(c.runnersUp[1].monthly)}. This is a price from the public file, not a recommendation.` },
    { q: 'Is hospital cover in Queensland dearer than in other states?', a: `For the cheapest policy, slightly: ${K.usd2(c.cheapest.monthly)} a month is the highest of the seven price lists in the file, a little above New South Wales at ${K.usd2(K.cell('NSW', 'single').cheapest.monthly)} and Victoria at ${K.usd2(K.cell('VIC', 'single').cheapest.monthly)}. Western Australia and the Northern Territory are much cheaper. The median policy in Queensland costs ${K.usd2(c.median)}.` },
  ],
  body: (h) => `
<h2>Age at joining against the surcharge</h2>
${h.table(['Age on the 1 July before joining', 'Loading', 'Cheapest policy, net per year', 'Surcharge at ' + K.usd(INC), 'Cover cheaper from'], ages.map((a) => { const x = at(a), e = beAt(a); return [String(a), K.pct(K.lhc(a), 0), K.usd(x.premium.net), K.usd(x.mls.total), e === null ? 'not under $1M' : K.usd(e)]; }), `Single person in Queensland, cheapest exempt policy (${K.usd2(c.cheapest.monthly)} a month), never held hospital cover before, rebate of 1 April 2026 (the rebate band changes at 65).`, ['r', 'r', 'r', 'r', 'r'])}
<p>The last column is the lowest income at which the cheapest policy, loading included, costs less than the surcharge. For someone covered since 31 it sits just above the ${K.usd(P.mls.single[0])} threshold. Each year of delay adds ${K.pct(P.lhc.perYear, 0)} to the premium and pushes that income up, because the loading is paid in full while the rebate shrinks with income. The surcharge itself does not care when you were born.</p>
${h.mini('lhc', { t: 'Your loading and its price in Queensland', p: ['age'], d: { age: 48, page: 0, rg: 'QLD' }, c: 'Open the loading calculator' })}

<h2>Why waiting rarely pays</h2>
<p>A loading is a ten-year cost, the surcharge a yearly one. Someone of 45 who stays uncovered for five more years on ${K.usd(INC)} pays the surcharge each of those years, then joins at 50 with ${K.pct(K.lhc(50), 0)} instead of ${K.pct(K.lhc(45), 0)}. On the cheapest Queensland policy at today's premium, those extra ${K.pct(K.lhc(50) - K.lhc(45), 0)} cost ${K.usd(c.cheapest.monthly * 12 * (K.lhc(50) - K.lhc(45)))} a year for ten years. The ${h.a('lhc-base-day-turning-31', 'base day page')} has a calculator for the cost of waiting, and ${h.a('lhc-10-year-removal', 'the removal page')} counts the years left on a loading you already have.</p>
<p>The rule that removes the loading is the same in every state: ten years of continuous hospital cover, with permitted gaps that do not break the count but do not add to it. A late joiner who keeps the cheapest policy for ten years and then moves up a tier pays the higher premium with no loading at all.</p>

<h2>A couple where one partner joins late</h2>
<p>Take a Brisbane couple: one partner has held hospital cover since their twenties, the other has never had any and is 47 on the 1 July before they join together. The late joiner's own loading is ${K.pct(K.lhc(47), 0)}; averaged over the two adults, the couple policy carries ${K.pct(K.avgLoad([K.lhc(47), 0]), 0)}. On the cheapest Queensland couple policy, ${K.usd2(S.two.cheapest.monthly)} a month before the rebate, that average adds ${K.usd(S.two.cheapest.monthly * 12 * K.avgLoad([K.lhc(47), 0]))} a year. With incomes of ${K.usd(140000)} and ${K.usd(95000)}, the couple would otherwise pay ${K.usd(S.vs(140000, undefined, 'couple', 95000, 47).mls.total)} of surcharge between them, and the cheapest couple policy with the averaged loading costs ${K.usd(S.vs(140000, undefined, 'couple', 95000, 47, K.avgLoad([K.lhc(47), 0])).premium.net)} after the rebate. The covered partner pays part of the price of the other's late start for as long as they share the policy, which is worth knowing before choosing between one couple policy and two single ones. Two single policies would cost ${K.usd(2 * c.cheapest.monthly * 12)} a year before the rebate, the loaded one carrying the full ${K.pct(K.lhc(47), 0)}.</p>
<h2>The Queensland price list</h2>
${h.table(['Tier', 'Cheapest from', 'Cheapest per month', 'Median per month', 'Policies'], S.tierRows('single'), 'Single cover in Queensland, open insurers, excess within the surcharge limits, before the rebate.', ['l', 'l', 'r', 'r', 'r'])}
<p>Families pay ${K.usd2(S.fam.cheapest.monthly)} a month for the cheapest exempt policy, couples ${K.usd2(S.two.cheapest.monthly)} and single parents ${K.usd2(S.sp.cheapest.monthly)}. On a couple or family policy the loading is the average of the two adults' loadings, so a partner who has held cover since 31 halves the loading of a late joiner.</p>
<p>Sources: PrivateHealth.gov.au file of ${K.day(K.PREM.release)} (${h.src('datagov_phi', 'data.gov.au')}), ${h.src('phio_lhc', 'Lifetime Health Cover rules')}, ${h.src('ato_mls_rates', 'ATO thresholds')}. Naming a policy reports a price, not a recommendation. ${h.a('method', 'How the figures are built')}.</p>
`,
  related: ['lifetime-health-cover-loading', 'lhc-base-day-turning-31', 'state-nsw', 'mls-125000', 'is-private-health-insurance-worth-it'],
  sources: ['datagov_phi', 'phio_lhc', 'ato_mls_rates', 'ato_rebate_rates'],
});
