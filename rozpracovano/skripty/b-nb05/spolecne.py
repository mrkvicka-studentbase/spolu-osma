import json
def dl(id, text, ok=False, chyba=None, stitek=None):
    d={"id":id}
    if stitek: d["stitek"]=stitek
    d["text"]=text; d["spravne"]=ok
    if not ok: d["typ_chyby"]=chyba
    return d
def uloz(lekce, cesta):
    with open(cesta,'w',encoding='utf-8') as f:
        json.dump(lekce,f,ensure_ascii=False,indent=2); f.write('\n')
KONTROLA_DATUM="2026-10-09"
