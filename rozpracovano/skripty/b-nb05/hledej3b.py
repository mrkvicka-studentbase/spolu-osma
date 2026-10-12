from fractions import Fraction as F
for T in range(60,500,10):
  for a in [3,4,5,6,8,10]:
    for q in [2,3,4,5,6,7,8,9,10]:
      for p in range(1,q):
        if F(p,q).denominator!=q or (a,p,q)==(6,3,5): continue
        s=F(1,a)+F(p,q)
        if s>=1: continue
        X=s*T
        if X.denominator!=1: continue
        mon=F(p,q)*F(a-1,a)
        t=F(1,a)+mon
        done=t*T
        if done.denominator!=1: continue
        rem=T-done; Y=T-X; wk=T//a; mo=mon*T
        if len({rem,Y,done,wk,mo})<5: continue
        if mon.denominator>10 or t.denominator>12 or T>400: continue
        k2a=F(1,a)+F(p,q)*F(1,a); k2c=F(1+p,a+q)
        if len({t,k2a,k2c})<3: continue
        print(T,a,p,q,'s',s,'X',X,'Y',Y,'| mon',mon,'t',t,'done',done,'rem',rem,'wk',wk,'mo',mo,'k2',k2a,k2c)
