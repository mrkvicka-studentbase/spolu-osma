from fractions import Fraction as F
def term(x):
    d=x.denominator
    while d%2==0: d//=2
    while d%5==0: d//=5
    return d==1
for w in range(2,16):
 for hd in [2,4,5]:
  for hn in range(1,hd):
   h=F(hn,hd)
   if h.denominator!=hd: continue
   V=w+h
   for q in range(2,11):
    for p in range(2,q):
     P=F(p,q)
     if P.denominator!=q: continue
     sold=V*P; rest=V-sold
     if not term(sold) or not term(rest): continue
     for cs in range(2,11):
      for cn in range(1,cs):
       C=F(cn,cs)
       if C.denominator!=cs: continue
       n=rest/C
       if n.denominator!=1 or n>30 or n<4: continue
       Vs=F(w+h.numerator,h.denominator)
       e=[V/q, Vs*P, V/p*q]
       k2e=[V-V/q, sold]
       fe=[rest*C, C/rest, V/C]
       if not all(term(x) for x in e+k2e+fe): continue
       if len({sold,*e})<4 or len({rest,*k2e})<3 or len({n,*fe})<4: continue
       print(f"V={w}+{h} P={P} sold={float(sold)} rest={float(rest)} C={C} n={n} | k1err {[float(x) for x in e]} k2err {[float(x) for x in k2e]} fin {[float(x) for x in fe]}")
