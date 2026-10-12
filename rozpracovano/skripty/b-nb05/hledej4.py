from fractions import Fraction as F
print("== L1 U3 cermat")
for T in range(300,1300,60):
  for a in [3,4,5,6]:
    for q in [3,4,5,6,7,8,9,10]:
      for p in range(2,q):
        if F(p,q).denominator!=q: continue
        if (a,p,q)==(3,3,8): continue
        if T%a: continue
        first=T//a; z=T-first
        if z%q or T%q or first*p%q: continue
        vy=z*p//q; br=z-vy; fr=F(br,T)
        k1=[vy, T*p//q, z//q, first*p//q]
        k2=[br, z-T*p//q, z-z//q, vy]
        fin=[fr, F(z-T*p//q,T), F(vy,T), 1-F(p,q)]
        if len(set(k1))<4 or len(set(k2))<4 or len(set(fin))<4: continue
        if min(k2)<=0: continue
        if fr.denominator>=T or fr.denominator>30: continue
        print(T,a,p,q,'k1',k1,'k2',k2,'fin',[str(x) for x in fin])
