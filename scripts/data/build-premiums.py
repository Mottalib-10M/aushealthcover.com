"""Builds src/data/premiums.json: the cheapest hospital policy that avoids the Medicare levy surcharge,
per state and per family type, from the PrivateHealth.gov.au monthly release on data.gov.au
(dataset "private-health-insurance", licence CC BY 3.0 AU, Private Health Insurance Ombudsman).

Replay (monthly, after the release of the 1st):
  1. download the zip of the month from https://data.gov.au/data/dataset/private-health-insurance
  2. unzip "Hospital Open <date>.xml" and "Funds <date>.xml" in an EMPTY folder outside the repo
  3. python3 -I scripts/data/build-premiums.py "<folder>/Hospital Open 01-Oct-2026.xml" "<folder>/Funds 01-Oct-2026.xml" 2026-10-01 2026-10-19

Kept: products open to new members, of an open (unrestricted) fund, not corporate, not sold only with
another product, flagged MedicareLevySurchargeExempt, valid on the reading day. NSW products cover the
ACT (the file has no ACT state). PremiumNoRebate is the full monthly premium (schema PHOLSchema-V3.1),
before the rebate, any Lifetime Health Cover loading and any age-based discount.
"""
import sys, json, statistics, collections, os, xml.etree.ElementTree as ET
NS = '{http://admin.privatehealth.gov.au/ws/Schemas}'
hosp, fundsf, release, asof = sys.argv[1:5]
out = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'premiums.json')
funds = {}
for _, el in ET.iterparse(fundsf):
    if el.tag == NS + 'Fund':
        funds[el.findtext(NS + 'FundCode')] = {'name': el.findtext(NS + 'FundName'), 'type': el.findtext(NS + 'FundType')}
        el.clear()
REGIONS = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT']
SCALES = ['single', 'couple', 'singleParent', 'family']
TIERS = ['Basic', 'BasicPlus', 'Bronze', 'BronzePlus', 'Silver', 'SilverPlus', 'Gold']

def scale(el):
    w = el.find(NS + 'WhoIsCovered')
    if w is None: return None
    if w.get('OnlyOnePerson') == 'true': return 'single'
    covs = w.findall(NS + 'Coverage')
    if len(covs) != 1: return None
    a = covs[0].get('NumberOfAdults')
    deps = {d.get('Title') for d in covs[0].findall(NS + 'DependantCover') if d.get('Covered') == 'true'}
    if a == '2' and not deps: return 'couple'
    if a == '2' and 'Child' in deps: return 'family'
    if a == '1' and 'Child' in deps: return 'singleParent'
    return None

rows = collections.defaultdict(list); skipped = collections.Counter(); total = 0
for _, el in ET.iterparse(hosp):
    if el.tag != NS + 'Product': continue
    total += 1
    try:
        fc = el.findtext(NS + 'FundCode'); f = funds.get(fc, {})
        co = el.find(NS + 'Corporate'); o = el.find(NS + 'OnlyAvailableWith')
        vf = el.findtext(NS + 'DateValidFrom') or ''; vt = el.findtext(NS + 'DateValidTo') or ''
        if f.get('type') != 'Open': skipped['restricted fund'] += 1; continue
        if co is not None and len(list(co)) > 0: skipped['corporate product'] += 1; continue
        if o is None or o.find(NS + 'NotApplicable') is None: skipped['sold only with another product'] += 1; continue
        if el.findtext(NS + 'ProductStatus') != 'Open': skipped['closed'] += 1; continue
        if el.findtext(NS + 'MedicareLevySurchargeExempt') != 'true': skipped['not surcharge exempt'] += 1; continue
        if (vf and vf > asof) or (vt and vt < asof): skipped['not valid on the day'] += 1; continue
        sc = scale(el)
        if not sc: skipped['other cover type'] += 1; continue
        ex = el.find(NS + 'Excesses')
        g = lambda k: (ex.findtext(NS + k) if ex is not None else None)
        abd = el.find(f'{NS}HospitalCover/{NS}AgeBasedDiscount')
        rec = {'fund': f['name'], 'code': fc, 'product': el.findtext(NS + 'Name'), 'tier': el.findtext(f'{NS}HospitalCover/{NS}HospitalTier'),
               'monthly': float(el.findtext(NS + 'PremiumNoRebate')), 'excess': int(float(g('ExcessPerPerson') or 0)), 'excessPolicy': int(float(g('ExcessPerPolicy') or 0)),
               'excessPerAdmission': int(float(g('ExcessPerAdmission') or 0)), 'ageDiscount': abd is not None and abd.get('Available') == 'true'}
        st = el.findtext(NS + 'State')
        for s in (REGIONS if st == 'ALL' else [st]): rows[(s, sc)].append(rec)
    finally:
        el.clear()

def pick(r): return {k: r[k] for k in ('fund', 'product', 'tier', 'monthly', 'excess', 'excessPolicy', 'ageDiscount')}
cells = {}
for s in REGIONS:
    for sc in SCALES:
        r = sorted(rows[(s, sc)], key=lambda x: (x['monthly'], x['fund']))
        bt = {}
        for t in TIERS:
            rt = [x for x in r if x['tier'] == t]
            if rt: bt[t] = {'cheapest': rt[0]['monthly'], 'fund': rt[0]['fund'], 'median': round(statistics.median([x['monthly'] for x in rt]), 2), 'n': len(rt)}
        cells[f'{s}:{sc}'] = {'n': len(r), 'funds': len({x['code'] for x in r}), 'cheapest': pick(r[0]), 'runnersUp': [pick(x) for x in r[1:3]],
                              'median': round(statistics.median([x['monthly'] for x in r]), 2), 'byTier': bt}
res = {'release': release, 'readOn': asof, 'source': 'https://data.gov.au/data/dataset/private-health-insurance', 'licence': 'CC BY 3.0 AU',
       'productsInFile': total, 'kept': sum(len(rows[(s, sc)]) for s in REGIONS for sc in SCALES if True), 'skipped': dict(skipped), 'openFunds': sum(1 for f in funds.values() if f['type'] == 'Open'),
       'restrictedFunds': sum(1 for f in funds.values() if f['type'] == 'Restricted'), 'cells': cells}
json.dump(res, open(out, 'w'), indent=1, ensure_ascii=False)
print('written', out, res['productsInFile'], res['skipped'])
