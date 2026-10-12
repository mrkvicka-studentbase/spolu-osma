from fractions import Fraction as F
def term(x):
    d=x.denominator
    while d%2==0: d//=2
    while d%5==0: d//=5
    return d==1
print("== L4 U3")
for w in range(2,16):
 for h in [F(1,2),F(1,4),F(3,4)]:
  V=w+h
  for q in [3,4,5,6,8]:
   for p in range(2,q):
    P=F(p,q)
    if P.denominator!=q: continue
    sold=V*P; rest=V-sold
    if not term(sold) or not term(rest): continue
    for cs in [4,5,8,10]:
     for cn in range(1,cs):
      C=F(cn,cs)
      if C.denominator!=cs: continue
      n=rest/C
      if n.denominator!=1 or n>30: continue
      Vs=F(w+h.numerator,h.denominator)
      e=[V/q, Vs*P, V/p*q]  # jen deleni, scital celou, obracene
      k2e=[V-V/q, sold]
      fe=[rest*C, C/rest, V/C]
      if not all(term(x) for x in e+k2e+fe): continue
      if len({sold,*e})<4 or len({rest,*k2e})<3 or len({n,*fe})<4: continue
      print(f"V={w}+{h} P={P} sold={float(sold)} rest={rest} C={C} n={n} | k1err {[float(x) for x in e]} k2err {[float(x) for x in k2e]} fin {[float(x) for x in fe]}")
