from fractions import Fraction as F
bad={360,90,270,120,150,110,240,960,320,640,400,280,560,80,120,40,28,92,84,48,147,12,50,15,3,4,10,45}
for T in range(150,500,10):
  for a in [3,4,5,6,8]:
    for q in [3,4,5,6,7,8,9,10]:
      for p in range(2,q):
        if F(p,q).denominator!=q or T%a: continue
        f=T//a; z=T-f
        if z%q or T%q: continue
        s=z*p//q; rem=z-s
        errs=[z-T*p//q, z-z//q, s]
        if len({rem,*errs})<4 or min(errs)<=0: continue
        if rem in bad or T in bad: continue
        print(T,a,p,q,'rem',rem,'errs',errs,'first',f,'z',z)
