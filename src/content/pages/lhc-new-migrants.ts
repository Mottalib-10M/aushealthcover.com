import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc;
const wa = K.cell('WA', 'single').cheapest.monthly * 12;
const waC = K.cell('WA', 'couple').cheapest.monthly * 12;
const sonja = K.lhc(36);

export default definePage({
  id: 'lhc-new-migrants', group: 'lhc', order: 3, slug: 'lhc-new-migrants',
  nav: 'LHC for new migrants', card: 'Twelve months from full Medicare registration, or your usual base day if later.',
  title: 'LHC Loading for New Migrants 2026: Your 12 Month Window',
  description: `LHC loading for new migrants in 2026: no loading if you take hospital cover within 12 months of full Medicare registration, or by the 1 July after you turn 31.`,
  h1: 'Lifetime Health Cover for new migrants: the twelve months after Medicare',
  intro: 'Arrived recently and over 31? Enter your age on the 1 July before you would join: if your twelve months have passed, the calculator gives your loading and its price in your state.',
  resume: `A new migrant to Australia gets a base day of their own for Lifetime Health Cover: the later of the 1 July following the 31st birthday and the first anniversary of full Medicare registration. In practice, someone who arrives at 38 and registers for Medicare has twelve months from that registration to take out private hospital cover with no loading. Full registration means registration for interim or full Medicare benefits, usually shown by a blue or green Medicare card; reciprocal Medicare does not count. Miss the twelve months and the normal rule applies: ${K.pct(L.perYear, 0)} for every year you were over 30 on the 1 July before joining. PrivateHealth.gov.au gives the case of Sonja, registered in April 2013 and insured only in October 2018 at 36: her loading is ${K.pct(sonja, 0)}. On the cheapest single policy in Western Australia, ${K.usd(wa)} a year, that is ${K.usd(wa * sonja)} more each year for ten years.`,
  tool: 'lhc',
  toolArg: { age: 38, page: 0, rg: 'WA' },
  faqs: [
    { q: 'When does the twelve month window for new migrants start?', a: 'On the date you registered for interim or full Medicare benefits, the date usually tied to a blue or green Medicare card. Your base day is the first anniversary of that date, unless the 1 July after your 31st birthday is later. You can confirm the registration date by asking Services Australia for a Medicare registration date letter.' },
    { q: 'Does reciprocal Medicare count as registration for Lifetime Health Cover?', a: 'No. PrivateHealth.gov.au states that reciprocal Medicare does not count for Lifetime Health Cover purposes. The window opens only with registration for interim or full Medicare benefits. If you are unsure which date applies to you, the Medicare registration date letter settles it, and your insurer uses it to set your loading.' },
    { q: 'Does Overseas Visitors Health Cover protect me from the loading?', a: 'No. Overseas Visitors Health Cover, Overseas Student Health Cover and insurance from another country are not hospital cover for Lifetime Health Cover. Only private hospital cover from an Australian registered insurer counts. A visa holder who keeps a visitor policy after full Medicare registration still needs an Australian hospital policy within the twelve months.' },
    { q: 'What do I give my insurer to avoid a loading as a new migrant?', a: 'A letter from Medicare stating your registration date, supplied on or after joining, so that the insurer can reassess your loading. If you registered on or after 1 July 2009 and were overseas on the anniversary of your registration, you may also need an International Movement Record from the Department of Home Affairs.' },
    { q: 'What if I left Australia soon after registering for Medicare?', a: 'If you registered on or after 1 July 2009 and were overseas on the anniversary, you have twelve months from your first return to Australia for 90 days or more. PrivateHealth.gov.au describes Deepak, who registered in 2009, worked in France for six years with short visits home and returned in December 2015: his new base day was the anniversary of that return.' },
  ],
  body: (h) => `
<h2>Two dates, take the later one</h2>
<p>For anyone who arrives in Australia already over 31, the usual deadline has long passed. The rules give them a fresh one. ${h.src('phio_lhc', 'PrivateHealth.gov.au')} sets the base day of a new migrant at the later of:</p>
<ul>
<li>the 1 July following the 31st birthday; or</li>
<li>the first anniversary of full Medicare registration.</li>
</ul>
<p>${h.src('ato_lhc', 'The ATO')} says the same thing in its list of people who do not pay the loading: a new migrant aged 31 or over who had hospital cover within 12 months of being registered for full Medicare benefits. For a migrant who arrives at 27, the first date is the later one and the usual rule applies. For a migrant who arrives at 45, it is the anniversary of registration.</p>
${h.table(['Arrival situation', 'Base day', 'Loading if insured within the window', 'Loading if insured two years after registration'], [
  ['Registered at 27, now 29', 'the 1 July after the 31st birthday', K.pct(0, 0), K.pct(0, 0)],
  ['Registered at 38', 'first anniversary of registration', K.pct(0, 0), K.pct(K.lhc(40), 0)],
  ['Registered at 45', 'first anniversary of registration', K.pct(0, 0), K.pct(K.lhc(47), 0)],
  ['Registered at 60', 'first anniversary of registration', K.pct(0, 0), K.pct(K.lhc(62), 0)],
], 'Loading after a missed window, assuming the person was two years older on the 1 July before joining. The exact figure depends on the date of birth.', ['l', 'l', 'r', 'r'])}

<h2>Sonja's case, step by step</h2>
<p>The Ombudsman's example shows the order of the tests. Sonja registers for full Medicare benefits, a green card, on 20 April 2013. Her 31st birthday is on 8 January 2014. The anniversary of her registration is 20 April 2014; the 1 July after her 31st birthday is 1 July 2014. The later of the two is 1 July 2014, so that is her base day. She buys private hospital cover on 2 October 2018, aged 36, and pays ${K.pct(sonja, 0)}: (36 minus 30) times ${K.pct(L.perYear, 0)}.</p>
<p>Had she registered at 33 instead, her base day would have been the anniversary of registration, and any policy bought in the following twelve months would have carried no loading at all.</p>
${h.mini('lhc', { t: 'Loading for a migrant couple who missed the window', p: ['age', 'page'], d: { age: 42, page: 39, rg: 'WA' }, c: 'Open the loading calculator' })}

<h2>A couple who arrived together</h2>
<p>When both partners miss the window, each has their own loading, and the couple policy carries the average. A couple aged 42 and 39 on the 1 July before joining have ${K.pct(K.lhc(42), 0)} and ${K.pct(K.lhc(39), 0)}, so ${K.pct(K.avgLoad([K.lhc(42), K.lhc(39)]), 0)} on the policy. On the cheapest couple policy in Western Australia, ${K.usd(waC)} a year before the rebate, that adds ${K.usd(waC * K.avgLoad([K.lhc(42), K.lhc(39)]))} a year for ten years. If one partner joined within the window and the other did not, the average halves the late joiner's loading.</p>

<h2>Choosing a policy inside the window</h2>
<p>Any private hospital policy from an Australian registered insurer meets the Lifetime Health Cover deadline, whatever its tier. A migrant who wants time to compare can take a low cost Basic policy before the anniversary, keep it, and move to a fuller policy later: changing product or insurer without a gap does not reset anything, and the loading stays at zero. The cheapest single policy in Western Australia that also avoids the surcharge costs ${K.usd2(wa / 12)} a month before the rebate in the file of ${K.day(K.PREM.release)}; ${h.a('state-wa', 'the Western Australia page')} lists the others.</p>

<h2>Visitors, students and the policies that do not count</h2>
<p>Many people arrive on a temporary visa that requires Overseas Visitors Health Cover or Overseas Student Health Cover. Neither counts as hospital cover for Lifetime Health Cover, and neither stops the Medicare levy surcharge either. Before full Medicare registration, the Lifetime Health Cover window has not opened. Once a visa holder is registered for full or interim Medicare benefits, the twelve months run, and a visitor policy kept out of habit does not stop them running.</p>
${h.box('The documents your insurer may ask for', `<p>A <strong>Medicare registration date letter</strong>, obtained from Services Australia, to show when your twelve months began. An <strong>International Movement Record</strong> from the Department of Home Affairs if you were overseas on the anniversary of your registration (for registrations from 1 July 2009). A <strong>clearance certificate</strong> from any previous Australian insurer, which a former insurer must provide within 14 days. Give them on or after joining so that your loading is reassessed.</p>`)}

<h2>The Medicare levy surcharge is a separate clock</h2>
<p>The twelve month window concerns the loading only. The surcharge runs from the first day you are both liable and without hospital cover: once your income for MLS purposes is over ${K.usd(P.mls.single[0])} (single, ${P.incomeYear}) and you are no longer in a Medicare levy exemption category, every day without an Australian hospital policy counts. A new resident on ${K.usd(140000)}, liable for the surcharge from registration, who waits the full twelve months pays ${K.usd(K.mls({ status: 'single', you: { mlsIncome: 140000 } }).total)} in surcharge for a full year. ${h.a('mls-visa-holders-expats', 'Visa holders and expats')} sets out when the exemption ends. The general rule for everyone else is on ${h.a('lifetime-health-cover-loading', 'the Lifetime Health Cover loading page')}, and the case of Australians coming home is on ${h.a('lhc-overseas-returning-australians', 'returning from overseas')}.</p>
`,
  related: ['lifetime-health-cover-loading', 'mls-visa-holders-expats', 'lhc-overseas-returning-australians', 'lhc-base-day-turning-31', 'state-wa'],
  sources: ['phio_lhc', 'ato_lhc', 'ato_not_entitled', 'datagov_phi'],
});
