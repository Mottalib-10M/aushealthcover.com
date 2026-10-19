/** llms.txt (RECETTE §21), generated from the page registry. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const t = K.thr('single');
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Calculators for Australian taxpayers deciding between paying the Medicare levy surcharge and holding private hospital cover, ${K.P.incomeYear} income year: surcharge tiers (singles ${K.usd(t[0])}, ${K.usd(t[1])} and ${K.usd(t[2])}; families double, plus ${K.usd(K.P.mls.childIncrement)} per child after the first; rates 1 %, 1.25 % and 1.5 %), income for MLS purposes, the private health insurance rebate by tier and age (${K.pct(K.reb(0, 40), 3)} base tier under 65 from 1 April 2026), the 2027 proposal for people aged 65 or more (a bill, not law), Lifetime Health Cover loading (2 % a year over 30, 70 % cap, removed after 10 years, 1,094 days of absence), and the cheapest open hospital policy that avoids the surcharge in each state, computed from the PrivateHealth.gov.au file on data.gov.au (${K.PREM.release} release, CC BY 3.0 AU). Independent site published by Radif Partners, no affiliation with the ATO or any insurer, no quotes, general information only. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
