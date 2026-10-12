from fractions import Fraction as F
import itertools
def term(x):  # terminating decimal
    d=x.denominator
    while d%2==0: d//=2
    while d%5==0: d//=5
    return d==1
print("== L1 D: N, 1/a spent, p/q of zbytek")
for N in [24,30,36,40,48,56,64,70,72,80,100,110,140,150,160]:
  for a in [3,4,5,6,7,8]:
    if N%a: continue
    z=N-N//a
    for q in range(2,11):
      for p in range(1,q):
        if F(p,q).denominator!=q: continue
        if z%q or N%q or (N//a)*p%q: continue
        ok=z*p//q; c=N*p//q; zam=(N//a)*p//q; jd=z//q
        vals=[ok,c,zam,jd]
        if len(set(vals))==4 and p>1: print(N,a,p,q,vals)
