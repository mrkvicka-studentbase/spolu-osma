import json, urllib.parse
D = '/home/user/spolu-osma/obsah/cestina/lekce/'
def dl(*opts):
    """opts: (text, True) správně | (text, 'kod') | (text, None) obecná"""
    m = []
    for i, (t, x) in enumerate(opts):
        o = {"id": "abcdef"[i], "text": t}
        if x is True: o["spravne"] = True
        else:
            o["spravne"] = False
            if x: o["typ_chyby"] = x
        m.append(o)
    return {"typ": "dlazdice", "moznosti": m}
def krok_dl(id, popisek, *opts):
    return {"id": id, "popisek": popisek, "vstup": dl(*opts)}
def doplnit(id, popisek, text, moz, spravne, chyby):
    n = text.count('_')
    assert len(moz) == n and len(spravne) == n, (n, len(moz), len(spravne))
    zn = []
    for idx, val, kod in chyby:
        h = [None] * n; h[idx] = val
        zn.append({"hodnota": h, "typ_chyby": kod})
    return {"id": id, "popisek": popisek,
            "vstup": {"typ": "doplnit_pismeno", "text": text, "mezery": [{"i": i, "moznosti": list(moz[i])} for i in range(n)]},
            "spravne": spravne, "zname_chyby": zn}
def role(id, popisek, text, slova, roles, spravne, chyby):
    return {"id": id, "popisek": popisek,
            "vstup": {"typ": "oznac_role", "text": text, "slova": slova, "role": roles},
            "spravne": {str(k): v for k, v in spravne.items()},
            "zname_chyby": [{"hodnota": {str(k): v}, "typ_chyby": kod} for k, v, kod in chyby]}
def uloha(id, typ, cil, cas, zadani, kroky, tahak, semafor, tisk, **extra):
    u = {"id": id, "typ": typ, "cil": cil, "cas_min": cas, "zadani": zadani, "zdroj": "vlastni",
         "kroky": kroky, "tahak": tahak, "semafor": semafor, "tisk": {"zadani": tisk}}
    u.update(extra); return u
def th(vys, res, otazky, orl, orl_o, typ):
    return {"vysvetleni": vys, "reseni": res, "otazky": otazky, "otocena_role": orl, "otocena_role_odpoved": orl_o, "typicka_chyba": typ}
def sem(z, o, c): return {"zelena": z, "oranzova": o, "cervena": c}
def q(k, t): return {"k": k, "text": t}
def zdroje(slova, ids=(400, 410, 756)):
    z = [f"https://prirucka.ujc.cas.cz/?id={i}" for i in ids]
    z += ["https://prirucka.ujc.cas.cz/?slovo=" + urllib.parse.quote(s) for s in slova]
    return z
def uloz(lekce):
    with open(D + lekce["id"] + ".json", "w", encoding="utf-8") as f:
        json.dump(lekce, f, ensure_ascii=False, indent=2); f.write("\n")
    print("zapsáno", lekce["id"])
def hlavicka(hlavni_id, bid, cil, uvod, pravidla, slovnik):
    h = json.load(open(D + hlavni_id + ".json", encoding="utf-8"))
    return {"id": bid, "predmet": h["predmet"], "faze": h["faze"], "tyden": h["tyden"], "poradi": h["poradi"],
            "tema": h["tema"], "kapitola": h["kapitola"], "cil_pro_rodice": cil, "uvod_pro_rodice": uvod,
            "uvod_pravidla": [{"znak": a, "text": b} for a, b in pravidla], "slovnicek_pro_rodice": slovnik,
            "cas_min": h["cas_min"], "pomucky": h["pomucky"], "vychozi_text": None}, h
KONTROLNI_SEMAFOR = "Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“."
KONTROLNI_UVOD = "Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: "
VYS_KONTROLNI = "Kontrolní úloha: dítě ji řeší samo, vy jen sledujete. Otázky použijte, až když se úplně zasekne; pak v semaforu zvolte „Potřeboval(a) otázku“. "
