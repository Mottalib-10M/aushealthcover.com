# Writing a page

One page = one TypeScript file, `src/content/pages/<id>.ts` (`definePage`), id equal to the file name.
Routes, menus, footer, sitemap, schemas, llms.txt and internal links read these files alone. Files
starting with `_` (such as `_state.ts`, shared computations of the state pages) are not pages.

| Group | Pages | Model |
|---|---|---|
| `surcharge` | thresholds, income for MLS purposes, couples, families, single parents, part year, excess, fringe benefits, investment losses and super, visa holders, levy vs surcharge | `mls-couples.ts` |
| `rebate` | rebate, over 65, premium reduction or tax offset | `private-health-insurance-rebate.ts` |
| `lhc` | loading, base day, new migrants, overseas, days of absence, 10-year removal | `lifetime-health-cover-loading.ts` |
| `decide` | worth it, private health insurance, compare, basic hospital cover | `is-private-health-insurance-worth-it.ts` |
| `income` | one income for MLS purposes (single or family) | `mls-125000.ts` |
| `state` | one state or territory (NSW page covers the ACT) | `state-nt.ts` |

The planned ids are in `src/lib/planned.ts`; fields are documented in `src/lib/page-types.ts`;
calculators (and the fields of each mini-simulator) are in `src/lib/tool-specs.ts`.

## Figures

- Never type a figure that the data holds: use the kit `K` (`src/lib/kit.ts`): `K.thr`, `K.tier`, `K.rate`,
  `K.reb`, `K.mls`, `K.cmp`, `K.be`, `K.lhc`, `K.avgLoad`, `K.cell(region, status)`, `K.usd`, `K.usd2`,
  `K.pct(0.24118, 3)`, `K.dec`, `K.day(iso)`. Example inputs you choose (an income, an age) can be typed.
- 2027: nothing is official. The rebate rates of 1 April 2027 are published in March 2027; the bill that
  would give people aged 65 and over the under-65 rates is before Parliament (`K.P.rebate.proposal2027`).
  The 2027-28 thresholds come with the ATO update in June 2027. Always "proposal" or "upcoming".
- The 2026-27 spouse floor ($28,011 is the 2025-26 figure of the M2 instructions) is flagged as such.
- A rule not in `params-2026.json` is not published unless you read it on an official page (ato.gov.au,
  privatehealth.gov.au, health.gov.au, aph.gov.au, data.gov.au). If you add a source, add it to
  `params-2026.json > sources` and list its key in `sources`. If unsure, leave the sentence out.

## Rules checked by `tests/pages.test.ts`

- `title` 50 to 60 characters, key term first, contains 2026; never starts with a question word,
  "Calculator", "Australia", "Australian", "AU" or "Aussie". Unique. `description` 150 to 160 with 2026.
- `resume`: ONE paragraph of 120 words or more that answers the query with the figures.
- Body: at least 650 words of prose (tables apart), 450 for income and state pages; at least one
  `${h.mini(kind, { t, p, d })}`.
- FAQ: 3 to 8 questions, answers 40 to 90 words, every question unique on the whole site (home included).
- No em dash or en dash, no stock phrases (list in the test), no quote form wording ("get a quote",
  "book a call", "call us"). No `undefined`, `NaN` or `null` in the output.
- Links: `${h.a('page-id', 'text')}`; sources: `${h.src('key', 'text')}`.
- Similarity between two pages under 30 % (`python3 scripts/sim-pages.py` after the test).

Test some files: `PAGE_FILES=state-wa,mls-couples npx vitest run tests/pages.test.ts`.

## Voice

Plain Australian English, second person, short sentences, facts first. Independent site: never imply
that it is the ATO, Services Australia, the Department of Health or the Ombudsman. Naming the cheapest
policy of the public file is a figure for the comparison, never a recommendation. No quote form, no
call to book, no e-mail capture, no affiliate link. Never name or link auspaycalculator.com or any site
of `_trame/domaines-ovh.txt`.

## Premium data: licence and monthly replay

The premiums come from the PrivateHealth.gov.au product data published by the Private Health Insurance
Ombudsman on data.gov.au (dataset `private-health-insurance`), under the **Creative Commons Attribution
3.0 Australia** licence (CC BY 3.0 AU). Attribution, on the method page and in the sources of every page
that uses it: "PrivateHealth.gov.au product data, Private Health Insurance Ombudsman, data.gov.au,
CC BY 3.0 AU". We publish derived figures (cheapest, median, counts), not the file itself.

Replay after each monthly release (the 1st of the month):

1. Download the zip of the month from https://data.gov.au/data/dataset/private-health-insurance into an
   empty folder outside the repository, and unzip it there.
2. `python3 -I scripts/data/build-premiums.py "<folder>/Hospital Open <date>.xml" "<folder>/Funds <date>.xml" <release YYYY-MM-DD> <read YYYY-MM-DD>`
3. `npx vitest run` (the engine tests check a policy exists for every state and type of cover, within
   the excess limits), then `npm run check`.

## Yearly calendar

- **1 April**: new rebate percentages (Department of Health circular in February or March, then the ATO
  table) and new premiums. Update `rebate.periods`, `rebate.current`, the RAF, and replay the premiums.
- **1 July**: new MLS thresholds (ATO page updated in June) and the new spouse floor when the M2
  instructions publish it. Update `mls`, `incomeYear`, `valid_from`, `valid_to`.
- **Any time**: the 2027 rebate bill. If it passes, move `proposal2027` into `periods` from 1 April 2027.
