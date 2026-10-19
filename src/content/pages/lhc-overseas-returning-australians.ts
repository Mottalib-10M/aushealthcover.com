import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lhc;
const qld = K.cell('QLD', 'single').cheapest.monthly * 12;
const phuong = K.lhc(35);

export default definePage({
  id: 'lhc-overseas-returning-australians', group: 'lhc', order: 4, slug: 'lhc-overseas-returning-australians',
  nav: 'LHC after living overseas', card: `A year from your return; visits home of up to ${L.overseasVisitDays} days do not count.`,
  title: 'LHC Loading After Living Overseas 2026: Coming Back Home',
  description: `LHC loading after living overseas in 2026: a year from your return to buy hospital cover, short visits home ignored, time abroad not counted in the ${K.num(L.daysOfAbsence)} days.`,
  h1: 'Lifetime Health Cover after living overseas: the rules for returning Australians',
  intro: `Enter the days you have spent in Australia without hospital cover since your base day, leaving out your years abroad: the calculator says whether a loading applies when you rejoin.`,
  resume: `Australians who live abroad are not penalised for the years they spend away. If you are a citizen or permanent resident and were overseas on the 1 July after your 31st birthday, you avoid any Lifetime Health Cover loading by buying private hospital cover before the first anniversary of your return. Your return is your first stay in Australia of ${L.overseasVisitDays} days or more: shorter trips home, for a wedding or a Christmas, leave you overseas for these rules. If you already held hospital cover after your base day and cancelled it to live abroad for at least a year, the days you spend outside Australia are not taken from your lifetime allowance of ${K.num(L.daysOfAbsence)} days without cover. The Ombudsman's example of Wei shows the limit: posted to Canada, he came home in 2012, waited three years to rejoin, used ${K.num(1114)} days of absence and pays ${K.tool('absence', { gap: 1114, cur: 0 }).value}. Buy within the year, and nothing is added.`,
  tool: 'absence',
  toolArg: { gap: 1114, cur: 0, rg: 'QLD' },
  faqs: [
    { q: 'How long do I have to buy hospital cover after moving back to Australia?', a: `If you were overseas on your base day, until the first anniversary of your return, where the return is your first period of ${L.overseasVisitDays} days or more in Australia. Buy after that anniversary and the loading is based on your age at the 1 July before joining. If you held cover after your base day and cancelled it to go abroad, your remaining days of absence apply instead.` },
    { q: 'Do visits home while I live abroad end my time overseas?', a: `Not if each visit lasts up to ${L.overseasVisitDays} consecutive days. PrivateHealth.gov.au treats you as still overseas during visits of up to ${L.overseasVisitDays} days. A stay of ${L.overseasVisitDays} days or more counts as your return, and for people who had cancelled their cover, any such stay is deducted from their ${K.num(L.daysOfAbsence)} days of absence.` },
    { q: 'What proof of my time overseas will the insurer want?', a: 'An International Movement Record, which you request from the Department of Home Affairs with its application form. It shows your exit and entry dates, so the insurer can count the days you were away. If you held cover before leaving, also ask your former insurer for a clearance certificate, which it must provide within 14 days.' },
    { q: 'I was over 31 and living abroad on 1 July 2000. What applies to me?', a: `You are treated as having held hospital cover on your base day. No loading builds up while you are overseas, and once back you have ${K.num(L.daysOfAbsence)} days of absence to buy cover without a loading. PrivateHealth.gov.au describes Haruki, back in 2012, who bought cover in December 2018, four years after his days ran out, and paid ${K.pct(4 * L.perYear, 0)}.` },
  ],
  body: (h) => `
<h2>Which of the three situations is yours?</h2>
<p>The Ombudsman's ${h.src('phio_lhc', 'Lifetime Health Cover page')} treats expatriates in three groups, and the deadline is different for each. Find your row before doing any arithmetic.</p>
${h.table(['Your situation', 'Deadline to buy without a loading', 'Ombudsman example'], [
  ['Citizen or permanent resident, overseas on the 1 July after your 31st birthday (birthday after 1 July 2000)', 'First anniversary of your return', 'Phuong'],
  ['Held hospital cover after your base day, cancelled it to live abroad for at least a year', `Your remaining days of the ${K.num(L.daysOfAbsence)} allowance, counted only while in Australia`, 'Wei'],
  ['Aged 31 or over and overseas on 1 July 2000', `${K.num(L.daysOfAbsence)} days of absence from your return`, 'Haruki'],
], 'The three cases set out by PrivateHealth.gov.au.', ['l', 'l', 'l'])}
<p>In every case the meaning of "return" is the same: your first period of ${L.overseasVisitDays} days or more in Australia. A posting abroad with a fortnight at home each summer is one continuous period overseas.</p>

<h2>Overseas on your base day: the year after you come back</h2>
<p>Phuong is an Australian citizen born on 5 April 1983. She leaves for Ecuador on 26 June 2014, a few days before the 1 July after her 31st birthday, and lives there for two years, visiting her parents five times for no more than 40 days each. She comes back for good on 25 June 2016. Her new base day is 25 June 2017. She buys hospital cover on 12 October 2018, aged 35, after that anniversary, so she pays ${K.pct(phuong, 0)}: five years over 30. Had she bought before 25 June 2017, she would have paid nothing. On today's cheapest single policy in Queensland, ${K.usd(qld)} a year, her ${K.pct(phuong, 0)} costs ${K.usd(qld * phuong)} a year for ten years.</p>

<h2>Cancelled to move abroad: the allowance waits for you</h2>
<p>Wei, born in 1971, takes out hospital cover in June 2001 with no loading and cancels it in February 2004 to work in Canada. He visits family in Australia once a year for 25 days. Those visits are well within ${L.overseasVisitDays} days, so none of his time abroad uses his allowance. He returns for good on 15 November 2012 with zero days of absence used, but only rejoins on 4 December 2015, ${K.num(1114)} days later. That is ${K.num(1114 - L.daysOfAbsence)} days over the ${K.num(L.daysOfAbsence)}, and he pays ${K.pct(L.perYear, 0)}.</p>
${h.mini('absence', { t: 'Days used since you came home', p: ['gap', 'cur'], d: { gap: 700, cur: 0, rg: 'QLD' }, c: 'Open the days of absence calculator' })}
<p>The lesson is that the allowance is generous while you are away and runs at full speed once you are back. Every day in Australia without hospital cover after your return counts, and once the ${K.num(L.daysOfAbsence)} days are spent the loading returns: your previous loading, plus ${K.pct(L.perYear, 0)}, plus ${K.pct(L.perYear, 0)} for each further year. The ${h.a('lhc-days-of-absence', 'days of absence page')} works through the count.</p>

<h2>Abroad on 1 July 2000</h2>
<p>When the scheme began, Australians aged 31 or over who lived overseas were treated as already covered on their base day. Haruki, a permanent resident born in 1964, moves to Sweden in May 2000 and returns for good on 7 September 2012. He has ${K.num(L.daysOfAbsence)} days, to 6 September 2015, to buy cover with no loading. He waits until 14 December 2018 and pays ${K.pct(4 * L.perYear, 0)}: ${K.pct(L.perYear, 0)} for each of the four years after his days of absence ended, by the Ombudsman's count. That allowance is for life; if he later lets his cover lapse while living in Australia, the gap comes off the same ${K.num(L.daysOfAbsence)} days.</p>
${h.box('Expats and the surcharge', `<p>Coming home also restarts the Medicare levy surcharge clock if your income is over ${K.usd(P.mls.single[0])} (single, ${P.incomeYear}) and you are not in a Medicare levy exemption category. The surcharge is charged for each day without hospital cover; the year you are given for Lifetime Health Cover does not suspend it. A returning single person on ${K.usd(150000)} pays ${K.usd(K.mls({ status: 'single', you: { mlsIncome: 150000 } }).total)} for a full year without cover. ${h.a('mls-visa-holders-expats', 'Visa holders and expats')} covers the surcharge side.</p>`)}

<h2>Paperwork that makes the difference</h2>
<p>Your insurer cannot see your travel history. To have the correct loading applied, give it an International Movement Record from the Department of Home Affairs, which lists every departure and arrival, and, if you held cover before leaving, a clearance certificate from your former insurer. PrivateHealth.gov.au lists the cases where the movement record is needed, including people who cancelled their cover after the age of 31 and went overseas for at least 12 months. Supply the documents on or after joining, and ask the insurer to reassess. The general rule is on ${h.a('lifetime-health-cover-loading', 'the Lifetime Health Cover loading page')}, and the parallel case of people moving to Australia for the first time on ${h.a('lhc-new-migrants', 'new migrants')}.</p>
`,
  related: ['lhc-days-of-absence', 'lifetime-health-cover-loading', 'lhc-new-migrants', 'mls-visa-holders-expats', 'state-qld'],
  sources: ['phio_lhc', 'ato_lhc', 'ato_overseas', 'datagov_phi'],
});
