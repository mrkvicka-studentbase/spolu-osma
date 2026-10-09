# Doplní do cestina/Obsah/AUDIO.md řádky pro nahrávky z lekcí, které tam ještě nejsou (text z JSON). Volitelně jen lekce s prefixy v argv.
import json,glob,re,sys,os
root='/home/user/spolu-osma'; p=root+'/cestina/Obsah/AUDIO.md'
md=open(p,encoding='utf-8').read()
mame=set(re.findall(r'^\| `([^`]+\.mp3)` \|',md,re.M))
pref=sys.argv[1:]
def key(f): return [int(x) for x in re.findall(r'\d+',os.path.basename(f))]+[os.path.basename(f)]
rows=[]
for f in sorted(glob.glob(root+'/obsah/cestina/lekce/cj-t*-l*.json'),key=key):
    d=json.load(open(f,encoding='utf-8'))
    if pref and not any(d['id'].startswith(x) for x in pref): continue
    for i,u in enumerate(d['ulohy'],1):
        posl={}
        for k in u['kroky']:
            v=k.get('vstup') or {}
            if v.get('typ')=='diktat':
                for j,vt in enumerate(v['vety'],1):
                    a=vt['audio'].replace('audio/cestina/','')
                    if a not in mame: rows.append((a,f"{d['id']} / úloha {i} (diktát, věta {j})",'diktát',vt['text'],'Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“.')); mame.add(a)
            elif v.get('typ')=='poslech':
                posl.setdefault((v['audio'],v['prepis']),[]).append(k['id'])
        for (a,t),ks in posl.items():
            a=a.replace('audio/cestina/','')
            if a not in mame: rows.append((a,f"{d['id']} / úloha {i} ({' i '.join('`'+x+'`' for x in ks)})",'poslech',t,'Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně.')); mame.add(a)
if not rows: print('nic k doplnění'); sys.exit()
lines=md.split('\n')
last=max(i for i,l in enumerate(lines) if re.match(r'^\| `t\d+/',l))
new=[f"| `{a}` | {kde} | {typ} | {t} | {pz} | čeká na Pavla |" for a,kde,typ,t,pz in rows]
lines[last+1:last+1]=new
open(p,'w',encoding='utf-8').write('\n'.join(lines))
print('doplněno',len(rows)); print('\n'.join(new))
