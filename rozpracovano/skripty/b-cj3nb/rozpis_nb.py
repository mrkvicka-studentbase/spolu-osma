import json, sys
sys.path.insert(0, '/home/user')
D = '/home/user/spolu-osma/obsah/cestina/lekce/'
import re
def tok(t): return [w for w in re.findall(r"[\wÀ-ž]+(?:[-–][\wÀ-ž]+)*", t)]
def tokens(t):
    return [w.strip('.,!?;:„“"') for w in t.split() if w.strip('.,!?;:„“"–')]
TYPN = {"rozcvicka": "rozcvička", "nova": "nová", "detektiv": "detektiv", "kontrolni": "kontrolní"}
JINE = {
 'cj-t3-l9nb': ["jiné rodiny (chladný, šetrný, závistivý, mlčenlivý) místo radostný, čistý, odvážný, líný", "úterní, kamarádčin, mokrá, spolužákova, odpolední, prudký místo večerní, sestřin, tmavá, bratrova, školní, těžký", "jiná věta, menší (malý) a Mámina místo horší (špatný) a Lucčina", "řady suchý, dobrý, tuhý, drahý místo hezký, dlouhý, tichý, krátký; chyba nejdobřejší místo nejdloužší", "jiné věty; Dědečkův, kovový, venkovní, Učitelčiny, ostré, dolní; nejstatečnější, rozumnější, větší, šedou, Nejvtipnější, kudrnatá"],
 'cj-t3-l10nb': ["hasičovo, vnitřní, velký – větší, řídký – nejřidší místo sousedovo, přední, úzký, tenký", "jiných 8 dvojic (dělníci, film, střelec, sýraři, lékaři, telefon, kosi, gauč)", "jiný text; pasti sousedé, učitelé, děti, telata, hadice vedle zahradníci, kamenným, překvapený", "jiná věta (hasiči … ušpiněný), past dobrovolného, klidní", "jiný text (statek), stejné pasti (osly ve 4. pádě, kůzlata, správce)"],
 'cj-t3-l11nb': ["jiné 4 věty (soustředění, okouzlení, kostkované, opravený)", "jiná spojení (kuchařovi, rybářovy, pekařova vrata, kapitánovi, učitelovy syny, Adamovy kalhoty, Tomášovi křečci, myslivcova štěňata)", "jiná věta (Adamovi dvakrát, Tomášovy hokejky)", "jiná věta (instruktorovi hole), pasti trenérčiny, bratrancův", "jiný text (u vody), pasti Hasičovy děti, plavčíkovy ploutve (4. pád), osušku Adamovi"],
 'cj-t3-l12nb': ["boční, nejmokřejší, vlídní, školníkovy místo zadní, nejširší, milí, trenérovy", "jiný text (Strýčkovo, pohodlném, slaměném, Maminčiny, postranních, kmotrův, Sváteční, podkrovního)", "dobrý, malý, velký, dlouhý (uzavřená skupina) a prudký, tuhý místo hluboký, lehký, úzký, hladký, sladký, nízký", "jiná věta (psi … rozdováděný), pasti Adamovy, zamlklé", "jiný diktát a text, stejné kódy a prahy"],
}
def vstup_popis(k):
    v = k['vstup']; t = v['typ']
    if t == 'dlazdice': return f"`{k['id']}` `dlazdice` „{k['popisek']}“: " + " · ".join(m['text'] for m in v['moznosti'])
    if t == 'poslech': return f"`{k['id']}` `poslech` `{v['audio']}`, otázka „{v['otazka']}“, dlaždice: " + " · ".join(m['text'] for m in v['vnoreny_vstup']['moznosti'])
    if t == 'doplnit_pismeno': return f"`{k['id']}` `doplnit_pismeno` {len(v['mezery'])} × " + "/".join(v['mezery'][0]['moznosti']) + f": {v['text']}"
    if t == 'oznac_role':
        tk = tokens(v['text']); return f"`{k['id']}` `oznac_role` ({len(v['role'])} role), „{v['text']}“ `slova`: " + ", ".join(f"{tk[i]}({i})" for i in v['slova'])
    if t == 'klik_ve_textu':
        tk = tokens(v['text']); return f"`{k['id']}` `klik_ve_textu` max {v['max']}, tokeny: " + " ".join(f"{w}({i})" for i, w in enumerate(tk))
    if t == 'diktat': return f"`{k['id']}` `diktat` {len(v['vety'])} věty, `max_prehrani` {v['max_prehrani']}, `hodnotit_interpunkci` false, `hodnotit_velikost` false"
def spravne(k):
    v = k['vstup']; t = v['typ']
    if t == 'dlazdice': return next(m['text'] for m in v['moznosti'] if m['spravne'])
    if t == 'poslech': return next(m['text'] for m in v['vnoreny_vstup']['moznosti'] if m['spravne'])
    if t == 'doplnit_pismeno': return ", ".join(k['spravne'])
    if t == 'oznac_role':
        tk = tokens(v['text']); return ", ".join(f"{tk[int(i)]} {r}" for i, r in k['spravne'].items())
    if t == 'klik_ve_textu':
        tk = tokens(v['text']); return ", ".join(f"{tk[i]}({i})" for i in k['spravne'])
    if t == 'diktat': return " / ".join(x['text'] for x in v['vety'])
def chyby(k):
    v = k['vstup']; t = v['typ']
    if t in ('dlazdice', 'poslech'):
        mm = v['moznosti'] if t == 'dlazdice' else v['vnoreny_vstup']['moznosti']
        return "; ".join(f"{m['text']} → " + (f"`{m['typ_chyby']}`" if m.get('typ_chyby') else "obecná") for m in mm if not m['spravne'])
    if t == 'doplnit_pismeno':
        return "; ".join(f"mezera {[i for i,x in enumerate(z['hodnota']) if x][0]} {[x for x in z['hodnota'] if x][0]} → `{z['typ_chyby']}`" for z in k['zname_chyby']) + "; ostatní → obecná"
    if t == 'oznac_role':
        tk = tokens(v['text']); return "; ".join(f"{tk[int(i)]} → {r} → `{z['typ_chyby']}`" for z in k['zname_chyby'] for i, r in z['hodnota'].items()) + "; ostatní → obecná"
    if t == 'klik_ve_textu':
        tk = tokens(v['text']); return "; ".join("navíc " + ", ".join(tk[i] for i in z['navic']) + f" → `{z['typ_chyby']}`" for z in k['zname_chyby']) + "; ostatní → obecná"
    if t == 'diktat':
        return "; ".join(f"{tokens(v['vety'][c['veta']]['text'])[c['slovo']]} → `{c['typ_chyby']}`" for c in k['chyby_ocekavane'])
out = []
for n in (9, 10, 11, 12):
    L = json.load(open(f"{D}cj-t3-l{n}nb.json"))
    posl = [u for u in L['ulohy'] for k in u['kroky'] if k['vstup']['typ'] in ('poslech',)]
    zn = " · poslech U3" if posl else (" · diktát U5" if n == 12 else "")
    out.append(f"### LEKCE {n}nb — {L['tema']}, B-varianta naostro (`{L['id']}`){zn}\n")
    out.append(f"B-varianta `cj-t3-l{n}n`. `tema` „{L['tema']}“ · `kapitola` `{L['kapitola']}` · `tyden` {L['tyden']}, `poradi` {L['poradi']} · `cas_min` {L['cas_min']}.\n")
    out.append("**Platí:** " + " · ".join(f"`{p['znak']}` ({p['text']})" for p in L['uvod_pravidla']) + "\n")
    out.append("| # | Typ | Co hodnotí | Vstup | Správně | Známé chyby | Jiné než hlavní lekce |\n|---|---|---|---|---|---|---|")
    for i, u in enumerate(L['ulohy']):
        typ = TYPN[u['typ']] + (" **týdenní**" if u.get('tydenni') else "") + f" ({u['cas_min']})"
        cell = lambda f: "<br>".join(f(k) for k in u['kroky']).replace("|", "\\|")
        out.append(f"| {i+1} | {typ} | {u['cil']} | {cell(vstup_popis)} | {cell(lambda k: '`'+k['id']+'` '+spravne(k))} | {cell(lambda k: '`'+k['id']+'` '+chyby(k))} | {JINE[L['id']][i]} |")
    for u in L['ulohy']:
        if u.get('semafor_tydne'):
            st = u['semafor_tydne']; out.append(f"\n`semafor_tydne` (z `final`, 12 mezer, beze změny proti L12n): zelená {st['zelena']['min_spravne']}+, oranžová {st['oranzova']['min_spravne']}+, červená 0+.")
    for u in L['ulohy']:
        for k in u['kroky']:
            if k['vstup']['typ'] == 'poslech' and k['id'] == 'k1':
                out.append(f"\nPřepis nahrávky (jen pro rodiče, sbalený): **„{k['vstup']['prepis']}“**")
    out.append("")
print("\n".join(out))
