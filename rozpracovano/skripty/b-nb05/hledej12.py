from fractions import Fraction as F
from itertools import product
ms=[(w,F(n,d)) for w in (1,2,3) for d in range(2,10) for n in range(1,d) if F(n,d).denominator==d]
fr=[F(n,d) for d in range(2,10) for n in range(1,d) if F(n,d).denominator==d]
for A,b,C in product(ms,fr,ms):
  a=A[0]+A[1]; c=C[0]+C[1]
  if A[1].denominator==b.denominator: continue
  t=a-b
  if t<=0: continue
  r=t/c
  if r.denominator>6 or r.numerator>9 or r==1 or r.denominator==1: continue
  if t.numerator!=c.numerator: continue   # same numerator like 11/6 : 11/8
  As=F(A[0]+A[1].numerator,A[1].denominator)
  errs=[c/t, t*c, (As-b)/c if As>b else None]
  if None in errs: continue
  if len({r,*errs})<4: continue
  if any(x.denominator>99 or x.numerator>200 for x in errs): continue
  print(f"({A[0]} {A[1]} - {b}) : {C[0]} {C[1]} = {t} : {c} = {r} | prvni {errs[0]} bez {errs[1]} scit {errs[2]}")
