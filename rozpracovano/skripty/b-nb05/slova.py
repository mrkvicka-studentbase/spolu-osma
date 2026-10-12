import json,re,sys
LIM={'vysvetleni':70,'otocena_role':25,'otocena_role_odpoved':40,'typicka_chyba':50,'zelena':25,'oranzova':60,'cervena':75,'zadani':60,'popisek':8,'otazka':25,'dlazdice':8,'pravidlo':4}
def w(s):
  s=re.sub(r'\$\$.*?\$\$','X',s,flags=re.S); s=re.sub(r'\$.*?\$','X',s)
  return len(s.split())
for id in sys.argv[1:]:
  L=json.load(open(f'/home/user/spolu-osma/obsah/lekce/{id}.json'))
  out=[]
  def chk(nazev,text,lim):
    c=w(text)
    if c>lim: out.append(f'  PŘES {nazev}: {c}/{lim}')
  print(id,'uvod',w(L['uvod_pro_rodice']),'slov')
  for p in L['uvod_pravidla']: chk('pravidlo',p['text'],4)
  for u in L['ulohy']:
    if u['typ']!='detektiv': chk(u['id']+' zadani',u['zadani'],60)
    t=u['tahak']
    for k in ['vysvetleni','otocena_role','otocena_role_odpoved','typicka_chyba']: chk(u['id']+' '+k,t[k],LIM[k])
    for o in t['otazky']: chk(u['id']+' otazka',o if isinstance(o,str) else o['text'],25)
    for k in ['zelena','oranzova','cervena']: chk(u['id']+' '+k,u['semafor'][k],LIM[k])
    for k in u['kroky']:
      chk(u['id']+' popisek '+k['id'],k['popisek'],8)
      if k['vstup']['typ']=='dlazdice':
        for m in k['vstup']['moznosti']: chk(u['id']+' dl',m['text'],8)
    # stats
    print(' ',u['id'],'vysv',w(t['vysvetleni']),'typ',w(t['typicka_chyba']),'or',w(u['semafor']['oranzova']),'cer',w(u['semafor']['cervena']),'ot',[w(o if isinstance(o,str) else o['text']) for o in t['otazky']],'zad',w(u['zadani']))
  print('\n'.join(out) if out else '  limity OK')
