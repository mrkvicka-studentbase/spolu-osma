import json,sys
d=json.load(open(sys.argv[1]))
for k in d:
  if k not in ('ulohy','kontrola'): print(k, json.dumps(d[k],ensure_ascii=False))
for u in d['ulohy']:
  print('=====',u['id'],u['typ'],u.get('cil'), 'tydenni' if u.get('tydenni') else '')
  if 'semafor_tydne' in u: print('SEMTYD', json.dumps(u['semafor_tydne'],ensure_ascii=False))
  print('ZADANI:',u['zadani'])
  for kr in u['kroky']:
    print('--',kr['id'],kr.get('popisek'),json.dumps(kr['vstup'],ensure_ascii=False))
    for x in kr:
      if x not in ('id','popisek','vstup'): print('  ',x,json.dumps(kr[x],ensure_ascii=False))
  print('TAHAK:',json.dumps(u['tahak'],ensure_ascii=False,indent=0))
  print('SEMAFOR:',json.dumps(u['semafor'],ensure_ascii=False,indent=0))
  print('TISK:',json.dumps(u['tisk'],ensure_ascii=False))
if len(sys.argv)>2: print(json.dumps(d['kontrola'],ensure_ascii=False))
