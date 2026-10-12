from fractions import Fraction as F
main={F(5,8),F(2,15),F(5,6),F(4,7),F(1,5),F(3,10),F(1,6),F(3,5),F(3,8),F(1,4),F(4,9),F(1,3)}
mine={F(3,14),F(7,15),F(7,9),F(5,7),F(1,8),F(2,7),F(2,9),F(1,10),F(2,3)}
for T in range(120,400,10):
  for a in range(2,11):
    for q in range(3,11):
      for p in range(2,q):
        P=F(p,q)
        if P.denominator!=q or T%a: continue
        if F(1,a) in main|mine or P in main|mine: continue
        f=T//a; z=T-f
        if z%q or T%q: continue
        s=z*p//q; rem=z-s
        errs=[z-T*p//q, z-z//q, s]
        if len({rem,*errs,f})<5 or min(errs)<=0: continue
        print(T,'1/%d'%a,P,'first',f,'z',z,'s',s,'rem',rem,'errs',errs)
