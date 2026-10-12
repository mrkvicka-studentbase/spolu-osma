import json,re
D='/home/user/spolu-osma/obsah/lekce/'
def L(i): return json.load(open(D+f'M8-T05-{i}.json'))
def tokens(s):
    s=s.replace('{,}','.')
    fr=set(re.findall(r'\\d?frac\{(\d+)\}\{(\d+)\}',s))
    mix=set(re.findall(r'(\d+)\\frac\{(\d+)\}\{(\d+)\}',s))
    s2=re.sub(r'\\d?frac\{\d+\}\{\d+\}',' ',s)
    nums=set(re.findall(r'\d+(?:\.\d+)?',s2))
    return fr,mix,nums
for n in '1234':
    b=L(f'L{n}NB'); m=L(f'L{n}N')
    # structure
    for ub,um in zip(b['ulohy'],m['ulohy']):
        sb=[(k['id'],k['vstup']['typ'],len(k['vstup'].get('moznosti',[])),len(k.get('zname_chyby',[]))) for k in ub['kroky']]
        sm=[(k['id'],k['vstup']['typ'],len(k['vstup'].get('moznosti',[])),len(k.get('zname_chyby',[]))) for k in um['kroky']]
        cb=sorted(c for k in ub['kroky'] for c in [x.get('typ_chyby') for x in k['vstup'].get('moznosti',[])]+[z['typ_chyby'] for z in k.get('zname_chyby',[])] if c)
        cm=sorted(c for k in um['kroky'] for c in [x.get('typ_chyby') for x in k['vstup'].get('moznosti',[])]+[z['typ_chyby'] for z in k.get('zname_chyby',[])] if c)
        print(n,ub['typ'],ub['cas_min']==um['cas_min'],'struktura',sb==sm,'kody',cb==cm, '' if sb==sm else (sb,sm), '' if cb==cm else (cb,cm))
    for k in ['tema','kapitola','tyden','poradi','varianta','cas_min','faze','pomucky']: assert b[k]==m[k],k
    # overlaps of zadani numbers
    zb=' '.join(u['zadani'] for u in b['ulohy'])
    frb,mixb,nb=tokens(zb)
    for other in [f'L{x}' for x in '1234']+[f'L{x}N' for x in '1234']+[f'L{x}B' for x in '1234']:
        o=L(other); zo=' '.join(u['zadani'] for u in o['ulohy'])
        fro,mixo,no=tokens(zo)
        big=lambda S:{x for x in S if float(x)>=12}
        ov=(frb&fro, mixb&mixo, big(nb)&big(no))
        if any(ov): print('   prekryv zadani s',other,ov)
